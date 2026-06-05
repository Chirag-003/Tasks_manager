"use client";

import { Box, Typography } from "@mui/material";

export default function Loader({ text = "Loading..." }) {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      {/* ✅ SQUARE WAVE LOADER */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{
              width: 12,
              height: 12,
              borderRadius: 0.5,

              // ✅ subtle color variation
              backgroundColor: i % 2 === 0 ? "#1976d2" : "#60a5fa",

              animation: "wave 1.4s infinite ease-in-out",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </Box>

      {/* ✅ TEXT */}
      <Typography
        sx={{
          fontSize: 13,
          color: "text.secondary",
          letterSpacing: 0.5,
        }}
      >
        {text}
      </Typography>

      {/* ✅ KEYFRAMES */}
      <style>
        {`
          @keyframes wave {
            0%, 80%, 100% {
              transform: translateY(0) scale(0.7);
              opacity: 0.5;
            }
            40% {
              transform: translateY(-6px) scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
}
