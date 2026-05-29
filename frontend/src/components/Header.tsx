"use client";

import { Box, Typography } from "@mui/material";

export default function Header() {
  return (
    <Box
      sx={{
        height: "60px",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        bgcolor: "#ffffff",
      }}
    >
      {/* Left */}
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Task Management
      </Typography>

      {/* Right */}
      <Typography variant="body2">Profile</Typography>
    </Box>
  );
}

// this is the comment
