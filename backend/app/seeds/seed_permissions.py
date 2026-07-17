from sqlalchemy.orm import Session

from app.models.model_permission import Permission


def seed_permissions(db: Session):

    permissions = [
        ("task.create", "Create tasks"),
        ("task.view", "View tasks"),
        ("task.update", "Update tasks"),
        ("task.delete", "Delete tasks"),
        ("subtask.create", "Create subtasks"),
        ("subtask.view", "View subtasks"),
        ("subtask.update", "Update subtasks"),
        ("subtask.delete", "Delete subtasks"),
        ("comment.create", "Create comments"),
        ("comment.view", "View comments"),
        ("comment.update", "Update comments"),
        ("comment.delete", "Delete comments"),
        ("user.view", "View users"),
        ("user.update", "Update users"),
        ("user.delete", "Delete users"),
        ("role.manage", "Manage roles"),
        ("permission.manage", "Manage permissions"),
    ]

    for name, description in permissions:

        existing_permission = (
            db.query(Permission).filter(Permission.name == name).first()
        )

        if existing_permission:
            continue

        permission = Permission(
            name=name,
            description=description,
        )

        db.add(permission)

    db.commit()
