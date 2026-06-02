import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/",
  }),

  tagTypes: ["Tasks", "Users", "Subtasks"],

  endpoints: (builder) => ({
    getTasks: builder.query<any, void>({
      query: () => "/api/task1/",
      providesTags: ["Tasks"],
    }),

    getTaskById: builder.query<any, number>({
      query: (taskId) => `/api/task1/${taskId}`,
      providesTags: ["Tasks"],
    }),

    getUsers: builder.query<any, void>({
      query: () => "/api/users",
      providesTags: ["Users"],
    }),

    // ✅ GET SUBTASKS
    getSubtasks: builder.query<any, number>({
      query: (taskId) => `/api/tasks/${taskId}/subtasks`,
      providesTags: ["Subtasks"],
    }),

    // ✅ CREATE TASK
    createTask: builder.mutation<any, any>({
      query: (taskData) => ({
        url: "/api/task1/",
        method: "POST",
        body: taskData,
      }),
      invalidatesTags: ["Tasks"], // ✅ AUTO REFRESH TASKS
    }),

    deleteTask: builder.mutation({
      query: (taskId) => ({
        url: `/api/task1/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),

    // ✅ CREATE SUBTASK
    createSubtask: builder.mutation<any, { taskId: number; data: any }>({
      query: ({ taskId, data }) => ({
        url: `/api/tasks/${taskId}/subtasks`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subtasks"],
    }),

    // ✅ ADD TASK COMMENT
    addTaskComment: builder.mutation({
      query: ({ taskId, data }) => ({
        url: `/api/tasks/${taskId}/comments`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tasks"], // ✅ optional (refresh tasks if needed)
    }),

    // ✅ ADD SUBTASK COMMENT
    addSubtaskComment: builder.mutation<any, { subtaskId: number; data: any }>({
      query: ({ subtaskId, data }) => ({
        url: `/api/subtasks/${subtaskId}/comments`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subtasks"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useGetUsersQuery,
  useGetSubtasksQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useCreateSubtaskMutation,
  useAddTaskCommentMutation,
  useAddSubtaskCommentMutation,
} = api;
