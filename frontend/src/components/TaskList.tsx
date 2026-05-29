'use client";';

import { Box, Typography } from "@mui/material";
import TaskCard from "./TaskCard";

type TaskListProps = {
  tasks: any[];
};

export default function TaskList({ tasks }: TaskListProps) {
  // ✅ Group tasks
  const backlog = tasks.filter((t) => t.status === "backlog");
  const todo = tasks.filter((t) => t.status === "todo");
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const inReview = tasks.filter((t) => t.status === "in_review");
  const qa = tasks.filter((t) => t.status === "qa");
  const completed = tasks.filter((t) => t.status === "completed");

  return (
    <Box
      display="flex"
      gap={2}
      sx={{
        mt: 2,
        overflowX: "auto", // ✅ allows scrolling like real boards
      }}
    >
      {/* ✅ BACKLOG */}
      <Box sx={{ minWidth: 250 }}>
        <Typography variant="h6">Backlog</Typography>
        {backlog.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Box>

      {/* ✅ TODO */}
      <Box sx={{ minWidth: 250 }}>
        <Typography variant="h6">Todo</Typography>
        {todo.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Box>

      {/* ✅ IN PROGRESS */}
      <Box sx={{ minWidth: 250 }}>
        <Typography variant="h6">In Progress</Typography>
        {inProgress.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Box>

      {/* ✅ IN REVIEW */}
      <Box sx={{ minWidth: 250 }}>
        <Typography variant="h6">In Review</Typography>
        {inReview.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Box>

      {/* ✅ QA */}
      <Box sx={{ minWidth: 250 }}>
        <Typography variant="h6">QA</Typography>
        {qa.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Box>

      {/* ✅ COMPLETED */}
      <Box sx={{ minWidth: 250 }}>
        <Typography variant="h6">Completed</Typography>
        {completed.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Box>
    </Box>
  );
}
