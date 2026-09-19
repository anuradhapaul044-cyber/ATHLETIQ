from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.core.dependencies import get_current_user, require_roles
from backend.app.db.models import Assessment, AssessmentResult, CoachVerification, MatchRecord, SavedAthlete, StudentProfile, User
from backend.app.db.session import get_db
from backend.app.schemas.auth import UserRole
from backend.app.services.user_store import UserRecord

router = APIRouter(tags=["coach"])


class SavedAthleteResponse(BaseModel):
    athlete_username: str
    athlete_name: str
    coach_username: str
    saved_at: datetime


class AthleteMatchResponse(BaseModel):
    id: str
    event: str
    date: str
    sport: str
    competition: str
    result: str
    notes: str | None = None
    verified: str


class AthleteAssessmentResponse(BaseModel):
    id: str
    completed_reps: int | None = None
    incomplete_reps: int | None = None
    minimum_elbow_angle: float | None = None
    maximum_elbow_angle: float | None = None
    average_elbow_angle: float | None = None
    pose_detection_percentage: float | None = None
    created_at: datetime


class AthleteDiscoveryResponse(BaseModel):
    username: str
    name: str
    sport: str
    location: str | None = None
    latest_assessment: AthleteAssessmentResponse | None = None
    match_records: list[AthleteMatchResponse] = []
    verification_status: str = "none"
    saved: bool = False


class CoachVerificationRequest(BaseModel):
    status: str = Field(default="pending")
    observation: str | None = None


class CoachVerificationResponse(BaseModel):
    id: str
    athlete_username: str
    athlete_name: str
    athlete_sport: str
    evidence_type: str
    metric: str
    details: str
    status: str
    observation: str | None = None
    reviewed_by: str | None = None
    reviewed_at: datetime | None = None
    created_at: datetime


def _get_athlete_profile(db: Session, user_id: str) -> StudentProfile | None:
    return db.execute(select(StudentProfile).where(StudentProfile.user_id == user_id)).scalar_one_or_none()


def _serialize_assessment_result(assessment: Assessment | None) -> AthleteAssessmentResponse | None:
    if assessment is None or assessment.result is None:
        return None
    result = assessment.result
    return AthleteAssessmentResponse(
        id=assessment.id,
        completed_reps=result.completed_reps,
        incomplete_reps=result.incomplete_reps,
        minimum_elbow_angle=result.minimum_elbow_angle,
        maximum_elbow_angle=result.maximum_elbow_angle,
        average_elbow_angle=result.average_elbow_angle,
        pose_detection_percentage=result.pose_detection_percentage,
        created_at=assessment.created_at,
    )


def _serialize_match_record(record: MatchRecord) -> AthleteMatchResponse:
    return AthleteMatchResponse(
        id=record.id,
        event=record.event,
        date=record.date,
        sport=record.sport,
        competition=record.competition,
        result=record.result,
        notes=record.notes,
        verified=record.verified,
    )


def _latest_assessment_for_user(db: Session, user_id: str) -> Assessment | None:
    return db.execute(
        select(Assessment)
        .where(Assessment.user_id == user_id)
        .order_by(Assessment.created_at.desc())
    ).scalars().first()


def _athlete_verification_status(db: Session, athlete_user_id: str) -> str:
    verification = db.execute(
        select(CoachVerification)
        .where(CoachVerification.athlete_user_id == athlete_user_id)
        .order_by(CoachVerification.updated_at.desc())
    ).scalars().first()
    return verification.status if verification else "none"


@router.get("/coach/discover", response_model=list[AthleteDiscoveryResponse])
def discover_athletes(
    current_user: UserRecord = Depends(require_roles(UserRole.COACH)),
    db: Session = Depends(get_db),
) -> list[AthleteDiscoveryResponse]:
    athletes = db.execute(select(User).where(User.role == UserRole.STUDENT.value)).scalars().all()
    items: list[AthleteDiscoveryResponse] = []
    for athlete in athletes:
        profile = _get_athlete_profile(db, athlete.id)
        latest_assessment = _latest_assessment_for_user(db, athlete.id)
        match_records = db.execute(
            select(MatchRecord).where(MatchRecord.user_id == athlete.id).order_by(MatchRecord.created_at.desc())
        ).scalars().all()
        saved = db.execute(
            select(SavedAthlete).where(SavedAthlete.coach_id == current_user.id, SavedAthlete.athlete_user_id == athlete.id)
        ).scalar_one_or_none() is not None
        items.append(
            AthleteDiscoveryResponse(
                username=athlete.username,
                name=profile.full_name if profile and profile.full_name else athlete.username,
                sport=profile.sport if profile and profile.sport else "Athletics",
                location=profile.location if profile else None,
                latest_assessment=_serialize_assessment_result(latest_assessment),
                match_records=[_serialize_match_record(record) for record in match_records[:3]],
                verification_status=_athlete_verification_status(db, athlete.id),
                saved=saved,
            )
        )
    return items


