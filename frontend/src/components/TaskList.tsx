"use client";

import { Box, Typography } from "@mui/material";
import TaskCard from "./TaskCard";

type TaskListProps = {
  tasks: any[];
};

export default function TaskList({ tasks }: TaskListProps) {
  const columns = [
    { key: "backlog", title: "Backlog" },
    { key: "todo", title: "Todo" },
    { key: "in_progress", title: "In Progress" },
    { key: "in_review", title: "In Review" },
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

              display: "flex",
              flexDirection: "column",

              height: "100%",
              minHeight: 0,
            }}
          >
            {/* HEADER */}
            <Typography sx={{ fontWeight: 600, mb: 1 }}>{col.title}</Typography>

            {/* TASK AREA */}
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto", // ✅ ONLY vertical scroll
              }}
            >
              {colTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
