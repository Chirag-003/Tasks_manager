from pydantic import BaseModel, Field
from typing import Optional, List
from .schemas_users import UserResponse
from datetime import datetime


class CommentBase(BaseModel):
    content: str


class CommentCreate(CommentBase):
    content: str = Field(
        min_length=1,
        max_length=500,
    )
    user_id: int


class CommentResponse(CommentBase):
    id: int
    task_id: int | None = None
    subtask_id: int | None = None

    created_at: datetime
    updated_at: datetime

    user: UserResponse | None = None

    class Config:
        from_attributes = True


class CommentListResponse(BaseModel):
    count: int
    data: List[CommentResponse]
