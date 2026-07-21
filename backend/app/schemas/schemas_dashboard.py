from pydantic import BaseModel


class DashboardStatsResponse(BaseModel):
    total_users: int
    total_tasks: int
    total_subtasks: int

    task_status_counts: dict[str, int]
