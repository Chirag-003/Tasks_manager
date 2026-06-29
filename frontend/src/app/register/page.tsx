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
                  rules={{
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Minimum 3 characters required",
                    },
                  }}
                />

                <InputField
                  name="email"
                  label="Email*"
                  control={control}
                  errors={errors}
                  type="text"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email (e.g. name@example.com)",
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
                      message: "Minimum 6 characters",
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
                  Register
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
  );
}
