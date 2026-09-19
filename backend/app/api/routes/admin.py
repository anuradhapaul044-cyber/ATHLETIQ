from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from backend.app.core.dependencies import require_roles
from backend.app.db.models import ActivityLog, CoachAccountVerification, Opportunity, StudentProfile, User
from backend.app.db.session import get_db
from backend.app.schemas.auth import UserRole
from backend.app.services.user_store import UserRecord

router = APIRouter(prefix="/admin", tags=["admin"])


class AdminUserResponse(BaseModel):
    username: str
    email: str
    role: str
    name: str | None = None
    sport: str | None = None
    location: str | None = None
    is_active: bool = True
    status: str = "active"
    created_at: datetime


class AdminCoachResponse(BaseModel):
    username: str
    name: str | None = None
    sport: str | None = None
    location: str | None = None
    status: str = "pending"
    created_at: datetime


class CoachAccountVerificationRequest(BaseModel):
    status: str = Field(default="pending")
    reason: str | None = None


class CoachAccountVerificationResponse(BaseModel):
    id: str
    coach_username: str
    coach_name: str | None = None
    status: str
    reason: str | None = None
    reviewed_by: str | None = None
    reviewed_at: datetime | None = None
    created_at: datetime


class OpportunityCreateRequest(BaseModel):
    title: str
    organization: str
    category: str
    sport: str
    location: str
    deadline: str
    eligibility: str
    description: str
    action_label: str = "Apply"
    action_url: str = "#"
    match: int = 0
    status: str = "Open"
    source: str = "official"


class OpportunityUpdateRequest(BaseModel):
    title: str | None = None
    organization: str | None = None
    category: str | None = None
    sport: str | None = None
    location: str | None = None
    deadline: str | None = None
    eligibility: str | None = None
    description: str | None = None
    action_label: str | None = None
    action_url: str | None = None
    match: int | None = None
    status: str | None = None
    source: str | None = None
    is_active: bool | None = None


class OpportunityResponse(BaseModel):
    id: str
    title: str
    organization: str
    category: str
    sport: str
    location: str
    deadline: str
    eligibility: str
    description: str
    action_label: str
    action_url: str
    match: int
    source: str
    status: str | None = None
    is_active: bool = True


class DashboardSummaryResponse(BaseModel):
    total_users: int
    total_students: int
    total_coaches: int
    verified_coaches: int
    pending_coach_verifications: int
    total_assessments: int
    total_opportunities: int
    recent_activity: list[dict[str, Any]]


class AuditLogResponse(BaseModel):
    id: str
    actor: str
    action: str
    entity: str
    entity_id: str | None = None
    details: str | None = None
    metadata: dict[str, Any] | None = None
    created_at: datetime


def _get_student_profile(db: Session, user_id: str) -> StudentProfile | None:
    return db.execute(select(StudentProfile).where(StudentProfile.user_id == user_id)).scalar_one_or_none()


def _latest_account_verification_status(db: Session, coach_id: str) -> str:
    record = db.execute(
        select(CoachAccountVerification)
        .where(CoachAccountVerification.coach_id == coach_id)
        .order_by(CoachAccountVerification.updated_at.desc())
    ).scalars().first()
    return record.status if record else "pending"


def _record_activity(
    db: Session,
    actor: UserRecord,
    action: str,
    entity: str,
    details: str,
    entity_id: str | None = None,
    metadata: dict[str, Any] | None = None,
) -> None:
    log = ActivityLog(
        actor_id=actor.id,
        actor_username=actor.username,
        action=action,
        entity=entity,
        entity_id=entity_id,
        details=details,
        metadata_json=metadata,
    )
    db.add(log)


def _serialize_opportunity(opportunity: Opportunity) -> OpportunityResponse:
    return OpportunityResponse(
        id=opportunity.id,
        title=opportunity.title,
        organization=opportunity.organization,
        category=opportunity.category,
        sport=opportunity.sport,
        location=opportunity.location,
        deadline=opportunity.deadline,
        eligibility=opportunity.eligibility,
        description=opportunity.description,
        action_label=opportunity.action_label,
        action_url=opportunity.action_url,
        match=opportunity.match_score,
        source=opportunity.source,
        status=opportunity.status,
        is_active=opportunity.is_active,
    )


