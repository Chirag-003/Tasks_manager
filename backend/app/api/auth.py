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

    access_token = create_access_token({"sub": str(db_user.id)})

    refresh_token = create_refresh_token({"sub": str(db_user.id)})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.post("/auth/logout")
def logout():
    return {"message": "Logged out successfully"}


@router.post("/auth/refresh")
def refresh_access_token(data: dict, db: Session = Depends(get_db)):
    token = data.get("refresh_token")

    # ✅ Step 1: validate presence
    if not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Refresh token is required"
        )

    # ✅ Step 2: decode + validate
    payload = decode_refresh_token(token)

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload"
        )

    # ✅ Step 3: generate new access token
    new_access_token = create_access_token({"sub": str(user_id)})

    # ✅ Step 4: return new token
    return {"access_token": new_access_token, "token_type": "bearer"}
