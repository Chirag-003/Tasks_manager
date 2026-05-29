from pydantic import BaseModel
from typing import Optional, List
from .schemas_users import UserResponse


class CommentBase(BaseModel):
    content: str


class CommentCreate(CommentBase):
    content: str
    user_id: int


class CommentResponse(CommentBase):
    id: int
    task_id: int | None = None
    subtask_id: int | None = None

    user: UserResponse | None = None

    class Config:
        from_attributes = True


class CommentListResponse(BaseModel):
    count: int
    data: List[CommentResponse]
