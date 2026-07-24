from app.db.base import Base
from app.models.model_role_permission_association import role_permission_association
from app.models.model_user_role_association import user_role_association
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship


class Role(Base):
    __tablename__ = "roles"

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

    permissions = relationship(
        "Permission",
        secondary=role_permission_association,
        back_populates="roles",
    )

    users = relationship(
        "User",
        secondary=user_role_association,
        back_populates="roles",
    )
