"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box,
  Grow,
} from "@mui/material";

import LockResetIcon from "@mui/icons-material/LockReset";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useResetUserPasswordMutation } from "@/services/api";

import InputField from "@/components/common/InputField";
import StatusSnackbar from "@/components/common/StatusSnackbar";

type Props = {
  open: boolean;
  onClose: () => void;
  user: any;
};

const resetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain a special character",
      ),

    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordDialog({ open, onClose, user }: Props) {
  const [resetUserPassword] = useResetUserPasswordMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    if (open) {
      reset({
        new_password: "",
        confirm_password: "",
      });
    }
  }, [open, reset]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetUserPassword({
        userId: user.id,
        data: {
          new_password: data.new_password,
        },
      }).unwrap();

      setSnackbar({
        open: true,
        message: "Password reset successfully",
        severity: "success",
      });

      reset();
      onClose();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message:
          err?.data?.message || err?.data?.detail || "Failed to reset password",
        severity: "error",
      });
    }
  };

  const fields: {
    name: string;
    label: string;
    type: "password";
    required: boolean;
    icon: React.ReactNode;
  }[] = [
    {
      name: "new_password",
      label: "New Password",
      type: "password",
      required: true,
      icon: <LockResetIcon fontSize="small" />,
    },
    {
      name: "confirm_password",
      label: "Confirm Password",
      type: "password",
      required: true,
      icon: <LockResetIcon fontSize="small" />,
    },
  ];

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
        <DialogTitle sx={{ pb: 1 }}>
          <Typography fontWeight={700} fontSize={18}>
            Reset Password
          </Typography>

          <Typography fontSize={13} color="text.secondary">
            Reset password for <strong>{user?.username}</strong>
          </Typography>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ mt: 2 }}>
          <Box
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              border: "1px solid #fdba74",
              bgcolor: "#fff7ed",
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                color: "#9a3412",
              }}
            >
              The user's current password will stop working immediately after
              this reset.
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" gap={2.5}>
            {fields.map((field) => (
              <InputField
                key={field.name}
                name={field.name}
                control={control}
                label={field.label}
                type={field.type}
                icon={field.icon}
                required={field.required}
                errors={errors}
              />
            ))}
          </Box>

          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              bgcolor: "#f8fafc",
            }}
          >
            <Typography fontWeight={600} fontSize={13} mb={1}>
              Password Requirements
            </Typography>

            <Typography fontSize={12} color="text.secondary">
              • At least 8 characters
            </Typography>

            <Typography fontSize={12} color="text.secondary">
              • One uppercase letter
            </Typography>

            <Typography fontSize={12} color="text.secondary">
              • One lowercase letter
            </Typography>

            <Typography fontSize={12} color="text.secondary">
              • One number
            </Typography>

            <Typography fontSize={12} color="text.secondary">
              • One special character
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="warning"
            onClick={handleSubmit(onSubmit)}
            startIcon={<LockResetIcon />}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
            }}
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>

      <StatusSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </>
  );
}
