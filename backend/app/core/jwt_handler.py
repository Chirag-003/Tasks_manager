from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi import HTTPException, status

from app.core.config import settings


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire, "type": "access"})

    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def create_refresh_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(days=7)

    to_encode.update({"exp": expire, "type": "refresh"})

    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


# ✅ Generic decoder (NEW)
def decode_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        return payload

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token"
        )


def decode_access_token(token: str):
    payload = decode_token(token)

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token"
        )

    return payload


def decode_refresh_token(token: str):
    payload = decode_token(token)

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
        )

    return payload
