from enum import Enum


class StatusEnum(str, Enum):
    backlog = "backlog"
    todo = "todo"
    in_progress = "in progress"
    in_review = "in review"
    qa = "qa"
    completed = "completed"
