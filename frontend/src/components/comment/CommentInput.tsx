"use client";

import { Box, TextField, Button, Avatar } from "@mui/material";
import { useState } from "react";

import SendIcon from "@mui/icons-material/Send";

import {
  useAddTaskCommentMutation,
  useAddSubtaskCommentMutation,
} from "@/services/api";

import { useGetCurrentUserQuery } from "@/services/api";

type Props = {
  entityId: number;
  entityType: "task" | "subtask";
  rightSlot?: React.ReactNode;
};

export default function CommentInput({
  entityId,
  entityType,
  rightSlot,
}: Props) {
  const [text, setText] = useState("");

  const [addTaskComment, { isLoading: isAddingTask }] =
    useAddTaskCommentMutation();

  const [addSubtaskComment, { isLoading: isAddingSubtask }] =
    useAddSubtaskCommentMutation();
  const { data: currentUser } = useGetCurrentUserQuery(undefined);

  const isLoading = isAddingTask || isAddingSubtask;

  const handleAddComment = async () => {
    if (!text.trim()) return;

    try {
      if (entityType === "task") {
        await addTaskComment({
          taskId: entityId,
          data: {
            content: text,
            user_id: currentUser?.id,
          },
        }).unwrap();
      } else {
        await addSubtaskComment({
          subtaskId: entityId,
          data: {
            content: text,
            user_id: currentUser?.id,
          },
        }).unwrap();
      }

      setText("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flex: 1,
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            fontSize: 14,
            bgcolor: "#2563eb",
            mt: 0.5,
            flexShrink: 0,
          }}
        >
          {currentUser?.username?.charAt(0).toUpperCase() || "U"}
        </Avatar>
        <TextField
          multiline
          minRows={1}
          maxRows={3}
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
          size="small"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAddComment();
            }
          }}
        />

        <Button
          sx={{ textTransform: "capitalize", height: "auto", minWidth: 120 }}
          variant="contained"
          disabled={isLoading}
          onClick={handleAddComment}
          startIcon={<SendIcon />}
        >
          {isLoading ? "Posting..." : "Post"}
        </Button>
      </Box>

      {rightSlot && (
        <Box
          sx={{
            display: "flex",
            alignItems: "stretch",
          }}
        >
          {rightSlot}
        </Box>
      )}
    </Box>
  );
}
