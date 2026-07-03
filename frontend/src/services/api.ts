import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://127.0.0.1:8000/api/",

  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        body: {
          refresh_token: refreshToken,
        },
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const data = refreshResult.data as {
        access_token: string;
      };

      localStorage.setItem("access_token", data.access_token);

      result = await baseQuery(args, api, extraOptions);
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      window.location.href = "/login";
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithReauth,

  tagTypes: ["Tasks", "Users", "Subtasks"],

  endpoints: (builder) => ({
    getTasks: builder.query<any, any>({
      query: (filters) => {
        const params = new URLSearchParams();

        // ✅ EXISTING filters (unchanged)
        if (filters?.search) params.append("search", filters.search);
        if (filters?.status) params.append("status", filters.status);
        if (filters?.sprint) params.append("sprint", filters.sprint);
        if (filters?.user_id) params.append("user_id", filters.user_id);

        // ✅ NEW: pagination
        if (filters?.page) params.append("page", filters.page);
        if (filters?.page_size) params.append("page_size", filters.page_size);

        return `/task1/?${params.toString()}`;
      },
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

    getSubtasks: builder.query<any, any>({
      query: ({ task_id, status, user_id, search }) => {
        const params = new URLSearchParams();

        if (status) params.append("status", status);
        if (user_id) params.append("user_id", user_id);
        if (search) params.append("search", search);

        return `/tasks/${task_id}/subtasks?${params.toString()}`;
      },
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

    getSprints: builder.query<string[], void>({
      query: () => "/task1/sprints",
    }),

    // ✅ CREATE SUBTASK
    createSubtask: builder.mutation<any, { taskId: number; data: any }>({
      query: ({ taskId, data }) => ({
        url: `/tasks/${taskId}/subtasks`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subtasks", "Tasks"],
    }),

    updateSubtask: builder.mutation({
      query: ({ id, data }) => ({
        url: `/subtasks/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Subtasks", "Tasks"],
    }),

    deleteSubtask: builder.mutation({
      query: (subtaskId) => ({
        url: `/subtasks/${subtaskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subtasks", "Tasks"],
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

    // ✅ LOGIN
    loginUser: builder.mutation<any, { email: string; password: string }>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    // prettier-ignore
    registerUser: builder.mutation<any,{ username: string; email: string; password: string }>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    getCurrentUser: builder.query<any, void>({
      query: () => "/auth/me",
    }),

    getKanbanTasks: builder.query<any, any>({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters?.search) params.append("search", filters.search);
        if (filters?.sprint) params.append("sprint", filters.sprint);
        if (filters?.user_id) params.append("user_id", filters.user_id);

        return `/task1/kanban?${params.toString()}`;
      },
      providesTags: ["Tasks"],
    }),

    // end
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
  useGetSprintsQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetCurrentUserQuery,
  useGetKanbanTasksQuery,
} = api;
