from __future__ import annotations

from pydantic import BaseModel
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.db.models import Opportunity
from backend.app.db.session import get_db

router = APIRouter(tags=["opportunities"])


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


@router.get("/opportunities", response_model=list[OpportunityResponse])
def list_opportunities(db: Session = Depends(get_db)) -> list[OpportunityResponse]:
    rows = db.execute(select(Opportunity).where(Opportunity.is_active.is_(True)).order_by(Opportunity.created_at.desc())).scalars().all()
    return [
        OpportunityResponse(
            id=item.id,
            title=item.title,
            organization=item.organization,
            category=item.category,
            sport=item.sport,
            location=item.location,
            deadline=item.deadline,
            eligibility=item.eligibility,
            description=item.description,
            action_label=item.action_label,
            action_url=item.action_url,
            match=item.match_score,
            source=item.source,
            status=item.status,
            is_active=item.is_active,
        )
        for item in rows
    ]
