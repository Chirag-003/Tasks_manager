from app.db.session import SessionLocal
from app.models.model_users import User
from app.core.permission import has_permission

db = SessionLocal()

user = db.query(User).filter(User.username == "Root").first()

print(has_permission(user, "task.create"))
print(has_permission(user, "user.delete"))
print(has_permission(user, "random.permission"))

db.close()
