from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.schemas_auth import RegisterRequest
from app.schemas.schemas_users import UserResponse
from app.services import services_auth

router = APIRouter()


@router.post("/auth/register", response_model=UserResponse)
def register(user: RegisterRequest, db: Session = Depends(get_db)):
    try:
        return services_auth.create_user(
            db=db,
            email=user.email,
            username=user.username,
            password=user.password,
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        # ✅ catch unexpected errors
        raise HTTPException(status_code=500, detail=str(e))
