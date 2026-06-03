"use client";

import { Box, Typography, Divider, CircularProgress } from "@mui/material";
import { useGetUsersQuery } from "@/services/api";

export default function UsersPage() {
  const { data, isLoading, isError } = useGetUsersQuery();

  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Error fetching users</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* ✅ HEADER */}
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Users
      </Typography>

      {/* ✅ TABLE HEADER */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "60px 1fr 1.5fr 1fr",
          px: 2,
          py: 1,
          fontSize: "13px",
          color: "#6b7280",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div>ID</div>
        <div>Username</div>
        <div>Email</div>
        <div>Team</div>
      </Box>

      {/* ✅ ROWS */}
      <Box>
        {data?.map((user: any) => (
          <Box key={user.id}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 1.5fr 1fr",
                px: 2,
                py: 1.5,
                alignItems: "center",

                transition: "background 0.2s ease",
                "&:hover": {
                  backgroundColor: "#f5f7fa",
                },
              }}
            >
              <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
                {user.id}
              </Typography>

              <Typography sx={{ fontWeight: 500 }}>{user.username}</Typography>

              <Typography sx={{ color: "#6b7280", fontSize: 13 }}>
                {user.email}
              </Typography>

              <Typography sx={{ fontSize: 13 }}>
                {user.team_name || "—"}
              </Typography>
            </Box>

            <Divider />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
