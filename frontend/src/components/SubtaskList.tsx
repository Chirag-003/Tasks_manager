"use client";

import { Box, Typography } from "@mui/material";
import { IconButton, Tooltip, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Chip } from "@mui/material";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import UILoader from "@/components/Loader";

type Props = {
  subtasks: any[];
  onAddClick: () => void;
  onSearch?: (value: string) => void;
  onFilterClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function SubtaskList({
  subtasks,
  onAddClick,
  onSearch,
  onFilterClick,
}: Props) {
  const router = useRouter();

  // ✅ PERSIST EXPANSION STATE
  const [showAll, setShowAll] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("subtasks-expanded") === "true";
    }
    return false;
  });

  const [loadingSubtaskId, setLoadingSubtaskId] = useState<number | null>(null);

  // ✅ ✅ NEW: CONTROLLED SEARCH INPUT
  const [searchInput, setSearchInput] = useState("");

  // ✅ ✅ DEBOUNCE + TRIM HANDLING
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchInput.trim();
      onSearch?.(trimmed || ""); // ✅ send clean value
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, onSearch]);

  const visibleSubtasks = showAll ? subtasks : subtasks.slice(0, 1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "backlog":
        return "warning";
      case "todo":
        return "default";
      case "in progress":
        return "primary";
      case "in review":
        return "info";
      case "qa":
        return "secondary";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box>
      {/* ✅ LOADER */}
      {loadingSubtaskId && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(2px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UILoader type="full" text="Opening subtask..." />
        </Box>
      )}

      {/* ✅ HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Subtasks
          </Typography>

          <Tooltip title="Add subtask">
            <IconButton size="small" onClick={onAddClick}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box display="flex" gap={1}>
          <TextField
            placeholder="Search subtasks by title..."
            size="small"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ width: 230 }}
          />

          <Button size="small" onClick={onFilterClick}>
            Filter
          </Button>
        </Box>
      </Box>

      {/* ✅ ✅ EMPTY STATE WITH SEARCH AWARENESS */}
      {!subtasks?.length ? (
        <Typography sx={{ color: "text.secondary" }}>
          {searchInput.trim()
            ? `No results found for "${searchInput.trim()}"`
            : "No subtasks"}
        </Typography>
      ) : (
        <>
          {visibleSubtasks.map((subtask) => (
            <Box
              key={subtask.id}
              onClick={() => {
                setLoadingSubtaskId(subtask.id);
                router.push(`/dashboard/subtasks/${subtask.id}`);
              }}
              sx={{
                px: 1.5,
                py: 1.2,
                borderRadius: 2,
                border: "1px solid #e5e7eb",
                backgroundColor: "#f8fafc",
                mb: 1,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",

                "&:hover": {
                  backgroundColor: "#eef2f7",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  color: "#334155",
                  flex: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {subtask.title}
              </Typography>

              <Chip
                label={subtask.status}
                size="small"
                color={getStatusColor(subtask.status)}
                sx={{
                  textTransform: "capitalize",
                  fontSize: "11px",
                }}
              />
            </Box>
          ))}

          {/* ✅ SHOW MORE */}
          {subtasks.length > 1 && (
            <Typography
              onClick={() => {
                setShowAll((prev) => {
                  const next = !prev;
                  localStorage.setItem("subtasks-expanded", String(next));
                  return next;
                });
              }}
              sx={{
                fontSize: 13,
                cursor: "pointer",
                color: "#2563eb",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {showAll ? "Show less ▲" : `See ${subtasks.length - 1} more ▼`}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
