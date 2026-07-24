from app.db.base import Base
from sqlalchemy import Column, ForeignKey, Integer, Table

user_task_association = Table(
    "user_task_association",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("task_id", Integer, ForeignKey("tasks.id"), primary_key=True),
)