@router.get("/coach/saved-athletes", response_model=list[SavedAthleteResponse])
def list_saved_athletes(
    current_user: UserRecord = Depends(require_roles(UserRole.COACH)),
    db: Session = Depends(get_db),
) -> list[SavedAthleteResponse]:
    saved = db.execute(
        select(SavedAthlete).where(SavedAthlete.coach_id == current_user.id).order_by(SavedAthlete.created_at.desc())
    ).scalars().all()
    results: list[SavedAthleteResponse] = []
    for row in saved:
        athlete = db.get(User, row.athlete_user_id)
        profile = _get_athlete_profile(db, row.athlete_user_id)
        results.append(
            SavedAthleteResponse(
                athlete_username=athlete.username if athlete else row.athlete_user_id,
                athlete_name=profile.full_name if profile and profile.full_name else (athlete.username if athlete else "Unknown"),
                coach_username=current_user.username,
                saved_at=row.created_at,
            )
        )
    return results


@router.post("/coach/saved-athletes/{athlete_username}", response_model=SavedAthleteResponse)
def save_athlete(
    athlete_username: str,
    current_user: UserRecord = Depends(require_roles(UserRole.COACH)),
    db: Session = Depends(get_db),
) -> SavedAthleteResponse:
    athlete = db.execute(select(User).where(User.username == athlete_username.strip().lower())).scalar_one_or_none()
    if athlete is None:
        raise HTTPException(status_code=404, detail="Athlete not found")
    if athlete.id == current_user.id:
        raise HTTPException(status_code=400, detail="A coach cannot save themselves")

    existing = db.execute(
        select(SavedAthlete).where(SavedAthlete.coach_id == current_user.id, SavedAthlete.athlete_user_id == athlete.id)
    ).scalar_one_or_none()
    if existing is not None:
        profile = _get_athlete_profile(db, athlete.id)
        return SavedAthleteResponse(
            athlete_username=athlete.username,
            athlete_name=profile.full_name if profile and profile.full_name else athlete.username,
            coach_username=current_user.username,
            saved_at=existing.created_at,
        )

    saved = SavedAthlete(coach_id=current_user.id, athlete_user_id=athlete.id)
    db.add(saved)
    db.commit()
    db.refresh(saved)
    profile = _get_athlete_profile(db, athlete.id)
    return SavedAthleteResponse(
        athlete_username=athlete.username,
        athlete_name=profile.full_name if profile and profile.full_name else athlete.username,
        coach_username=current_user.username,
        saved_at=saved.created_at,
    )


@router.delete("/coach/saved-athletes/{athlete_username}", status_code=status.HTTP_204_NO_CONTENT)
def unsave_athlete(
    athlete_username: str,
    current_user: UserRecord = Depends(require_roles(UserRole.COACH)),
    db: Session = Depends(get_db),
) -> None:
    athlete = db.execute(select(User).where(User.username == athlete_username.strip().lower())).scalar_one_or_none()
    if athlete is None:
        raise HTTPException(status_code=404, detail="Athlete not found")
    saved = db.execute(
        select(SavedAthlete).where(SavedAthlete.coach_id == current_user.id, SavedAthlete.athlete_user_id == athlete.id)
    ).scalar_one_or_none()
    if saved is None:
        raise HTTPException(status_code=404, detail="Saved athlete relationship not found")
    db.delete(saved)
    db.commit()


@router.get("/coach/verification-queue", response_model=list[CoachVerificationResponse])
def get_verification_queue(
    current_user: UserRecord = Depends(require_roles(UserRole.COACH)),
    db: Session = Depends(get_db),
) -> list[CoachVerificationResponse]:
    athletes = db.execute(select(User).where(User.role == UserRole.STUDENT.value)).scalars().all()
    records: list[CoachVerificationResponse] = []
    for athlete in athletes:
        latest_assessment = _latest_assessment_for_user(db, athlete.id)
        latest_match = db.execute(
            select(MatchRecord).where(MatchRecord.user_id == athlete.id).order_by(MatchRecord.created_at.desc())
        ).scalars().first()
        verification = db.execute(
            select(CoachVerification)
            .where(CoachVerification.coach_id == current_user.id, CoachVerification.athlete_user_id == athlete.id)
            .order_by(CoachVerification.updated_at.desc())
        ).scalars().first()

        if latest_assessment is None and latest_match is None and verification is None:
            continue

        metric_parts: list[str] = []
        details = "Athlete evidence is available for coach review."
        evidence_type = "assessment"
        if latest_assessment is not None:
            result = latest_assessment.result
            if result is not None:
                metric_parts.append(f"Push-ups: {result.completed_reps} reps")
                metric_parts.append(f"Pose detection: {result.pose_detection_percentage}%")
                details = "AI-assisted assessment result generated from video analysis and ready for coach attestation."
                evidence_type = "assessment"
        if latest_match is not None:
            metric_parts.append(f"{latest_match.sport}: {latest_match.result}")
            details = "Match record available for coach review and attestation."
            evidence_type = "match_record"

        metric = " · ".join(metric_parts) if metric_parts else "No result recorded"
        status = verification.status if verification else "pending"
        athlete_profile = _get_athlete_profile(db, athlete.id)
        records.append(
            CoachVerificationResponse(
                id=verification.id if verification else f"queue-{athlete.id}",
                athlete_username=athlete.username,
                athlete_name=athlete_profile.full_name if athlete_profile and athlete_profile.full_name else athlete.username,
                athlete_sport=athlete_profile.sport if athlete_profile and athlete_profile.sport else "Athletics",
                evidence_type=evidence_type,
                metric=metric,
                details=details,
                status=status,
                observation=verification.observation if verification else None,
                reviewed_by=verification.coach.username if verification else None,
                reviewed_at=verification.updated_at if verification else None,
                created_at=verification.created_at if verification else datetime.now(timezone.utc),
            )
        )
    return records


