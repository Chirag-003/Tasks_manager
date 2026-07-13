"use client";

import { useGetTasksQuery, useCreateTaskMutation } from "@/services/api";

import TaskList from "@/components/tasks/TaskList";
import CreateTaskDialog from "@/components/tasks/CreateTaskDialog";
import UILoader from "@/components/common/Loader";
import FilterMenu from "@/components/common/FilterMenu";
import StatusTabs from "@/components/tasks/StatusTabs";
import TasksHeader from "@/components/tasks/TaskHeader";

import { useState, useEffect } from "react";

import {
  Box,
  Typography,
  Snackbar,
  Alert,
  TablePagination,
  useMediaQuery,
} from "@mui/material";

import { useRouter, useSearchParams } from "next/navigation";
import { STATUS_VALUES } from "@/constants/status";
import { hasToken } from "@/utils/auth";

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
  const [pageSize, setPageSize] = useState(10);

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

  const { data, isFetching, isError } = useGetTasksQuery(
    {
      ...filters,
      page,
      page_size: pageSize,
    },
    { skip: !hasToken() },
  );

  const [createTask] = useCreateTaskMutation();

  const handleOpen = (status?: string) => {
    setSelectedStatus(status);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStatus(undefined);
  };

  if (isError) return <p>Error fetching tasks</p>;

  const statusTabs = isMobile ? STATUS_VALUES : ["", ...STATUS_VALUES];

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
      onClear={() => {
        setFilters({
          search: "",
          status: "",
          sprint: "",
          user_id: "",
        });
        setSearchInput("");
      }}
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

        <Box
          sx={{ mb: 1.5, display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          <TasksHeader
            isMobile={isMobile}
            showMobileSearch={showMobileSearch}
            searchInput={searchInput}
            onSearchChange={setSearchInput}
            onToggleMobileSearch={setShowMobileSearch}
            onCreateTask={() => handleOpen()}
            filterComponent={taskFilters}
          />
          <StatusTabs
            statusTabs={statusTabs}
            activeStatus={activeStatus}
            onStatusChange={handleStatusChange}
          />
        </Box>

        {/* ✅ TASK LIST */}
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {!activeStatus ? (
            <TaskList
              tasks={data?.results ?? []}
              grouped
              filters={filters}
              onTaskClick={(task: any) => {
                setLoadingTaskId(task.id);
                router.push(`/dashboard/tasks/${task.id}`);
              }}
              onAddTask={(status) => handleOpen(status)}
            />
          ) : isFetching ? (
            <UILoader type="taskFlat" />
          ) : !data?.results?.length ? (
            <Typography sx={{ color: "text.secondary" }}>
              {searchInput.trim()
                ? `No results found for "${searchInput.trim()}"`
                : "No tasks available"}
            </Typography>
          ) : (
            <TaskList
              tasks={data.results}
              grouped={false}
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
          <TablePagination
            component="div"
            count={data.count}
            page={page - 1}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[5, 10, 25, 50]}
            onPageChange={(_, newPage) => {
              setPage(newPage + 1);
            }}
            onRowsPerPageChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          />
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
