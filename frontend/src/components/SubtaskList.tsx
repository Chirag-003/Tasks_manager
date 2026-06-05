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
          sx={{
            p: 1.2,
            border: "1px solid #e5e7eb",
            borderRadius: 2,
            mb: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* ✅ TITLE (CLICKABLE) */}
          <Typography
            onClick={() => router.push(`/dashboard/subtasks/${subtask.id}`)}
            sx={{
              fontSize: 14,
              cursor: "pointer",
              flex: 1,

              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",

              "&:hover": {
                color: "#2563eb",
              },
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
