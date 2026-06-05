"use client";

import { Box, Typography } from "@mui/material";
import TaskCard from "./TaskCard";

type TaskListProps = {
  tasks: any[];
  onTaskClick: (task: any) => void;
};

export default function TaskList({ tasks, onTaskClick }: TaskListProps) {
  const columns = [
    { key: "backlog", title: "Backlog" },
    { key: "todo", title: "Todo" },
    { key: "in progress", title: "In Progress" },
    { key: "in review", title: "In Review" },
    { key: "qa", title: "QA" },
    { key: "completed", title: "Completed" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        height: "100%",
      }}
    >
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);

        return (
          <Box
            key={col.key}
            sx={{
              minWidth: 260,
              flexShrink: 0,

              height: "100%",
              display: "flex",
              flexDirection: "column",

              "&:hover .scroll-area::-webkit-scrollbar-thumb": {
                backgroundColor: "#cbd5e1",
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                mb: 1,
                px: 0.5,
              }}
            >
              {col.title}
            </Typography>

            <Box
              className="scroll-area"
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                pr: 1,

                "&::-webkit-scrollbar": {
                  width: "8px",
                },

                "&::-webkit-scrollbar-track": {
                  backgroundColor: "transparent",
                },

                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "transparent",
                  borderRadius: "10px",
                  minHeight: "40px",
                  transition: "background-color 0.2s ease",
                },
              }}
            >
              {colTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => onTaskClick(task)}
                />
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
