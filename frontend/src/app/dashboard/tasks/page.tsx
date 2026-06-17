"use client";

import { useGetTasksQuery, useCreateTaskMutation } from "@/services/api";

import TaskList from "@/components/TaskList";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import UILoader from "@/components/Loader";
import FilterMenu from "@/components/FilterMenu";

import { useState, useEffect } from "react";

import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  TextField,
  Popover,
  Pagination,
} from "@mui/material";

import { useRouter, useSearchParams } from "next/navigation";

export default function TasksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sprint: "",
    user_id: "",
  });

  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const statusParam = searchParams.get("status") || "";
  const [activeStatus, setActiveStatus] = useState(statusParam);

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined,
  );

  const openFilter = Boolean(anchorEl);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const statusFromUrl = searchParams.get("status") || "";
    setActiveStatus(statusFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = searchInput.trim();

      setFilters((prev) => ({
        ...prev,
        search: trimmed || "",
      }));
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      status: activeStatus,
    }));
  }, [activeStatus]);

  // ✅ RESET PAGE ON FILTER CHANGE
  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    if (searchParams.get("deleted") === "true") {
      setSnackbar({
        open: true,
        message: "Task deleted successfully",
      });

      router.replace("/dashboard/tasks");
    }
  }, [searchParams, router]);

  // ✅ ✅ FIXED (pagination + search now works)
  const { data, isLoading, isFetching, isError } = useGetTasksQuery({
    ...filters,
    page,
    page_size: pageSize,
  });

  const [createTask] = useCreateTaskMutation();

  const handleOpen = (status?: string) => {
    setSelectedStatus(status);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStatus(undefined);
  };

  const handleOpenFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setAnchorEl(null);
  };

  if (isLoading) return <UILoader type="task" />;
  if (isError) return <p>Error fetching tasks</p>;

  return (
    <>
      {loadingTaskId && (
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
          <UILoader type="full" text="Opening task..." />
        </Box>
      )}

      <Box
        sx={{
          height: "100%",
          px: 1.5,
          py: 0.5,
          paddingTop: 1.5,
          backgroundColor: "#f8fafc",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <Box mb={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1.5}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Tasks
            </Typography>

            <Box display="flex" gap={2}>
              <TextField
                placeholder="Search task by title..."
                size="small"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                sx={{ width: 250 }}
              />

              <Button
                variant="outlined"
                onClick={handleOpenFilter}
                sx={{ textTransform: "none" }}
              >
                Filter
              </Button>
            </Box>
          </Box>

          {/* STATUS TAGS */}
          <Box
            sx={{ display: "flex", gap: 4, borderBottom: "1px solid #e5e7eb" }}
          >
            {[
              "",
              "backlog",
              "todo",
              "in progress",
              "in review",
              "qa",
              "completed",
            ].map((status) => {
              const isActive = activeStatus === status;

              return (
                <Box
                  key={status || "all"}
                  onClick={() => {
                    setActiveStatus(status);

                    const params = new URLSearchParams(searchParams.toString());

                    if (status) {
                      params.set("status", status);
                    } else {
                      params.delete("status");
                    }

                    router.push(`/dashboard/tasks?${params.toString()}`);
                  }}
                  sx={{
                    position: "relative",
                    cursor: "pointer",
                    pb: 1.2,
                    fontSize: "15px",
                    fontWeight: isActive ? 600 : 500,
                    textTransform: "capitalize",
                    color: isActive ? "#2563eb" : "#475569",
                    transition: "color 0.2s ease",
                    "&:hover": { color: "#1d4ed8" },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      bottom: 0,
                      width: isActive ? "100%" : "0%",
                      opacity: isActive ? 1 : 0,
                      height: "2.5px",
                      backgroundColor: "#2563eb",
                      borderRadius: "2px",
                      transition: "all 0.2s ease",
                    },
                  }}
                >
                  {status ? (status === "qa" ? "QA" : status) : "All"}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* FILTER */}
        <Popover
          open={openFilter}
          anchorEl={anchorEl}
          onClose={handleCloseFilter}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          disableScrollLock // ✅ ✅ MAIN FIX
          disableAutoFocus
          disableEnforceFocus
          disableRestoreFocus
        >
          <Box p={2} width={280}>
            <FilterMenu
              type="task"
              filters={filters}
              onChange={(newFilters: any) => {
                setFilters((prev) => ({
                  ...prev,
                  ...newFilters,
                }));
              }}
              onClear={() =>
                setFilters({
                  search: "",
                  status: "",
                  sprint: "",
                  user_id: "",
                })
              }
              onClose={handleCloseFilter}
            />
          </Box>
        </Popover>

        {/* TASK LIST */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowX: "auto",
            overflowY: "hidden",
            pb: 1,
            "&::-webkit-scrollbar": {
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#e2e8f0",
              borderRadius: "10px",
              transition: "background-color 0.2s ease",
            },
            "&:hover::-webkit-scrollbar-thumb": {
              backgroundColor: "#cbd5e1",
            },
          }}
        >
          {isFetching ? (
            activeStatus ? (
              <UILoader type="taskFlat" />
            ) : (
              <UILoader type="task" />
            )
          ) : !data?.results?.length ? (
            <Typography sx={{ color: "text.secondary" }}>
              {searchInput.trim()
                ? `No results found for "${searchInput.trim()}"`
                : "No tasks available"}
            </Typography>
          ) : (
            <TaskList
              tasks={data.results}
              grouped={!activeStatus}
              filters={filters} // ✅ ✅ CRITICAL FIX
              onTaskClick={(task: any) => {
                setLoadingTaskId(task.id);
                router.push(`/dashboard/tasks/${task.id}`);
              }}
              onAddTask={(status) => handleOpen(status)}
            />
          )}
        </Box>

        {/* PAGINATION */}
        {activeStatus && data && (
          <Box mt={2} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(data.count / pageSize)}
              page={page}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}

        {/* CREATE BUTTON */}
        <Button
          variant="contained"
          onClick={() => handleOpen()}
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            borderRadius: "10px",
            px: 3,
            textTransform: "none",
          }}
        >
          Create Task
        </Button>

        <CreateTaskDialog
          open={open}
          onClose={handleClose}
          defaultStatus={selectedStatus}
          onCreate={async (formData) => {
            await createTask({
              ...formData,
              status: selectedStatus || formData.status,
            }).unwrap();
          }}
        />
      </Box>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
