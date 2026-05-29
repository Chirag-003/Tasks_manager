from pydantic import BaseModel, Field
from typing import Optional, List
from app.schemas.schemas_subtasks import SubTaskResponse
from app.schemas.schemas_comments import CommentResponse, CommentListResponse
from app.schemas.schemas_users import UserResponse
from app.schemas.schemas_enums import StatusEnum


class TaskBase(BaseModel):
    title: str
    description: str | None = None
    status: StatusEnum | None = None


class TaskCreate(TaskBase):
    sprint: str | None = None
    users: List[int] = Field(default_factory=list)


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: StatusEnum | None = None
    sprint: str | None = None
    users: List[int] = Field(default_factory=list)


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None = None

    status: StatusEnum  # ✅ required

    sprint: str | None = None
    users: List[UserResponse] = Field(default_factory=list)

    subtasks: List[SubTaskResponse] = Field(default_factory=list)
    comments: CommentListResponse

    class Config:
        from_attributes = True
