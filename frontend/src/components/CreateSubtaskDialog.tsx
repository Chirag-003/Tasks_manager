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

// ✅ NEW IMPORTS
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ ZOD SCHEMA
const subtaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.string(),
  users: z.array(z.number()).optional(),
});

type SubtaskFormData = z.infer<typeof subtaskSchema>;

export default function CreateSubtaskDialog({ open, onClose, onCreate }: any) {
  // ✅ REPLACED useState FORM
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SubtaskFormData>({
    resolver: zodResolver(subtaskSchema),
    defaultValues: {
      title: "",
      status: "backlog",
      users: [],
    },
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [userError, setUserError] = useState("");
  const [titleError, setTitleError] = useState("");

  // ✅ USERS HANDLING (CONNECTED TO RHF)
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
  const onSubmit = async (data: SubtaskFormData) => {
    if (userError) return;

    try {
      await onCreate(data);

      setSnackbar({
        open: true,
        message: "Subtask created ✅",
        severity: "success",
      });

      reset(); // ✅ replaces manual reset
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
                    placeholder="Enter subtask title"
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

            {/* ✅ STATUS */}
            <Box>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                Status <span style={{ color: "red" }}>*</span>
              </Typography>

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

            {/* ✅ USERS */}
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
            onClick={handleSubmit(onSubmit)} // ✅ UPDATED
            disabled={!!userError}
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
