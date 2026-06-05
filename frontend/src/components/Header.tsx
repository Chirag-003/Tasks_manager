"use client";

import { Box, Typography, Avatar } from "@mui/material";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default function Header() {
  return (
    <Box
      sx={{
        height: "60px",
        px: 3,

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <Box className={manrope.className}>
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 600,
            letterSpacing: "-0.3px",
            color: "#1f2937",
            fontFamily: "inherit",
          }}
        >
          Dev
          <Box
            component="span"
            sx={{
              color: "#2563eb",
              fontWeight: 700,
              fontFamily: "inherit",
            }}
          >
            Track
          </Box>
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.2,

          px: 1,
          py: 0.6,
          borderRadius: 2,
          cursor: "pointer",

          transition: "all 0.15s ease",

          "&:hover": {
            backgroundColor: "#f3f4f6",
          },
        }}
      >
        <Avatar
          sx={{
            width: 30,
            height: 30,
            fontSize: 13,
            backgroundColor: "#2563eb",
          }}
        >
          T
        </Avatar>

        <Typography
          className={manrope.className}
          sx={{
            fontSize: "13px",
            color: "#374151",
            fontWeight: 500,
          }}
        >
          Profile
        </Typography>
      </Box>
    </Box>
  );
}
