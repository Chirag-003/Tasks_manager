from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.schemas_comments import CommentCreate, CommentResponse
from app.services import services_comment

router = APIRouter(tags=["Comments"])


@router.post("/tasks/{task_id}/comments", response_model=CommentResponse)
def create_task_comment(
    task_id: int, data: CommentCreate, db: Session = Depends(get_db)
):
    try:
        return services_comment.create_task_comment(db, task_id, data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/subtasks/{subtask_id}/comments", response_model=CommentResponse)
def create_subtask_comment(
    subtask_id: int, data: CommentCreate, db: Session = Depends(get_db)
):
    try:
        return services_comment.create_subtask_comment(db, subtask_id, data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tasks/{task_id}/comments", response_model=list[CommentResponse])
def get_task_comments(task_id: int, db: Session = Depends(get_db)):
    try:
        return services_comment.get_task_comments(db, task_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/subtasks/{subtask_id}/comments", response_model=list[CommentResponse])
def get_subtask_comments(subtask_id: int, db: Session = Depends(get_db)):
    try:
        return services_comment.get_subtask_comments(db, subtask_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
