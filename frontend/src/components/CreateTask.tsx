"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Divider,
  Box,
  Typography,
  MenuItem,
  Fade,
  Grow,
} from "@mui/material";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: any) => Promise<void>;
};

export default function CreateTaskDialog({ open, onClose, onCreate }: Props) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "backlog",
    sprint: "",
    users: [] as number[],
  });

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
      await onCreate(form);

      setForm({
        title: "",
        description: "",
        status: "backlog",
        sprint: "",
        users: [],
      });

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      // ✅ TRANSITION (smooth open/close)
      TransitionComponent={Grow}
      transitionDuration={300}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          transition: "all 0.25s ease", // ✅ smooth feel
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(8px)", // ✅ blur effect
          backgroundColor: "rgba(0,0,0,0.3)", // ✅ overlay
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>Create Task</DialogTitle>

      <Divider />

      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* TITLE */}
          <Box>
            <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
              Title
            </Typography>
            <TextField
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              placeholder="Enter task title"
            />
          </Box>

          {/* DESCRIPTION */}
          <Box>
            <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
              Description
            </Typography>
            <TextField
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={3}
              placeholder="Describe the task..."
            />
          </Box>

          {/* STATUS + SPRINT */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}
              >
                Status
              </Typography>
              <TextField
                select
                name="status"
                value={form.status}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="backlog">Backlog</MenuItem>
                <MenuItem value="todo">Todo</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="in_review">In Review</MenuItem>
                <MenuItem value="qa">QA</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}
              >
                Sprint
              </Typography>
              <TextField
                name="sprint"
                value={form.sprint}
                onChange={handleChange}
                fullWidth
                placeholder="Sprint name"
              />
            </Box>
          </Box>

          {/* USERS */}
          <Box>
            <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
              Users
            </Typography>
            <TextField
              onChange={handleUsersChange}
              fullWidth
              placeholder="Enter user IDs (1,2)"
            />
          </Box>
        </Box>
      </DialogContent>

      {/* ACTIONS */}
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            px: 3,
          }}
        >
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
}
