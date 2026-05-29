"use client";

import { Box, Typography } from "@mui/material";
import Link from "next/link";

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: "220px",
        height: "100vh",
        borderRight: "1px solid #e0e0e0",
        p: 2,
        bgcolor: "#fafafa",
      }}
    >
      {/* ✅ Title */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Menu
      </Typography>

      {/* ✅ Links */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Link
          href="/dashboard"
          style={{ textDecoration: "none", color: "black" }}
        >
          Dashboard
        </Link>

        <Link
          href="/dashboard/tasks"
          style={{ textDecoration: "none", color: "black" }}
        >
          Tasks
        </Link>

        <Link
          href="/dashboard/users"
          style={{ textDecoration: "none", color: "black" }}
        >
          Users
        </Link>
      </Box>
    </Box>
  );
}
