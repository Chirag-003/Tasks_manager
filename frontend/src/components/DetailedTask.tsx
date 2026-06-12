"use client";

import {
  Box,
  Typography,
  Divider,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Popover,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import {
  useCreateSubtaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useGetSubtasksQuery,
} from "@/services/api";

import CreateSubtaskDialog from "@/components/CreateSubtaskDialog";
import FilterMenu from "@/components/FilterMenu";

import AssigneeField from "./AssigneeField";
import StatusField from "./StatusField";
import DescriptionField from "./DescriptionField";
import SubtaskList from "./SubtaskList";
import CommentsField from "./CommentField";

// ✅ ONLY ADDED
import { z } from "zod";

// ✅ ONLY ADDED
const titleSchema = z.string().min(1, "Title cannot be empty");

type Props = {
  task: any;
};

export default function DetailedTask({ task }: Props) {
  const router = useRouter();

  const [openSubtask, setOpenSubtask] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [createSubtask] = useCreateSubtaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const [title, setTitle] = useState(task.title);
  const [titleError, setTitleError] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [subtaskFilters, setSubtaskFilters] = useState({
    status: "",
    user_id: "",
    search: "",
  });

  const { data: subtasks = [] } = useGetSubtasksQuery(
    {
      task_id: task.id,
      ...subtaskFilters,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseFilter = () => setAnchorEl(null);
  const openFilter = Boolean(anchorEl);

  const handleSearch = useCallback((value: string) => {
    const trimmed = value.trim();

    setSubtaskFilters((prev) => {
      if (prev.search === trimmed) return prev;

      return {
        ...prev,
        search: trimmed || "",
      };
    });
  }, []);

  // ✅ ONLY THIS FUNCTION UPDATED
  const handleUpdateTitle = async () => {
    const trimmed = title.trim();

    const result = titleSchema.safeParse(trimmed);

    if (!result.success) {
      setTitle(task.title);
      setTitleError(result.error.errors[0].message);
      setTimeout(() => setTitleError(""), 3000);
      return;
    }

    if (trimmed === task.title) return;

    try {
      await updateTask({
        id: task.id,
        data: { title: trimmed },
      }).unwrap();

      setTitleError("");
      setIsEditingTitle(false);
    } catch (err: any) {
      setTitle(task.title);
      setTitleError(err?.data?.detail || "Task title must be unique");
      setTimeout(() => setTitleError(""), 3000);
    }
  };

  if (!task) return null;

  const handleDelete = async () => {
    setDeleteError("");

    try {
      await deleteTask(task.id).unwrap();
      router.push("/dashboard/tasks?deleted=true");
    } catch (err: any) {
      let message =
        err?.data?.detail || "Cannot delete task because it has subtasks";

      if (typeof message === "string") {
        message = message.replace(/^\d+:\s*/, "").trim();
      }

      setDeleteError(message);
    }
  };

  const handleCreateSubtask = async (data: any) => {
    await createSubtask({
      taskId: task.id,
      data,
    }).unwrap();
  };

  return (
    <>
      <Box sx={{ height: "100%", display: "flex", p: 2, bgcolor: "#edeff0" }}>
        <Box
          sx={{
            width: "100%",
            bgcolor: "#fff",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
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

            {!isEditingTitle ? (
              <Typography
                onClick={() => setIsEditingTitle(true)}
                sx={{ fontWeight: 600, fontSize: 18, cursor: "pointer" }}
              >
                {task.title}
              </Typography>
            ) : (
              <TextField
                autoFocus
                variant="standard"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdateTitle()}
                onBlur={() => setIsEditingTitle(false)}
                fullWidth
                InputProps={{
                  disableUnderline: true,
                }}
              />
            )}
          </Box>

          {/* MAIN */}
          <Box sx={{ p: 3, flex: 1, overflowY: "auto" }}>
            <Box display="flex" flexDirection="column" gap={2}>
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

              <Divider />

              <Typography
                sx={{
                  fontSize: 16,
                  color: "text.secondary",
                  fontWeight: 500,
                }}
              >
                Description
              </Typography>

              <DescriptionField
                entityId={task.id}
                entityType="task"
                value={task.description}
              />

              <Divider />

              <SubtaskList
                subtasks={subtasks}
                onAddClick={() => setOpenSubtask(true)}
                onSearch={handleSearch}
                onFilterClick={handleOpenFilter}
              />

              <Popover
                open={openFilter}
                anchorEl={anchorEl}
                onClose={handleCloseFilter}
              >
                <Box p={2} width={260}>
                  <FilterMenu
                    filters={subtaskFilters}
                    type="subtask"
                    onChange={(filters) => setSubtaskFilters(filters)}
                    onClear={() =>
                      setSubtaskFilters({
                        status: "",
                        user_id: "",
                        search: "",
                      })
                    }
                  />
                </Box>
              </Popover>

              <Divider />
            </Box>

            <Box sx={{ mt: "auto" }}>
              <CommentsField
                entityId={task.id}
                entityType="task"
                comments={task.comments?.data || []}
                rightSlot={
                  <Button
                    sx={{ textTransform: "capitalize" }}
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutlinedIcon />}
                    onClick={() => {
                      setDeleteError("");
                      setOpenDelete(true);
                    }}
                  >
                    Delete Task
                  </Button>
                }
              />
            </Box>
          </Box>

          <CreateSubtaskDialog
            open={openSubtask}
            onClose={() => setOpenSubtask(false)}
            onCreate={handleCreateSubtask}
          />
        </Box>
      </Box>

      {/* DELETE DIALOG */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>Delete Task</DialogTitle>

        <DialogContent>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </Typography>

          {deleteError && (
            <Box
              sx={{
                mt: 2,
                px: 2,
                py: 1.5,
                borderRadius: 1,
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
              }}
            >
              <Typography
                sx={{ fontSize: 13, color: "#b91c1c", fontWeight: 500 }}
              >
                {deleteError}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenDelete(false)}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            sx={{
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
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
        gap: 2,
      }}
    >
      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
        {label}
      </Typography>
      <Box>{children}</Box>
    </Box>
  );
}
