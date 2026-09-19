"""student/coach persistence tables

Revision ID: 20260920_student_coach_persistence
Revises: 20260919_initial
Create Date: 2026-09-19 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260920_student_coach_persistence"
down_revision = "20260919_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("student_profiles", sa.Column("bio", sa.String(length=500), nullable=True))
    op.add_column("student_profiles", sa.Column("interests", sa.String(length=250), nullable=True))
    op.add_column("student_profiles", sa.Column("profile_completed", sa.Boolean(), nullable=False, server_default=sa.text("false")))

    op.create_table(
        "match_records",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("event", sa.String(length=200), nullable=False),
        sa.Column("date", sa.String(length=50), nullable=False),
        sa.Column("sport", sa.String(length=100), nullable=False),
        sa.Column("competition", sa.String(length=150), nullable=False),
        sa.Column("result", sa.String(length=150), nullable=False),
        sa.Column("notes", sa.String(length=500), nullable=True),
        sa.Column("verified", sa.String(length=20), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_match_records_user_id"), "match_records", ["user_id"], unique=False)

    op.create_table(
        "wellness_profiles",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("height_cm", sa.Float(), nullable=True),
        sa.Column("weight_kg", sa.Float(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", name="uq_wellness_profiles_user_id"),
    )

    op.create_table(
        "diet_entries",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("date", sa.String(length=50), nullable=False),
        sa.Column("meal_type", sa.String(length=50), nullable=False),
        sa.Column("description", sa.String(length=200), nullable=False),
        sa.Column("notes", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_diet_entries_user_id"), "diet_entries", ["user_id"], unique=False)

    op.create_table(
        "saved_athletes",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("coach_id", sa.String(length=36), nullable=False),
        sa.Column("athlete_user_id", sa.String(length=36), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["athlete_user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["coach_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("coach_id", "athlete_user_id", name="uq_saved_athletes_unique"),
    )
    op.create_index(op.f("ix_saved_athletes_coach_id"), "saved_athletes", ["coach_id"], unique=False)
    op.create_index(op.f("ix_saved_athletes_athlete_user_id"), "saved_athletes", ["athlete_user_id"], unique=False)

    op.create_table(
        "coach_verifications",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("coach_id", sa.String(length=36), nullable=False),
        sa.Column("athlete_user_id", sa.String(length=36), nullable=False),
        sa.Column("evidence_type", sa.String(length=50), nullable=False),
        sa.Column("metric", sa.String(length=250), nullable=True),
        sa.Column("details", sa.String(length=500), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("observation", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["athlete_user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["coach_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_coach_verifications_coach_id"), "coach_verifications", ["coach_id"], unique=False)
    op.create_index(op.f("ix_coach_verifications_athlete_user_id"), "coach_verifications", ["athlete_user_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_coach_verifications_athlete_user_id"), table_name="coach_verifications")
    op.drop_index(op.f("ix_coach_verifications_coach_id"), table_name="coach_verifications")
    op.drop_table("coach_verifications")
    op.drop_index(op.f("ix_saved_athletes_athlete_user_id"), table_name="saved_athletes")
    op.drop_index(op.f("ix_saved_athletes_coach_id"), table_name="saved_athletes")
    op.drop_table("saved_athletes")
    op.drop_index(op.f("ix_diet_entries_user_id"), table_name="diet_entries")
    op.drop_table("diet_entries")
    op.drop_table("wellness_profiles")
    op.drop_index(op.f("ix_match_records_user_id"), table_name="match_records")
    op.drop_table("match_records")
    op.drop_column("student_profiles", "profile_completed")
    op.drop_column("student_profiles", "interests")
    op.drop_column("student_profiles", "bio")
