from sqlalchemy import Table, Column, Integer, ForeignKey
from app.db.base import Base

user_task_association = Table(
    "user_task_association",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("task_id", Integer, ForeignKey("tasks.id"), primary_key=True),
)
