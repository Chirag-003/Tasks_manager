from app.api.v1.auth import router as auth_router
from app.api.v1.comments import router as comments_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.subtasks import router as subtasks_router
from app.api.v1.task1 import router as task_router
from app.api.v1.users import router as users_router
from app.core.dependencies import get_current_user
from fastapi import APIRouter, Depends

router = APIRouter()

router.include_router(
    task_router,
    prefix="/task1",
    tags=["Tasks"],
    dependencies=[Depends(get_current_user)],
)

router.include_router(
    subtasks_router,
    tags=["Subtasks"],
    dependencies=[Depends(get_current_user)],
)

router.include_router(
    comments_router,
    tags=["Comments"],
    dependencies=[Depends(get_current_user)],
)

router.include_router(
    users_router,
    tags=["Users"],
    dependencies=[Depends(get_current_user)],
)

router.include_router(
    auth_router,
    tags=["Auth"],
)

router.include_router(
    dashboard_router,
    tags=["Dashboard"],
)
