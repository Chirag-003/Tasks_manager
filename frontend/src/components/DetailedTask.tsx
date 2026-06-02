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
import { useRouter } from "next/navigation";
import {
  useAddTaskCommentMutation,
  useCreateSubtaskMutation,
  useDeleteTaskMutation,
} from "@/services/api";

import CreateSubtaskDialog from "@/components/CreateSubtaskDialog";

type Props = {
  task: any;
  onClose?: () => void; // now optional
};

export default function DetailedTask({ task }: Props) {
  const router = useRouter();

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
      router.push("/dashboard/tasks"); // ✅ go back to list after delete
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // ✅ CREATE SUBTASK
  const handleCreateSubtask = async (data: any) => {
    await createSubtask({
      taskId: task.id,
      data,
    }).unwrap();

    setShowSubtasks(true);
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
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        py: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: "900px",
          mx: "auto",
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ✅ HEADER */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* ✅ BACK BUTTON */}
          <IconButton onClick={() => router.back()}>←</IconButton>

          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {task.title}
          </Typography>

          <Box sx={{ ml: "auto" }}>
            <IconButton onClick={handleDelete} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* ✅ CONTENT */}
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
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

          <Divider />

          {/* ✅ DESCRIPTION */}
          <Box>
            <Typography sx={{ fontSize: 13, mb: 1, color: "text.secondary" }}>
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

          <Divider />

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
                    <Typography>{subtask.title}</Typography>
                  </Box>
                ))
              )}
            </Box>
          )}

          <Divider />

          {/* ✅ COMMENTS */}
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            Comments
          </Typography>

          {!task.comments?.data?.length ? (
            <Typography sx={{ color: "text.secondary" }}>
              No comments
            </Typography>
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

        {/* ✅ SUBTASK DIALOG */}
        <CreateSubtaskDialog
          open={openSubtask}
          onClose={() => setOpenSubtask(false)}
          onCreate={handleCreateSubtask}
        />
      </Box>
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
