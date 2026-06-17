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
  InputAdornment,
} from "@mui/material";

import { useState } from "react";

import TitleIcon from "@mui/icons-material/Title";
import FlagIcon from "@mui/icons-material/Flag";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useGetUsersQuery } from "@/services/api";

import InputField from "./InputField";
import UserField from "./UserField";

// ✅ SCHEMA
const subtaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.string(),
  users: z.array(z.number()).optional(),
});

type SubtaskFormData = z.infer<typeof subtaskSchema>;

export default function CreateSubtaskDialog({ open, onClose, onCreate }: any) {
  const {
    control,
    handleSubmit,
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

  const { data: users = [] } = useGetUsersQuery();

  // ✅ map ID -> username
  const getUserNameById = (id: number) => {
    const user = users.find((u: any) => u.id === id);
    return user?.username || "";
  };

  // ✅ SUBMIT
  const onSubmit = async (data: SubtaskFormData) => {
    if (userError) return;

    try {
      await onCreate(data);

      setSnackbar({
        open: true,
        message: "Subtask created ✅",
        severity: "success",
      });

      reset();
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
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0px 20px 50px rgba(0,0,0,0.15)",
          },
        }}
      >
        {/* ✅ HEADER */}
        <DialogTitle sx={{ pb: 1 }}>
          <Typography fontWeight={700} fontSize={18}>
            Create Subtask
          </Typography>
          <Typography fontSize={13} color="text.secondary">
            Add details for your subtask
          </Typography>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ mt: 2 }}>
          <Box display="flex" flexDirection="column" gap={2.5}>
            {/* ✅ TITLE */}
            <InputField
              name="title"
              control={control}
              label="Title"
              errors={errors}
              extraError={titleError}
              onChangeExtra={() => setTitleError("")}
              icon={<TitleIcon fontSize="small" />}
            />

            {/* ✅ STATUS */}

            <InputField
              name="status"
              control={control}
              label="Status"
              type="select"
              errors={errors}
              icon={<FlagIcon fontSize="small" />}
              options={[
                { label: "Backlog", value: "backlog" },
                { label: "Todo", value: "todo" },
                { label: "In Progress", value: "in progress" },
                { label: "In Review", value: "in review" },
                { label: "QA", value: "qa" },
                { label: "Completed", value: "completed" },
              ]}
            />

            {/* ✅ USERS (SAME METHOD AS TASK) */}
            <UserField name="users" control={control} />
          </Box>
        </DialogContent>

        {/* ✅ ACTIONS */}
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button sx={{ textTransform: "none" }} onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={!!userError}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
