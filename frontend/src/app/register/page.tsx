"use client";
import { useForm } from "react-hook-form";
import styles from "./register.module.css";

import InputField from "@/components/InputField";

import { Box, Paper, Typography, Button } from "@mui/material";

import { useRouter } from "next/navigation";

type RegisterForm = {
  username: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();
  const router = useRouter();
  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.detail || "Register Failed");
        return;
      }
      alert("account created successfully");

      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("something went wrong");
    }
  };

  return (
    <Box className={styles.container}>
      <Paper elevation={3} className={styles.card}>
        {/* ✅ HEADER */}
        <Typography className={styles.title}>Register</Typography>

        <Typography className={styles.subtitle}>
          Create your account!
        </Typography>

        {/* ✅ FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Box className={styles.formInner}>
            {/* ✅ USERNAME */}
            <InputField
              name="username"
              label="Username"
              control={control}
              errors={errors}
              required
              type="text"
            />

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
              Register
            </Button>
          </Box>
        </form>

        {/* ✅ FOOTER LINK */}
        <Typography className={styles.footerText}>
          Already have an account?{" "}
          <span className={styles.link} onClick={() => router.push("/login")}>
            Login
          </span>
        </Typography>
      </Paper>
    </Box>
  );
}
