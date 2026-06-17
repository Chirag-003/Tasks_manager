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
  InputAdornment,
} from "@mui/material";

import { useState, useEffect } from "react";

import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import FlagIcon from "@mui/icons-material/Flag";
import TimelineIcon from "@mui/icons-material/Timeline";
import GroupIcon from "@mui/icons-material/Group";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useGetUsersQuery } from "@/services/api";

import InputField from "./InputField";

// ✅ TYPES
type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: any) => Promise<void>;
  defaultStatus?: string; // ✅ already added earlier
};

// ✅ SCHEMA
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.string(),
  sprint: z.string().optional(),
  users: z.array(z.number()).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function CreateTaskDialog({
  open,
  onClose,
  onCreate,
  defaultStatus,
}: Props) {
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

  // ✅✅ FIX 1: Proper reset when dialog opens
  useEffect(() => {
    if (open) {
      reset({
        title: "",
        description: "",
        status: defaultStatus || "backlog",
        sprint: "",
        users: [],
      });

      setUserError("");
      setTitleError("");
    }
  }, [open, defaultStatus, reset]);

  // ✅✅ FIX 2: auto clear error after 3s
  useEffect(() => {
    if (!titleError) return;

    const timer = setTimeout(() => {
      setTitleError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [titleError]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const { data: users = [] } = useGetUsersQuery();

  const getUserNameById = (id: number) => {
    const user = users.find((u: any) => u.id === id);
    return user?.username || "";
  };

  const onSubmit = async (data: TaskFormData) => {
    if (userError) return;

    try {
      await onCreate(data);

      setSnackbar({
        open: true,
        message: "Task created ✅",
        severity: "success",
      });

      reset();
      setUserError("");
      setTitleError("");

      onClose();
    } catch (err: any) {
      let message = err?.data?.detail || "Failed to create task";

      if (Array.isArray(message)) message = message[0];

      if (typeof message === "string") {
        message = message.replace(/^\d+:\s*/, "").trim();
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
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0px 20px 50px rgba(0,0,0,0.15)",
          },
        }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0,0,0,0.25)",
          },
        }}
      >
        {/* ✅ HEADER */}
        <DialogTitle sx={{ pb: 1 }}>
          <Typography fontWeight={700} fontSize={18}>
            Create Task
          </Typography>
          <Typography fontSize={13} color="text.secondary">
            Add details for your task
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
              required
              errors={errors}
              extraError={titleError}
              onChangeExtra={() => setTitleError("")}
              icon={<TitleIcon fontSize="small" />}
            />
            {/* ✅ DESCRIPTION */}
            <InputField
              name="description"
              control={control}
              label="Description"
              type="textarea"
              rows={3}
              errors={errors}
              icon={<DescriptionIcon fontSize="small" />}
            />

            <Box display="flex" gap={2}>
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

              <InputField
                name="sprint"
                control={control}
                label="Sprint"
                errors={errors}
                icon={<TimelineIcon fontSize="small" />}
              />
            </Box>
            {/* ✅ USERS */}
            <Controller
              name="users"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Users"
                  fullWidth
                  size="small"
                  value={field.value || []}
                  onChange={field.onChange}
                  SelectProps={{
                    multiple: true,
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          maxHeight: 260,
                          mt: 1,
                          borderRadius: 2,
                          p: 1,
                        },
                      },
                      MenuListProps: {
                        sx: {
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 1,
                        },
                      },
                    },
                    renderValue: (selected) =>
                      (selected as number[]).map(getUserNameById).join(", "),
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GroupIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    backgroundColor: "#f9fafb",
                    borderRadius: 2,
                  }}
                >
                  {users.map((user: any) => (
                    <MenuItem
                      key={user.id}
                      value={user.id}
                      sx={{
                        borderRadius: 2,
                        textAlign: "center",
                        fontSize: 13,
                        "&:hover": {
                          backgroundColor: "#f3f4f6",
                        },
                      }}
                    >
                      {user.username}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
        </DialogContent>

        {/* ✅ ACTIONS */}
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} sx={{ textTransform: "none" }}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={!!userError}
            sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
          >
            Create Task
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
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
