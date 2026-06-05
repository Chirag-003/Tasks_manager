"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  MenuItem,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";

export default function CreateSubtaskDialog({ open, onClose, onCreate }: any) {
  const [form, setForm] = useState({
    title: "",
    status: "backlog",
    users: [] as number[],
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [userError, setUserError] = useState("");
  const [titleError, setTitleError] = useState("");

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUsersChange = (e: any) => {
    const value = e.target.value;

    if (!value) {
      setForm({ ...form, users: [] });
      setUserError("");
      return;
    }

    const ids = value.split(",");

    const invalid = ids.some((id: string) => isNaN(Number(id.trim())));

    if (invalid) {
      setUserError("Enter valid numeric user IDs (e.g. 1,2,3)");
    } else {
      setUserError("");
      setForm({
        ...form,
        users: ids.map((id: string) => Number(id.trim())),
      });
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || userError) return;

    try {
      await onCreate(form);

      setSnackbar({
        open: true,
        message: "Subtask created ✅",
        severity: "success",
      });

      setForm({
        title: "",
        status: "backlog",
        users: [],
      });

      setUserError("");
      setTitleError("");

      onClose();
    } catch (err: any) {
      let message = err?.data?.detail || "Failed to create subtask";

      if (Array.isArray(message)) {
        message = message[0];
      }

      if (typeof message === "string") {
        message = message
          .replace(/^\d+:\s*/, "")
          .replace(/\(\d+\)/g, "")
          .trim();
      }

      setTitleError(message);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 600 }}>Create Subtask</DialogTitle>

        <Divider />

        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                Title <span style={{ color: "red" }}>*</span>
              </Typography>

              <TextField
                name="title"
                value={form.title}
                onChange={(e) => {
                  handleChange(e);
                  setTitleError("");
                }}
                fullWidth
                placeholder="Enter subtask title"
                error={!!titleError}
                helperText={titleError}
              />
            </Box>

            <Box>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                Status <span style={{ color: "red" }}>*</span>
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
                <MenuItem value="in progress">In Progress</MenuItem>
                <MenuItem value="in review">In Review</MenuItem>
                <MenuItem value="qa">QA</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
            </Box>

            <Box>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>Users</Typography>

              <TextField
                fullWidth
                placeholder="Enter user IDs (1,2)"
                onChange={handleUsersChange}
                error={!!userError}
                helperText={userError}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button sx={{ textTransform: "none" }} onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!form.title.trim() || !!userError}
            sx={{ textTransform: "none" }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
