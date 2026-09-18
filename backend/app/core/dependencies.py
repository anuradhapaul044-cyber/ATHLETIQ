"""Reusable authentication and role authorization dependencies."""

from collections.abc import Callable

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from backend.app.core.security import ALGORITHM, JWT_SECRET
from backend.app.schemas.auth import UserRole
from backend.app.services.user_store import UserRecord, user_store


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_user(token: str = Depends(oauth2_scheme)) -> UserRecord:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        username = payload.get("sub")
        token_role = payload.get("role")
    except jwt.InvalidTokenError as exc:
        raise credentials_exception from exc

    user = user_store.get_user(username) if isinstance(username, str) else None
    if user is None or token_role != user.role.value:
        raise credentials_exception
    return user


def require_roles(*allowed_roles: UserRole) -> Callable:
    """Create a dependency that accepts only users with one of the given roles."""
    def role_guard(current_user: UserRecord = Depends(get_current_user)) -> UserRecord:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource",
            )
        return current_user

    return role_guard
