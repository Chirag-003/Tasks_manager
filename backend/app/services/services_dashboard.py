from sqlalchemy import func

from app.models.model_users import User
from app.models.model_task import Task
from app.models.model_subtasks import SubTask


def get_dashboard_stats(db):
    total_users = db.query(User).count()

    total_tasks = db.query(Task).count()

    total_subtasks = db.query(SubTask).count()

    task_status_rows = (
        db.query(
            Task.status,
            func.count(Task.id),
        )
        .group_by(Task.status)
        .all()
    )

    task_status_counts = {
        "backlog": 0,
        "todo": 0,
        "in_progress": 0,
        "in_review": 0,
        "qa": 0,
        "completed": 0,
    }

    for status, count in task_status_rows:
        task_status_counts[status] = count

    return {
        "total_users": total_users,
        "total_tasks": total_tasks,
        "total_subtasks": total_subtasks,
        "task_status_counts": task_status_counts,
    }
