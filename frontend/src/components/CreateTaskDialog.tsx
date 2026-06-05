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
  Grow,
  Snackbar,
  Alert,
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

  const [userError, setUserError] = useState("");
  const [titleError, setTitleError] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

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
        message: "Task created ✅",
        severity: "success",
      });

      setForm({
        title: "",
        description: "",
        status: "backlog",
        sprint: "",
        users: [],
      });

      setUserError("");
      setTitleError("");

      onClose();
    } catch (err: any) {
      let message = err?.data?.detail || "Failed to create task";

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
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Grow}
        transitionDuration={300}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            transition: "all 0.25s ease",
          },
        }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0,0,0,0.3)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Create Task</DialogTitle>

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
                placeholder="Enter task title"
                error={!!titleError}
                helperText={titleError}
              />
            </Box>

            <Box>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>
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

            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 13, mb: 0.5 }}>Status</Typography>
                <TextField
                  select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  fullWidth
                  SelectProps={{
                    MenuProps: {
                      TransitionProps: {
                        timeout: 250,
                      },
                      PaperProps: {
                        sx: {
                          mt: 1,
                          borderRadius: 2,
                        },
                      },

                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "center",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "center",
                      },
                    },
                  }}
                >
                  <MenuItem value="backlog">Backlog</MenuItem>
                  <MenuItem value="todo">Todo</MenuItem>
                  <MenuItem value="in progress">In Progress</MenuItem>
                  <MenuItem value="in review">In Review</MenuItem>
                  <MenuItem value="qa">QA</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </TextField>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 13, mb: 0.5 }}>Sprint</Typography>

                <TextField
                  name="sprint"
                  value={form.sprint}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Sprint name"
                />
              </Box>
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
          <Button
            sx={{ textTransform: "none", borderRadius: "20px" }}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!form.title.trim() || !!userError}
            sx={{ borderRadius: "20px", px: 3, textTransform: "none" }}
          >
            Create Task
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
