"use client";

import { Box, Typography } from "@mui/material";
import TaskCard from "./TaskCard";

type TaskListProps = {
  tasks: any[];
  onTaskClick: (task: any) => void;
  grouped?: boolean;
};

export default function TaskList({
  tasks,
  onTaskClick,
  grouped = true,
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

          "&::-webkit-scrollbar": {
            width: "8px",
          },
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

  // ✅ GROUPED VIEW (FINAL)
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
              height: "100%",
              overflowY: "auto", // ✅ whole column scrolls

              backgroundColor: "#f8fafc",
              borderRadius: 3,

              pt: 0, // ✅ FIX: remove top gap
              pb: 1,

              border: "1px solid #eef2f7",

              "&::-webkit-scrollbar": {
                width: "0px", // ✅ completely hidden
              },

              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "transparent",
              },
            }}
          >
            {/* ✅ HEADER (STICKY) */}
            {/* ✅ HEADER (FIXED SOLID) */}

            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 2,

                // ✅ FIX WIDTH (already done)
                mx: -1,
                px: 1.2,

                // ✅ FIX TOP GAP (NEW)
                mt: -1, // 🔥 pull header up
                pt: 1, // 🔥 restore internal spacing

                pb: 0.5,

                backgroundColor: "#f8fafc",
                borderBottom: "1px solid #e5e7eb",
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
                    fontSize: "14px",
                    color: "#334155",
                  }}
                >
                  {col.title}
                </Typography>

                <Box
                  sx={{
                    fontSize: "11px",
                    px: 1,
                    py: 0.2,
                    borderRadius: "6px",
                    backgroundColor: "#e2e8f0",
                    color: "#475569",
                  }}
                >
                  {colTasks.length}
                </Box>
              </Box>
            </Box>

            {/* ✅ CONTENT */}
            <Box sx={{ px: 1, pb: 2 }}>
              {colTasks.length === 0 ? (
                <Box
                  sx={{
                    mt: 2,
                    textAlign: "center",
                    fontSize: "12px",
                    color: "#94a3b8",
                  }}
                >
                  No tasks
                </Box>
              ) : (
                colTasks.map((task) => (
                  <Box key={task.id} sx={{ mb: 0.5 }}>
                    <TaskCard task={task} onClick={() => onTaskClick(task)} />
                  </Box>
                ))
              )}

              {/* ✅ ADD TASK (SCROLLS NATURALLY) */}
              <Box
                sx={{
                  mt: 1,
                  px: 1,
                  py: 0.6,
                  borderRadius: 1.5,
                  fontSize: "12px",
                  color: "#64748b",
                  textAlign: "center",
                  cursor: "pointer",

                  "&:hover": {
                    backgroundColor: "#e2e8f0",
                    color: "#334155",
                  },
                }}
              >
                + Add task
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
