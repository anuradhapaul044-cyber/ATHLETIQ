"""JWT and password helpers for the ATHLETIQ prototype."""

from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash

from backend.app.core.config import JWT_SECRET

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)


def create_access_token(subject: str, role: str) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": subject, "role": role, "exp": expires_at}
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)
