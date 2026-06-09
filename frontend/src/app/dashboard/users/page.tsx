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
        height: "95%",
        px: 3,
        py: 2,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8fafc",
      }}
    >
      {/* HEADER */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        Users
      </Typography>

      {/* TABLE HEADER */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "60px 1fr 1.5fr 1fr",
          px: 2,
          py: 1,
          fontSize: "13px",
          color: "#6b7280",
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "#fff",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <div>ID</div>
        <div>Username</div>
        <div>Email</div>
        <div>Team</div>
      </Box>

      {/* ✅ SCROLLABLE LIST WITH PARTIAL SCROLL VISIBILITY */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          pr: 1,
          backgroundColor: "#fff",
          borderRadius: "0 0 8px 8px",

          /* ✅ Scroll style */
          "&::-webkit-scrollbar": {
            width: "8px",
          },

          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },

          /* ✅ ✅ PARTIALLY VISIBLE */
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#e2e8f0", // ✅ faint visible
            borderRadius: "10px",
            minHeight: "40px",
            transition: "background-color 0.2s ease",
          },

          /* ✅ Darker on hover */
          "&:hover::-webkit-scrollbar-thumb": {
            backgroundColor: "#cbd5e1",
          },
        }}
      >
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
