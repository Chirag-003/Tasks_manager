"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useGetUsersQuery, useGetTasksQuery } from "@/services/api";

import { useSearchParams, useRouter } from "next/navigation"; // ✅ added router
import { useEffect, useState } from "react";
import StatusSnackbar from "@/components/common/StatusSnackbar";
import { hasToken } from "@/utils/auth";

export default function DashboardPage() {
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery(
    undefined,
    {
      skip: !hasToken(),
    },
  );
  const { data: tasks = [], isLoading: tasksLoading } = useGetTasksQuery(
    {
      page_size: 2000,
    },
    {
      skip: !hasToken(),
    },
  );

  const searchParams = useSearchParams();
  const router = useRouter(); // ✅ added

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

      router.replace("/dashboard"); // ✅ added (clean URL)
    }
  }, [searchParams, router]); // ✅ updated dependency

  // ✅ ✅ FIX 1 — extract array
  const taskList = tasks?.results || [];

  if (usersLoading || tasksLoading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalUsers = users.length;

  // ✅ ✅ FIX 2 — use taskList instead of tasks
  const totalTasks = taskList.length;

  const ALL_STATUSES = [
    "backlog",
    "todo",
    "in progress",
    "in review",
    "qa",
    "completed",
  ];

  const statusCount = ALL_STATUSES.reduce((acc: any, status) => {
    acc[status] = taskList.filter((t: any) => t.status === status).length; // ✅ unchanged
    return acc;
  }, {});

  const teamCounts = users.reduce((acc: any, user: any) => {
    const team = user.team_name || "No Team";
    acc[team] = (acc[team] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Box
        sx={{
          height: "100%",
          overflowY: "auto",
          p: 3,
          pb: 6,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Dashboard
        </Typography>

        <GridSection>
          <DashboardCard label="Total Users" value={totalUsers} />
          <DashboardCard label="Total Tasks" value={totalTasks} />
        </GridSection>

        <Box sx={{ mt: 4 }}>
          <Typography sx={{ fontWeight: 600, mb: 2 }}>
            Tasks by Status
          </Typography>

          <GridSection>
            {ALL_STATUSES.map((status) => {
              const count = statusCount[status];

              return (
                <DashboardCard
                  key={status}
                  label={status}
                  value={count === 0 ? "No tasks" : count}
                />
              );
            })}
          </GridSection>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography sx={{ fontWeight: 600, mb: 2 }}>Teams</Typography>

          <GridSection>
            {Object.entries(teamCounts).map(([team, count]: any) => (
              <DashboardCard key={team} label={team} value={count} />
            ))}
          </GridSection>
        </Box>
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

function GridSection({ children }: any) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 200px)",
        gap: 2,
        justifyContent: "flex-start",
      }}
    >
      {children}
    </Box>
  );
}

function DashboardCard({ label, value }: any) {
  return (
    <Card
      sx={{
        width: "200px",
        height: "100px",
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent>
        <Typography sx={{ fontSize: 13, color: "#6b7280" }}>{label}</Typography>

        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 600,
            mt: 0.5,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
