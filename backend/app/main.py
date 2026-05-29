from fastapi import FastAPI

from app.api.task1 import router as task_router
from app.api.subtasks import router as subtasks_router
from app.api.comments import router as comments_router
from app.api.users import router as users_router

from app.models import model_task
from app.models import model_subtasks

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Task Management API", version="1.0.0")


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


app.include_router(task_router, prefix="/api/task1", tags=["Tasks"])

app.include_router(subtasks_router, prefix="/api")

app.include_router(comments_router, prefix="/api")

app.include_router(users_router, prefix="/api", tags=["Users"])
