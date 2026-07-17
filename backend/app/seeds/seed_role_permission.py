# seed_role_permissions.py

from sqlalchemy.orm import Session

from app.models.model_role import Role
from app.models.model_permission import Permission


def seed_role_permissions(db: Session):

    role_permissions = {
        "Admin": [
            "task.create",
            "task.view",
            "task.update",
            "task.delete",
            "subtask.create",
            "subtask.view",
            "subtask.update",
            "subtask.delete",
            "comment.create",
            "comment.view",
            "comment.update",
            "comment.delete",
            "user.view",
            "user.update",
            "user.delete",
            "role.manage",
            "permission.manage",
        ],
        "Manager": [
            "task.create",
            "task.view",
            "task.update",
            "task.delete",
            "subtask.create",
            "subtask.view",
            "subtask.update",
            "subtask.delete",
            "comment.create",
            "comment.view",
            "comment.update",
            "comment.delete",
            "user.view",
        ],
        "Developer": [
            "task.view",
            "subtask.view",
            "comment.create",
            "comment.view",
            "comment.update",
        ],
        "QA": [
            "task.view",
            "subtask.view",
            "comment.create",
            "comment.view",
        ],
    }

    for role_name, permission_names in role_permissions.items():

        role = db.query(Role).filter(Role.name == role_name).first()

        if not role:
            continue

        for permission_name in permission_names:

            permission = (
                db.query(Permission).filter(Permission.name == permission_name).first()
            )

            if not permission:
                continue

            if permission not in role.permissions:
                role.permissions.append(permission)

    db.commit()
