from sqlalchemy.orm import Session
from fastapi import HTTPException

from starlette import status

from app.models.model_users import User
from app.core.security import hash_password


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
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating user",
        )

    return new_user
