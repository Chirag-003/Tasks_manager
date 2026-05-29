from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String(500), nullable=False)

    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    subtask_id = Column(Integer, ForeignKey("subtasks.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    task = relationship("Task", back_populates="comments")
    subtask = relationship("SubTask", back_populates="comments")
    user = relationship("User", back_populates="comments")
