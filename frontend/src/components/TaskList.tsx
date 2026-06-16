"use client";

import { Box, Typography } from "@mui/material";
import TaskCard from "./TaskCard";

type TaskListProps = {
  tasks: any[];
  onTaskClick: (task: any) => void;
  grouped?: boolean;
  onAddTask?: (status?: string) => void; // ✅ NEW
};

export default function TaskList({
  tasks,
  onTaskClick,
  grouped = true,
  onAddTask, // ✅ NEW
}: TaskListProps) {
  const columns = [
    { key: "backlog", title: "Backlog" },
    { key: "todo", title: "Todo" },
    { key: "in progress", title: "In Progress" },
    { key: "in review", title: "In Review" },
    { key: "qa", title: "QA" },
    { key: "completed", title: "Completed" },
  ];

  // ✅ FLAT VIEW (UNCHANGED)
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
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#e2e8f0",
            borderRadius: "10px",
          },
          "&:hover::-webkit-scrollbar-thumb": {
            backgroundColor: "#cbd5e1",
          },
        }}
      >
        {tasks.map((task) => (
          <Box key={task.id} sx={{ width: 280 }}>
            <TaskCard task={task} onClick={() => onTaskClick(task)} />
          </Box>
        ))}
      </Box>
    );
  }

  // ✅ GROUPED VIEW
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        height: "100%",
        px: 1,
      }}
    >
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);

        return (
          <Box
            key={col.key}
            sx={{
              minWidth: 270,
              flexShrink: 0,
              height: "calc(100% - 8px)",
              overflowY: "auto",
              overflowX: "hidden",

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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "13.5px",
                    color: "#1e293b",
                    letterSpacing: "0.2px",
                  }}
                >
                  {col.title}
                </Typography>

                <Box
                  sx={{
                    fontSize: "11px",
                    px: 1.2,
                    py: 0.3,
                    borderRadius: "999px",
                    backgroundColor: "#e2e8f0",
                    color: "#334155",
                    fontWeight: 500,
                  }}
                >
                  {colTasks.length}
                </Box>
              </Box>
            </Box>

            {/* CONTENT */}
            <Box sx={{ px: 1, pt: 2, pb: 2 }}>
              {colTasks.length === 0 ? (
                <Box
                  sx={{
                    mt: 3,
                    textAlign: "center",
                    fontSize: "12px",
                    color: "#94a3b8",
                  }}
                >
                  No tasks
                </Box>
              ) : (
                colTasks.map((task) => (
                  <Box
                    key={task.id}
                    sx={{
                      mb: 1,
                      transition: "transform 0.15s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <TaskCard task={task} onClick={() => onTaskClick(task)} />
                  </Box>
                ))
              )}

              {/* ✅ ADD TASK (CONNECTED) */}
              <Box
                sx={{
                  mt: 1,
                  px: 1,
                  py: 0.8,
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: "13px",
                  color: "#64748b",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    backgroundColor: "#e2e8f0",
                    color: "#1e293b",
                  },
                }}
                onClick={() => onAddTask?.(col.key)} // ✅ MAIN CHANGE
              >
                <Box sx={{ fontSize: "16px", lineHeight: 1, fontWeight: 500 }}>
                  +
                </Box>

                <Box>Add task</Box>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
