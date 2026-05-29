"use client";

import { useGetTasksQuery, useCreateTaskMutation } from "@/services/api";
import TaskList from "@/components/TaskList";
import { useState } from "react";

import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

export default function TasksPage() {
  const { data, isLoading, isError, refetch } = useGetTasksQuery();
  const [createTask] = useCreateTaskMutation();

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    sprint: "",
    users: [] as number[],
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUsersChange = (e: any) => {
    const ids = e.target.value
      .split(",")
      .map((id: string) => Number(id.trim()))
      .filter((id: number) => id > 0);

    setForm({
      ...form,
      users: ids,
    });
  };

  const handleSubmit = async () => {
    try {
      await createTask(form).unwrap();
      alert("✅ Task created");
      refetch();

      setForm({
        title: "",
        description: "",
        status: "todo",
        sprint: "",
        users: [],
      });

      handleClose();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create task");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching tasks</p>;

  return (
    <div>
      <h1>Tasks</h1>

      {/* ✅ BOARD */}
      <TaskList tasks={data || []} />

      {/* ✅ FLOATING BUTTON */}
      <Fab
        color="primary"
        onClick={handleOpen}
        sx={{
          position: "fixed",
          bottom: 30,
          right: 30,
        }}
      >
        +
      </Fab>

      {/* ✅ DIALOG */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create Task</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Sprint"
            name="sprint"
            value={form.sprint}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="dense"
            label="User IDs (1,2)"
            onChange={handleUsersChange}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>

          <Button variant="contained" onClick={handleSubmit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
