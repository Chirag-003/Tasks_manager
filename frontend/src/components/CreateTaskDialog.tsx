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

// ✅ NEW IMPORTS
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: any) => Promise<void>;
};

// ✅ ZOD SCHEMA
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.string(),
  sprint: z.string().optional(),
  users: z.array(z.number()).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function CreateTaskDialog({ open, onClose, onCreate }: Props) {
  // ✅ REPLACED useState form WITH RHF
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "backlog",
      sprint: "",
      users: [],
    },
  });

  const [userError, setUserError] = useState("");
  const [titleError, setTitleError] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // ✅ USERS FIELD HANDLING (KEPT, just wired to RHF)
  const handleUsersChange = (e: any) => {
    const value = e.target.value;

    if (!value) {
      setValue("users", []);
      setUserError("");
      return;
    }

    const ids = value.split(",");
    const invalid = ids.some((id: string) => isNaN(Number(id.trim())));

    if (invalid) {
      setUserError("Enter valid numeric user IDs (e.g. 1,2,3)");
    } else {
      setUserError("");
      setValue(
        "users",
        ids.map((id: string) => Number(id.trim())),
      );
    }
  };

  // ✅ UPDATED SUBMIT
  const onSubmit = async (data: TaskFormData) => {
    if (userError) return;

    try {
      await onCreate(data);

      setSnackbar({
        open: true,
        message: "Task created ✅",
        severity: "success",
      });

      reset(); // ✅ replaces manual reset
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
            {/* ✅ TITLE */}
            <Box>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                Title <span style={{ color: "red" }}>*</span>
              </Typography>

              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="Enter task title"
                    error={!!errors.title || !!titleError}
                    helperText={errors.title?.message || titleError}
                    onChange={(e) => {
                      field.onChange(e);
                      setTitleError("");
                    }}
                  />
                )}
              />
            </Box>

            {/* DESCRIPTION */}
            <Box>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                Description
              </Typography>

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={3}
                    placeholder="Describe the task..."
                  />
                )}
              />
            </Box>

            {/* STATUS & SPRINT */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 13, mb: 0.5 }}>Status</Typography>

                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <TextField select {...field} fullWidth>
                      <MenuItem value="backlog">Backlog</MenuItem>
                      <MenuItem value="todo">Todo</MenuItem>
                      <MenuItem value="in progress">In Progress</MenuItem>
                      <MenuItem value="in review">In Review</MenuItem>
                      <MenuItem value="qa">QA</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </TextField>
                  )}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 13, mb: 0.5 }}>Sprint</Typography>

                <Controller
                  name="sprint"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} fullWidth placeholder="Sprint name" />
                  )}
                />
              </Box>
            </Box>

            {/* USERS */}
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
            onClick={handleSubmit(onSubmit)} // ✅ UPDATED
            disabled={!!userError}
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
