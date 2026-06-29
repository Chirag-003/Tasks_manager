from jose import jwt, JWTError
from datetime import datetime, timedelta

from app.core.config import settings  # ✅ import config


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES  # ✅ use config
    )

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,  # ✅ use config
        algorithm=settings.ALGORITHM,  # ✅ use config
    )


def decode_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,  # ✅ use config
            algorithms=[settings.ALGORITHM],  # ✅ use config
        )
        return payload
    except JWTError:
        raise Exception("Invalid or expired token")
