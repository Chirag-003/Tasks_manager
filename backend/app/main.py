from fastapi import FastAPI

from fastapi import Depends

from app.core.dependencies import get_current_user

from app.api.task1 import router as task_router
from app.api.subtasks import router as subtasks_router
from app.api.comments import router as comments_router
from app.api.users import router as users_router
from app.api.auth import router as auth_router

from app.core.errors import (
    global_exception_handler,
    http_exception_handler,
)
from fastapi.exceptions import HTTPException

from app.models import model_task
from app.models import model_subtasks


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Task Management API", version="1.0.0")


app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "API is running"}


app.include_router(
    task_router,
    prefix="/api/task1",
    tags=["Tasks"],
    dependencies=[Depends(get_current_user)],
)

app.include_router(
    subtasks_router,
    prefix="/api",
    tags=["Subtasks"],
    dependencies=[Depends(get_current_user)],
)

app.include_router(
    comments_router,
    prefix="/api",
    tags=["Comments"],
    dependencies=[Depends(get_current_user)],
)

app.include_router(
    users_router,
    prefix="/api",
    tags=["Users"],
    dependencies=[Depends(get_current_user)],
)

app.include_router(auth_router, prefix="/api", tags=["Auth"])
