"""admin integration tables

Revision ID: 20260921_admin_integration
Revises: 20260920_student_coach_persistence
Create Date: 2026-09-19 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "20260921_admin_integration"
down_revision = "20260920_student_coach_persistence"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "coach_account_verifications",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("coach_id", sa.String(length=36), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("reason", sa.String(length=500), nullable=True),
        sa.Column("reviewed_by", sa.String(length=36), nullable=True),
        sa.Column("reviewed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["coach_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["reviewed_by"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_coach_account_verifications_coach_id"), "coach_account_verifications", ["coach_id"], unique=False)
    op.create_index(op.f("ix_coach_account_verifications_reviewed_by"), "coach_account_verifications", ["reviewed_by"], unique=False)

    op.create_table(
        "opportunities",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("organization", sa.String(length=200), nullable=False),
        sa.Column("category", sa.String(length=80), nullable=False),
        sa.Column("sport", sa.String(length=120), nullable=False),
        sa.Column("location", sa.String(length=200), nullable=False),
        sa.Column("deadline", sa.String(length=80), nullable=False),
        sa.Column("eligibility", sa.String(length=500), nullable=False),
        sa.Column("description", sa.String(length=1000), nullable=False),
        sa.Column("action_label", sa.String(length=80), nullable=False),
        sa.Column("action_url", sa.String(length=500), nullable=False),
        sa.Column("match_score", sa.Integer(), nullable=False),
        sa.Column("source", sa.String(length=50), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "activity_logs",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("actor_id", sa.String(length=36), nullable=True),
        sa.Column("actor_username", sa.String(length=150), nullable=False),
        sa.Column("action", sa.String(length=150), nullable=False),
        sa.Column("entity", sa.String(length=80), nullable=False),
        sa.Column("entity_id", sa.String(length=80), nullable=True),
        sa.Column("details", sa.String(length=500), nullable=True),
        sa.Column("metadata_json", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["actor_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_activity_logs_actor_id"), "activity_logs", ["actor_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_activity_logs_actor_id"), table_name="activity_logs")
    op.drop_table("activity_logs")
    op.drop_index(op.f("ix_coach_account_verifications_reviewed_by"), table_name="coach_account_verifications")
    op.drop_index(op.f("ix_coach_account_verifications_coach_id"), table_name="coach_account_verifications")
    op.drop_table("coach_account_verifications")
    op.drop_table("opportunities")
