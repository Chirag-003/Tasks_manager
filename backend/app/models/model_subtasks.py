from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import UniqueConstraint
from app.models.model_subtask_association import user_subtask_association


from app.db.base import Base
from app.schemas.schemas_enums import StatusEnum
from sqlalchemy import Enum as SQLEnum


class SubTask(Base):
    __tablename__ = "subtasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    status = Column(SQLEnum(StatusEnum), default=StatusEnum.backlog, nullable=False)

    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)

    task = relationship("Task", back_populates="subtasks")
    __table_args__ = (
        UniqueConstraint("title", "task_id", name="unique_subtask_per_task"),
    )
    comments = relationship("Comment", back_populates="subtask", cascade="all, delete")

    users = relationship(
        "User", secondary=user_subtask_association, back_populates="subtasks"
    )
