"use client";

import { Box, Typography, Card, CardContent } from "@mui/material";
import { useGetUsersQuery, useGetTasksQuery } from "@/services/api";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { hasToken } from "@/utils/auth";
import StatusSnackbar from "@/components/common/StatusSnackbar";
import { STATUS_CONFIG } from "@/constants/status";
import UILoader from "@/components/common/Loader";

const STATUS_COLORS = {
  backlog: "#f59e0b",
  todo: "#64748b",
  in_progress: "#2563eb",
  in_review: "#06b6d4",
  qa: "#8b5cf6",
  completed: "#22c55e",
};

export default function DashboardPage() {
  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useGetUsersQuery(undefined, {
    skip: !hasToken(),
  });

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery(
    {
      page_size: 2000,
    },
    {
      skip: !hasToken(),
    },
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    const status = searchParams.get("status");

    if (status === "login") {
      setSnackbar({
        open: true,
        message: "Login successful",
        severity: "success",
      });

      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  if (usersError || tasksError) {
    return <Typography color="error">Failed to load dashboard data</Typography>;
  }

  if (!users || !tasks || usersLoading || tasksLoading) {
    return <UILoader type="subtask" />;
  }

  const taskList = tasks.results ?? [];

  const totalUsers = users.length;

  const totalTasks = taskList.length;

  const ALL_STATUSES = Object.keys(STATUS_CONFIG);

  const statusCount = ALL_STATUSES.reduce(
    (acc: Record<string, number>, status) => {
      acc[status] = taskList.filter(
        (task: any) => task.status === status,
      ).length;

      return acc;
    },
    {},
  );

  return (
    <>
      <Box
        sx={{
          height: "100%",
          overflowY: "auto",
          p: 4,
          pb: 6,
          backgroundColor: "#f8fafc",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              color: "#0f172a",
            }}
          >
            Dashboard
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              fontSize: 14,
            }}
          >
            Overview of users, tasks and project progress
          </Typography>
        </Box>

        {/* OVERVIEW */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(240px, 320px))",
            },
            gap: 2,
            mb: 4,
          }}
        >
          <DashboardCard
            label="Total Users"
            value={totalUsers}
            color="#2563eb"
          />

          <DashboardCard
            label="Total Tasks"
            value={totalTasks}
            color="#22c55e"
          />
        </Box>

        {/* STATUS SECTION */}
        <Box
          sx={{
            p: 3,
            borderRadius: 4,
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              mb: 3,
              fontSize: 18,
              color: "#0f172a",
            }}
          >
            Tasks by Status
          </Typography>

          <GridSection>
            {Object.entries(STATUS_CONFIG).map(([status, config]) => {
              const count = statusCount[status];

              return (
                <DashboardCard
                  key={status}
                  label={config.label}
                  value={count}
                  color={STATUS_COLORS[status as keyof typeof STATUS_COLORS]}
                />
              );
            })}
          </GridSection>
        </Box>
      </Box>

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

function GridSection({ children }: any) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 2,
      }}
    >
      {children}
    </Box>
  );
}

function DashboardCard({
  label,
  value,
  color = "#2563eb",
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <Card
      sx={{
        height: 120,
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
        transition: "all 0.2s ease",

        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
        },
      }}
    >
      <Box
        sx={{
          height: 4,
          bgcolor: color,
        }}
      />

      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            color: "#64748b",
            fontSize: 13,
            fontWeight: 500,
            mb: 1,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: 34,
            fontWeight: 700,
            lineHeight: 1,
            color: "#0f172a",
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
