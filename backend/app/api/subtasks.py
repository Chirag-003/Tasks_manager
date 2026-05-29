from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.schemas_subtasks import SubTaskCreate, SubTaskResponse, SubTaskUpdate
from app.services import services_subtask

router = APIRouter(
    tags=["Subtasks"],
)


@router.post("/tasks/{task_id}/subtasks", response_model=SubTaskResponse)
def create_subtask(task_id: int, subtask: SubTaskCreate, db: Session = Depends(get_db)):
    try:
        return services_subtask.create_subtask(db, task_id, subtask)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tasks/{task_id}/subtasks", response_model=list[SubTaskResponse])
def get_subtasks(task_id: int, db: Session = Depends(get_db)):
    try:
        return services_subtask.get_subtasks(db, task_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/subtasks/{subtask_id}", response_model=SubTaskResponse)
def update_subtask(
    subtask_id: int, subtask: SubTaskUpdate, db: Session = Depends(get_db)
):
    try:
        return services_subtask.update_subtask(db, subtask_id, subtask)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/subtasks/{subtask_id}")
def delete_subtask(subtask_id: int, db: Session = Depends(get_db)):
    try:
        return services_subtask.delete_subtask(db, subtask_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
