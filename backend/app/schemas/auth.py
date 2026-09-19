from enum import Enum

from pydantic import BaseModel, Field


class UserRole(str, Enum):
    STUDENT = "student"
    COACH = "coach"
    ADMIN = "admin"


class RegisterRequest(BaseModel):
    """Credentials and role for a new account.

    The API keeps ``role`` optional for backwards compatibility with older
    clients; omitted roles remain students.
    """

    username: str = Field(min_length=3, max_length=100)
    password: str = Field(min_length=8, max_length=128)
    role: UserRole | None = Field(
        default=None,
        description="Account role. Omit for the backwards-compatible student default.",
    )


class UserResponse(BaseModel):
    username: str
    role: UserRole


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
