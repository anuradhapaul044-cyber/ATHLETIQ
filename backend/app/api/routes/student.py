from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.core.dependencies import get_current_user, require_roles
from backend.app.db.models import Assessment, DietEntry, MatchRecord, StudentProfile, User, WellnessProfile
from backend.app.db.session import get_db
from backend.app.schemas.auth import UserRole
from backend.app.services.user_store import UserRecord

router = APIRouter(tags=["student"])


class StudentProfileRequest(BaseModel):
    full_name: str | None = None
    sport: str | None = None
    bio: str | None = None
    interests: str | None = None
    location: str | None = None


class StudentProfileResponse(BaseModel):
    id: str
    user_id: str
    full_name: str | None = None
    sport: str | None = None
    bio: str | None = None
    interests: str | None = None
    location: str | None = None
    profile_completed: bool = False
    created_at: datetime
    updated_at: datetime


class MatchRecordRequest(BaseModel):
    event: str = Field(min_length=1)
    date: str = Field(min_length=1)
    sport: str = Field(min_length=1)
    competition: str = Field(min_length=1)
    result: str = Field(min_length=1)
    notes: str | None = None
    verified: str = "self"


class MatchRecordResponse(BaseModel):
    id: str
    user_id: str
    event: str
    date: str
    sport: str
    competition: str
    result: str
    notes: str | None = None
    verified: str
    created_at: datetime
    updated_at: datetime


class WellnessProfileRequest(BaseModel):
    height_cm: float | None = None
    weight_kg: float | None = None


class WellnessProfileResponse(BaseModel):
    id: str
    user_id: str
    height_cm: float | None = None
    weight_kg: float | None = None
    bmi: float | None = None
    updated_at: datetime


class DietEntryRequest(BaseModel):
    date: str = Field(min_length=1)
    meal_type: str = Field(min_length=1)
    description: str = Field(min_length=1)
    notes: str | None = None


class DietEntryResponse(BaseModel):
    id: str
    user_id: str
    date: str
    meal_type: str
    description: str
    notes: str | None = None
    created_at: datetime
    updated_at: datetime


def _serialize_profile(profile: StudentProfile | None) -> StudentProfileResponse | None:
    if profile is None:
        return None
    return StudentProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        full_name=profile.full_name,
        sport=profile.sport,
        bio=profile.bio,
        interests=profile.interests,
        location=profile.location,
        profile_completed=bool(profile.profile_completed),
        created_at=profile.created_at,
        updated_at=profile.updated_at,
    )


def _serialize_match_record(record: MatchRecord) -> MatchRecordResponse:
    return MatchRecordResponse(
        id=record.id,
        user_id=record.user_id,
        event=record.event,
        date=record.date,
        sport=record.sport,
        competition=record.competition,
        result=record.result,
        notes=record.notes,
        verified=record.verified,
        created_at=record.created_at,
        updated_at=record.updated_at,
    )


def _serialize_diet_entry(entry: DietEntry) -> DietEntryResponse:
    return DietEntryResponse(
        id=entry.id,
        user_id=entry.user_id,
        date=entry.date,
        meal_type=entry.meal_type,
        description=entry.description,
        notes=entry.notes,
        created_at=entry.created_at,
        updated_at=entry.updated_at,
    )


def _bmi(height_cm: float | None, weight_kg: float | None) -> float | None:
    if height_cm is None or weight_kg is None:
        return None
    if height_cm <= 0 or weight_kg <= 0:
        return None
    return weight_kg / ((height_cm / 100) ** 2)


