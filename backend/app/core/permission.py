from app.models.model_users import User


def has_permission(user: User, permission_name: str) -> bool:
    """
    Check if a user has a specific permission
    through any of their assigned roles.
    """

    for role in user.roles:
        for permission in role.permissions:
            if permission.name == permission_name:
                return True

    return False
