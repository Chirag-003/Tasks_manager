"use client";

import { Box, Typography } from "@mui/material";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  subtasks: any[];
};

export default function SubtaskList({ subtasks }: Props) {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  // ✅ No subtasks case
  if (!subtasks?.length) {
    return (
      <Typography sx={{ color: "text.secondary" }}>No subtasks</Typography>
    );
  }

  // ✅ Decide what to show
  const visibleSubtasks = showAll ? subtasks : subtasks.slice(0, 1);

  return (
    <Box>
      {/* ✅ SUBTASK LIST */}
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
        </Box>
      ))}

      {/* ✅ SHOW MORE / LESS */}
      {subtasks.length > 1 && (
        <Typography
          onClick={() => setShowAll((prev) => !prev)}
          sx={{
            fontSize: 13,
            cursor: "pointer",
            color: "#2563eb",
          }}
        >
          {showAll ? "Show less ▲" : `See ${subtasks.length - 1} more ▼`}
        </Typography>
      )}
    </Box>
  );
}
