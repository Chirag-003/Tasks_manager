"use client";

import {
  Box,
  Typography,
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
import { useDeleteSubtaskMutation, useGetSubtasksQuery } from "@/services/api";

import FilterMenu from "@/components/FilterMenu";
import { STATUS_CONFIG } from "@/constants/status";

type Props = {
  taskId: number;
  onAddClick: () => void;
};

export default function SubtaskList({ taskId, onAddClick }: Props) {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");

  const [filters, setFilters] = useState({
    status: "",
    user_id: "",
    search: "",
  });

  const [pageSize, setPageSize] = useState(5);

  const { data } = useGetSubtasksQuery(
    {
      task_id: taskId,
      ...filters,
      page: 1,
      page_size: pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const subtasks = data?.results ?? [];

  useEffect(() => {
    setPageSize(5);
  }, [filters, taskId]);

  const [deleteSubtask] = useDeleteSubtaskMutation();

  const [loadingSubtaskId, setLoadingSubtaskId] = useState<number | null>(null);

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

      setFilters((prev) => ({
        ...prev,
        search: trimmed || "",
      }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

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
        message: "Subtask deleted successfully ",
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

          <FilterMenu
            type="subtask"
            filters={filters}
            onChange={setFilters}
            onClear={() =>
              setFilters({
                status: "",
                user_id: "",
                search: "",
              })
            }
          />
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
          {subtasks.map((subtask: any) => {
            const statusConfig =
              STATUS_CONFIG[subtask.status as keyof typeof STATUS_CONFIG];
            return (
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
                  label={statusConfig?.label ?? subtask.status}
                  size="small"
                  color={statusConfig?.color ?? "default"}
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
            );
          })}

          {subtasks.length < (data?.count ?? 0) && (
            <Box
              sx={{
                mt: 2,
                py: 1,
                textAlign: "center",
                border: "1px dashed #cbd5e1",
                borderRadius: 2,
                cursor: "pointer",
                fontWeight: 600,
                color: "#475569",

                "&:hover": {
                  backgroundColor: "#f8fafc",
                },
              }}
              onClick={() => setPageSize((prev) => prev + 5)}
            >
              Load More Subtasks
            </Box>
          )}
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
