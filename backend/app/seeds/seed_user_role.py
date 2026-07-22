from sqlalchemy.orm import Session

from app.models.model_users import User
from app.models.model_role import Role


def seed_user_roles(db: Session):
    assignments = [
        ("Root", "Admin"),
        ("John", "Developer"),
        ("Test", "QA"),
        ("Manager", "Manager"),
    ]

    for username, role_name in assignments:
        user = db.query(User).filter(User.username == username).first()
        role = db.query(Role).filter(Role.name == role_name).first()

        if not user:
            print(f"❌ User not found: {username}")
            continue

        if not role:
            print(f"❌ Role not found: {role_name}")
            continue

        if role not in user.roles:
            user.roles.append(role)

        print(f"✅ Assigned {role_name} role to {username}")

    db.commit()

    print("✅ User role seeding completed")
