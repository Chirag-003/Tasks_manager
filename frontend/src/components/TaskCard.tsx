"use client";

import { Card, CardContent, Typography, Chip, Box } from "@mui/material";

type TaskCardProps = {
  task: any;
  onClick?: () => void; // ✅ FIX: add onClick prop
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "backlog":
      return "warning";
    case "todo":
      return "default";
    case "in progress":
      return "primary";
    case "completed":
      return "success";
    default:
      return "default";
  }
};

export default function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <Card
      onClick={onClick} // ✅ FIX: now clickable
      sx={{
        mb: 2,
        borderRadius: 3,
        minHeight: 160,

        backgroundColor: "#f4f6f8",
        border: "1px solid #e0e0e0",

        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",

        cursor: "pointer", // ✅ IMPORTANT (shows it’s clickable)

        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* ✅ HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              fontSize: "15px",
              lineHeight: 1.4,
              flex: 1,
            }}
          >
            {task.title}
          </Typography>

          <Chip
            label={task.status}
            size="small"
            color={getStatusColor(task.status)}
            sx={{
              textTransform: "capitalize",
              flexShrink: 0,
            }}
          />
        </Box>

        {/* ✅ DESCRIPTION */}
        {task.description && (
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: "text.secondary",
              fontSize: "13px",
              lineHeight: 1.4,
            }}
          >
            {task.description}
          </Typography>
        )}

        {/* ✅ META INFO */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            fontSize: "13px",
            color: "text.secondary",
          }}
        >
          <Box>
            <Typography sx={{ fontSize: "13px" }}>
              Sprint: {task.sprint || "—"}
            </Typography>

            <Typography sx={{ fontSize: "13px", mt: 0.5 }}>
              Users:{" "}
              {!task.users?.length
                ? "—"
                : task.users.map((u: any) => u.username).join(", ")}
            </Typography>
          </Box>

          <Box textAlign="right">
            <Typography sx={{ fontSize: "13px" }}>
              {task.subtasks?.length || 0} subtasks
            </Typography>

            <Typography sx={{ fontSize: "13px", mt: 0.5 }}>
              {task.comments?.data?.length || 0} comments
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
