from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from app.models.model_users import User


def create_user(db: Session, user):

    existing = db.query(User).filter(User.email == user.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    db_user = User(**user.dict())

    db.add(db_user)

    try:
        db.commit()

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Duplicate entry detected")

    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error creating user")

    db.refresh(db_user)

    return db_user


def get_users(db: Session):
    try:
        return db.query(User).all()

    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching users" or str(e))


def update_user(db: Session, user_id: int, user):

    db_user = db.query(User).filter(User.id == user_id).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        update_data = user.dict(exclude_unset=True)

        if "email" in update_data:
            existing = (
                db.query(User)
                .filter(User.email == update_data["email"], User.id != user_id)
                .first()
            )

            if existing:
                raise HTTPException(status_code=400, detail="Email already exists")

        for key, value in update_data.items():
            setattr(db_user, key, value)

        db.commit()
        db.refresh(db_user)

        return db_user

    except HTTPException as e:
        db.rollback()
        raise e

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already exists")

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error updating user" or str(e))


def delete_user(db: Session, user_id: int):

    db_user = db.query(User).filter(User.id == user_id).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        db_user.tasks = []

        db.delete(db_user)
        db.commit()

        return {"detail": "User deleted successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error deleting user: " + str(e))
