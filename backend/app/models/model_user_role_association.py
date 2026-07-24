from app.db.base import Base
from sqlalchemy import Column, ForeignKey, Integer, Table

user_role_association = Table(
    "user_roles",
    Base.metadata,
    Column(
        "user_id",
        Integer,
        ForeignKey("users.id"),
        primary_key=True,
    ),
    Column(
        "role_id",
        Integer,
        ForeignKey("roles.id"),
        primary_key=True,
    ),
)
