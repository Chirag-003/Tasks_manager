"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useGetUsersQuery, useGetTasksQuery } from "@/services/api";

export default function DashboardPage() {
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: tasks = [], isLoading: tasksLoading } = useGetTasksQuery();

  if (usersLoading || tasksLoading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  // ✅ TOTALS
  const totalUsers = users.length;
  const totalTasks = tasks.length;

  // ✅ ALL STATUSES (YOUR ENUMS)
  const ALL_STATUSES = [
    "backlog",
    "todo",
    "in progress",
    "in review",
    "qa",
    "completed",
  ];

  // ✅ STATUS COUNT (INCLUDING EMPTY)
  const statusCount = ALL_STATUSES.reduce((acc: any, status) => {
    acc[status] = tasks.filter((t: any) => t.status === status).length;
    return acc;
  }, {});

  // ✅ TEAM COUNT
  const teamCounts = users.reduce((acc: any, user: any) => {
    const team = user.team_name || "No Team";
    acc[team] = (acc[team] || 0) + 1;
    return acc;
  }, {});

  return (
    <Box
      sx={{
        height: "100%", // ✅ IMPORTANT
        overflowY: "auto", // ✅ ENABLE SCROLL ✅🔥
        p: 3,
        pb: 6,
      }}
    >
      {/* ✅ TITLE */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Dashboard
      </Typography>

      {/* ✅ SUMMARY */}
      <GridSection>
        <DashboardCard label="Total Users" value={totalUsers} />
        <DashboardCard label="Total Tasks" value={totalTasks} />
      </GridSection>

      {/* ✅ STATUS */}
      <Box sx={{ mt: 4 }}>
        <Typography sx={{ fontWeight: 600, mb: 2 }}>Tasks by Status</Typography>

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

      {/* ✅ TEAMS */}
      <Box sx={{ mt: 4 }}>
        <Typography sx={{ fontWeight: 600, mb: 2 }}>Teams</Typography>

        <GridSection>
          {Object.entries(teamCounts).map(([team, count]: any) => (
            <DashboardCard key={team} label={team} value={count} />
          ))}
        </GridSection>
      </Box>
    </Box>
  );
}

/* ✅ FIXED GRID (uniform layout) */
function GridSection({ children }: any) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 200px)", // ✅ fixed width
        gap: 2,
        justifyContent: "flex-start",
      }}
    >
      {children}
    </Box>
  );
}

/* ✅ FIXED CARD (same size everywhere) */
function DashboardCard({ label, value }: any) {
  return (
    <Card
      sx={{
        width: "200px", // ✅ FIXED WIDTH
        height: "100px", // ✅ FIXED HEIGHT

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
