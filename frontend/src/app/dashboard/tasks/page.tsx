"use client";

import { useGetTasksQuery, useCreateTaskMutation } from "@/services/api";

import TaskList from "@/components/TaskList";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import UILoader from "@/components/Loader";
import FilterMenu from "@/components/FilterMenu";

import { useState, useEffect } from "react";

import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  TextField,
  Popover,
} from "@mui/material";

import { useRouter, useSearchParams } from "next/navigation";

export default function TasksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ filters state
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sprint: "",
    user_id: "",
  });

  // ✅ ✅ NEW → click loading state
  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);

  // ✅ search debounce
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = searchInput.trim();

      setFilters((prev) => ({
        ...prev,
        search: trimmed || "",
      }));
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data, isLoading, isError } = useGetTasksQuery(filters);
  const [createTask] = useCreateTaskMutation();

  // ✅ create modal
  const [open, setOpen] = useState(false);

  const handleOpen = (e: any) => {
    e.currentTarget.blur();
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // ✅ popover state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setAnchorEl(null);
  };

  const openFilter = Boolean(anchorEl);

  // ✅ snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  useEffect(() => {
    if (searchParams.get("deleted") === "true") {
      setSnackbar({
        open: true,
        message: "Task deleted successfully ✅",
      });

      router.replace("/dashboard/tasks");
    }
  }, [searchParams, router]);

  // ✅ TASK SKELETON (correct)
  if (isLoading) return <UILoader type="task" />;
  if (isError) return <p>Error fetching tasks</p>;

  return (
    <>
      {/* ✅ ✅ CLICK LOADER OVERLAY (NEW) */}
      {loadingTaskId && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(2px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UILoader type="full" text="Opening task..." />
        </Box>
      )}

      <Box
        sx={{
          height: "95%",
          px: 3,
          py: 1.5,
          backgroundColor: "#f8fafc",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Tasks
          </Typography>

          <Box display="flex" gap={2}>
            <TextField
              placeholder="Search tasks..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ width: 250 }}
            />

            <Button
              variant="outlined"
              onClick={handleOpenFilter}
              sx={{ textTransform: "none" }}
            >
              Filter
            </Button>
          </Box>
        </Box>

        {/* FILTER */}
        <Popover
          open={openFilter}
          anchorEl={anchorEl}
          onClose={handleCloseFilter}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          sx={{ "& .MuiPaper-root": { mt: 1 } }}
        >
          <Box p={2} width={280}>
            <FilterMenu
              type="task"
              onChange={(newFilters: any) => {
                setFilters((prev) => ({
                  ...prev,
                  ...newFilters,
                }));
              }}
            />
          </Box>
        </Popover>

        {/* TASK LIST */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            overflowX: "auto",
          }}
        >
          {!data?.length ? (
            <Typography sx={{ color: "text.secondary" }}>
              {searchInput.trim()
                ? `No results found for "${searchInput.trim()}"`
                : "No tasks available"}
            </Typography>
          ) : (
            <TaskList
              tasks={data}
              onTaskClick={(task: any) =>
                router.push(`/dashboard/tasks/${task.id}`)
              }
            />
          )}
        </Box>

        {/* CREATE BUTTON */}
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            borderRadius: "24px",
            px: 3,
            textTransform: "none",
          }}
        >
          Create Task
        </Button>

        <CreateTaskDialog
          open={open}
          onClose={handleClose}
          onCreate={async (formData) => {
            await createTask(formData).unwrap();
          }}
        />
      </Box>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
