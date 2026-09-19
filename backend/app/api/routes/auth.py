from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from backend.app.core.security import create_access_token, verify_password
from backend.app.schemas.auth import RegisterRequest, TokenResponse, UserResponse, UserRole
from backend.app.services.user_store import user_store


router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest) -> UserResponse:
    """Create an account in PostgreSQL using the requested role."""
    selected_role = request.role or UserRole.STUDENT
    try:
        user = user_store.create_user(request.username, request.password, selected_role)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    return UserResponse(username=user.username, role=UserRole(user.role))


@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends()) -> TokenResponse:
    """Exchange OAuth2 password-form credentials for an ATHLETIQ JWT."""
    user = user_store.get_user(form_data.username)
    if user is None or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return TokenResponse(
        access_token=create_access_token(user.username, user.role),
        user=UserResponse(username=user.username, role=UserRole(user.role)),
    )
