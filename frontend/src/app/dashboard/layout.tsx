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
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ✅ HEADER */}
      <Header />

      {/* ✅ MAIN AREA */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden", // ✅ prevents outer scroll
        }}
      >
        {/* ✅ SIDEBAR */}
        <Sidebar />

        {/* ✅ CONTENT */}
        <Box
          sx={{
            flex: 1,
            overflowY: "hidden", // ✅ only content scrolls if needed
            p: 2,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
