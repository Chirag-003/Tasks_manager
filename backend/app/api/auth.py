from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.schemas_auth import RegisterRequest, LoginRequest
from app.schemas.schemas_users import UserResponse
from app.services import services_auth

from app.core.jwt_handler import create_access_token

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
def login(user: LoginRequest, db: Session = Depends(get_db)):
    db_user = services_auth.login_user(
        db=db,
        email=user.email,
        password=user.password,
    )

    token = create_access_token({"sub": str(db_user.id)})

    return {"access_token": token, "token_type": "bearer"}


@router.post("/auth/logout")
def logout():
    return {"message": "Logged out successfully"}
