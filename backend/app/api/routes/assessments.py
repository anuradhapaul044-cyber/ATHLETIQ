import os
from pathlib import Path
import tempfile

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from starlette.concurrency import run_in_threadpool

from backend.app.core.dependencies import require_roles
from backend.app.schemas.assessment import PushupAssessmentResponse
from backend.app.schemas.auth import UserRole
from backend.app.services.assessment_service import AssessmentProcessingError, analyze_pushup_video
from backend.app.services.user_store import UserRecord


router = APIRouter(prefix="/assessments", tags=["assessments"])

ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv", ".webm"}
MAX_UPLOAD_SIZE_BYTES = 100 * 1024 * 1024
UPLOAD_CHUNK_SIZE = 1024 * 1024


@router.post("/pushup", response_model=PushupAssessmentResponse)
async def analyze_pushup_assessment(
    video: UploadFile = File(...),
    _current_user: UserRecord = Depends(require_roles(UserRole.STUDENT)),
) -> PushupAssessmentResponse:
    """Analyze one student-uploaded side-view push-up video."""
    filename = video.filename or ""
    extension = Path(filename).suffix.lower()
    if extension not in ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Upload a supported video file: MP4, MOV, AVI, MKV, or WEBM",
        )
    if video.content_type and not (
        video.content_type.startswith("video/") or video.content_type == "application/octet-stream"
    ):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="The uploaded file must have a video content type",
        )

    file_descriptor, temporary_filename = tempfile.mkstemp(suffix=extension, prefix="athletiq-pushup-")
    os.close(file_descriptor)
    temporary_path = Path(temporary_filename)

    try:
        uploaded_bytes = 0
        with temporary_path.open("wb") as destination:
            while chunk := await video.read(UPLOAD_CHUNK_SIZE):
                uploaded_bytes += len(chunk)
                if uploaded_bytes > MAX_UPLOAD_SIZE_BYTES:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail="Video exceeds the 100 MB upload limit",
                    )
                destination.write(chunk)

        if uploaded_bytes == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded video is empty",
            )

        analysis = await run_in_threadpool(analyze_pushup_video, temporary_path)
        form_metrics = analysis["form_metrics"]
        return PushupAssessmentResponse(
            completed_reps=form_metrics["completed_reps"],
            incomplete_reps=form_metrics["potentially_incomplete_reps"],
            minimum_elbow_angle=form_metrics["minimum_elbow_angle"],
            maximum_elbow_angle=form_metrics["maximum_elbow_angle"],
            average_elbow_angle=form_metrics["average_elbow_angle"],
            pose_detection_percentage=form_metrics["pose_detection_percentage"],
            movement_consistency=form_metrics["movement_consistency"],
            processed_frames=analysis["processed_frames"],
            fps=analysis["fps"],
            pose_detected_frames=analysis["pose_detected_frames"],
            selected_elbow=analysis["selected_elbow"],
            pose_detection=analysis["pose_detection"],
        )
    except AssessmentProcessingError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The uploaded video could not be processed as a push-up assessment",
        ) from exc
    finally:
        await video.close()
        temporary_path.unlink(missing_ok=True)
