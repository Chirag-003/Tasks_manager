from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.db.session import get_db
from app.schemas.schemas_task import TaskCreate, TaskUpdate, TaskResponse
from app.schemas.schemas_enums import StatusEnum

from app.services import services_task
from app.models.model_task import Task
from app.models.model_users import User
from sqlalchemy import distinct

router = APIRouter()


@router.post("/", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    try:
        return services_task.create_task(db, task)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=list[TaskResponse])
def get_tasks(
    skip: int = 0,
    limit: int = 100,
    status: Optional[StatusEnum] = Query(default=None),
    sprint: Optional[str] = Query(default=None),
    user_id: Optional[int] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    try:
        return services_task.get_tasks(
            db,
            skip=skip,
            limit=limit,
            status=status,
            sprint=sprint,
            user_id=user_id,
            search=search,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sprints")
def get_sprints(db: Session = Depends(get_db)):
    try:
        # ✅ Get unique sprints
        sprints = db.query(Task.sprint).filter(Task.sprint != None).distinct().all()

        # ✅ Flatten result
        sprint_list = [s[0] for s in sprints if s[0]]

        return sprint_list

    except Exception as e:
        raise Exception(str(e))


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    try:
        return services_task.get_task(db, task_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    try:
        return services_task.update_task(db, task_id, task)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    try:
        return services_task.delete_task(db, task_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
