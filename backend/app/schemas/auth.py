from enum import Enum

from pydantic import BaseModel, Field


class UserRole(str, Enum):
    STUDENT = "student"
    COACH = "coach"
    ADMIN = "admin"


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=100)
    password: str = Field(min_length=8, max_length=128)


class UserResponse(BaseModel):
    username: str
    role: UserRole


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
