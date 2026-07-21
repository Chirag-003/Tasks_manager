"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Typography,
  Box,
  Grow,
  Avatar,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import GroupsIcon from "@mui/icons-material/Groups";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import LockResetIcon from "@mui/icons-material/LockReset";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SecurityIcon from "@mui/icons-material/Security";

import { Fade } from "@mui/material";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useUpdateUserMutation,
  useResetUserPasswordMutation,
} from "@/services/api";

import InputField from "@/components/common/InputField";
import StatusSnackbar from "@/components/common/StatusSnackbar";

import { Tabs, Tab } from "@mui/material";
import { flightRouterStateSchema } from "next/dist/server/app-render/types";

type Props = {
  open: boolean;
  onClose: () => void;
  user: any;
};

const editUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(255, "Username is too long"),

  email: z.string().trim().email("Invalid email address"),

  team_name: z.string().optional(),
});

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

type EditUserFormData = z.infer<typeof editUserSchema>;

export default function EditUserDialog({ open, onClose, user }: Props) {
  const [updateUser] = useUpdateUserMutation();
  const [resetUserPassword] = useResetUserPasswordMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      username: "",
      email: "",
      team_name: "",
    },
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
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

  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  useEffect(() => {
    if (open && user) {
      setActiveTab("profile");

      reset({
        username: user.username || "",
        email: user.email || "",
        team_name: user.team_name || "",
      });
      resetPasswordForm({
        new_password: "",
        confirm_password: "",
      });
    }
  }, [open, user, reset]);

  const onSubmit = async (data: EditUserFormData) => {
    try {
      await updateUser({
        userId: user.id,
        data,
      }).unwrap();

      setSnackbar({
        open: true,
        message: "User updated successfully",
        severity: "success",
      });

      onClose();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message:
          err?.data?.message || err?.data?.detail || "Failed to update user",
        severity: "error",
      });
    }
  };

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    try {
      await resetUserPassword({
        userId: user.id,
        data: {
          new_password: data.new_password,
        },
      }).unwrap();

      resetPasswordForm();

      setSnackbar({
        open: true,
        message: "Password reset successfully",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.data?.detail || "Failed to reset password",
        severity: "error",
      });
    }
  };

  const TAB_CONFIG = {
    profile: {
      label: "Profile",
      icon: <PersonOutlineIcon sx={{ fontSize: 16 }} />,
    },

    security: {
      label: "Security",
      icon: <SecurityIcon sx={{ fontSize: 16 }} />,
    },
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
        <DialogTitle sx={{ pb: 1 }}>
          <Typography fontWeight={700} fontSize={18}>
            Edit User
          </Typography>

          <Typography fontSize={13} color="text.secondary">
            Update user information
          </Typography>
        </DialogTitle>

        <Divider />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            px: 3,
            pt: 2,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          {(["profile", "security"] as const).map((tab) => {
            const isActive = activeTab === tab;

            return (
              <Box
                key={tab}
                onClick={() => setActiveTab(tab)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  position: "relative",
                  cursor: "pointer",
                  pb: 1.25,
                  px: 0.5,

                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  minWidth: 90,

                  color: isActive ? "#2563eb" : "#64748b",

                  transition: "all 0.2s ease",

                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: isActive ? "100%" : 0,
                    height: "2px",
                    backgroundColor: "#2563eb",
                    transition: "all 0.25s ease",
                  },
                }}
              >
                {TAB_CONFIG[tab].icon}
                {TAB_CONFIG[tab].label}
              </Box>
            );
          })}
        </Box>

        <DialogContent sx={{ mt: 2, height: 420 }}>
          <Fade in={activeTab === "profile"} timeout={350} unmountOnExit>
            <Box>
              {activeTab === "profile" && (
                <Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 3 }}
                  >
                    <Avatar
                      sx={{
                        width: 160,
                        height: 160,
                        bgcolor: "#2563eb",
                        fontSize: 100,
                        fontWeight: 700,
                      }}
                    >
                      {user?.username?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Box>

                  <Box display="flex" flexDirection="column" gap={2.5}>
                    <InputField
                      name="username"
                      control={control}
                      label="Username"
                      type="text"
                      icon={<PersonIcon />}
                      errors={errors}
                      required
                    />

                    <InputField
                      name="email"
                      control={control}
                      label="Email"
                      type="text"
                      icon={<EmailIcon />}
                      errors={errors}
                      required
                    />

                    <InputField
                      name="team_name"
                      control={control}
                      label="Team Name"
                      type="text"
                      icon={<GroupsIcon />}
                      errors={errors}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Fade>

          <Fade in={activeTab === "security"} timeout={350} unmountOnExit>
            <Box>
              {activeTab === "security" && (
                <>
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
                      The user's current password will stop working immediately
                      after this reset.
                    </Typography>
                  </Box>

                  <Box display="flex" flexDirection="column" gap={2.5}>
                    <InputField
                      name="new_password"
                      control={passwordControl}
                      label="New Password"
                      type="password"
                      icon={<PersonIcon />}
                      errors={passwordErrors}
                      required
                    />

                    <InputField
                      name="confirm_password"
                      control={passwordControl}
                      label="Confirm Password"
                      type="password"
                      icon={<PersonIcon />}
                      errors={passwordErrors}
                      required
                    />
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

                    <Typography fontSize={12}>
                      • At least 8 characters
                    </Typography>

                    <Typography fontSize={12}>
                      • One uppercase letter
                    </Typography>

                    <Typography fontSize={12}>
                      • One lowercase letter
                    </Typography>

                    <Typography fontSize={12}>• One number</Typography>

                    <Typography fontSize={12}>
                      • One special character
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Fade>
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

          {activeTab === "profile" && (
            <Button
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              onClick={handleSubmit(onSubmit)}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 3,
                minWidth: 120,
              }}
            >
              Save
            </Button>
          )}
          {activeTab === "security" && (
            <Button
              variant="contained"
              startIcon={<LockResetIcon />}
              color="warning"
              onClick={handlePasswordSubmit(handleResetPassword)}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 3,
                minWidth: 120,
              }}
            >
              Reset
            </Button>
          )}
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
