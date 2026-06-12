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

from app.core.redis_client import redis_client
import json

router = APIRouter()


@router.post("/", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    try:
        result = services_task.create_task(db, task)

        # ✅ write-through (ADD single task cache)
        try:
            redis_client.setex(
                f"task:{result.id}",
                60,
                json.dumps(TaskResponse.model_validate(result).model_dump()),
            )
        except Exception:
            pass

        # ✅ invalidate list cache
        for key in redis_client.scan_iter("tasks:*"):
            redis_client.delete(key)
        redis_client.delete("tasks:sprints")

        return result

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

        def normalize(value):
            if value is None:
                return "null"
            if hasattr(value, "value"):
                return value.value
            return str(value).strip().lower() if value != "" else "null"

        cache_key = (
            f"tasks:"
            f"{normalize(status)}:"
            f"{normalize(sprint)}:"
            f"{normalize(user_id)}:"
            f"{normalize(search)}:"
            f"{skip}:{limit}"
        )

        cached_data = redis_client.get(cache_key)

        if cached_data:
            print("✅ CACHE HIT")
            try:
                return json.loads(cached_data)
            except Exception:
                redis_client.delete(cache_key)

        print("❌ CACHE MISS")

        tasks = services_task.get_tasks(
            db,
            skip=skip,
            limit=limit,
            status=status,
            sprint=sprint,
            user_id=user_id,
            search=search,
        )

        if tasks:
            redis_client.setex(
                cache_key,
                60,
                json.dumps(
                    [TaskResponse.model_validate(task).model_dump() for task in tasks]
                ),
            )

        return tasks

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sprints")
def get_sprints(db: Session = Depends(get_db)):
    try:
        cache_key = "tasks:sprints"

        try:
            cached_data = redis_client.get(cache_key)
        except Exception:
            cached_data = None

        if cached_data:
            print("✅ CACHE HIT (sprints)")
            try:
                return json.loads(cached_data)
            except Exception:
                redis_client.delete(cache_key)

        print("❌ CACHE MISS (sprints)")

        sprints = db.query(Task.sprint).filter(Task.sprint != None).distinct().all()
        sprint_list = [s[0] for s in sprints if s[0]]

        if sprint_list:
            try:
                redis_client.setex(
                    cache_key,
                    300,
                    json.dumps(sprint_list),
                )
            except Exception:
                pass

        return sprint_list

    except Exception as e:
        raise Exception(str(e))


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    try:
        cache_key = f"task:{task_id}"

        try:
            cached_data = redis_client.get(cache_key)
        except Exception:
            cached_data = None

        if cached_data:
            print("✅ CACHE HIT (task)")
            try:
                return json.loads(cached_data)
            except Exception:
                redis_client.delete(cache_key)

        print("❌ CACHE MISS (task)")

        task = services_task.get_task(db, task_id)

        if task:
            try:
                redis_client.setex(
                    cache_key,
                    60,
                    json.dumps(TaskResponse.model_validate(task).model_dump()),
                )
            except Exception:
                pass

        return task

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    try:
        result = services_task.update_task(db, task_id, task)

        # ✅ write-through (UPDATE single task cache)
        try:
            redis_client.setex(
                f"task:{task_id}",
                60,
                json.dumps(TaskResponse.model_validate(result).model_dump()),
            )
        except Exception:
            pass

        # ✅ invalidate list caches
        for key in redis_client.scan_iter("tasks:*"):
            redis_client.delete(key)
        redis_client.delete("tasks:sprints")

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    try:
        result = services_task.delete_task(db, task_id)

        # ✅ delete single cache
        redis_client.delete(f"task:{task_id}")

        # ✅ invalidate list caches
        for key in redis_client.scan_iter("tasks:*"):
            redis_client.delete(key)
        redis_client.delete("tasks:sprints")

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
