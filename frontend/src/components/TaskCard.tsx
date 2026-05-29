'use client";';

import { Card, CardContent, Typography, Chip, Box } from "@mui/material";

type TaskCardProps = {
  task: any;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "todo":
      return "default";
    case "backlog":
      return "warning";
    case "in_progress":
      return "primary";
    default:
      return "default";
  }
};

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <Card sx={{ mb: 2, p: 1, borderRadius: 2 }}>
      <CardContent>
        {/* ✅ HEADER */}

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {task.title}
          </Typography>

          <Chip label={task.status} color={getStatusColor(task.status)} />
        </Box>

        {/* ✅ CONTENT (2-column layout) */}
        <Box
          sx={{
            mt: 1,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* LEFT */}
          <Box>
            <Typography>
              <b>Sprint:</b> {task.sprint}
            </Typography>

            <Typography sx={{ mt: 0.5 }}>
              <b>Users:</b>{" "}
              {!task.users?.length
                ? "None"
                : task.users.map((u: any) => u.username).join(", ")}
            </Typography>
          </Box>

          {/* RIGHT */}
          <Box>
            <Typography>
              <b>Subtasks:</b> {task.subtasks?.length || 0}
            </Typography>

            <Typography sx={{ mt: 0.5 }}>
              <b>Comments:</b> {task.comments?.data?.length || 0}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
