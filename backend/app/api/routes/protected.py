from fastapi import APIRouter, Depends

from backend.app.core.dependencies import get_current_user, require_roles
from backend.app.schemas.auth import UserResponse, UserRole
from backend.app.services.user_store import UserRecord


router = APIRouter(prefix="/test", tags=["authorization tests"])


@router.get("/authenticated", response_model=UserResponse)
def authenticated_user(current_user: UserRecord = Depends(get_current_user)) -> UserResponse:
    return UserResponse(username=current_user.username, role=current_user.role)


@router.get("/student", response_model=UserResponse)
def student_only(current_user: UserRecord = Depends(require_roles(UserRole.STUDENT))) -> UserResponse:
    return UserResponse(username=current_user.username, role=current_user.role)


@router.get("/coach", response_model=UserResponse)
def coach_only(current_user: UserRecord = Depends(require_roles(UserRole.COACH))) -> UserResponse:
    return UserResponse(username=current_user.username, role=current_user.role)


@router.get("/admin", response_model=UserResponse)
def admin_only(current_user: UserRecord = Depends(require_roles(UserRole.ADMIN))) -> UserResponse:
    return UserResponse(username=current_user.username, role=current_user.role)
