from datetime import UTC, datetime

from app.db.base import Base
from app.models.model_subtask_association import user_subtask_association
from app.schemas.schemas_enums import StatusEnum
from sqlalchemy import Column, DateTime
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship


class SubTask(Base):
    __tablename__ = "subtasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    status = Column(
        SQLEnum(StatusEnum, name="statusenum"),
        default=StatusEnum.backlog,
        nullable=False,
    )

    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)

    task = relationship("Task", back_populates="subtasks")
    __table_args__ = (
        UniqueConstraint("title", "task_id", name="unique_subtask_per_task"),
    )

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    comments = relationship("Comment", back_populates="subtask", cascade="all, delete")

    users = relationship(
        "User", secondary=user_subtask_association, back_populates="subtasks"
    )
