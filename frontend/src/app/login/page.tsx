"use client";

if (typeof window !== "undefined") {
  (window as any).__NEXT_DISABLE_HMR__ = true;
}

import styles from "./login.module.css";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";

import InputField from "@/components/InputField";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import StatusSnackbar from "@/components/StatusSnackbar";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status");

    if (status === "logout") {
      setSnackbar({
        open: true,
        message: "Logged out successfully",
        severity: "success",
      });
      router.replace("/login");
    }
  }, [searchParams]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setSnackbar({
          open: true,
          message: "Login failed",
          severity: "error",
        });

        setLoading(false);
        return;
      }

      localStorage.setItem("token", result.access_token);

      router.push("/dashboard?status=login");

      // ✅ DO NOT setLoading(false) here
    } catch {
      setSnackbar({
        open: true,
        message: "Something went wrong",
        severity: "error",
      });

      setLoading(false);
    }
  };
  return (
    <>
      <Box className={styles.container}>
        <div className={styles.card}>
          <Paper elevation={0} className={styles.paperInner}>
            {/* ✅ LEFT SIDE */}
            <Box className={styles.leftSection}>
              <Typography component="div" className={styles.brand}>
                TaskFlow
              </Typography>

              <Typography component="div" className={styles.heroTitle}>
                Stay organized. Stay productive.
              </Typography>

              <Typography component="div" className={styles.heroSubtitle}>
                Manage your tasks and workflow in one powerful platform.
              </Typography>
            </Box>

            {/* ✅ RIGHT SIDE */}
            <Box className={styles.rightSection}>
              <Typography component="div" className={styles.title}>
                Welcome back
              </Typography>

              <Typography component="div" className={styles.subtitle}>
                Login to your account
              </Typography>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Box className={styles.formInner}>
                  <InputField
                    name="email"
                    label="Email*"
                    control={control}
                    errors={errors}
                    type="text"
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    }}
                  />
                  <InputField
                    name="password"
                    label="Password*"
                    control={control}
                    errors={errors}
                    type="password"
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Minimum 6 characters required",
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    className={styles.button}
                  >
                    {loading ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={16} sx={{ color: "white" }} />
                        Logging in...
                      </Box>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </Box>
              </form>

              <Typography component="div" className={styles.footerText}>
                Don't have an account?{" "}
                <span
                  className={styles.link}
                  onClick={() => router.push("/register")}
                >
                  Register
                </span>
              </Typography>
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
