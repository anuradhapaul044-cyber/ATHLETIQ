"""Analyze a side-view push-up video with MediaPipe Pose Landmarker."""

import argparse
from collections import deque
import json
import math
from pathlib import Path
from statistics import mean, pstdev
import urllib.request

import cv2
import mediapipe as mp


MODEL_URL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task"
MODEL_PATH = Path(__file__).with_name("pose_landmarker_full.task")

# A push-up is one full bend and extension. These are movement-quality guards,
# not a target number of repetitions: a cycle must bend and then extend by at
# least this many degrees before it can be counted.
SMOOTHING_FRAMES = 3
MIN_MOVEMENT_DEGREES = 35
MIN_TOP_ANGLE = 135
MIN_DIRECTION_FRAMES = 2
DEBUG_EVERY_N_DETECTED_FRAMES = 60

LEFT_SHOULDER, RIGHT_SHOULDER = 11, 12
LEFT_ELBOW, RIGHT_ELBOW = 13, 14
LEFT_WRIST, RIGHT_WRIST = 15, 16


def ensure_model():
    """Download the Pose Landmarker model once, when it is not already local."""
    if not MODEL_PATH.exists():
        print("Downloading MediaPipe pose model...")
        urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
        print("Model downloaded!")


def calculate_angle(a, b, c):
    """Return the angle ABC, where b is the elbow."""
    angle = math.degrees(
        math.atan2(c.y - b.y, c.x - b.x)
        - math.atan2(a.y - b.y, a.x - b.x)
    )
    angle = abs(angle)
    return 360 - angle if angle > 180 else angle


def landmark_visibility(*landmarks):
    """Average MediaPipe visibility for the shoulder, elbow and wrist."""
    return sum(getattr(landmark, "visibility", 0.0) for landmark in landmarks) / len(landmarks)


def choose_side(landmarks):
    """Use the more visible arm instead of averaging both arms in side view."""
    left_points = (landmarks[LEFT_SHOULDER], landmarks[LEFT_ELBOW], landmarks[LEFT_WRIST])
    right_points = (landmarks[RIGHT_SHOULDER], landmarks[RIGHT_ELBOW], landmarks[RIGHT_WRIST])
    left_visibility = landmark_visibility(*left_points)
    right_visibility = landmark_visibility(*right_points)

    if left_visibility >= right_visibility:
        return calculate_angle(*left_points), "left", left_visibility
    return calculate_angle(*right_points), "right", right_visibility


