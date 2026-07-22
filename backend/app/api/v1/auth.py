from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session


from app.db.session import get_db
from app.schemas.schemas_auth import RegisterRequest, LoginRequest, UpdateMeRequest
from app.schemas.schemas_users import UserResponse
from app.services import services_auth


from app.core.dependencies import get_current_user

router = APIRouter()


@router.post("/auth/register", response_model=UserResponse)
def register(user: RegisterRequest, db: Session = Depends(get_db)):
    return services_auth.create_user(
        db=db,
        email=user.email,
        username=user.username,
        password=user.password,
    )


@router.post("/auth/login")
def login(
    user: LoginRequest,
    db: Session = Depends(get_db),
):
    return services_auth.authenticate_user(
        db=db,
        email=user.email,
        password=user.password,
    )


@router.post("/auth/logout")
def logout():
    return services_auth.logout_user()


@router.post("/auth/refresh")
def refresh_access_token(data: dict):
    return services_auth.refresh_access_token(
        refresh_token=data.get("refresh_token"),
    )


@router.get("/auth/me")
def get_me(
    current_user=Depends(get_current_user),
):

    permissions = set()

    for role in current_user.roles:
        for permission in role.permissions:
            permissions.add(permission.name)

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "team_name": current_user.team_name,
        "roles": [role.name for role in current_user.roles],
        "permissions": list(permissions),
    }


@router.patch("/auth/me")
def update_me(
    payload: UpdateMeRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return services_auth.update_me(
        db,
        current_user,
        payload,
    )
