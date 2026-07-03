"use client";

import { Box, Typography } from "@mui/material";
import TaskCard from "./TaskCard";
import { useGetKanbanTasksQuery } from "@/services/api";
import UILoader from "./Loader";
import { STATUS_COLUMNS } from "@/constants/status";

type TaskListProps = {
  tasks: any[];
  onTaskClick: (task: any) => void;
  grouped?: boolean;
  onAddTask?: (status?: string) => void;
  filters?: any;
};

export default function TaskList({
  tasks,
  onTaskClick,
  grouped = true,
  onAddTask,
  filters,
}: TaskListProps) {
  const columns = STATUS_COLUMNS;

  const { data, isLoading, error } = useGetKanbanTasksQuery(filters);

  if (error) {
    return (
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        Failed to load tasks
      </Box>
    );
  }

  if (!grouped) {
    return (
      <Box
        sx={{
          height: "100%",
          overflowY: "auto",
          pr: 1,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignContent: "flex-start",
        }}
      >
        {tasks.map((task: any) => (
          <Box
            key={task.id}
            sx={{
              width: {
                xs: "100%",
                sm: "280px",
              },
              flexGrow: 0,
              flexShrink: 0,
            }}
          >
            <TaskCard task={task} onClick={() => onTaskClick(task)} />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box
      className="kanban-container"
      sx={{
        display: "flex",
        gap: 2,
        height: "100%",
        px: 1,
      }}
    >
      {columns.map((col) => {
        const colTasks = data?.[col.key]?.tasks ?? [];
        const totalCount = data?.[col.key]?.count ?? 0;

        return (
          <Box
            className="kanban-column"
            key={col.key}
            sx={{
              backgroundColor: "#f1f5f9",
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              pt: 0,
              pb: 1,
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.03)",
              "&::-webkit-scrollbar": { width: "0px" },
            }}
          >
            {/* HEADER */}
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 2,
                px: 1.5,
                mt: -1,
                pt: 1.2,
                pb: 0.8,
                backgroundColor: "#f1f5f9",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography sx={{ fontWeight: 600, fontSize: "13.5px" }}>
                    {col.title}
                  </Typography>
                  <Box sx={{ fontSize: "11px", px: 1.2, py: 0.3 }}>
                    {totalCount}
                  </Box>
                </Box>

                <Box
                  sx={{
                    cursor: "pointer",
                    px: 0.5,
                    borderRadius: 1,
                    "&:hover": { backgroundColor: "#e2e8f0" },
                  }}
                  onClick={() => onAddTask?.(col.key)}
                >
                  +
                </Box>
              </Box>
            </Box>

            {/* CONTENT */}
            <Box sx={{ px: 1, pt: 2, pb: 2 }}>
              {isLoading ? (
                <UILoader type="kanbanColumn" />
              ) : colTasks.length === 0 ? (
                <Box>No tasks</Box>
              ) : (
                <Box className="kanban-tasks">
                  {colTasks.map((task: any) => (
                    <Box key={task.id} className="kanban-task-card">
                      <TaskCard task={task} onClick={() => onTaskClick(task)} />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