def analyze_pushups(video_path, debug=True):
    """Analyze a video and return backend-ready push-up metrics as a dictionary.

    Args:
        video_path: Path to any readable side-view push-up video.
        debug: Print progress and cycle diagnostics when True.
    """
    source_path = Path(video_path)
    if not source_path.is_file():
        raise FileNotFoundError(f"Video file not found: {source_path}")

    ensure_model()
    cap = cv2.VideoCapture(str(source_path))
    if not cap.isOpened():
        raise ValueError(f"Could not open video: {source_path}")

    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    declared_frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if debug:
        print("Push-up AI analyzer starting...")
        print(f"Video: {declared_frame_count} frames at {fps:.3f} FPS")

    frame_count = 0
    detected_frames = 0
    missing_frames = 0
    missing_runs = []
    missing_run_start = None
    longest_missing_run = 0
    side_use = {"left": 0, "right": 0}
    raw_angles = []

    angle_window = deque(maxlen=SMOOTHING_FRAMES)
    last_smoothed_angle = None
    direction = None
    direction_frames = 0

    # The detector starts in an unknown state. It learns the top of the current
    # movement, confirms a meaningful descent, and counts only after a meaningful
    # rise from that bottom point.
    phase = "looking_for_down"
    top_angle = None
    bottom_angle = None
    rep_count = 0
    confirmed_descents = 0
    completed_rep_ranges = []

    def finish_missing_run(end_frame):
        nonlocal missing_run_start, longest_missing_run
        if missing_run_start is None:
            return
        run_length = end_frame - missing_run_start
        missing_runs.append((missing_run_start, end_frame - 1, run_length))
        longest_missing_run = max(longest_missing_run, run_length)
        if debug and run_length >= 3:
            print(f"DEBUG pose gap: frames {missing_run_start}-{end_frame - 1} ({run_length} frames)")
        missing_run_start = None

    def update_cycle(angle, frame_number):
        nonlocal last_smoothed_angle, direction, direction_frames
        nonlocal phase, top_angle, bottom_angle, rep_count, confirmed_descents

        if last_smoothed_angle is None:
            last_smoothed_angle = angle
            top_angle = angle
            return None

        delta = angle - last_smoothed_angle
        current_direction = "up" if delta > 0 else "down" if delta < 0 else "flat"
        if current_direction == direction and current_direction != "flat":
            direction_frames += 1
        elif current_direction != "flat":
            direction = current_direction
            direction_frames = 1

        event = None
        if phase == "looking_for_down":
            top_angle = max(top_angle, angle)
            if direction == "down" and direction_frames >= MIN_DIRECTION_FRAMES:
                if top_angle - angle >= MIN_MOVEMENT_DEGREES:
                    phase = "looking_for_up"
                    bottom_angle = angle
                    confirmed_descents += 1
                    event = f"DEBUG descent confirmed at frame {frame_number}: top {top_angle:.1f}, current {angle:.1f}"
        else:
            bottom_angle = min(bottom_angle, angle)
            if direction == "up" and direction_frames >= MIN_DIRECTION_FRAMES:
                rise = angle - bottom_angle
                if rise >= MIN_MOVEMENT_DEGREES and angle >= MIN_TOP_ANGLE:
                    rep_count += 1
                    completed_rep_ranges.append(rise)
                    event = (
                        f"*** PUSH-UP #{rep_count} COMPLETED at frame {frame_number} "
                        f"(bottom {bottom_angle:.1f}, top {angle:.1f}, rise {rise:.1f}) ***"
                    )
                    phase = "looking_for_down"
                    top_angle = angle
                    bottom_angle = None

        last_smoothed_angle = angle
        return event

    BaseOptions = mp.tasks.BaseOptions
    PoseLandmarker = mp.tasks.vision.PoseLandmarker
    PoseLandmarkerOptions = mp.tasks.vision.PoseLandmarkerOptions
    VisionRunningMode = mp.tasks.vision.RunningMode
    options = PoseLandmarkerOptions(
        base_options=BaseOptions(model_asset_path=str(MODEL_PATH)),
        running_mode=VisionRunningMode.VIDEO,
        num_poses=1,
        min_pose_detection_confidence=0.3,
        min_pose_presence_confidence=0.3,
        min_tracking_confidence=0.3,
    )

    try:
        with PoseLandmarker.create_from_options(options) as landmarker:
            while True:
                success, frame = cap.read()
                if not success:
                    break

                frame_count += 1
                frame = cv2.resize(frame, (768, 432))
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

                # Video mode requires strictly increasing timestamps. Prefer the
                # source timestamp, then use the frame index as a reliable fallback.
                timestamp_ms = int(cap.get(cv2.CAP_PROP_POS_MSEC))
                if timestamp_ms <= 0:
                    timestamp_ms = int((frame_count - 1) * 1000 / fps)

                results = landmarker.detect_for_video(mp_image, timestamp_ms)
                if not results.pose_landmarks:
                    missing_frames += 1
                    if missing_run_start is None:
                        missing_run_start = frame_count
                    continue

                finish_missing_run(frame_count)
                detected_frames += 1
                landmarks = results.pose_landmarks[0]
                raw_angle, side, visibility = choose_side(landmarks)
                side_use[side] += 1
                raw_angles.append(raw_angle)
                angle_window.append(raw_angle)
                smoothed_angle = sum(angle_window) / len(angle_window)

                event = update_cycle(smoothed_angle, frame_count)
                if debug and event:
                    print(event)
                if debug and detected_frames % DEBUG_EVERY_N_DETECTED_FRAMES == 0:
                    print(
                        f"DEBUG frame {frame_count}: {side} elbow raw={raw_angle:.1f}, "
                        f"smooth={smoothed_angle:.1f}, visibility={visibility:.2f}, phase={phase}, reps={rep_count}"
                    )
    finally:
        cap.release()

    finish_missing_run(frame_count + 1)
    pose_detection_percentage = (detected_frames / frame_count * 100) if frame_count else 0.0
    selected_side = max(side_use, key=side_use.get) if detected_frames else None
    movement_consistency = {
        "completed_rep_angle_range_mean_degrees": mean(completed_rep_ranges) if completed_rep_ranges else None,
        "completed_rep_angle_range_std_dev_degrees": pstdev(completed_rep_ranges) if len(completed_rep_ranges) > 1 else None,
    }
    results = {
        "total_pushups": rep_count,
        "processed_frames": frame_count,
        "fps": fps,
        "pose_detected_frames": detected_frames,
        "pose_detection_percentage": pose_detection_percentage,
        "selected_elbow": {
            "side": selected_side,
            "frames_by_side": side_use,
        },
        "elbow_angle_range": {
            "min": min(raw_angles) if raw_angles else None,
            "max": max(raw_angles) if raw_angles else None,
        },
        "form_metrics": {
            "completed_reps": rep_count,
            "potentially_incomplete_reps": max(confirmed_descents - rep_count, 0),
            "minimum_elbow_angle": min(raw_angles) if raw_angles else None,
            "maximum_elbow_angle": max(raw_angles) if raw_angles else None,
            "average_elbow_angle": mean(raw_angles) if raw_angles else None,
            "pose_detection_percentage": pose_detection_percentage,
            "movement_consistency": movement_consistency,
        },
        "pose_detection": {
            "missing_frames": missing_frames,
            "longest_gap_frames": longest_missing_run,
            "gap_count": len(missing_runs),
        },
    }

    if debug:
        print("\n--- Detection summary ---")
        print(json.dumps(results, indent=2))
    return results


def main():
    parser = argparse.ArgumentParser(description="Analyze a side-view push-up video.")
    parser.add_argument("video_path", help="Path to the video file to analyze")
    parser.add_argument("--quiet", action="store_true", help="Only print the final JSON result")
    args = parser.parse_args()

    results = analyze_pushups(args.video_path, debug=not args.quiet)
    if args.quiet:
        print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
