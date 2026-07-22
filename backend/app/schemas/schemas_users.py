from pydantic import BaseModel, EmailStr
from app.schemas.schemas_roles import RoleResponse


class UserUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None
    team_name: str | None = None
    role_id: int | None = None


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    team_name: str | None = None
    roles: list[RoleResponse] = []

    class Config:
        from_attributes = True
