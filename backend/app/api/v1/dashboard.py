from app.db.session import get_db
from app.schemas.schemas_dashboard import DashboardStatsResponse
from app.services import services_dashboard
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter(tags=["Dashboard"])


@router.get(
    "/dashboard/stats",
    response_model=DashboardStatsResponse,
)
def get_dashboard_stats(
    db: Session = Depends(get_db),
):
    return services_dashboard.get_dashboard_stats(db)
