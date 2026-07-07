"use client";

import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
    { label: "Tasks", href: "/dashboard/tasks", icon: <TaskIcon /> },
    { label: "Users", href: "/dashboard/users", icon: <PeopleIcon /> },
  ];

  return (
    <Box className="bottom-nav">
      {items.map((item) => {
        const isActive =
          item.label === "Tasks"
            ? pathname.startsWith("/dashboard/tasks")
            : pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{ textDecoration: "none" }}
          >
            <Box
              className="bottom-nav-item"
              sx={{
                color: isActive ? "#2563eb" : "#475569",
                fontWeight: isActive ? 600 : 500,
              }}
            >
              <Box className="bottom-nav-icon">{item.icon}</Box>
              <Typography
                className="
              bottom-nav-text"
                sx={{ fontSize: 13 }}
              >
                {item.label}
              </Typography>
            </Box>
          </Link>
        );
      })}
    </Box>
  );
}
