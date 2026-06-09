"use client";

import { Box, Typography, TextField, Button, Divider } from "@mui/material";
import { useState } from "react";

import {
  useAddTaskCommentMutation,
  useAddSubtaskCommentMutation,
} from "@/services/api";

type Props = {
  entityId: number;
  entityType: "task" | "subtask";
  comments: any[];
  rightSlot?: React.ReactNode; // ✅ important
};

export default function CommentsField({
  entityId,
  entityType,
  comments,
  rightSlot,
}: Props) {
  const [text, setText] = useState("");

  const [addTaskComment, { isLoading: isAddingTask }] =
    useAddTaskCommentMutation();

  const [addSubtaskComment, { isLoading: isAddingSubtask }] =
    useAddSubtaskCommentMutation();

  const isLoading = isAddingTask || isAddingSubtask;

  const handleAddComment = async () => {
    if (!text.trim()) return;

    try {
      if (entityType === "task") {
        await addTaskComment({
          taskId: entityId,
          data: {
            content: text,
            user_id: 5,
          },
        }).unwrap();
      } else {
        await addSubtaskComment({
          subtaskId: entityId,
          data: {
            content: text,
            user_id: 5,
          },
        }).unwrap();
      }

      setText("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      {/* Heading */}
      <Typography
        sx={{ fontSize: 13, color: "text.secondary", mb: 1, cursor: "default" }}
      >
        Comments
      </Typography>

      {/* Comments List */}
      {!comments?.length ? (
        <Typography sx={{ color: "text.secondary", mb: 1, cursor: "default" }}>
          No comments
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
          {comments.map((comment: any) => (
            <Box
              key={comment.id}
              sx={{
                p: 1.2,
                borderRadius: 2,
                backgroundColor: "#f5f7fa",
              }}
            >
              <Typography>{comment.content}</Typography>

              {comment.user?.username && (
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  — {comment.user.username}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      <Divider />

      {/* ✅ INPUT + ADD + DELETE SAME ROW */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: 2,
          mt: 1.5,
        }}
      >
        {/* Input + Add */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "flex-end",
            maxWidth: 450, // ✅ controls width
            flex: 1,
          }}
        >
          <TextField
            multiline
            minRows={1}
            maxRows={4}
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{
              flex: 1,
              "& .MuiInputBase-root": {
                padding: "6px 8px",
              },
              "& textarea": {
                padding: 0,
                lineHeight: "1.6",
              },
              minWidth: 800,
            }}
          />

          <Button
            variant="contained"
            onClick={handleAddComment}
            disabled={isLoading}
            sx={{
              height: "fit-content",
              minWidth: 100,
              textTransform: "capitalize",
            }}
          >
            Add
          </Button>
        </Box>

        {/* ✅ Delete / right-side actions */}
        {rightSlot && <Box sx={{ ml: "auto" }}>{rightSlot}</Box>}
      </Box>
    </Box>
  );
}
