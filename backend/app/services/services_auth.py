from datetime import datetime, timedelta, UTC

from sqlalchemy.orm import Session
from fastapi import HTTPException

from starlette import status

from app.models.model_users import User
from app.core.security import hash_password, verify_password
from app.core.jwt_handler import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
)
from app.models.model_refreshtokens import RefreshToken
from app.core.config import settings


def create_user(db: Session, email: str, username: str, password: str):
    # ✅ 1. Check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists",
        )

    # ✅ 2. Hash password
    password_hash = hash_password(password)

    # ✅ 3. Create user object
    new_user = User(email=email, username=username, password_hash=password_hash)

    # ✅ 4. Save to DB
    db.add(new_user)

    try:
        db.commit()
        db.refresh(new_user)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating user",
        )

    return new_user


def login_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    if not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    return user


def authenticate_user(
    db: Session,
    email: str,
    password: str,
):
    user = login_user(
        db=db,
        email=email,
        password=password,
    )

    db.query(RefreshToken).filter(
        RefreshToken.user_id == user.id, RefreshToken.is_revoked == False
    ).update({"is_revoked": True})

    db.commit()

    access_token = create_access_token({"sub": str(user.id)})

    refresh_token = create_refresh_token({"sub": str(user.id)})

    refresh_token_record = RefreshToken(
        token=refresh_token,
        user_id=user.id,
        expires_at=datetime.now(UTC)
        + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )

    db.add(refresh_token_record)
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


def refresh_access_token(
    db: Session,
    refresh_token: str,
):
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Refresh token is required",
        )

    payload = decode_refresh_token(refresh_token)

    db_token = (
        db.query(RefreshToken).filter(RefreshToken.token == refresh_token).first()
    )

    if not db_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found",
        )

    if db_token.is_revoked:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token revoked",
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    db_token.is_revoked = True

    new_access_token = create_access_token({"sub": str(user_id)})

    new_refresh_token = create_refresh_token({"sub": str(user_id)})

    new_refresh_token_record = RefreshToken(
        token=new_refresh_token,
        user_id=int(user_id),
        expires_at=datetime.now(UTC)
        + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )

    db.add(new_refresh_token_record)
    db.commit()

    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
    }


def logout_user(
    db: Session,
    refresh_token: str,
):
    if not refresh_token:
        return {"message": "Logged out successfully"}

    db_token = (
        db.query(RefreshToken).filter(RefreshToken.token == refresh_token).first()
    )

    if db_token:
        db_token.is_revoked = True
        db.commit()

    return {"message": "Logged out successfully"}
