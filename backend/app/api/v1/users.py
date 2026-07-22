from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.schemas_users import UserResponse, UserUpdate
from app.services import (
    services_task,
    services_users as services_user,
    services_subtask,
)

from app.core.rbac import require_permission

router = APIRouter()


@router.get("/users", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db), current_user=Depends(require_permission("user.view"))
):
    return services_user.get_users(db)


@router.get("/users/{user_id}/tasks")
def get_user_tasks(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("user.view")),
):
    return services_task.get_tasks_by_user(db, user_id)


@router.get("/users/{user_id}/subtasks")
def get_user_subtasks(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("user.view")),
):
    return services_subtask.get_subtasks_by_user(db, user_id)


@router.patch("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user: UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("user.update")),
):
    return services_user.update_user(db, user_id, user)


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("user.delete")),
):
    return services_user.delete_user(
        db,
        user_id,
        current_user,
    )


@router.get("/roles")
def fetch_roles(
    db: Session = Depends(get_db), current_user=Depends(require_permission("user.view"))
):
    return services_user.get_roles(db)
