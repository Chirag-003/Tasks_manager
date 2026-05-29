"use client";

import { Box } from "@mui/material";
import Header from "@/components/Header";
import Sidebar from "@/components/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box>
      {/* ✅ HEADER */}
      <Header />

      {/* ✅ MAIN SECTION */}
      <Box sx={{ display: "flex" }}>
        {/* ✅ Sidebar */}
        <Sidebar />

        {/* ✅ Content */}
        <Box sx={{ flex: 1, p: 2 }}>{children}</Box>
      </Box>
    </Box>
  );
}
