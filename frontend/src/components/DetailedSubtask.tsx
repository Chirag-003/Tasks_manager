"use client";

import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function DetailedSubtask({ subtask }: any) {
  const router = useRouter();

  if (!subtask) return null;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6">{subtask.title}</Typography>

      <Typography sx={{ mt: 2 }}>
        {subtask.description || "No description"}
      </Typography>

      <Typography sx={{ mt: 2, color: "text.secondary" }}>
        Status: {subtask.status}
      </Typography>
    </Box>
  );
}
