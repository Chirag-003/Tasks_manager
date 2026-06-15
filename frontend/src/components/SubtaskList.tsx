"use client";

import { Box, Typography } from "@mui/material";
import {
  IconButton,
  Tooltip,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar, // ✅ NEW
  Alert, // ✅ NEW
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import UILoader from "@/components/Loader";
import { useDeleteSubtaskMutation } from "@/services/api";

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

  const [deleteSubtask] = useDeleteSubtaskMutation();

  const [showAll, setShowAll] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("subtasks-expanded") === "true";
    }
    return false;
  });

  const [loadingSubtaskId, setLoadingSubtaskId] = useState<number | null>(null);

  const [searchInput, setSearchInput] = useState("");

  // ✅ DELETE STATE
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");

  // ✅ ✅ ✅ NEW SNACKBAR STATE
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchInput.trim();
      onSearch?.(trimmed || "");
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

  // ✅ DELETE FUNCTION (UPDATED WITH SNACKBAR)
  const handleDelete = async () => {
    if (!selectedId) return;

    setDeleteError("");

    try {
      await deleteSubtask(selectedId).unwrap();

      setOpenDelete(false);
      setSelectedId(null);

      // ✅ ✅ ✅ SHOW SUCCESS MESSAGE
      setSnackbar({
        open: true,
        message: "Subtask deleted successfully ✅",
      });
    } catch (err: any) {
      let message = err?.data?.detail || "Cannot delete subtask";

      if (typeof message === "string") {
        message = message.replace(/^\d+:\s*/, "").trim();
      }

      setDeleteError(message);
    }
  };

  return (
    <Box>
      {/* LOADER */}
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

      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
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
            placeholder="Search subtasks..."
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

      {/* LIST */}
      {!subtasks?.length ? (
        <Typography color="text.secondary">
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
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography sx={{ flex: 1 }}>{subtask.title}</Typography>

              <Chip
                label={subtask.status}
                size="small"
                color={getStatusColor(subtask.status)}
              />

              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(subtask.id);
                  setOpenDelete(true);
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </>
      )}

      {/* DELETE DIALOG */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Subtask</DialogTitle>

        <DialogContent>
          <Typography>Are you sure you want to delete this subtask?</Typography>

          {deleteError && (
            <Typography color="error" mt={1}>
              {deleteError}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>

          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ ✅ ✅ SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
