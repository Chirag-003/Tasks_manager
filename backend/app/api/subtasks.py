from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi import Query
from typing import Optional

from app.db.session import get_db
from app.schemas.schemas_subtasks import SubTaskCreate, SubTaskResponse, SubTaskUpdate
from app.services import services_subtask
from app.core.redis_client import redis_client
import json

router = APIRouter(
    tags=["Subtasks"],
)


@router.post("/tasks/{task_id}/subtasks", response_model=SubTaskResponse)
def create_subtask(task_id: int, subtask: SubTaskCreate, db: Session = Depends(get_db)):
    try:
        result = services_subtask.create_subtask(db, task_id, subtask)

        # ✅ write-through → single subtask cache
        try:
            redis_client.setex(
                f"subtask:{result.id}",
                60,
                json.dumps(SubTaskResponse.model_validate(result).model_dump()),
            )
        except Exception:
            pass

        # ✅ invalidate list cache for this task
        for key in redis_client.scan_iter(f"subtasks:{task_id}:*"):
            redis_client.delete(key)

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tasks/{task_id}/subtasks", response_model=list[SubTaskResponse])
def get_subtasks(
    task_id: int,
    status: Optional[str] = Query(default=None),
    user_id: Optional[int] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    try:

        def normalize(value):
            if value is None or value == "":
                return "null"
            return str(value).strip().lower()

        cache_key = (
            f"subtasks:"
            f"{task_id}:"
            f"{normalize(status)}:"
            f"{normalize(user_id)}:"
            f"{normalize(search)}"
        )

        try:
            cached_data = redis_client.get(cache_key)
        except Exception:
            cached_data = None

        if cached_data:
            print("✅ CACHE HIT (subtasks)")
            try:
                return json.loads(cached_data)
            except Exception:
                redis_client.delete(cache_key)

        print("❌ CACHE MISS (subtasks)")

        subtasks = services_subtask.get_subtasks(
            db,
            task_id=task_id,
            status=status,
            user_id=user_id,
            search=search,
        )

        if subtasks:
            try:
                redis_client.setex(
                    cache_key,
                    60,
                    json.dumps(
                        [
                            SubTaskResponse.model_validate(subtask).model_dump()
                            for subtask in subtasks
                        ]
                    ),
                )
            except Exception:
                pass

        return subtasks

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/subtasks/{subtask_id}", response_model=SubTaskResponse)
def get_subtask_by_id(subtask_id: int, db: Session = Depends(get_db)):
    try:
        cache_key = f"subtask:{subtask_id}"

        try:
            cached_data = redis_client.get(cache_key)
        except Exception:
            cached_data = None

        if cached_data:
            print("✅ CACHE HIT (subtask)")
            try:
                return json.loads(cached_data)
            except Exception:
                redis_client.delete(cache_key)

        print("❌ CACHE MISS (subtask)")

        subtask = services_subtask.get_subtask_by_id(db, subtask_id)

        if subtask:
            try:
                redis_client.setex(
                    cache_key,
                    60,
                    json.dumps(SubTaskResponse.model_validate(subtask).model_dump()),
                )
            except Exception:
                pass

        return subtask

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/subtasks/{subtask_id}", response_model=SubTaskResponse)
def update_subtask(
    subtask_id: int, subtask: SubTaskUpdate, db: Session = Depends(get_db)
):
    try:
        result = services_subtask.update_subtask(db, subtask_id, subtask)

        # ✅ write-through → update single cache
        try:
            redis_client.setex(
                f"subtask:{subtask_id}",
                60,
                json.dumps(SubTaskResponse.model_validate(result).model_dump()),
            )
        except Exception:
            pass

        # ✅ invalidate list cache
        for key in redis_client.scan_iter("subtasks:*"):
            redis_client.delete(key)

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/subtasks/{subtask_id}")
def delete_subtask(subtask_id: int, db: Session = Depends(get_db)):
    try:
        result = services_subtask.delete_subtask(db, subtask_id)

        # ✅ delete single cache
        redis_client.delete(f"subtask:{subtask_id}")

        # ✅ invalidate list cache
        for key in redis_client.scan_iter("subtasks:*"):
            redis_client.delete(key)

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
