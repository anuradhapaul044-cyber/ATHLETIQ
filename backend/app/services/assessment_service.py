"""Bridge between assessment routes and the existing AI analyzer."""

from pathlib import Path

from ai.pushup_analyzer import analyze_pushups


class AssessmentProcessingError(Exception):
    """Raised when an uploaded video cannot be analyzed."""


def analyze_pushup_video(video_path: Path) -> dict:
    """Run the existing push-up analyzer without changing its CV logic."""
    try:
        return analyze_pushups(video_path, debug=False)
    except Exception as exc:
        raise AssessmentProcessingError("Unable to analyze the uploaded video") from exc
