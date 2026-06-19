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
  useMediaQuery,
  InputAdornment,
} from "@mui/material";

/* ✅ ICONS */
import AssignmentIcon from "@mui/icons-material/Assignment";
import PendingIcon from "@mui/icons-material/Pending";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BugReportIcon from "@mui/icons-material/BugReport";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import TuneIcon from "@mui/icons-material/Tune";
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "backlog":
        return <AssignmentIcon sx={{ fontSize: 14 }} />;
      case "todo":
        return <PendingIcon sx={{ fontSize: 14 }} />;
      case "in progress":
        return <AutorenewIcon sx={{ fontSize: 14 }} />;
      case "in review":
        return <CheckCircleIcon sx={{ fontSize: 14 }} />;
      case "qa":
        return <BugReportIcon sx={{ fontSize: 14 }} />;
      case "completed":
        return <DoneAllIcon sx={{ fontSize: 14 }} />;
      default:
        return null;
    }
  };

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

  const handleOpenFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setAnchorEl(null);
  };

  if (isLoading) return <UILoader type="task" />;
  if (isError) return <p>Error fetching tasks</p>;

  const statusTabs = isMobile
    ? ["backlog", "todo", "in progress", "in review", "qa", "completed"]
    : ["", "backlog", "todo", "in progress", "in review", "qa", "completed"];

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
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1.5}
          >
            {isMobile ? (
              showMobileSearch ? (
                <Box display="flex" alignItems="center" gap={1} width="100%">
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

                  <Button onClick={handleOpenFilter}>
                    <TuneIcon />
                  </Button>
                </Box>
              ) : (
                <>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1,
                      }}
                    >
                      Tasks
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#64748b",
                        mt: 0.2,
                      }}
                    >
                      Manage and track your work
                    </Typography>
                  </Box>

                  <Box display="flex" gap={1}>
                    <Button onClick={() => setShowMobileSearch(true)}>
                      <SearchIcon
                        sx={{
                          color: showMobileSearch ? "#2563eb" : "#111827",
                        }}
                      />
                    </Button>

                    <Button onClick={handleOpenFilter}>
                      <TuneIcon
                        sx={{
                          color: openFilter ? "#2563eb" : "#111827",
                        }}
                      />
                    </Button>
                  </Box>
                </>
              )
            ) : (
              <>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Tasks
                </Typography>

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

                  <Button onClick={handleOpenFilter}>
                    <TuneIcon />
                  </Button>
                </Box>
              </>
            )}
          </Box>

          {/* ✅ TABS */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              overflowX: "auto",
              whiteSpace: "nowrap",
              pb: 0.5,
              borderBottom: "1px solid #e5e7eb",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {statusTabs.map((status) => {
              const isActive = activeStatus === status;

              return (
                <Box
                  key={status || "all"}
                  onClick={() => {
                    setActiveStatus(status);

                    const params = new URLSearchParams(searchParams.toString());

                    if (status) params.set("status", status);
                    else params.delete("status");

                    router.push(`/dashboard/tasks?${params.toString()}`);
                  }}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    position: "relative",
                    cursor: "pointer",
                    pb: 1,
                    px: 0.5,
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#2563eb" : "#475569",
                    flexShrink: 0,
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      bottom: 0,
                      width: isActive ? "100%" : "0%",
                      height: "2px",
                      backgroundColor: "#2563eb",
                    },
                  }}
                >
                  {getStatusIcon(status)}
                  {status ? (status === "qa" ? "QA" : status) : "All"}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* ✅ POPOVER */}
        <Popover
          open={openFilter}
          anchorEl={anchorEl}
          onClose={handleCloseFilter}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <Box p={2} width={280}>
            <FilterMenu
              type="task"
              filters={filters}
              onChange={(newFilters: any) =>
                setFilters((prev) => ({ ...prev, ...newFilters }))
              }
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

        {/* ✅ BUTTON */}
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
