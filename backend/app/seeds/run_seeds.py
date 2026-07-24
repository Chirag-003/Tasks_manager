from app.db.session import SessionLocal
from app.seeds.seed_permissions import seed_permissions
from app.seeds.seed_role_permission import seed_role_permissions
from app.seeds.seed_roles import seed_roles
from app.seeds.seed_user_role import seed_user_roles


def run():

    db = SessionLocal()

    try:
        seed_permissions(db)
        seed_roles(db)
        seed_role_permissions(db)
        seed_user_roles(db)

        print("✅ Seeding completed")

    finally:
        db.close()


if __name__ == "__main__":
    run()
