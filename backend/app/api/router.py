from fastapi import APIRouter

from backend.app.api.routes.admin import router as admin_router
from backend.app.api.routes.assessments import router as assessments_router
from backend.app.api.routes.auth import router as auth_router
from backend.app.api.routes.coach import router as coach_router
from backend.app.api.routes.health import router as health_router
from backend.app.api.routes.opportunities import router as opportunities_router
from backend.app.api.routes.protected import router as protected_router
from backend.app.api.routes.student import router as student_router


api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(protected_router)
api_router.include_router(student_router)
api_router.include_router(coach_router)
api_router.include_router(admin_router)
api_router.include_router(opportunities_router)
api_router.include_router(assessments_router)