@router.get("", response_model=DashboardSummaryResponse)
def admin_dashboard(
    current_user: UserRecord = Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db),
) -> DashboardSummaryResponse:
    total_users = db.execute(select(func.count(User.id))).scalar() or 0
    total_students = db.execute(select(func.count(User.id)).where(User.role == UserRole.STUDENT.value)).scalar() or 0
    total_coaches = db.execute(select(func.count(User.id)).where(User.role == UserRole.COACH.value)).scalar() or 0
    verified_coaches = db.execute(
        select(func.count(User.id)).where(User.role == UserRole.COACH.value, User.is_active.is_(True))
    ).scalar() or 0
    pending_coach_verifications = db.execute(
        select(func.count(CoachAccountVerification.id)).where(CoachAccountVerification.status == "pending")
    ).scalar() or 0
    total_assessments = db.execute(select(func.count(User.id))).scalar() or 0
    total_opportunities = db.execute(select(func.count(Opportunity.id)).where(Opportunity.is_active.is_(True))).scalar() or 0
    recent_activity = db.execute(
        select(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(5)
    ).scalars().all()

    return DashboardSummaryResponse(
        total_users=int(total_users),
        total_students=int(total_students),
        total_coaches=int(total_coaches),
        verified_coaches=int(verified_coaches),
        pending_coach_verifications=int(pending_coach_verifications),
        total_assessments=int(total_assessments),
        total_opportunities=int(total_opportunities),
        recent_activity=[
            {
                "id": entry.id,
                "actor": entry.actor_username,
                "action": entry.action,
                "entity": entry.entity,
                "entity_id": entry.entity_id,
                "details": entry.details,
                "metadata": entry.metadata_json,
                "created_at": entry.created_at.isoformat(),
            }
            for entry in recent_activity
        ],
    )


@router.get("/users", response_model=list[AdminUserResponse])
def list_admin_users(
    current_user: UserRecord = Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db),
) -> list[AdminUserResponse]:
    users = db.execute(select(User).order_by(User.created_at.desc())).scalars().all()
    rows: list[AdminUserResponse] = []
    for user in users:
        profile = _get_student_profile(db, user.id)
        status = "active" if user.is_active else "inactive"
        if user.role == UserRole.COACH.value:
            status = _latest_account_verification_status(db, user.id)
        rows.append(
            AdminUserResponse(
                username=user.username,
                email=user.email,
                role=user.role,
                name=profile.full_name if profile and profile.full_name else user.username,
                sport=profile.sport if profile and profile.sport else None,
                location=profile.location if profile and profile.location else None,
                is_active=user.is_active,
                status=status,
                created_at=user.created_at,
            )
        )
    return rows


@router.get("/coaches", response_model=list[AdminCoachResponse])
def list_admin_coaches(
    current_user: UserRecord = Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db),
) -> list[AdminCoachResponse]:
    coaches = db.execute(select(User).where(User.role == UserRole.COACH.value).order_by(User.created_at.desc())).scalars().all()
    rows: list[AdminCoachResponse] = []
    for coach in coaches:
        profile = _get_student_profile(db, coach.id)
        rows.append(
            AdminCoachResponse(
                username=coach.username,
                name=profile.full_name if profile and profile.full_name else coach.username,
                sport=profile.sport if profile and profile.sport else None,
                location=profile.location if profile and profile.location else None,
                status=_latest_account_verification_status(db, coach.id),
                created_at=coach.created_at,
            )
        )
    return rows


@router.get("/verification", response_model=list[CoachAccountVerificationResponse])
def list_verification_queue(
    current_user: UserRecord = Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db),
) -> list[CoachAccountVerificationResponse]:
    records = db.execute(
        select(CoachAccountVerification).order_by(CoachAccountVerification.updated_at.desc())
    ).scalars().all()
    if not records:
        coaches = db.execute(select(User).where(User.role == UserRole.COACH.value)).scalars().all()
        for coach in coaches:
            row = CoachAccountVerification(coach_id=coach.id, status="pending")
            db.add(row)
        db.commit()
        records = db.execute(
            select(CoachAccountVerification).order_by(CoachAccountVerification.updated_at.desc())
        ).scalars().all()

    response: list[CoachAccountVerificationResponse] = []
    for record in records:
        coach = db.get(User, record.coach_id)
        profile = _get_student_profile(db, record.coach_id)
        reviewer = db.get(User, record.reviewed_by) if record.reviewed_by else None
        response.append(
            CoachAccountVerificationResponse(
                id=record.id,
                coach_username=coach.username if coach else "unknown",
                coach_name=profile.full_name if profile and profile.full_name else (coach.username if coach else None),
                status=record.status,
                reason=record.reason,
                reviewed_by=reviewer.username if reviewer else None,
                reviewed_at=record.reviewed_at,
                created_at=record.created_at,
            )
        )
    return response


@router.post("/verification/{coach_username}", response_model=CoachAccountVerificationResponse)
def approve_or_reject_coach(
    coach_username: str,
    payload: CoachAccountVerificationRequest,
    current_user: UserRecord = Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db),
) -> CoachAccountVerificationResponse:
    coach = db.execute(select(User).where(User.username == coach_username.strip().lower())).scalar_one_or_none()
    if coach is None or coach.role != UserRole.COACH.value:
        raise HTTPException(status_code=404, detail="Coach not found")

    record = db.execute(
        select(CoachAccountVerification)
        .where(CoachAccountVerification.coach_id == coach.id)
        .order_by(CoachAccountVerification.updated_at.desc())
    ).scalars().first()
    if record is None:
        record = CoachAccountVerification(coach_id=coach.id, status="pending")
        db.add(record)
        db.flush()

    candidate_status = payload.status.strip().lower() if payload.status else "pending"
    if candidate_status not in {"pending", "approved", "rejected"}:
        raise HTTPException(status_code=400, detail="Unsupported verification status")

    record.status = candidate_status
    record.reason = payload.reason.strip() if payload.reason and payload.reason.strip() else None
    record.reviewed_by = current_user.id
    record.reviewed_at = datetime.now(timezone.utc)
    record.updated_at = datetime.now(timezone.utc)
    db.add(record)
    _record_activity(
        db,
        current_user,
        "Coach account verification",
        "coach_account_verification",
        f"Coach account {coach.username} was {candidate_status}",
        entity_id=record.id,
        metadata={"status": candidate_status, "coach_username": coach.username, "reason": record.reason},
    )
    db.commit()
    db.refresh(record)
    profile = _get_student_profile(db, coach.id)
    reviewer = db.get(User, record.reviewed_by)
    return CoachAccountVerificationResponse(
        id=record.id,
        coach_username=coach.username,
        coach_name=profile.full_name if profile and profile.full_name else coach.username,
        status=record.status,
        reason=record.reason,
        reviewed_by=reviewer.username if reviewer else None,
        reviewed_at=record.reviewed_at,
        created_at=record.created_at,
    )


