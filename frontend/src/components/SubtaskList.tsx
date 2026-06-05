"use client";

import { Box, Typography } from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Chip } from "@mui/material";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  subtasks: any[];
  onAddClick: () => void;
};

export default function SubtaskList({ subtasks, onAddClick }: Props) {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  const visibleSubtasks = showAll ? subtasks : subtasks.slice(0, 1);

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

  return (
    <Box>
      {/* ✅ HEADER MOVED HERE */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          Subtasks
        </Typography>

        <Tooltip title="Add subtask">
          <IconButton size="small" onClick={onAddClick}>
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ✅ EMPTY STATE */}
      {!subtasks?.length ? (
        <Typography sx={{ color: "text.secondary" }}>No subtasks</Typography>
      ) : (
        <>
          {visibleSubtasks.map((subtask) => (
            <Box
              key={subtask.id}
              onClick={() => router.push(`/dashboard/subtasks/${subtask.id}`)}
              sx={{
                px: 1.5,
                py: 1.2,
                borderRadius: 2,
                border: "1px solid #e5e7eb",
                backgroundColor: "#f8fafc",
                mb: 1,
                cursor: "pointer",
                transition: "all 0.2s ease",

                display: "flex",
                alignItems: "center",

                "&:hover": {
                  backgroundColor: "#eef2f7",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  color: "#334155",
                  flex: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {subtask.title}
              </Typography>

              <Chip
                label={subtask.status}
                size="small"
                color={getStatusColor(subtask.status)}
                sx={{
                  textTransform: "capitalize",
                  fontSize: "11px",
                }}
              />
            </Box>
          ))}

          {/* ✅ SHOW MORE */}
          {subtasks.length > 1 && (
            <Typography
              onClick={() => setShowAll((prev) => !prev)}
              sx={{
                fontSize: 13,
                cursor: "pointer",
                color: "#2563eb",

                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {showAll ? "Show less ▲" : `See ${subtasks.length - 1} more ▼`}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
