from pydantic import BaseModel


class MovementConsistency(BaseModel):
    completed_rep_angle_range_mean_degrees: float | None
    completed_rep_angle_range_std_dev_degrees: float | None


class SelectedElbow(BaseModel):
    side: str | None
    frames_by_side: dict[str, int]


class PoseDetection(BaseModel):
    missing_frames: int
    longest_gap_frames: int
    gap_count: int


class PushupAssessmentResponse(BaseModel):
    completed_reps: int
    incomplete_reps: int
    minimum_elbow_angle: float | None
    maximum_elbow_angle: float | None
    average_elbow_angle: float | None
    pose_detection_percentage: float
    movement_consistency: MovementConsistency
    processed_frames: int
    fps: float
    pose_detected_frames: int
    selected_elbow: SelectedElbow
    pose_detection: PoseDetection
