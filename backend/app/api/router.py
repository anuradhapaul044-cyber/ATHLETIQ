from fastapi import APIRouter

from backend.app.api.routes.assessments import router as assessments_router
from backend.app.api.routes.auth import router as auth_router
from backend.app.api.routes.health import router as health_router
from backend.app.api.routes.protected import router as protected_router


api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(protected_router)
api_router.include_router(assessments_router)
