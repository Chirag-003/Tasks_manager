from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.models.model_role_permission_association import (
    role_permission_association,
)


class Permission(Base):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
    )

    description = Column(
        String(255),
        nullable=True,
    )

    roles = relationship(
        "Role",
        secondary=role_permission_association,
        back_populates="permissions",
    )
