import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000",
  }),

  endpoints: (builder) => ({
    getTasks: builder.query<any, void>({
      query: () => "/api/task1/",
    }),

    getUsers: builder.query<any, void>({
      query: () => "/api/users",
    }),

    getSubtasks: builder.query<any, number>({
      query: (taskId) => `/api/tasks/${taskId}/subtasks`,
    }),

    createTask: builder.mutation<any, any>({
      query: (taskData) => ({
        url: "/api/task1/",
        method: "POST",
        body: taskData,
      }),
    }),

    createSubtask: builder.mutation<any, { taskId: number; data: any }>({
      query: ({ taskId, data }) => ({
        url: `/api/tasks/${taskId}/subtasks`,
        method: "POST",
        body: data,
      }),
    }),

    addTaskComment: builder.mutation({
      query: ({ taskId, data }) => ({
        url: `/api/tasks/${taskId}/comments`,
        method: "POST",
        body: data,
      }),
    }),

    addSubtaskComment: builder.mutation<any, { subtaskId: number; data: any }>({
      query: ({ subtaskId, data }) => ({
        url: `/api/subtasks/${subtaskId}/comments`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetUsersQuery,
  useGetSubtasksQuery,
  useCreateTaskMutation,
  useCreateSubtaskMutation,
  useAddTaskCommentMutation,
  useAddSubtaskCommentMutation,
} = api;
