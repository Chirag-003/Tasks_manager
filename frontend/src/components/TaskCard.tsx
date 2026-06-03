"use client";

import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

type TaskCardProps = {
  task: any;
  onClick?: () => void;
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
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      onClick={onClick}
      sx={{
        mb: 2,
        borderRadius: 3,
        width: "280px",
        minWidth: "280px",
        maxWidth: "280px",
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          transform: "translateY(-3px)",
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "15px",
              color: "#111827",
              flex: 1,
              wordBreak: "break-word",
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
              fontSize: "11px",
            }}
          />
        </Box>

        {/* DESCRIPTION */}
        {task.description && (
          <Typography
            sx={{
              mt: 1,
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            {task.description}
          </Typography>
        )}

        {/* USERS */}
        <Typography
          sx={{
            mt: 2,
            fontSize: "12.5px",
            color: "#6b7280",
          }}
        >
          Users:{" "}
          <span style={{ color: "#111827", wordBreak: "break-word" }}>
            {!task.users?.length
              ? "—"
              : task.users.map((u: any) => u.username).join(", ")}
          </span>
        </Typography>

        {/* SUBTASK ROW */}
        <Box
          onClick={(e) => {
            if (task.subtasks?.length > 0) {
              e.stopPropagation();
              setExpanded((prev) => !prev);
            }
          }}
          sx={{
            mt: 1.5,
            px: 1.5,
            py: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 2,
            backgroundColor: "#f1f5f9",
            cursor: task.subtasks?.length > 0 ? "pointer" : "default",
          }}
        >
          <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>
            {task.subtasks?.length > 0
              ? `Subtasks • ${task.subtasks.length}`
              : "No subtasks"}
          </Typography>

          {task.subtasks?.length > 0 && (
            <ExpandMoreIcon
              sx={{
                fontSize: 18,
                transition: "transform 0.3s",
                transform: expanded ? "rotate(180deg)" : "rotate(0)",
              }}
            />
          )}
        </Box>

        {/* EXPANDABLE LIST */}
        {task.subtasks?.length > 0 && (
          <Box
            sx={{
              maxHeight: expanded ? 500 : 0, // ✅ FIXED
              overflow: "hidden",
              transition: "max-height 0.35s ease",
            }}
          >
            <Box sx={{ mt: 1 }}>
              {task.subtasks.map((sub: any) => (
                <Box
                  key={sub.id}
                  sx={{
                    px: 1.5,
                    py: 0.8,
                    borderRadius: 1.5,
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e5e7eb",
                    mb: 0.6,
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    title={sub.title}
                    sx={{
                      fontSize: "13px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    • {sub.title}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
