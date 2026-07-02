"use client";

import { useGetTasksQuery, useCreateTaskMutation } from "@/services/api";

import TaskList from "@/components/TaskList";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import UILoader from "@/components/Loader";
import FilterMenu from "@/components/FilterMenu";
import StatusTabs from "@/components/StatusTabs";

import { useState, useEffect } from "react";

import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  TextField,
  Pagination,
  useMediaQuery,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import { useRouter, useSearchParams } from "next/navigation";

export default function TasksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isMobile = useMediaQuery("(max-width:768px)");

  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sprint: "",
    user_id: "",
  });

  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const statusParam = searchParams.get("status") || "";

  const [activeStatus, setActiveStatus] = useState(
    statusParam || (isMobile ? "backlog" : ""),
  );

  const [open, setOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined,
  );

  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const statusFromUrl = searchParams.get("status");

    if (statusFromUrl) {
      setActiveStatus(statusFromUrl);
    } else {
      setActiveStatus(isMobile ? "backlog" : "");
    }
  }, [searchParams, isMobile]);

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);

    const params = new URLSearchParams(searchParams.toString());

    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    router.push(`/dashboard/tasks?${params.toString()}`);
  };

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

  if (isLoading) return <UILoader type="task" />;
  if (isError) return <p>Error fetching tasks</p>;

  const statusTabs = isMobile
    ? ["backlog", "todo", "in_progress", "in_review", "qa", "completed"]
    : ["", "backlog", "todo", "in_progress", "in_review", "qa", "completed"];

  const taskFilters = (
    <FilterMenu
      type="task"
      filters={filters}
      onChange={(newFilters: any) =>
        setFilters((prev) => ({
          ...prev,
          ...newFilters,
        }))
      }
      onClear={() =>
        setFilters({
          search: "",
          status: "",
          sprint: "",
          user_id: "",
        })
      }
    />
  );

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
        {/* ✅ HEADER */}
        <Box mb={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
              minHeight: "50px",
            }}
          >
            {isMobile ? (
              showMobileSearch ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: "100%",
                    minHeight: "36px",
                  }}
                >
                  <TextField
                    autoFocus
                    fullWidth
                    placeholder="Search task by title..."
                    size="small"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    variant="standard"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button onClick={() => setShowMobileSearch(false)}>✕</Button>

                  {taskFilters}
                </Box>
              ) : (
                <>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1,
                      }}
                    >
                      Tasks
                    </Typography>

                    <Box
                      onClick={() => handleOpen()}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        width: 36,
                        height: 36,

                        borderRadius: 2,
                        cursor: "pointer",

                        color: "#111827",

                        transition: "all 0.15s ease",

                        "&:hover": {
                          backgroundColor: "#f3f4f6",
                          color: "#2563eb",
                        },
                      }}
                    >
                      <AddIcon sx={{ fontSize: 20 }} />
                    </Box>
                  </Box>

                  <Box display="flex" gap={1}>
                    <Button onClick={() => setShowMobileSearch(true)}>
                      <SearchIcon />
                    </Button>

                    {taskFilters}
                  </Box>
                </>
              )
            ) : (
              <>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    Tasks
                  </Typography>

                  <Box
                    onClick={() => handleOpen()}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      width: 26,
                      height: 26,

                      borderRadius: "6px",
                      cursor: "pointer",

                      color: "#2563eb",

                      transition: "all 0.15s ease",

                      "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 0.1)",
                      },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 18, fontWeight: 700 }} />
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  <TextField
                    placeholder="Search task by title..."
                    size="small"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    sx={{ width: 240 }}
                    variant="standard"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {taskFilters}
                </Box>
              </>
            )}
          </Box>

          {/* ✅ TABS */}

          <StatusTabs
            statusTabs={statusTabs}
            activeStatus={activeStatus}
            onStatusChange={handleStatusChange}
          />
        </Box>

        {/* ✅ POPOVER */}

        {/* ✅ TASK LIST */}
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
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
              filters={filters}
              onTaskClick={(task: any) => {
                setLoadingTaskId(task.id);
                router.push(`/dashboard/tasks/${task.id}`);
              }}
              onAddTask={(status) => handleOpen(status)}
            />
          )}
        </Box>

        {/* ✅ PAGINATION */}
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

        {/* ✅ DIALOG */}
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

      {/* ✅ SNACKBAR */}
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
