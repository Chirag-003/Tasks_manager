from sqlalchemy import Table, Column, Integer, ForeignKey
from app.db.base import Base

user_subtask_association = Table(
    "user_subtask_association",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("subtask_id", Integer, ForeignKey("subtasks.id"), primary_key=True),
)
