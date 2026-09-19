"""Reusable authentication and role authorization dependencies."""

from collections.abc import Callable

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.core.config import JWT_SECRET
from backend.app.core.security import ALGORITHM
from backend.app.db.models import User
from backend.app.db.session import get_db
from backend.app.schemas.auth import UserRole


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        username = payload.get("sub")
        token_role = payload.get("role")
    except jwt.InvalidTokenError as exc:
        raise credentials_exception from exc

    user = db.execute(select(User).where(User.username == username, User.is_active.is_(True))).scalar_one_or_none() if isinstance(username, str) else None
    if user is None or token_role != user.role:
        raise credentials_exception
    return user


def require_roles(*allowed_roles: UserRole) -> Callable:
    """Create a dependency that accepts only users with one of the given roles."""
    def role_guard(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in {role.value for role in allowed_roles}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource",
            )
        return current_user

    return role_guard
