"use client";

import { useGetTasksQuery, useCreateTaskMutation } from "@/services/api";
import TaskList from "@/components/TaskList";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import Loader from "@/components/Loader";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStatus } from "@/store/slices/filterSlice";

import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

export default function TasksPage() {
  const { data, isLoading, isError } = useGetTasksQuery();
  const [createTask] = useCreateTaskMutation();

  const dispatch = useDispatch();
  const status = useSelector((state: any) => state.filter.status);
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const handleOpen = (e: any) => {
    e.currentTarget.blur();
    setOpen(true);
  };

  const searchParams = useSearchParams();

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

  const handleClose = () => setOpen(false);

  if (isLoading) return <Loader />;
  if (isError) return <p>Error fetching tasks</p>;

  const filteredTasks =
    status === "all"
      ? data || []
      : (data || []).filter((t: any) => t.status === status);

  return (
    <>
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
        <Box sx={{ mb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Tasks
          </Typography>
        </Box>

        <Tabs
          value={status}
          onChange={(e, newValue) => dispatch(setStatus(newValue))}
          sx={{
            borderBottom: "1px solid #e0e0e0",
            minHeight: 36,

            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 500,
              color: "#6b7280",

              px: 1.5,
              py: 0.5,
              minHeight: 40,

              transition: "all 0.2s ease",

              "&:hover": {
                color: "#111827",
                backgroundColor: "transparent",
              },
            },

            "& .Mui-selected": {
              color: "#1976d2",
              backgroundColor: "transparent",
              borderRadius: 2,
            },

            "& .MuiTabs-indicator": {
              height: "3px",
              borderRadius: 2,
              backgroundColor: "#1976d2",
            },
          }}
        >
          <Tab label="All" value="all" />
          <Tab label="Backlog" value="backlog" />
          <Tab label="Todo" value="todo" />
          <Tab label="In Progress" value="in progress" />
          <Tab label="In Review" value="in review" />
          <Tab label="QA" value="qa" />
          <Tab label="Completed" value="completed" />
        </Tabs>

        <Box
          sx={{
            mt: 2,
            flex: 1,
            minHeight: 0,
            overflowX: "auto",
            overflowY: "hidden",
            display: "flex",

            "&::-webkit-scrollbar": {
              height: "6px",
            },

            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },

            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#cbd5f1",
              borderRadius: "8px",
            },

            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#94a3b8",
            },
          }}
        >
          <TaskList
            tasks={filteredTasks}
            onTaskClick={(task: any) =>
              router.push(`/dashboard/tasks/${task.id}`)
            }
          />
        </Box>

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
