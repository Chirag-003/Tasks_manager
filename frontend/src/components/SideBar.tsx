"use client";

import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Tasks", href: "/dashboard/tasks" },
    { label: "Users", href: "/dashboard/users" },
  ];

  return (
    <Box
      sx={{
        width: 200,
        minWidth: 200,
        height: "100%",
        borderRight: "1px solid #e5e7eb",
        px: 2,
        py: 3,
        bgcolor: "#ffffff",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 4,
          fontWeight: 700,
          fontSize: 18,
          color: "#111827",
        }}
      >
        Task App
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {menuItems.map((item) => {
          const isActive =
            item.label === "Tasks"
              ? pathname.startsWith("/dashboard/tasks") ||
                pathname.startsWith("/dashboard/subtasks")
              : pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,

                  px: 1.5,
                  py: 1.2,

                  borderRadius: 2,
                  cursor: "pointer",

                  position: "relative",

                  color: isActive ? "#111827" : "#6b7280",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 14,

                  backgroundColor: isActive ? "#f1f5f9" : "transparent",

                  transition: "all 0.2s ease",

                  "&:hover": {
                    backgroundColor: "#f3f4f6",
                    color: "#111827",
                  },
                }}
              >
                {isActive && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: 6,
                      bottom: 6,
                      width: "3px",
                      borderRadius: 2,
                      backgroundColor: "#3b82f6",
                    }}
                  />
                )}

                {item.label}
              </Box>
            </Link>
          );
        })}
      </Box>
    </Box>
  );
}
