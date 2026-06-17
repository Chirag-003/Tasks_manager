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
    <Box
      sx={{
        height: "100%", // ✅ use 100% instead of 100vh
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <Header />

      {/* MAIN LAYOUT */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* SIDEBAR */}
        <Sidebar />

        {/* CONTENT */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto", // ✅ allows scrolling (important fix)
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
