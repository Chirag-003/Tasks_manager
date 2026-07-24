from app.core.dependencies import get_current_user
from app.core.permission import has_permission
from fastapi import Depends, HTTPException, status


def require_permission(permission_name: str):
    def permission_checker(
        current_user=Depends(get_current_user),
    ):

        if not has_permission(
            current_user,
            permission_name,
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied",
            )

        return current_user

    return permission_checker
