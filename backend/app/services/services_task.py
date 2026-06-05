from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.model_task import Task
from app.models.model_users import User


from sqlalchemy.exc import IntegrityError

from app.schemas.schemas_enums import StatusEnum


def create_task(db: Session, task):
    exiting_task = db.query(Task).filter(Task.title == task.title).first()
    if exiting_task:
        raise HTTPException(status_code=400, detail="Task already exists")

    db_task = Task(
        title=task.title,
        description=task.description,
        status=(task.status or StatusEnum.backlog),
        sprint=task.sprint,
    )

    if task.users:
        users = db.query(User).filter(User.id.in_(task.users)).all()

        if len(users) != len(task.users):
            raise HTTPException(status_code=400, detail="Invalid user IDs")

        db_task.users = users

    db.add(db_task)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Duplicate entry detected")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error Creating Task")

    db.refresh(db_task)

    return {
        "id": db_task.id,
        "title": db_task.title,
        "description": db_task.description,
        "status": db_task.status.value,
        "sprint": db_task.sprint,
        "users": [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "team_name": user.team_name,
            }
            for user in db_task.users
        ],
        "subtasks": [],
        "comments": {"count": 0, "data": []},
    }


def get_tasks(db: Session, skip: int = 0, limit: int = 10):
    tasks = db.query(Task).offset(skip).limit(limit).all()

    result = []

    for task in tasks:
        result.append(
            {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status.value,
                "sprint": task.sprint,
                "users": [
                    {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "team_name": user.team_name,
                    }
                    for user in task.users
                ],
                "subtasks": [
                    {
                        "id": subtask.id,
                        "title": subtask.title,
                        "status": subtask.status.value,
                        "task_id": subtask.task_id,
                        "sprint": task.sprint,
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
                            "data": subtask.comments,
                        },
                    }
                    for subtask in task.subtasks
                ],
                "comments": {
                    "count": len(task.comments),
                    "data": task.comments,
                },
            }
        )

    return result


def get_task(db: Session, task_id: int):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "sprint": task.sprint,
        "status": task.status.value,
        "users": [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "team_name": user.team_name,
            }
            for user in task.users
        ],
        "subtasks": [
            {
                "id": subtask.id,
                "title": subtask.title,
                "status": subtask.status.value,
                "task_id": subtask.task_id,
                "sprint": subtask.task.sprint,  # ✅ ADD
                "users": [  # ✅ ADD
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
            for subtask in task.subtasks
        ],
        "comments": {
            "count": len(task.comments),
            "data": task.comments,
        },
    }


def update_task(db: Session, task_id: int, task_data):
    # ✅ Fetch task
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # ✅ Get only provided fields
    update_data = task_data.dict(exclude_unset=True)

    # ✅ Duplicate title validation
    if "title" in update_data:
        existing_task = (
            db.query(Task)
            .filter(Task.title == update_data["title"], Task.id != task_id)
            .first()
        )

        if existing_task:
            raise HTTPException(
                status_code=400,
                detail="Task title already exists",
            )

    # ✅ Handle users (many-to-many)
    if "users" in update_data:
        users = db.query(User).filter(User.id.in_(update_data["users"])).all()

        if len(users) != len(update_data["users"]):
            raise HTTPException(status_code=400, detail="Invalid user IDs")

        task.users = users
        del update_data["users"]

    # ✅ Apply updates dynamically
    for key, value in update_data.items():
        setattr(task, key, value)

    # ✅ Commit with proper error handling
    try:
        db.commit()

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Task title already exists",
        )

    except Exception as e:
        db.rollback()
        print("Error updating task:", e)
        raise HTTPException(
            status_code=500,
            detail="Something went wrong while updating task",
        )

    db.refresh(task)

    # ✅ Structured response
    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "status": task.status.value,
        "sprint": task.sprint,
        "users": [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "team_name": user.team_name,
            }
            for user in task.users
        ],
        "subtasks": [
            {
                "id": subtask.id,
                "title": subtask.title,
                "status": subtask.status.value,
                "task_id": subtask.task_id,
                "comments": {
                    "count": len(subtask.comments),
                    "data": subtask.comments[:1],
                },
            }
            for subtask in task.subtasks[:1]
        ],
        "comments": {
            "count": len(task.comments),
            "data": task.comments[:1],
        },
    }


def delete_task(db: Session, task_id: int):

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    try:
        db.delete(task)
        db.commit()

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="Cannot delete task with existing subtasks"
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error deleting task")

    return {"message": "Task deleted successfully"}


def get_tasks_by_user(db: Session, user_id: int):

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    tasks = user.tasks

    result = []

    for task in tasks:

        user_subtasks = [subtask for subtask in task.subtasks if user in subtask.users]

        result.append(
            {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status.value,
                "sprint": task.sprint,
                "subtasks": [
                    {
                        "id": subtask.id,
                        "title": subtask.title,
                        "status": subtask.status.value,
                        "task_id": subtask.task_id,
                    }
                    for subtask in user_subtasks
                ],
                "comments": {
                    "count": len(task.comments),
                    "data": [],
                },
            }
        )
    return result
