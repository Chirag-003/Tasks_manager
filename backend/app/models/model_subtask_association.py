from app.db.base import Base
from sqlalchemy import Column, ForeignKey, Integer, Table

user_subtask_association = Table(
    "user_subtask_association",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("subtask_id", Integer, ForeignKey("subtasks.id"), primary_key=True),
)
