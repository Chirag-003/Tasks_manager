"use client";

import { Box, Typography, Avatar, Menu, MenuItem } from "@mui/material";

import { Manrope } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StatusSnackbar from "../common/StatusSnackbar";
import { api, useGetCurrentUserQuery } from "@/services/api";

import { useDispatch } from "react-redux";
import UILoader from "../common/Loader";
import { hasToken } from "@/utils/auth";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    handleClose();
    const token = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    try {
      await fetch("http://127.0.0.1:8000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });
    } catch {}
    dispatch(api.util.resetApiState());
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    window.location.replace("/login?status=logout");
  };

  const { data } = useGetCurrentUserQuery(undefined, {
    skip: !hasToken(),
  });

  if (loggingOut) {
    return <UILoader type="full" text="Logging out..." />;
  }

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
        {data && (
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
              {data.username.charAt(0).toUpperCase()}
            </Avatar>

            <Typography
              className={manrope.className}
              sx={{
                fontSize: "14px",
                color: "#374151",
                fontWeight: 500,
              }}
            >
              {data.username}
            </Typography>
          </Box>
        )}

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
