import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/",
  }),

  tagTypes: ["Tasks", "Users", "Subtasks"],

  endpoints: (builder) => ({
    getTasks: builder.query<any, void>({
      query: () => "/task1/",
      providesTags: ["Tasks"],
    }),

    getTaskById: builder.query<any, number>({
      query: (taskId) => `/task1/${taskId}`,
      providesTags: ["Tasks"],
    }),

    getUsers: builder.query<any, void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    // ✅ GET SUBTASKS
    getSubtasks: builder.query<any, number>({
      query: (taskId) => `/tasks/${taskId}/subtasks`,
      providesTags: ["Subtasks"],
    }),

    getSubtaskById: builder.query<any, number>({
      query: (subtaskId) => `/subtasks/${subtaskId}`,
      providesTags: ["Subtasks"],
    }),

    // ✅ CREATE TASK
    createTask: builder.mutation<any, any>({
      query: (taskData) => ({
        url: "/task1/",
        method: "POST",
        body: taskData,
      }),
      invalidatesTags: ["Tasks"], // ✅ AUTO REFRESH TASKS
    }),

    deleteTask: builder.mutation({
      query: (taskId) => ({
        url: `/task1/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),

    updateTask: builder.mutation({
      query: ({ id, data }) => ({
        url: `/task1/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Tasks"],
    }),

    // ✅ CREATE SUBTASK
    createSubtask: builder.mutation<any, { taskId: number; data: any }>({
      query: ({ taskId, data }) => ({
        url: `/tasks/${taskId}/subtasks`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subtasks"],
    }),

    updateSubtask: builder.mutation({
      query: ({ id, data }) => ({
        url: `/subtasks/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Tasks"],
    }),

    deleteSubtask: builder.mutation({
      query: (subtaskId) => ({
        url: `/subtasks/${subtaskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subtasks"],
    }),

    // ✅ ADD TASK COMMENT
    addTaskComment: builder.mutation({
      query: ({ taskId, data }) => ({
        url: `/tasks/${taskId}/comments`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tasks"], // ✅ optional (refresh tasks if needed)
    }),

    // ✅ ADD SUBTASK COMMENT
    addSubtaskComment: builder.mutation<any, { subtaskId: number; data: any }>({
      query: ({ subtaskId, data }) => ({
        url: `/subtasks/${subtaskId}/comments`,
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
  useGetSubtasksQuery,
  useGetSubtaskByIdQuery,
  useGetUsersQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useCreateSubtaskMutation,
  useAddTaskCommentMutation,
  useAddSubtaskCommentMutation,
  useUpdateSubtaskMutation,
  useDeleteSubtaskMutation,
} = api;
