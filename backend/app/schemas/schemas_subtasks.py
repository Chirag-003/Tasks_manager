from pydantic import BaseModel, Field
from typing import Optional, List
from app.schemas.schemas_comments import CommentResponse, CommentListResponse
from app.schemas.schemas_users import UserResponse
from app.schemas.schemas_enums import StatusEnum


class SubTaskBase(BaseModel):
    title: str
    status: StatusEnum | None = None


class SubTaskCreate(SubTaskBase):
    users: Optional[List[int]] = []


class SubTaskUpdate(SubTaskBase):
    title: str | None = None
    status: StatusEnum | None = None
    users: List[int] = Field(default_factory=list)


class SubTaskResponse(BaseModel):
    id: int
    title: str
    status: StatusEnum
    task_id: int

    sprint: str | None = None
    users: List[UserResponse] = Field(default_factory=list)

    comments: CommentListResponse

    class Config:
        from_attributes = True
