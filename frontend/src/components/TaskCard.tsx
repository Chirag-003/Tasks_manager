"use client";

import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { useRouter } from "next/navigation";

import UILoader from "@/components/Loader";

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
    case "in review":
      return "info";
    case "qa":
      return "secondary";
    case "completed":
      return "success";
    default:
      return "default";
  }
};

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const [loadingSubtaskId, setLoadingSubtaskId] = useState<number | null>(null);

  return (
    <>
      {loadingSubtaskId && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(2px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UILoader type="full" text="Opening subtask..." />
        </Box>
      )}

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

          <Typography
            sx={{
              mt: 2,
              fontSize: "12.5px",
              color: "#6b7280",
            }}
          >
            Assignees{" "}
            <span style={{ color: "#111827", wordBreak: "break-word" }}>
              {!task.users?.length
                ? "No Assignees"
                : task.users.map((u: any) => u.username).join(", ")}
            </span>
          </Typography>

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

              "&:hover": {
                backgroundColor:
                  task.subtasks?.length > 0 ? "#e2e8f0" : "#f1f5f9",
              },
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
                  color: "#64748b",
                  transition: "transform 0.3s ease",
                  transform: expanded ? "rotate(180deg)" : "rotate(0)",
                }}
              />
            )}
          </Box>

          {task.subtasks?.length > 0 && (
            <Box
              sx={{
                maxHeight: expanded ? 500 : 0,
                overflow: "hidden",
                transition: "max-height 0.35s ease",
              }}
            >
              <Box sx={{ mt: 1 }}>
                {task.subtasks.map((sub: any) => (
                  <Box
                    key={sub.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLoadingSubtaskId(sub.id); // ✅ ADDED
                      router.push(`/dashboard/subtasks/${sub.id}`);
                    }}
                    sx={{
                      px: 1.5,
                      py: 0.8,
                      borderRadius: 1.5,
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e5e7eb",
                      mb: 0.6,
                      overflow: "hidden",
                      cursor: "pointer",

                      "&:hover": {
                        backgroundColor: "#eef2f7",
                      },
                    }}
                  >
                    <Typography
                      title={sub.title}
                      sx={{
                        fontSize: "13px",
                        color: "#334155",

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
    </>
  );
}
