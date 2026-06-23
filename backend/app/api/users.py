from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.schemas_users import UserResponse, UserUpdate
from app.services import (
    services_task,
    services_users as services_user,
    services_subtask,
)

router = APIRouter()


@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    try:
        return services_user.get_users(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/users/{user_id}/tasks")
def get_user_tasks(user_id: int, db: Session = Depends(get_db)):
    try:
        return services_task.get_tasks_by_user(db, user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/users/{user_id}/subtasks")
def get_user_subtasks(user_id: int, db: Session = Depends(get_db)):
    try:
        return services_subtask.get_subtasks_by_user(db, user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    try:
        return services_user.update_user(db, user_id, user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    try:
        return services_user.delete_user(db, user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
