"use client";

import { Box, Typography } from "@mui/material";
import TaskCard from "./TaskCard";
import { useGetTasksQuery } from "@/services/api";
import { useState, useEffect } from "react";
import UILoader from "./Loader";

type TaskListProps = {
  tasks: any[];
  onTaskClick: (task: any) => void;
  grouped?: boolean;
  onAddTask?: (status?: string) => void;
  filters?: any;
};

export default function TaskList({
  tasks,
  onTaskClick,
  grouped = true,
  onAddTask,
  filters,
}: TaskListProps) {
  const columns = [
    { key: "backlog", title: "Backlog" },
    { key: "todo", title: "Todo" },
    { key: "in_progress", title: "In Progress" },
    { key: "in_review", title: "In Review" },
    { key: "qa", title: "QA" },
    { key: "completed", title: "Completed" },
  ];

  const [columnPages, setColumnPages] = useState<Record<string, number>>({
    backlog: 1,
    todo: 1,
    in_progress: 1,
    in_review: 1,
    qa: 1,
    completed: 1,
  });

  const [columnDataState, setColumnDataState] = useState<Record<string, any[]>>(
    {
      backlog: [],
      todo: [],
      in_progress: [],
      in_review: [],
      qa: [],
      completed: [],
    },
  );

  const backlogQuery = useGetTasksQuery({
    ...filters,
    status: "backlog",
    page: columnPages["backlog"],
    page_size: 10,
  });

  const todoQuery = useGetTasksQuery({
    ...filters,
    status: "todo",
    page: columnPages["todo"],
    page_size: 10,
  });

  const inProgressQuery = useGetTasksQuery({
    ...filters,
    status: "in_progress",
    page: columnPages["in_progress"],
    page_size: 10,
  });

  const inReviewQuery = useGetTasksQuery({
    ...filters,
    status: "in_review",
    page: columnPages["in_review"],
    page_size: 10,
  });

  const qaQuery = useGetTasksQuery({
    ...filters,
    status: "qa",
    page: columnPages["qa"],
    page_size: 10,
  });

  const completedQuery = useGetTasksQuery({
    ...filters,
    status: "completed",
    page: columnPages["completed"],
    page_size: 10,
  });

  const mergeUnique = (oldList: any[] = [], newList: any[] = []) => {
    const map = new Map();
    [...oldList, ...newList].forEach((item) => {
      map.set(item.id, item);
    });
    return Array.from(map.values());
  };

  useEffect(() => {
    setColumnDataState((prev) => ({
      backlog:
        columnPages.backlog === 1
          ? backlogQuery.data?.results || []
          : mergeUnique(prev.backlog, backlogQuery.data?.results || []),

      todo:
        columnPages.todo === 1
          ? todoQuery.data?.results || []
          : mergeUnique(prev.todo, todoQuery.data?.results || []),

      qa:
        columnPages.qa === 1
          ? qaQuery.data?.results || []
          : mergeUnique(prev.qa, qaQuery.data?.results || []),

      completed:
        columnPages.completed === 1
          ? completedQuery.data?.results || []
          : mergeUnique(prev.completed, completedQuery.data?.results || []),

      in_progress:
        columnPages.in_progress === 1
          ? inProgressQuery.data?.results || []
          : mergeUnique(prev.in_progress, inProgressQuery.data?.results || []),

      in_review:
        columnPages.in_review === 1
          ? inReviewQuery.data?.results || []
          : mergeUnique(prev.in_review, inReviewQuery.data?.results || []),
    }));
  }, [
    backlogQuery.data,
    todoQuery.data,
    inProgressQuery.data,
    inReviewQuery.data,
    qaQuery.data,
    completedQuery.data,
  ]);

  const columnData = columnDataState;

  const columnLoading: Record<string, boolean> = {
    backlog: backlogQuery.isLoading,
    todo: todoQuery.isLoading,
    in_progress: inProgressQuery.isLoading,
    in_review: inReviewQuery.isLoading,
    qa: qaQuery.isLoading,
    completed: completedQuery.isLoading,
  };

  if (!grouped) {
    return (
      <Box
        sx={{
          height: "100%",
          overflowY: "auto",
          pr: 1,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignContent: "flex-start",
        }}
      >
        {tasks.map((task: any) => (
          <Box
            key={task.id}
            sx={{
              width: {
                xs: "100%",
                sm: "280px",
              },
              flexGrow: 0,
              flexShrink: 0,
            }}
          >
            <TaskCard task={task} onClick={() => onTaskClick(task)} />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box
      className="kanban-container"
      sx={{
        display: "flex",
        gap: 2,
        height: "100%",
        px: 1,
      }}
    >
      {columns.map((col) => {
        const colTasks = columnData[col.key] || [];
        const isLoading = columnLoading[col.key];

        const queryMap: any = {
          backlog: backlogQuery,
          todo: todoQuery,
          in_progress: inProgressQuery,
          in_review: inReviewQuery,
          qa: qaQuery,
          completed: completedQuery,
        };

        const totalCount = queryMap[col.key].data?.count || 0;

        return (
          <Box
            className="kanban-column"
            key={col.key}
            sx={{
              backgroundColor: "#f1f5f9",
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              pt: 0,
              pb: 1,
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.03)",
              "&::-webkit-scrollbar": { width: "0px" },
            }}
          >
            {/* HEADER */}
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 2,
                px: 1.5,
                mt: -1,
                pt: 1.2,
                pb: 0.8,
                backgroundColor: "#f1f5f9",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography sx={{ fontWeight: 600, fontSize: "13.5px" }}>
                    {col.title}
                  </Typography>
                  <Box sx={{ fontSize: "11px", px: 1.2, py: 0.3 }}>
                    {colTasks.length}
                  </Box>
                </Box>

                <Box
                  sx={{
                    cursor: "pointer",
                    px: 0.5,
                    borderRadius: 1,
                    "&:hover": { backgroundColor: "#e2e8f0" },
                  }}
                  onClick={() => onAddTask?.(col.key)}
                >
                  +
                </Box>
              </Box>
            </Box>

            {/* CONTENT */}
            <Box sx={{ px: 1, pt: 2, pb: 2 }}>
              {isLoading ? (
                <UILoader type="kanbanColumn" />
              ) : colTasks.length === 0 ? (
                <Box>No tasks</Box>
              ) : (
                <Box className="kanban-tasks">
                  {colTasks.map((task: any) => (
                    <Box key={task.id} className="kanban-task-card">
                      <TaskCard task={task} onClick={() => onTaskClick(task)} />
                    </Box>
                  ))}
                </Box>
              )}

              {/* ✅ SHOW MORE (RESTORED EXACTLY) */}
              {colTasks.length < totalCount && !isLoading && (
                <Box
                  sx={{
                    mt: 1,
                    px: 1,
                    py: 0.8,
                    borderRadius: 1.5,
                    display: "flex",
                    gap: 1,
                    cursor: "pointer",
                    fontSize: "15px",
                    color: "#1e293b",
                    "&:hover": {
                      backgroundColor: "#e2e8f0",
                    },
                  }}
                  onClick={() =>
                    setColumnPages((prev) => ({
                      ...prev,
                      [col.key]: prev[col.key] + 1,
                    }))
                  }
                >
                  <Box>Show more</Box>
                </Box>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
