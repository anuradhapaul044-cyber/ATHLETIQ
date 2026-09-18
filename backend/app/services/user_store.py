"""Temporary in-memory user store. Replace with a database repository later."""

from dataclasses import dataclass

from backend.app.core.security import hash_password
from backend.app.schemas.auth import UserRole


@dataclass
class UserRecord:
    username: str
    password_hash: str
    role: UserRole


class InMemoryUserStore:
    def __init__(self):
        self._users: dict[str, UserRecord] = {}

    def create_user(self, username: str, password: str, role: UserRole) -> UserRecord:
        normalized_username = username.strip().lower()
        if normalized_username in self._users:
            raise ValueError("Username is already registered")

        user = UserRecord(
            username=normalized_username,
            password_hash=hash_password(password),
            role=role,
        )
        self._users[normalized_username] = user
        return user

    def get_user(self, username: str | None) -> UserRecord | None:
        return self._users.get(username.lower()) if username else None


user_store = InMemoryUserStore()

# Local-only accounts allow each authorization path to be tested before a
# database and administrative user-management workflow exist.
user_store.create_user("anuradha", "stringst", UserRole.STUDENT)
user_store.create_user("demo.student", "DemoStudent123!", UserRole.STUDENT)
user_store.create_user("demo.coach", "DemoCoach123!", UserRole.COACH)
user_store.create_user("demo.admin", "DemoAdmin123!", UserRole.ADMIN)
