"use client";

import { useGetTasksQuery, useCreateTaskMutation } from "@/services/api";
import TaskList from "@/components/TaskList";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import DetailedTask from "@/components/DetailedTask";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStatus } from "@/store/slices/filterSlice";

import { Box, Tabs, Tab, Typography, Button, Paper } from "@mui/material";

export default function TasksPage() {
  const { data, isLoading, isError } = useGetTasksQuery();
  const [createTask] = useCreateTaskMutation();

  const dispatch = useDispatch();
  const status = useSelector((state: any) => state.filter.status);

  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const handleOpen = (e: any) => {
    e.currentTarget.blur(); // ✅ prevent focus warning
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching tasks</p>;

  const filteredTasks =
    status === "all"
      ? data || []
      : (data || []).filter((t: any) => t.status === status);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* ✅ LEFT SIDE */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          px: 3,
          py: 1.5,
          backgroundColor: "#f8fafc",
        }}
      >
        {/* HEADER */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Tasks
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Manage and track your tasks
          </Typography>
        </Box>

        {/* TABS */}
        <Tabs
          value={status}
          onChange={(e, newValue) => dispatch(setStatus(newValue))}
          sx={{ borderBottom: "1px solid #e0e0e0" }}
        >
          <Tab label="All" value="all" />
          <Tab label="Backlog" value="backlog" />
          <Tab label="Todo" value="todo" />
          <Tab label="In Progress" value="in_progress" />
          <Tab label="Completed" value="completed" />
        </Tabs>

        {/* BOARD */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            mt: 1,
            overflowX: "auto",
            overflowY: "hidden",
            pr: selectedTask ? 1 : 0, // ✅ space before sidebar
          }}
        >
          <TaskList
            tasks={filteredTasks}
            onTaskClick={(task: any) => setSelectedTask(task)}
          />
        </Box>
      </Box>

      {/* ✅ RIGHT SIDEBAR */}
      {selectedTask && (
        <Paper
          elevation={4}
          sx={{
            width: 420,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            ml: 1,
            backgroundColor: "#ffffff",

            // ✅ CONTROL VISIBILITY WITH TRANSFORM
            transform: selectedTask ? "translateX(0)" : "translateX(100%)",

            // ✅ SMOOTH ANIMATION
            transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",

            // ✅ HIDE WHEN CLOSED (prevents interaction)
            pointerEvents: selectedTask ? "auto" : "none",
          }}
        >
          <DetailedTask
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        </Paper>
      )}

      {/* ✅ FLOAT BUTTON (UPDATED ✅) */}
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          position: "fixed",
          bottom: 30,

          // ✅ DYNAMIC POSITION
          right: selectedTask ? 460 : 30,

          borderRadius: "24px",
          px: 3,
          textTransform: "none",

          // ✅ SMOOTH MOVE
          transition: "right 0.2s ease",

          // ✅ OPTIONAL HOVER POLISH
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          },
        }}
      >
        Create Task
      </Button>

      {/* ✅ CREATE TASK DIALOG */}
      <CreateTaskDialog
        open={open}
        onClose={handleClose}
        onCreate={async (formData) => {
          await createTask(formData).unwrap();
        }}
      />
    </Box>
  );
}
