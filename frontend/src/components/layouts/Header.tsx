"use client";

import { Box, Typography } from "@mui/material";

import { Manrope } from "next/font/google";

import { useMediaQuery } from "@mui/material";
import MobileDrawer from "./MobileDrawer";

import UserAvatarMenu from "../users/UserAvatarMenu";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default function Header() {
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Box
      sx={{
        height: "52px",
        px: {
          xs: 1,
          md: 3,
        },

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {isMobile && <MobileDrawer />}

        <Box className={manrope.className}>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "-0.3px",
              color: "#1f2937",
            }}
          >
            Dev
            <Box
              component="span"
              sx={{
                color: "#2563eb",
                fontWeight: 700,
              }}
            >
              Track
            </Box>
          </Typography>
        </Box>
      </Box>

      <UserAvatarMenu />
    </Box>
  );
}
