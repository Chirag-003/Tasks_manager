"use client";

import { useGetTasksQuery, useCreateTaskMutation } from "@/services/api";
import TaskList from "@/components/TaskList";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import DetailedTask from "@/components/DetailedTask";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStatus } from "@/store/slices/filterSlice";

import { Box, Tabs, Tab, Typography, Button } from "@mui/material";

export default function TasksPage() {
  const { data, isLoading, isError } = useGetTasksQuery();
  const [createTask] = useCreateTaskMutation();

  const dispatch = useDispatch();
  const status = useSelector((state: any) => state.filter.status);

  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const handleOpen = () => setOpen(true);
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
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        px: 3,
        py: 1.5,
        boxSizing: "border-box",
      }}
    >
      {/* ✅ HEADER */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Tasks
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Manage and track your tasks
        </Typography>
      </Box>

      {/* ✅ TABS */}
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

      {/* ✅ BOARD */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          mt: 1,
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        <TaskList
          tasks={filteredTasks}
          onTaskClick={(task: any) => {
            setSelectedTask(task); // ✅ click handling already done
          }}
        />
      </Box>

      {/* ✅ FLOAT BUTTON */}
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

      {/* ✅ CREATE DIALOG */}
      <CreateTaskDialog
        open={open}
        onClose={handleClose}
        onCreate={async (formData) => {
          await createTask(formData).unwrap();
        }}
      />

      {/* ✅ SIDEBAR */}
      <DetailedTask task={selectedTask} onClose={() => setSelectedTask(null)} />
    </Box>
  );
}
``;
