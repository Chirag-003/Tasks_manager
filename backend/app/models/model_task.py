from sqlalchemy import Column, Integer, String, Text
from app.db.base import Base
from sqlalchemy.orm import relationship
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import DateTime
from datetime import datetime, UTC

from app.models.model_association import user_task_association
from app.schemas.schemas_enums import StatusEnum


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False, unique=True)

    description = Column(Text, nullable=True)

    status = Column(
        SQLEnum(StatusEnum, name="statusenum"),
        default=StatusEnum.backlog,
        nullable=False,
    )

    sprint = Column(String, nullable=True)

    users = relationship(
        "User", secondary=user_task_association, back_populates="tasks"
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

    comments = relationship("Comment", back_populates="task", cascade="all, delete")
    subtasks = relationship("SubTask", back_populates="task")
