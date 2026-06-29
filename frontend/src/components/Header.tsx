"use client";

import { Box, Typography, Avatar, Menu, MenuItem } from "@mui/material";

import { Manrope } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StatusSnackbar from "./StatusSnackbar";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default function Header() {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    handleClose();

    const token = localStorage.getItem("token");

    try {
      await fetch("http://127.0.0.1:8000/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {}

    localStorage.removeItem("token");

    router.push("/login?status=logout");
  };

  return (
    <>
      <Box
        sx={{
          height: "52px",
          px: 4,

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        {/* ✅ LOGO */}
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

        {/* ✅ PROFILE (CLICKABLE) */}
        <Box
          onClick={handleOpen}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,

            px: 1.5,
            py: 0.8,
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
              width: 32,
              height: 32,
              fontSize: 14,
              backgroundColor: "#2563eb",
            }}
          >
            C
          </Avatar>

          <Typography
            className={manrope.className}
            sx={{
              fontSize: "14px",
              color: "#374151",
              fontWeight: 500,
            }}
          >
            Chirag
          </Typography>
        </Box>

        {/* ✅ DROPDOWN MENU */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 2,
              boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
              minWidth: "160px",
            },
          }}
        >
          <MenuItem
            onClick={handleLogout}
            sx={{
              fontSize: "14px",
              color: "#ef4444",
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
}
