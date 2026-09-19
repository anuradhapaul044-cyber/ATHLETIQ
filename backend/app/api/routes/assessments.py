import os
import tempfile
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from starlette.concurrency import run_in_threadpool

from backend.app.core.dependencies import get_current_user, require_roles
from backend.app.db.models import Assessment
from backend.app.db.session import get_db
from backend.app.schemas.assessment import AssessmentHistoryItem, PushupAssessmentResponse
from backend.app.schemas.auth import UserRole
from backend.app.services.assessment_service import (
    AssessmentProcessingError,
    analyze_pushup_video,
    persist_pushup_assessment,
)
from backend.app.services.user_store import UserRecord


router = APIRouter(prefix="/assessments", tags=["assessments"])

ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv", ".webm"}
MAX_UPLOAD_SIZE_BYTES = 100 * 1024 * 1024
UPLOAD_CHUNK_SIZE = 1024 * 1024


def _serialize_assessment(assessment: Assessment) -> AssessmentHistoryItem:
    result = assessment.result
    return AssessmentHistoryItem(
        id=str(assessment.id),
        assessment_type=assessment.assessment_type,
        status=assessment.status,
        completed_reps=result.completed_reps if result else None,
        incomplete_reps=result.incomplete_reps if result else None,
        minimum_elbow_angle=result.minimum_elbow_angle if result else None,
        maximum_elbow_angle=result.maximum_elbow_angle if result else None,
        average_elbow_angle=result.average_elbow_angle if result else None,
        pose_detection_percentage=result.pose_detection_percentage if result else None,
        created_at=assessment.created_at,
        updated_at=assessment.updated_at,
    )


@router.get("", response_model=list[AssessmentHistoryItem])
def get_student_assessments(
    current_user: UserRecord = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[AssessmentHistoryItem]:
    assessments = db.execute(
        select(Assessment).where(Assessment.user_id == current_user.id).order_by(Assessment.created_at.desc())
    ).scalars().all()
    return [_serialize_assessment(assessment) for assessment in assessments]


@router.get("/history", response_model=list[AssessmentHistoryItem])
def get_student_assessment_history(
    current_user: UserRecord = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[AssessmentHistoryItem]:
    return get_student_assessments(current_user=current_user, db=db)


@router.get("/{assessment_id}", response_model=AssessmentHistoryItem)
def get_student_assessment(
    assessment_id: str,
    current_user: UserRecord = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AssessmentHistoryItem:
    assessment = db.execute(select(Assessment).where(Assessment.id == assessment_id)).scalar_one_or_none()
    if assessment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")
    if assessment.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not own this assessment")
    return _serialize_assessment(assessment)


@router.post("/pushup", response_model=PushupAssessmentResponse)
async def analyze_pushup_assessment(
    video: UploadFile = File(...),
    current_user: UserRecord = Depends(require_roles(UserRole.STUDENT)),
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
        persist_pushup_assessment(current_user.id, analysis)
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
