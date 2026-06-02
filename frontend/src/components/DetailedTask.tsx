"use client";

import {
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { useState } from "react";
import {
  useAddTaskCommentMutation,
  useCreateSubtaskMutation,
  useDeleteTaskMutation,
} from "@/services/api";

import CreateSubtaskDialog from "@/components/CreateSubtaskDialog";

type Props = {
  task: any;
  onClose: () => void;
};

export default function DetailedTask({ task, onClose }: Props) {
  const [commentText, setCommentText] = useState("");

  const [addComment, { isLoading }] = useAddTaskCommentMutation();
  const [createSubtask] = useCreateSubtaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [showSubtasks, setShowSubtasks] = useState(false);
  const [openSubtask, setOpenSubtask] = useState(false);

  if (!task) return null;

  // ✅ DELETE TASK
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?",
    );
    if (!confirmDelete) return;

    try {
      await deleteTask(task.id).unwrap();
      onClose();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // ✅ CREATE SUBTASK (NO UI ERROR HERE ✅)
  const handleCreateSubtask = async (data: any) => {
    await createSubtask({
      taskId: task.id,
      data,
    }).unwrap();

    // ✅ OPTIONAL: auto-open subtasks after creation
    setShowSubtasks(true);

    // ✅ OPTIONAL (only if you want parent success later)
    // showSuccessSnackbar(...)
  };

  // ✅ ADD COMMENT
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await addComment({
        taskId: task.id,
        data: {
          content: commentText,
          user_id: 5,
        },
      }).unwrap();

      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
      }}
    >
      {/* ✅ HEADER */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {task.title}
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={handleDelete} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={onClose}>✕</IconButton>
        </Box>
      </Box>

      {/* ✅ CONTENT */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {/* ✅ DETAILS */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Row label="Assignee">
            {!task.users?.length
              ? "—"
              : task.users.map((u: any) => u.username).join(", ")}
          </Row>

          <Row label="Status">
            <Chip size="small" label={task.status} />
          </Row>

          <Row label="Sprint">{task.sprint || "—"}</Row>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ✅ DESCRIPTION */}
        <Box>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1 }}>
            Description
          </Typography>

          <Box
            sx={{
              p: 1.5,
              border: "1px solid #e5e7eb",
              borderRadius: 2,
              backgroundColor: "#f9fafb",
            }}
          >
            {task.description || "No description"}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ✅ SUBTASKS */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            Subtasks
          </Typography>

          <IconButton size="small" onClick={() => setOpenSubtask(true)}>
            +
          </IconButton>
        </Box>

        <Typography
          onClick={() => setShowSubtasks(!showSubtasks)}
          sx={{
            fontSize: 13,
            cursor: "pointer",
            color: "#1976d2",
            mt: 0.5,
            mb: 1,
          }}
        >
          {showSubtasks ? "Hide subtasks ▲" : "See subtasks ▼"}
        </Typography>

        {showSubtasks && (
          <Box>
            {!task.subtasks?.length ? (
              <Typography sx={{ color: "text.secondary" }}>
                No subtasks
              </Typography>
            ) : (
              task.subtasks.map((subtask: any) => (
                <Box
                  key={subtask.id}
                  sx={{
                    p: 1,
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <Typography sx={{ fontSize: 14 }}>{subtask.title}</Typography>
                </Box>
              ))
            )}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* ✅ COMMENTS */}
        <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1 }}>
          Comments
        </Typography>

        {!task.comments?.data?.length ? (
          <Typography sx={{ color: "text.secondary" }}>No comments</Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {task.comments.data.map((comment: any) => (
              <Box
                key={comment.id}
                sx={{
                  p: 1.2,
                  borderRadius: 2,
                  backgroundColor: "#f5f7fa",
                }}
              >
                <Typography>{comment.content}</Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  — {comment.user?.username}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* ✅ COMMENT INPUT */}
      <Box sx={{ p: 2, borderTop: "1px solid #e5e7eb" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />

          <Box
            onClick={handleAddComment}
            sx={{
              px: 2,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              backgroundColor: "#1976d2",
              color: "#fff",
              borderRadius: 1,
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            Send
          </Box>
        </Box>
      </Box>

      {/* ✅ DIALOG */}
      <CreateSubtaskDialog
        open={openSubtask}
        onClose={() => setOpenSubtask(false)}
        onCreate={handleCreateSubtask}
      />
    </Box>
  );
}

/* ✅ ROW */
function Row({ label, children }: any) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
        {label}
      </Typography>

      <Typography component="div" sx={{ fontSize: 14 }}>
        {children}
      </Typography>
    </Box>
  );
}
