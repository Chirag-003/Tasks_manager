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
        width: {
          xs: 200,
          sm: 220,
          md: 240,
        },
        minWidth: {
          xs: 200,
          sm: 220,
          md: 240,
        },
        height: "100%",
        borderRight: "1px solid #e0e0e0",
        p: 2,
        bgcolor: "#fafafa",
      }}
    >
      {/* ✅ Title */}
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Task App
      </Typography>

      {/* ✅ Menu */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1.2,
                  borderRadius: 2,
                  cursor: "pointer",
                  color: "black",
                  fontSize: 17,

                  // ✅ ACTIVE STYLE
                  bgcolor: isActive ? "#d2d2d2" : "transparent",

                  fontWeight: isActive ? 500 : 300,

                  // ✅ HOVER EFFECT
                  "&:hover": {
                    bgcolor: isActive ? "#7979799c" : "#e0e0e0",
                  },

                  transition: "all 0.2s ease",
                }}
              >
                {item.label}
              </Box>
            </Link>
          );
        })}
      </Box>
    </Box>
  );
}
