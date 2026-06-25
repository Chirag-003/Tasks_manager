"use client";
import styles from "./login.module.css";
import { Box, Button, Typography, Paper } from "@mui/material";
import { useForm } from "react-hook-form";

import InputField from "@/components/InputField";

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
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <Box className={styles.container}>
      <Paper elevation={3} className={styles.card}>
        {/* ✅ HEADER */}
        <Typography className={styles.title}>Login</Typography>

        <Typography className={styles.subtitle}>
          Enter your credentials to continue
        </Typography>

        {/* ✅ FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Box className={styles.formInner}>
            {/* ✅ EMAIL */}
            <InputField
              name="email"
              label="Email"
              control={control}
              errors={errors}
              required
              type="text"
            />

            {/* ✅ PASSWORD */}
            <InputField
              name="password"
              label="Password"
              control={control}
              errors={errors}
              required
              type="password"
            />

            {/* ✅ BUTTON */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className={styles.button}
            >
              Login
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
