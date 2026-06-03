from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.model_subtasks import SubTask
from app.models.model_task import Task
from app.models.model_users import User
from app.schemas.schemas_enums import StatusEnum


def create_subtask(db: Session, task_id: int, subtask_data):

    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    subtask = SubTask(
        title=subtask_data.title,
        status=(subtask_data.status or StatusEnum.backlog),
        task_id=task_id,
    )

    db.add(subtask)

    try:
        if subtask_data.users:
            users = db.query(User).filter(User.id.in_(subtask_data.users)).all()

            if len(users) != len(subtask_data.users):
                raise HTTPException(status_code=400, detail="Invalid user IDs")

            subtask.users = users

        db.commit()

    except HTTPException as e:
        db.rollback()
        raise e

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="Subtask with this title already exists"
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error creating subtask")

    db.refresh(subtask)

    subtask = db.query(SubTask).filter(SubTask.id == subtask.id).first()

    return {
        "id": subtask.id,
        "title": subtask.title,
        "status": subtask.status.value,
        "task_id": subtask.task_id,
        "sprint": subtask.task.sprint,
        "users": [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "team_name": user.team_name,
            }
            for user in subtask.users
        ],
        "comments": {
            "count": 0,
            "data": [],
        },
    }


def get_subtasks(db: Session, task_id: int):

    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    subtasks = db.query(SubTask).filter(SubTask.task_id == task_id).all()

    result = []

    for subtask in subtasks:
        result.append(
            {
                "id": subtask.id,
                "title": subtask.title,
                "status": subtask.status.value,
                "task_id": subtask.task_id,
                "sprint": subtask.task.sprint,
                "users": [
                    {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "team_name": user.team_name,
                    }
                    for user in subtask.users
                ],
                "comments": {
                    "count": len(subtask.comments),
                    "data": subtask.comments[:1],
                },
            }
        )

    return result


def get_subtask_by_id(db: Session, subtask_id: int):
    subtask = db.query(SubTask).filter(SubTask.id == subtask_id).first()

    if not subtask:
        raise HTTPException(status_code=404, detail="Subtask not found")

    return {
        "id": subtask.id,
        "title": subtask.title,
        "status": subtask.status.value,
        "task_id": subtask.task_id,
        "sprint": subtask.task.sprint,
        "users": [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "team_name": user.team_name,
            }
            for user in subtask.users
        ],
        "comments": {
            "count": len(subtask.comments),
            "data": subtask.comments[:1],
        },
    }


def get_subtasks_by_user(db: Session, user_id: int):

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    subtasks = user.subtasks

    result = []

    for subtask in subtasks:
        result.append(
            {
                "id": subtask.id,
                "title": subtask.title,
                "status": subtask.status.value,
                "task_id": subtask.task_id,
                "sprint": subtask.task.sprint,
                "comments": {
                    "count": len(subtask.comments),
                    "data": [],
                },
            }
        )

    return result


def update_subtask(db: Session, subtask_id: int, subtask_data):

    subtask = db.query(SubTask).filter(SubTask.id == subtask_id).first()

    if not subtask:
        raise HTTPException(status_code=404, detail="Subtask not found")

    update_data = subtask_data.dict(exclude_unset=True)

    try:

        if "users" in update_data:
            users = db.query(User).filter(User.id.in_(update_data["users"])).all()

            if len(users) != len(update_data["users"]):
                raise HTTPException(status_code=400, detail="Invalid user IDs")

            subtask.users = users
            del update_data["users"]

        for key, value in update_data.items():
            setattr(subtask, key, value)

        db.commit()

    except HTTPException as e:
        db.rollback()
        raise e

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Subtask with this title already exists for this task",
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error updating subtask")

    db.refresh(subtask)

    subtask = db.query(SubTask).filter(SubTask.id == subtask.id).first()

    return {
        "id": subtask.id,
        "title": subtask.title,
        "status": subtask.status.value,
        "task_id": subtask.task_id,
        "sprint": subtask.task.sprint,
        "users": [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "team_name": user.team_name,
            }
            for user in subtask.users
        ],
        "comments": {
            "count": len(subtask.comments),
            "data": subtask.comments[:1],
        },
    }


def delete_subtask(db: Session, subtask_id: int):

    subtask = db.query(SubTask).filter(SubTask.id == subtask_id).first()

    if not subtask:
        raise HTTPException(status_code=404, detail="Subtask not found")

    try:
        db.delete(subtask)
        db.commit()

    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error deleting subtask")

    return {"message": "Subtask deleted successfully"}
