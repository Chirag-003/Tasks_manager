"use client";
import { useForm } from "react-hook-form";
import styles from "./register.module.css";

import InputField from "@/components/common/InputField";
import {
  getPasswordStrength,
  getPasswordStrengthLabel,
} from "@/utils/passwordStrength";

import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  LinearProgress,
} from "@mui/material";

import { useRouter } from "next/navigation";
import { useState } from "react";
import StatusSnackbar from "@/components/common/StatusSnackbar";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Minimum 3 characters required")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscores",
      ),

    email: z.string().email("Enter a valid email"),

    password: z
      .string()
      .min(
        8,
        "Password must be 8+ characters and contain uppercase, lowercase, number and special character",
      )
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
        "Password must be 8+ characters and contain uppercase, lowercase, number and special character",
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const password = watch("password");
  const passwordStrength = getPasswordStrength(password || "");
  const strength = getPasswordStrengthLabel(passwordStrength);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    const { confirmPassword, ...payload } = data;
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      // ✅ artificial delay (important)
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (!res.ok) {
        const errorMessage =
          typeof result.message === "string"
            ? result.message
            : result.message?.msg || "Register failed";

        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error",
        });

        setLoading(false);
        return;
      }

      setSnackbar({
        open: true,
        message: "Account created successfully",
        severity: "success",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch {
      setSnackbar({
        open: true,
        message: "Something went wrong",
        severity: "error",
      });
    }

    setLoading(false);
  };

  return (
    <>
      <Box className={styles.container}>
        <div className={styles.card}>
          <Paper elevation={0} className={styles.paperInner}>
            {/* ✅ LEFT SIDE */}
            <Box className={styles.leftSection}>
              <div className={styles.brand}>TaskFlow</div>

              <div className={styles.heroTitle}>
                Join and start organizing your work
              </div>

              <div className={styles.heroSubtitle}>
                Create your account and take control of your productivity.
              </div>
            </Box>

            {/* ✅ RIGHT SIDE */}
            <Box className={styles.rightSection}>
              <div className={styles.title}>Create Account</div>

              <div className={styles.subtitle}>Sign up to get started</div>

              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <Box className={styles.formInner}>
                  <InputField
                    name="username"
                    label="Username*"
                    control={control}
                    errors={errors}
                    type="text"
                  />

                  <InputField
                    name="email"
                    label="Email*"
                    control={control}
                    errors={errors}
                    type="text"
                  />
                  <Box>
                    <InputField
                      name="password"
                      label="Password*"
                      control={control}
                      errors={errors}
                      type="password"
                    />

                    {password && (
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        sx={{ mt: 0.5, mb: 0.5 }}
                      >
                        <Box
                          sx={{
                            flex: 1,
                            overflow: "hidden",
                            maxHeight: password ? "20px" : "0px",
                            opacity: password ? 1 : 0,
                            transform: password
                              ? "translateY(0)"
                              : "translateY(-6px)",
                            transition:
                              "max-height 400ms cubic-bezier(0.22, 1, 0.36, 1), opacity 350ms ease, transform 350ms ease",
                            mt: password ? 0.5 : 0,
                            mb: password ? 0.5 : 0,
                          }}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={(passwordStrength / 7) * 100}
                            sx={{
                              height: 3,
                              borderRadius: 999,
                              backgroundColor: "#e5e7eb",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: strength.color,
                                transition:
                                  "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                  <InputField
                    name="confirmPassword"
                    label="Confirm Password*"
                    control={control}
                    errors={errors}
                    type="password"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disableElevation
                    disabled={loading}
                    className={styles.button}
                  >
                    {loading ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={16} sx={{ color: "white" }} />
                        Creating...
                      </Box>
                    ) : (
                      "Register"
                    )}
                  </Button>
                </Box>
              </form>

              <div className={styles.footerText}>
                Already have an account?{" "}
                <span
                  className={styles.link}
                  onClick={() => router.push("/login")}
                >
                  Login
                </span>
              </div>
            </Box>
          </Paper>
        </div>
      </Box>
      <StatusSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
}
