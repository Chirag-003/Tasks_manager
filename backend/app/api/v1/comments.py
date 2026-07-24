from app.core.rbac import require_permission
from app.db.session import get_db
from app.schemas.schemas_comments import CommentCreate, CommentResponse
from app.services import services_comment
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter(tags=["Comments"])


@router.post("/tasks/{task_id}/comments", response_model=CommentResponse)
def create_task_comment(
    task_id: int,
    data: CommentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("comment.create")),
):
    return services_comment.create_task_comment(db, task_id, data)


@router.post("/subtasks/{subtask_id}/comments", response_model=CommentResponse)
def create_subtask_comment(
    subtask_id: int,
    data: CommentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("comment.create")),
):
    return services_comment.create_subtask_comment(db, subtask_id, data)


@router.get("/tasks/{task_id}/comments", response_model=list[CommentResponse])
def get_task_comments(
    task_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("comment.view")),
):
    return services_comment.get_task_comments(db, task_id)


@router.get("/subtasks/{subtask_id}/comments", response_model=list[CommentResponse])
def get_subtask_comments(
    subtask_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("comment.view")),
):
    return services_comment.get_subtask_comments(db, subtask_id)
