from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.db.session import get_db
from app.schemas.schemas_auth import RegisterRequest, LoginRequest
from app.schemas.schemas_users import UserResponse
from app.services import services_auth

from app.core.jwt_handler import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
)

from app.core.dependencies import get_current_user

router = APIRouter()


@router.post("/auth/register", response_model=UserResponse)
def register(user: RegisterRequest, db: Session = Depends(get_db)):
    return services_auth.create_user(
        db=db,
        email=user.email,
        username=user.username,
        password=user.password,
    )


@router.post("/auth/login")
def login(
    user: LoginRequest,
    db: Session = Depends(get_db),
):
    return services_auth.authenticate_user(
        db=db,
        email=user.email,
        password=user.password,
    )


@router.post("/auth/logout")
def logout(
    data: dict,
    db: Session = Depends(get_db),
):
    return services_auth.logout_user(
        db=db,
        refresh_token=data.get("refresh_token"),
    )


@router.post("/auth/refresh")
def refresh_access_token(
    data: dict,
    db: Session = Depends(get_db),
):
    return services_auth.refresh_access_token(
        db=db,
        refresh_token=data.get("refresh_token"),
    )


@router.get("/auth/me")
def get_me(
    current_user=Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
    }
