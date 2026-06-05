"use client";

import {
  Box,
  Typography,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useAddTaskCommentMutation,
  useCreateSubtaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/services/api";

import CreateSubtaskDialog from "@/components/CreateSubtaskDialog";
import AssigneeField from "./AssigneeField";
import StatusField from "./StatusField";
import DescriptionField from "./DescriptionField";
import SubtaskList from "./SubtaskList";

type Props = {
  task: any;
};

export default function DetailedTask({ task }: Props) {
  const router = useRouter();

  const [commentText, setCommentText] = useState("");
  const [openSubtask, setOpenSubtask] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [addComment, { isLoading }] = useAddTaskCommentMutation();
  const [createSubtask] = useCreateSubtaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [title, setTitle] = useState(task.title);
  const [updateTask] = useUpdateTaskMutation();
  const [titleError, setTitleError] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [subtasks, setSubtasks] = useState(task.subtasks || []);

  useEffect(() => {
    setSubtasks(task.subtasks || []);
  }, [task.subtasks]);

  const handleUpdateTitle = async () => {
    const trimmed = title.trim();

    if (!trimmed) {
      setTitle(task.title);
      setTitleError("Title cannot be empty");

      setTimeout(() => {
        setTitleError("");
      }, 3000);
      return;
    }

    if (trimmed === task.title) {
      setIsEditingTitle(false);
      return;
    }

    const previousTitle = task.title;

    try {
      await updateTask({
        id: task.id,
        data: { title: trimmed },
      }).unwrap();

      setTitleError("");
      setIsEditingTitle(false);
    } catch (err: any) {
      let message =
        err?.data?.detail || err?.error || "Task title must be unique";

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

  if (!task) return null;

  const handleDelete = async () => {
    try {
      await deleteTask(task.id).unwrap();
      router.push("/dashboard/tasks?deleted=true");
    } catch (err: any) {
      let message =
        err?.data?.detail || "Cannot delete task because it has subtasks";

      if (typeof message === "string") {
        message = message
          .replace(/^\d+:\s*/, "")
          .replace(/\(\d+\)/g, "")
          .trim();
      }

      setDeleteError(message);
    }
  };

  const handleCreateSubtask = async (data: any) => {
    const newSubtask = await createSubtask({
      taskId: task.id,
      data,
    }).unwrap();

    setSubtasks((prev: any[]) => [newSubtask, ...prev]);
  };

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
      console.error(error);
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
            bgcolor: "#fff",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <IconButton onClick={() => router.back()}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {!isEditingTitle ? (
                <Typography
                  onClick={() => {
                    setIsEditingTitle(true);
                    setTitle(task.title);
                  }}
                  sx={{
                    fontWeight: 600,
                    fontSize: 18,
                    cursor: "pointer",
                  }}
                >
                  {task.title}
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
                    setTitle(task.title);
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
                <Typography sx={{ fontSize: 12, color: "#dc2626", mt: 0.5 }}>
                  {titleError}
                </Typography>
              )}
            </Box>
          </Box>

          {/* CONTENT */}
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
                  entityId={task.id}
                  entityType="task"
                  users={task.users}
                />
              </Row>

              <Row label="Status">
                <StatusField
                  entityId={task.id}
                  entityType="task"
                  value={task.status}
                />
              </Row>

              <Row label="Sprint">{task.sprint || "—"}</Row>
            </Box>

            <Divider />

            <Box>
              <Typography sx={{ fontSize: 13, mb: 1, color: "text.secondary" }}>
                Description
              </Typography>

              <DescriptionField
                entityId={task.id}
                entityType="task"
                value={task.description}
              />
            </Box>

            <Divider />

            {/* SUBTASKS */}
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
                <IconButton size="small" onClick={() => setOpenSubtask(true)}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <SubtaskList subtasks={subtasks} />

            <Divider />

            {/* COMMENTS */}
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              Comments
            </Typography>

            {!task.comments?.data?.length ? (
              <Typography sx={{ color: "text.secondary" }}>
                No comments
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {task.comments.data.map((c: any) => (
                  <Box
                    key={c.id}
                    sx={{
                      p: 1.2,
                      borderRadius: 2,
                      backgroundColor: "#f5f7fa",
                    }}
                  >
                    <Typography>{c.content}</Typography>
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                      — {c.user?.username}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* COMMENT INPUT */}
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
                  Delete Task
                </Button>
              </Box>
            </Box>
          </Box>

          <CreateSubtaskDialog
            open={openSubtask}
            onClose={() => setOpenSubtask(false)}
            onCreate={handleCreateSubtask}
          />
        </Box>
      </Box>

      {/* DELETE MODAL */}
      <Dialog
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setDeleteError("");
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Task</DialogTitle>

        <DialogContent>
          <Typography sx={{ fontSize: 14 }}>
            Are you sure you want to delete this task?
          </Typography>

          {deleteError && (
            <Box sx={{ mt: 2, p: 1, bgcolor: "#fee2e2", borderRadius: 1 }}>
              <Typography sx={{ fontSize: 13, color: "#dc2626" }}>
                {deleteError}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function Row({ label, children }: any) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 2 }}>
      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
        {label}
      </Typography>
      <Box>{children}</Box>
    </Box>
  );
}