@router.post("/coach/verification/{athlete_username}", response_model=CoachVerificationResponse)
def save_verification(
    athlete_username: str,
    payload: CoachVerificationRequest,
    current_user: UserRecord = Depends(require_roles(UserRole.COACH)),
    db: Session = Depends(get_db),
) -> CoachVerificationResponse:
    athlete = db.execute(select(User).where(User.username == athlete_username.strip().lower())).scalar_one_or_none()
    if athlete is None:
        raise HTTPException(status_code=404, detail="Athlete not found")

    verification = db.execute(
        select(CoachVerification).where(
            CoachVerification.coach_id == current_user.id,
            CoachVerification.athlete_user_id == athlete.id,
        )
    ).scalar_one_or_none()

    if verification is None:
        verification = CoachVerification(
            coach_id=current_user.id,
            athlete_user_id=athlete.id,
            evidence_type="assessment",
            metric="AI-assisted assessment",
            details="Coach attestation recorded.",
            status="pending",
            observation=None,
        )
        db.add(verification)
        db.flush()

    latest_assessment = _latest_assessment_for_user(db, athlete.id)
    latest_match = db.execute(
        select(MatchRecord).where(MatchRecord.user_id == athlete.id).order_by(MatchRecord.created_at.desc())
    ).scalars().first()

    metric = "AI-assisted assessment"
    details = "Coach attestation recorded."
    evidence_type = "assessment"
    if latest_assessment is not None and latest_assessment.result is not None:
        metric = f"Push-ups: {latest_assessment.result.completed_reps} reps · Pose detection: {latest_assessment.result.pose_detection_percentage}%"
        details = "AI-assisted assessment result generated from video analysis and ready for coach attestation."
        evidence_type = "assessment"
    elif latest_match is not None:
        metric = f"{latest_match.sport}: {latest_match.result}"
        details = "Match record available for coach review and attestation."
        evidence_type = "match_record"

    verification.evidence_type = evidence_type
    verification.metric = metric
    verification.details = details
    verification.status = payload.status.strip() if payload.status.strip() else "pending"
    verification.observation = payload.observation.strip() if payload.observation else None
    verification.updated_at = datetime.now(timezone.utc)
    db.add(verification)
    db.commit()
    db.refresh(verification)

    athlete_profile = _get_athlete_profile(db, athlete.id)
    return CoachVerificationResponse(
        id=verification.id,
        athlete_username=athlete.username,
        athlete_name=athlete_profile.full_name if athlete_profile and athlete_profile.full_name else athlete.username,
        athlete_sport=athlete_profile.sport if athlete_profile and athlete_profile.sport else "Athletics",
        evidence_type=verification.evidence_type,
        metric=verification.metric or "AI-assisted assessment",
        details=verification.details or "Coach attestation recorded.",
        status=verification.status,
        observation=verification.observation,
        reviewed_by=current_user.username,
        reviewed_at=verification.updated_at,
        created_at=verification.created_at,
    )


@router.get("/coach/athletes/{athlete_username}/match-records", response_model=list[AthleteMatchResponse])
def get_athlete_match_records(
    athlete_username: str,
    current_user: UserRecord = Depends(require_roles(UserRole.COACH)),
    db: Session = Depends(get_db),
) -> list[AthleteMatchResponse]:
    athlete = db.execute(select(User).where(User.username == athlete_username.strip().lower())).scalar_one_or_none()
    if athlete is None:
        raise HTTPException(status_code=404, detail="Athlete not found")
    records = db.execute(
        select(MatchRecord).where(MatchRecord.user_id == athlete.id).order_by(MatchRecord.created_at.desc())
    ).scalars().all()
    return [_serialize_match_record(record) for record in records]
