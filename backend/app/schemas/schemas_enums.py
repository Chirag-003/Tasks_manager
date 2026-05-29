from enum import Enum


class StatusEnum(str, Enum):
    backlog = "backlog"
    todo = "todo"
    in_progress = "in_progress"
    in_review = "in_review"
    qa = "qa"
    completed = "completed"
