from pydantic import BaseModel, EmailStr


class UserUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True


class ResetPasswordRequest(BaseModel):
    new_password: str
