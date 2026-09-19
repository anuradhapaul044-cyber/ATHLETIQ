import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, JSON, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.db.base import Base
from backend.app.schemas.auth import UserRole


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False, default=UserRole.STUDENT.value)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    student_profile: Mapped["StudentProfile | None"] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    assessments: Mapped[list["Assessment"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    match_records: Mapped[list["MatchRecord"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    wellness_profile: Mapped["WellnessProfile | None"] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    diet_entries: Mapped[list["DietEntry"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    saved_athletes: Mapped[list["SavedAthlete"]] = relationship(back_populates="coach", foreign_keys="SavedAthlete.coach_id", cascade="all, delete-orphan")
    saved_by_coaches: Mapped[list["SavedAthlete"]] = relationship(back_populates="athlete", foreign_keys="SavedAthlete.athlete_user_id", cascade="all, delete-orphan")
    verification_records: Mapped[list["CoachVerification"]] = relationship(back_populates="coach", foreign_keys="CoachVerification.coach_id", cascade="all, delete-orphan")
    athlete_verifications: Mapped[list["CoachVerification"]] = relationship(back_populates="athlete", foreign_keys="CoachVerification.athlete_user_id", cascade="all, delete-orphan")
    coach_account_verifications: Mapped[list["CoachAccountVerification"]] = relationship(back_populates="coach", foreign_keys="CoachAccountVerification.coach_id", cascade="all, delete-orphan")
    coach_verification_reviews: Mapped[list["CoachAccountVerification"]] = relationship(back_populates="reviewer", foreign_keys="CoachAccountVerification.reviewed_by", cascade="all, delete-orphan")
    activity_logs: Mapped[list["ActivityLog"]] = relationship(back_populates="actor", foreign_keys="ActivityLog.actor_id", cascade="all, delete-orphan")


class StudentProfile(Base):
    __tablename__ = "student_profiles"
    __table_args__ = (UniqueConstraint("user_id", name="uq_student_profiles_user_id"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, unique=True)
    full_name: Mapped[str | None] = mapped_column(String(150), nullable=True)
    sport: Mapped[str | None] = mapped_column(String(100), nullable=True)
    bio: Mapped[str | None] = mapped_column(String(500), nullable=True)
    interests: Mapped[str | None] = mapped_column(String(250), nullable=True)
    date_of_birth: Mapped[Date | None] = mapped_column(Date, nullable=True)
    location: Mapped[str | None] = mapped_column(String(150), nullable=True)
    profile_completed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user: Mapped[User] = relationship(back_populates="student_profile")


class MatchRecord(Base):
    __tablename__ = "match_records"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    event: Mapped[str] = mapped_column(String(200), nullable=False)
    date: Mapped[str] = mapped_column(String(50), nullable=False)
    sport: Mapped[str] = mapped_column(String(100), nullable=False)
    competition: Mapped[str] = mapped_column(String(150), nullable=False)
    result: Mapped[str] = mapped_column(String(150), nullable=False)
    notes: Mapped[str | None] = mapped_column(String(500), nullable=True)
    verified: Mapped[str] = mapped_column(String(20), nullable=False, default="self")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user: Mapped[User] = relationship(back_populates="match_records")


class WellnessProfile(Base):
    __tablename__ = "wellness_profiles"
    __table_args__ = (UniqueConstraint("user_id", name="uq_wellness_profiles_user_id"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, unique=True)
    height_cm: Mapped[float | None] = mapped_column(Float, nullable=True)
    weight_kg: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user: Mapped[User] = relationship(back_populates="wellness_profile")


class DietEntry(Base):
    __tablename__ = "diet_entries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    date: Mapped[str] = mapped_column(String(50), nullable=False)
    meal_type: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(200), nullable=False)
    notes: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user: Mapped[User] = relationship(back_populates="diet_entries")


class SavedAthlete(Base):
    __tablename__ = "saved_athletes"
    __table_args__ = (UniqueConstraint("coach_id", "athlete_user_id", name="uq_saved_athletes_unique"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    coach_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    athlete_user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    coach: Mapped[User] = relationship(back_populates="saved_athletes", foreign_keys=[coach_id])
    athlete: Mapped[User] = relationship(back_populates="saved_by_coaches", foreign_keys=[athlete_user_id])


class CoachVerification(Base):
    __tablename__ = "coach_verifications"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    coach_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    athlete_user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    evidence_type: Mapped[str] = mapped_column(String(50), nullable=False, default="assessment")
    metric: Mapped[str | None] = mapped_column(String(250), nullable=True)
    details: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    observation: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    coach: Mapped[User] = relationship(back_populates="verification_records", foreign_keys=[coach_id])
    athlete: Mapped[User] = relationship(back_populates="athlete_verifications", foreign_keys=[athlete_user_id])


class CoachAccountVerification(Base):
    __tablename__ = "coach_account_verifications"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    coach_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    reason: Mapped[str | None] = mapped_column(String(500), nullable=True)
    reviewed_by: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    coach: Mapped[User] = relationship(back_populates="coach_account_verifications", foreign_keys=[coach_id])
    reviewer: Mapped[User | None] = relationship(back_populates="coach_verification_reviews", foreign_keys=[reviewed_by])


class Opportunity(Base):
    __tablename__ = "opportunities"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    organization: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(80), nullable=False)
    sport: Mapped[str] = mapped_column(String(120), nullable=False)
    location: Mapped[str] = mapped_column(String(200), nullable=False)
    deadline: Mapped[str] = mapped_column(String(80), nullable=False)
    eligibility: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=False)
    action_label: Mapped[str] = mapped_column(String(80), nullable=False, default="Apply")
    action_url: Mapped[str] = mapped_column(String(500), nullable=False, default="#")
    match_score: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    source: Mapped[str] = mapped_column(String(50), nullable=False, default="official")
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="Open")
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    actor_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), index=True, nullable=True)
    actor_username: Mapped[str] = mapped_column(String(150), nullable=False)
    action: Mapped[str] = mapped_column(String(150), nullable=False)
    entity: Mapped[str] = mapped_column(String(80), nullable=False)
    entity_id: Mapped[str | None] = mapped_column(String(80), nullable=True)
    details: Mapped[str | None] = mapped_column(String(500), nullable=True)
    metadata_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    actor: Mapped[User | None] = relationship(back_populates="activity_logs", foreign_keys=[actor_id])


class Assessment(Base):
    __tablename__ = "assessments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    assessment_type: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user: Mapped[User] = relationship(back_populates="assessments")
    result: Mapped["AssessmentResult | None"] = relationship(back_populates="assessment", uselist=False, cascade="all, delete-orphan")


class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    assessment_id: Mapped[str] = mapped_column(ForeignKey("assessments.id"), unique=True, nullable=False)
    completed_reps: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    incomplete_reps: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    minimum_elbow_angle: Mapped[float | None] = mapped_column(Float, nullable=True)
    maximum_elbow_angle: Mapped[float | None] = mapped_column(Float, nullable=True)
    average_elbow_angle: Mapped[float | None] = mapped_column(Float, nullable=True)
    pose_detection_percentage: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    movement_consistency: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    processed_frames: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    fps: Mapped[float | None] = mapped_column(Float, nullable=True)
    pose_detected_frames: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    selected_elbow: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    pose_detection: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    assessment: Mapped[Assessment] = relationship(back_populates="result")
