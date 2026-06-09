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

  // ✅ ✅ FILTER STATE
  const [subtaskFilters, setSubtaskFilters] = useState({
    status: "",
    user_id: "",
    search: "",
  });

  // ✅ ✅ FORCE REFETCH WHEN FILTERS CHANGE
  const { data: subtasks = [] } = useGetSubtasksQuery(
    {
      task_id: task.id,
      ...subtaskFilters,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  // ✅ FILTER POPOVER
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseFilter = () => setAnchorEl(null);
  const openFilter = Boolean(anchorEl);

  // ✅ ✅ CLEAN SEARCH HANDLER
  const handleSearch = useCallback((value: string) => {
    const trimmed = value.trim();

    setSubtaskFilters((prev) => {
      // ✅ avoid unnecessary re-renders / API calls
      if (prev.search === trimmed) return prev;

      return {
        ...prev,
        search: trimmed || "",
      };
    });
  }, []);

  // ✅ TITLE UPDATE
  const handleUpdateTitle = async () => {
    const trimmed = title.trim();

    if (!trimmed) {
      setTitle(task.title);
      setTitleError("Title cannot be empty");
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

  // ✅ DELETE
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

  // ✅ CREATE SUBTASK
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
                sx={{ fontWeight: 600, fontSize: 18 }}
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

              {/* ✅ ✅ SUBTASK LIST */}
              <SubtaskList
                subtasks={subtasks}
                onAddClick={() => setOpenSubtask(true)}
                onSearch={handleSearch}
                onFilterClick={handleOpenFilter}
              />

              {/* ✅ FILTER */}
              <Popover
                open={openFilter}
                anchorEl={anchorEl}
                onClose={handleCloseFilter}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
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

      {/* DELETE */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Task</DialogTitle>

        <DialogContent>
          <Typography>Are you sure?</Typography>

          {deleteError && (
            <Box sx={{ mt: 2, p: 1, bgcolor: "#fee2e2" }}>
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
