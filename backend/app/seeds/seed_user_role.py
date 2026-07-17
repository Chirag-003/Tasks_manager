from sqlalchemy.orm import Session

from app.models.model_users import User
from app.models.model_role import Role


def seed_user_roles(db: Session):

    root_user = db.query(User).filter(User.username == "Root").first()

    admin_role = db.query(Role).filter(Role.name == "Admin").first()

    if not root_user:
        print("❌ Root user not found")
        return

    if not admin_role:
        print("❌ Admin role not found")
        return

    if admin_role not in root_user.roles:
        root_user.roles.append(admin_role)

    db.commit()

    print("✅ Admin role assigned to root user")
