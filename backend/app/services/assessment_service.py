"""Bridge between assessment routes and the existing AI analyzer."""

from pathlib import Path

from ai.pushup_analyzer import analyze_pushups

from backend.app.db.models import Assessment, AssessmentResult
from backend.app.db.session import SessionLocal


class AssessmentProcessingError(Exception):
    """Raised when an uploaded video cannot be analyzed."""


def analyze_pushup_video(video_path: Path) -> dict:
    """Run the existing push-up analyzer without changing its CV logic."""
    try:
        return analyze_pushups(video_path, debug=False)
    except Exception as exc:
        raise AssessmentProcessingError("Unable to analyze the uploaded video") from exc


def persist_pushup_assessment(user_id: str, analysis: dict) -> Assessment:
    """Save an AI-generated push-up assessment to the database."""
    form_metrics = analysis.get("form_metrics", {})
    with SessionLocal() as db:
        assessment = Assessment(user_id=user_id, assessment_type="pushup", status="completed")
        db.add(assessment)
        db.flush()

        result = AssessmentResult(
            assessment_id=assessment.id,
            completed_reps=int(form_metrics.get("completed_reps", 0)),
            incomplete_reps=int(form_metrics.get("potentially_incomplete_reps", 0)),
            minimum_elbow_angle=form_metrics.get("minimum_elbow_angle"),
            maximum_elbow_angle=form_metrics.get("maximum_elbow_angle"),
            average_elbow_angle=form_metrics.get("average_elbow_angle"),
            pose_detection_percentage=float(form_metrics.get("pose_detection_percentage", 0.0)),
            movement_consistency=form_metrics.get("movement_consistency"),
            processed_frames=int(analysis.get("processed_frames", 0)),
            fps=float(analysis.get("fps", 0.0) or 0.0),
            pose_detected_frames=int(analysis.get("pose_detected_frames", 0)),
            selected_elbow=analysis.get("selected_elbow"),
            pose_detection=analysis.get("pose_detection"),
        )
        db.add(result)
        db.commit()
        db.refresh(assessment)
        return assessment
