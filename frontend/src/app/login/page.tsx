"use client";

if (typeof window !== "undefined") {
  (window as any).__NEXT_DISABLE_HMR__ = true;
}

import styles from "./login.module.css";
import { Box, Button, Typography, Paper } from "@mui/material";
import { useForm } from "react-hook-form";

import InputField from "@/components/InputField";

import { useRouter } from "next/navigation";

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

  const onSubmit = async (data: LoginForm) => {
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
        alert(result.detail || "Login failed");
        return;
      }

      // ✅ Store token
      localStorage.setItem("token", result.access_token);

      // ✅ Redirect
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
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
                  variant="contained"
                  fullWidth
                  disableElevation
                  className={styles.button}
                >
                  Login
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
  );
}
