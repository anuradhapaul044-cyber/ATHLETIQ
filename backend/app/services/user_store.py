"""Database-backed user store for ATHLETIQ."""

from sqlalchemy import select

from backend.app.core.security import hash_password
from backend.app.db.models import StudentProfile, User
from backend.app.db.session import SessionLocal
from backend.app.schemas.auth import UserRole

UserRecord = User


class DatabaseUserStore:
    def create_user(self, username: str, password: str, role: UserRole) -> User:
        normalized_username = username.strip().lower()
        with SessionLocal() as session:
            existing = session.execute(select(User).where(User.username == normalized_username)).scalar_one_or_none()
            if existing is not None:
                raise ValueError("Username is already registered")

            user = User(
                username=normalized_username,
                email=f"{normalized_username}@athletiq.local",
                password_hash=hash_password(password),
                role=role.value,
            )
            session.add(user)
            session.flush()

            if role == UserRole.STUDENT:
                session.add(StudentProfile(user_id=user.id, full_name=normalized_username))

            session.commit()
            session.refresh(user)
            return user

    def get_user(self, username: str | None) -> User | None:
        if username is None:
            return None
        normalized_username = username.strip().lower()
        with SessionLocal() as session:
            return session.execute(select(User).where(User.username == normalized_username)).scalar_one_or_none()


user_store = DatabaseUserStore()
