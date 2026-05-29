from pydantic import BaseModel, EmailStr, field_validator


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    team_name: str | None = None

    @field_validator("team_name")
    def validate_team_name(cls, value):
        if value and not value.isalpha():
            raise ValueError("Team name must contain only letters")
        return value


class UserUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None
    team_name: str | None = None

    @field_validator("team_name")
    def validate_team_name(cls, value):
        if value and not value.isalpha():
            raise ValueError("Team name must contain only letters")
        return value


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    team_name: str | None = None

    class Config:
        from_attributes = True
