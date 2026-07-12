"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetSubtaskByIdQuery } from "@/services/api";
import DetailedSubtask from "@/components/subtasks/DetailedSubtask";

import { Box, Typography, Button } from "@mui/material";

export default function SubtaskPage() {
  const router = useRouter();

  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading, isError } = useGetSubtaskByIdQuery(id);

  if (isLoading) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  if (isError) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Subtask not found
        </Typography>

        <Typography color="text.secondary">
          This subtask may have been deleted.
        </Typography>

        <Button
          variant="contained"
          onClick={() => router.push("/dashboard/tasks")}
        >
          Back to Tasks
        </Button>
      </Box>
    );
  }

  if (!data) return null;

  return <DetailedSubtask subtask={data} />;
}
