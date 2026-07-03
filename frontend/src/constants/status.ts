export const STATUS_CONFIG = {
  backlog: {
    label: "Backlog",
    color: "warning",
  },
  todo: {
    label: "Todo",
    color: "default",
  },
  in_progress: {
    label: "In Progress",
    color: "primary",
  },
  in_review: {
    label: "In Review",
    color: "info",
  },
  qa: {
    label: "QA",
    color: "secondary",
  },
  completed: {
    label: "Completed",
    color: "success",
  },
} as const;

export const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(
  ([value, config]) => ({
    value,
    label: config.label,
  }),
);

export const STATUS_VALUES = Object.keys(STATUS_CONFIG);

export const STATUS_COLUMNS = Object.entries(STATUS_CONFIG).map(
  ([key, config]) => ({
    key,
    title: config.label,
  }),
);