@router.get("/reports", response_model=dict[str, Any])
def admin_reports(
    current_user: UserRecord = Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    users_by_role = db.execute(
        select(User.role, func.count(User.id)).group_by(User.role)
    ).all()
    assessments = db.execute(select(func.count(User.id)).where(User.role == UserRole.STUDENT.value)).scalar() or 0
    verified_coaches = db.execute(
        select(func.count(CoachAccountVerification.id)).where(CoachAccountVerification.status == "approved")
    ).scalar() or 0
    pending_coaches = db.execute(
        select(func.count(CoachAccountVerification.id)).where(CoachAccountVerification.status == "pending")
    ).scalar() or 0
    opportunities = db.execute(select(func.count(Opportunity.id))).scalar() or 0
    return {
        "users_by_role": [{"role": role, "count": int(count)} for role, count in users_by_role],
        "assessment_count": int(assessments),
        "verified_coaches": int(verified_coaches),
        "pending_coaches": int(pending_coaches),
        "opportunities_count": int(opportunities),
    }


@router.get("/activity", response_model=list[AuditLogResponse])
def admin_activity(
    current_user: UserRecord = Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db),
) -> list[AuditLogResponse]:
    entries = db.execute(select(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(50)).scalars().all()
    return [
        AuditLogResponse(
            id=entry.id,
            actor=entry.actor_username,
            action=entry.action,
            entity=entry.entity,
            entity_id=entry.entity_id,
            details=entry.details,
            metadata=entry.metadata_json,
            created_at=entry.created_at,
        )
        for entry in entries
    ]


@router.get("/opportunities", response_model=list[OpportunityResponse])
def admin_list_opportunities(
    current_user: UserRecord = Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db),
) -> list[OpportunityResponse]:
    opportunities = db.execute(select(Opportunity).order_by(Opportunity.created_at.desc())).scalars().all()
    return [_serialize_opportunity(item) for item in opportunities]


@router.post("/opportunities", response_model=OpportunityResponse)
def create_opportunity(
    payload: OpportunityCreateRequest,
    current_user: UserRecord = Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db),
) -> OpportunityResponse:
    item = Opportunity(
        title=payload.title,
        organization=payload.organization,
        category=payload.category,
        sport=payload.sport,
        location=payload.location,
        deadline=payload.deadline,
        eligibility=payload.eligibility,
        description=payload.description,
        action_label=payload.action_label,
        action_url=payload.action_url,
        match_score=payload.match,
        source=payload.source,
        status=payload.status,
        is_active=True,
    )
    db.add(item)
    db.flush()
    _record_activity(
        db,
        current_user,
        "Opportunity created",
        "opportunity",
        f"Opportunity {item.title} created",
        entity_id=item.id,
        metadata={"organization": item.organization, "status": item.status},
    )
    db.commit()
    db.refresh(item)
    return _serialize_opportunity(item)


@router.put("/opportunities/{opportunity_id}", response_model=OpportunityResponse)
def update_opportunity(
    opportunity_id: str,
    payload: OpportunityUpdateRequest,
    current_user: UserRecord = Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db),
) -> OpportunityResponse:
    item = db.get(Opportunity, opportunity_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        if value is None:
            continue
        if field == "match":
            item.match_score = value
        elif field == "is_active":
            item.is_active = value
        else:
            setattr(item, field, value)
    item.updated_at = datetime.now(timezone.utc)
    db.add(item)
    _record_activity(
        db,
        current_user,
        "Opportunity updated",
        "opportunity",
        f"Opportunity {item.title} updated",
        entity_id=item.id,
        metadata={"status": item.status},
    )
    db.commit()
    db.refresh(item)
    return _serialize_opportunity(item)


@router.delete("/opportunities/{opportunity_id}", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_opportunity(
    opportunity_id: str,
    current_user: UserRecord = Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db),
) -> None:
    item = db.get(Opportunity, opportunity_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    item.is_active = False
    item.status = "Closed"
    item.updated_at = datetime.now(timezone.utc)
    _record_activity(
        db,
        current_user,
        "Opportunity deactivated",
        "opportunity",
        f"Opportunity {item.title} deactivated",
        entity_id=item.id,
    )
    db.commit()
