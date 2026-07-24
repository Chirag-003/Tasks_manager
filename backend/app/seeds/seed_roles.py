from app.models.model_role import Role
from sqlalchemy.orm import Session


def seed_roles(db: Session):

    roles = [
        ("Admin", "Full system access"),
        ("Manager", "Manage tasks and oversee workflow"),
        ("Developer", "Work on tasks and collaborate"),
        ("QA", "Test and verify task completion"),
    ]

    for name, description in roles:

        existing_role = db.query(Role).filter(Role.name == name).first()

        if existing_role:
            continue

        role = Role(
            name=name,
            description=description,
        )

        db.add(role)

    db.commit()
