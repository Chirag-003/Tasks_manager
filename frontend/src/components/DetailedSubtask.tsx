"use client";

import {
  Box,
  Typography,
  Divider,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  useAddSubtaskCommentMutation,
  useDeleteSubtaskMutation,
  useUpdateSubtaskMutation,
} from "@/services/api";

import AssigneeField from "./AssigneeField";
import StatusField from "./StatusField";

type Props = {
  subtask: any;
};

export default function DetailedSubtask({ subtask }: Props) {
  const router = useRouter();
  const [commentText, setCommentText] = useState("");

  const [addComment, { isLoading }] = useAddSubtaskCommentMutation();
  const [deleteSubtask] = useDeleteSubtaskMutation();

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [title, setTitle] = useState(subtask.title);
  const [updateSubtask] = useUpdateSubtaskMutation();
  const [titleError, setTitleError] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleUpdateTitle = async () => {
    const trimmed = title.trim();

    if (!trimmed) {
      setTitle(subtask.title);
      setTitleError("Title cannot be empty");

      setTimeout(() => {
        setTitleError("");
      }, 3000);

      return;
    }

    if (trimmed === subtask.title) {
      setIsEditingTitle(false);
      return;
    }

    const previousTitle = subtask.title;

    try {
      await updateSubtask({
        id: subtask.id,
        data: { title: trimmed },
      }).unwrap();

      setTitleError("");
      setIsEditingTitle(false);
    } catch (err: any) {
      let message =
        err?.data?.detail || err?.error || "Subtask title must be unique";

      if (typeof message === "string") {
        message = message.replace(/^\d+:\s*/, "").trim();
      }

      setTitle(previousTitle);
      setTitleError(message);
      setIsEditingTitle(false);

      setTimeout(() => {
        setTitleError("");
      }, 3000);
    }
  };

  if (!subtask) return null;

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await addComment({
        subtaskId: subtask.id,
        data: {
          content: commentText,
          user_id: 5,
        },
      }).unwrap();

      setCommentText("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSubtask(subtask.id).unwrap();
      router.push("/dashboard/tasks");
    } catch (err: any) {
      let message = err?.data?.detail || "Cannot delete subtask";

      if (typeof message === "string") {
        message = message.replace(/^\d+:\s*/, "").trim();
      }

      setDeleteError(message);
    }
  };

  return (
    <>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          overflow: "hidden",
          backgroundColor: "#edeff0",
          p: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <IconButton onClick={() => router.back()}>
              <ArrowBackIcon />
            </IconButton>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {!isEditingTitle ? (
                <Typography
                  onClick={() => {
                    setIsEditingTitle(true);
                    setTitle(subtask.title);
                  }}
                  sx={{
                    fontWeight: 600,
                    fontSize: 18,
                    cursor: "pointer",
                  }}
                >
                  {title}
                </Typography>
              ) : (
                <TextField
                  autoFocus
                  variant="standard"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setTitleError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleUpdateTitle();
                      setIsEditingTitle(false);
                    }
                  }}
                  onBlur={() => {
                    setTitle(subtask.title);
                    setIsEditingTitle(false);
                  }}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{
                    fontSize: 18,
                    fontWeight: 400,
                  }}
                />
              )}

              {titleError && (
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#dc2626",
                    mt: 0.5,
                  }}
                >
                  {titleError}
                </Typography>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              flex: 1,
              overflowY: "auto",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Row label="Assignee">
                <AssigneeField
                  entityId={subtask.id}
                  entityType="subtask"
                  users={subtask.users}
                />
              </Row>

              <Row label="Status">
                <StatusField
                  entityId={subtask.id}
                  entityType="subtask"
                  value={subtask.status}
                />
              </Row>

              <Row label="Sprint">{subtask.sprint || "—"}</Row>
            </Box>

            <Divider />

            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              Comments
            </Typography>

            {!subtask?.comments?.data?.length ? (
              <Typography sx={{ color: "text.secondary" }}>
                No comments
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {subtask.comments.data.map((comment: any) => (
                  <Box
                    key={comment.id}
                    sx={{
                      p: 1.2,
                      borderRadius: 2,
                      backgroundColor: "#f5f7fa",
                    }}
                  >
                    <Typography>{comment.content}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Box sx={{ p: 2, borderTop: "1px solid #e5e7eb" }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
              <TextField
                multiline
                minRows={1}
                maxRows={4}
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                sx={{
                  flex: 0.6,
                  "& .MuiInputBase-root": {
                    padding: "6px 8px",
                  },
                  "& textarea": {
                    padding: 0,
                    lineHeight: "1.6",
                  },
                }}
              />

              <Button
                variant="contained"
                onClick={handleAddComment}
                sx={{ height: "fit-content" }}
              >
                Add
              </Button>

              <Box sx={{ ml: "auto" }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlinedIcon />}
                  onClick={() => setOpenDelete(true)}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#fee2e2",
                    },
                  }}
                >
                  Delete Subtask
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setDeleteError("");
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Subtask</DialogTitle>

        <DialogContent>
          <Typography sx={{ fontSize: 14 }}>
            Are you sure you want to delete this subtask? This action cannot be
            undone.
          </Typography>

          {deleteError && (
            <Box
              sx={{
                mt: 2,
                px: 1.5,
                py: 1,
                borderRadius: 1,
                bgcolor: "#fee2e2",
              }}
            >
              <Typography sx={{ fontSize: 13, color: "#dc2626" }}>
                {deleteError}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setOpenDelete(false);
              setDeleteError("");
            }}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={!!deleteError}
            sx={{ textTransform: "none" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function Row({ label, children }: any) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "120px 1fr",
        alignItems: "center",
        columnGap: 2,
      }}
    >
      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
        {label}
      </Typography>

      <Box sx={{ fontSize: 14 }}>{children}</Box>
    </Box>
  );
}