@router.get("/students/me/profile", response_model=StudentProfileResponse)
def get_student_profile(
    current_user: UserRecord = Depends(require_roles(UserRole.STUDENT)),
    db: Session = Depends(get_db),
) -> StudentProfileResponse:
    profile = db.execute(select(StudentProfile).where(StudentProfile.user_id == current_user.id)).scalar_one_or_none()
    if profile is None:
        profile = StudentProfile(
            user_id=current_user.id,
            full_name=current_user.username,
            sport="Athletics",
            profile_completed=False,
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return _serialize_profile(profile)  # type: ignore[arg-type]


@router.post("/students/me/profile", response_model=StudentProfileResponse)
def upsert_student_profile(
    payload: StudentProfileRequest,
    current_user: UserRecord = Depends(require_roles(UserRole.STUDENT)),
    db: Session = Depends(get_db),
) -> StudentProfileResponse:
    profile = db.execute(select(StudentProfile).where(StudentProfile.user_id == current_user.id)).scalar_one_or_none()
    if profile is None:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)

    profile.full_name = payload.full_name or profile.full_name or current_user.username
    profile.sport = payload.sport or profile.sport
    profile.bio = payload.bio or profile.bio
    profile.interests = payload.interests or profile.interests
    profile.location = payload.location or profile.location
    profile.profile_completed = bool(
        profile.full_name or profile.sport or profile.bio or profile.interests or profile.location
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return _serialize_profile(profile)  # type: ignore[arg-type]


@router.get("/students/me/match-records", response_model=list[MatchRecordResponse])
def list_match_records(
    current_user: UserRecord = Depends(require_roles(UserRole.STUDENT)),
    db: Session = Depends(get_db),
) -> list[MatchRecordResponse]:
    records = db.execute(
        select(MatchRecord).where(MatchRecord.user_id == current_user.id).order_by(MatchRecord.created_at.desc())
    ).scalars().all()
    return [_serialize_match_record(record) for record in records]


@router.get("/students/me/match-records/{record_id}", response_model=MatchRecordResponse)
def get_match_record(
    record_id: str,
    current_user: UserRecord = Depends(require_roles(UserRole.STUDENT)),
    db: Session = Depends(get_db),
) -> MatchRecordResponse:
    record = db.execute(select(MatchRecord).where(MatchRecord.id == record_id)).scalar_one_or_none()
    if record is None:
        raise HTTPException(status_code=404, detail="Match record not found")
    if record.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this match record")
    return _serialize_match_record(record)


@router.post("/students/me/match-records", response_model=MatchRecordResponse)
def create_match_record(
    payload: MatchRecordRequest,
    current_user: UserRecord = Depends(require_roles(UserRole.STUDENT)),
    db: Session = Depends(get_db),
) -> MatchRecordResponse:
    record = MatchRecord(
        user_id=current_user.id,
        event=payload.event.strip(),
        date=payload.date.strip(),
        sport=payload.sport.strip(),
        competition=payload.competition.strip(),
        result=payload.result.strip(),
        notes=payload.notes.strip() if payload.notes else None,
        verified=payload.verified.strip() if payload.verified else "self",
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return _serialize_match_record(record)


@router.put("/students/me/match-records/{record_id}", response_model=MatchRecordResponse)
def update_match_record(
    record_id: str,
    payload: MatchRecordRequest,
    current_user: UserRecord = Depends(require_roles(UserRole.STUDENT)),
    db: Session = Depends(get_db),
) -> MatchRecordResponse:
    record = db.execute(select(MatchRecord).where(MatchRecord.id == record_id)).scalar_one_or_none()
    if record is None:
        raise HTTPException(status_code=404, detail="Match record not found")
    if record.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this match record")

    record.event = payload.event.strip()
    record.date = payload.date.strip()
    record.sport = payload.sport.strip()
    record.competition = payload.competition.strip()
    record.result = payload.result.strip()
    record.notes = payload.notes.strip() if payload.notes else None
    record.verified = payload.verified.strip() if payload.verified else "self"
    record.updated_at = datetime.now(timezone.utc)
    db.add(record)
    db.commit()
    db.refresh(record)
    return _serialize_match_record(record)


@router.delete("/students/me/match-records/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_match_record(
    record_id: str,
    current_user: UserRecord = Depends(require_roles(UserRole.STUDENT)),
    db: Session = Depends(get_db),
) -> None:
    record = db.execute(select(MatchRecord).where(MatchRecord.id == record_id)).scalar_one_or_none()
    if record is None:
        raise HTTPException(status_code=404, detail="Match record not found")
    if record.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this match record")
    db.delete(record)
    db.commit()


@router.get("/students/me/wellness", response_model=WellnessProfileResponse)
def get_wellness_profile(
    current_user: UserRecord = Depends(require_roles(UserRole.STUDENT)),
    db: Session = Depends(get_db),
) -> WellnessProfileResponse:
    profile = db.execute(select(WellnessProfile).where(WellnessProfile.user_id == current_user.id)).scalar_one_or_none()
    if profile is None:
        profile = WellnessProfile(user_id=current_user.id, height_cm=None, weight_kg=None)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return WellnessProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        height_cm=profile.height_cm,
        weight_kg=profile.weight_kg,
        bmi=_bmi(profile.height_cm, profile.weight_kg),
        updated_at=profile.updated_at,
    )


@router.post("/students/me/wellness", response_model=WellnessProfileResponse)
def upsert_wellness_profile(
    payload: WellnessProfileRequest,
    current_user: UserRecord = Depends(require_roles(UserRole.STUDENT)),
    db: Session = Depends(get_db),
) -> WellnessProfileResponse:
    profile = db.execute(select(WellnessProfile).where(WellnessProfile.user_id == current_user.id)).scalar_one_or_none()
    if profile is None:
        profile = WellnessProfile(user_id=current_user.id)
        db.add(profile)

    profile.height_cm = payload.height_cm if payload.height_cm is not None else profile.height_cm
    profile.weight_kg = payload.weight_kg if payload.weight_kg is not None else profile.weight_kg
    profile.updated_at = datetime.now(timezone.utc)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return WellnessProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        height_cm=profile.height_cm,
        weight_kg=profile.weight_kg,
        bmi=_bmi(profile.height_cm, profile.weight_kg),
        updated_at=profile.updated_at,
    )


@router.get("/students/me/wellness/diet", response_model=list[DietEntryResponse])
def list_meal_entries(
    current_user: UserRecord = Depends(require_roles(UserRole.STUDENT)),
    db: Session = Depends(get_db),
) -> list[DietEntryResponse]:
    entries = db.execute(
        select(DietEntry).where(DietEntry.user_id == current_user.id).order_by(DietEntry.created_at.desc())
    ).scalars().all()
    return [_serialize_diet_entry(entry) for entry in entries]


@router.post("/students/me/wellness/diet", response_model=DietEntryResponse)
def create_meal_entry(
    payload: DietEntryRequest,
    current_user: UserRecord = Depends(require_roles(UserRole.STUDENT)),
    db: Session = Depends(get_db),
) -> DietEntryResponse:
    entry = DietEntry(
        user_id=current_user.id,
        date=payload.date.strip(),
        meal_type=payload.meal_type.strip(),
        description=payload.description.strip(),
        notes=payload.notes.strip() if payload.notes else None,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return _serialize_diet_entry(entry)


@router.delete("/students/me/wellness/diet/{diet_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meal_entry(
    diet_id: str,
    current_user: UserRecord = Depends(require_roles(UserRole.STUDENT)),
    db: Session = Depends(get_db),
) -> None:
    entry = db.execute(select(DietEntry).where(DietEntry.id == diet_id)).scalar_one_or_none()
    if entry is None:
        raise HTTPException(status_code=404, detail="Meal entry not found")
    if entry.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this meal entry")
    db.delete(entry)
    db.commit()
