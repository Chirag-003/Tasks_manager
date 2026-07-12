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

import { useDispatch } from "react-redux";
import { api } from "@/services/api";

import InputField from "@/components/common/InputField";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import StatusSnackbar from "@/components/common/StatusSnackbar";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useGetCurrentUserQuery } from "@/services/api";
import { hasToken } from "@/utils/auth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),

  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const dispatch = useDispatch();

  const { data: currentUser, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !hasToken(),
  });

  useEffect(() => {
    if (currentUser) {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);

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
          message: result.message || "Login failed",
          severity: "error",
        });

        setLoading(false);
        return;
      }

      localStorage.setItem("access_token", result.access_token);

      localStorage.setItem("refresh_token", result.refresh_token);

      dispatch(api.util.resetApiState());

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

  if (hasToken() && isLoading) {
    return <CircularProgress />;
  }

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
                  />
                  <InputField
                    name="password"
                    label="Password*"
                    control={control}
                    errors={errors}
                    type="password"
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
