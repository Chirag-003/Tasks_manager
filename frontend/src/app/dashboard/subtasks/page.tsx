"use client";

import {
  useGetSubtasksQuery,
  useAddSubtaskCommentMutation,
} from "@/services/api";

export default function SubtasksPage() {
  const taskId = 11;

  const { data, isLoading, isError } = useGetSubtasksQuery(taskId);
  const [addSubtaskComment] = useAddSubtaskCommentMutation();

  if (isLoading) return <p>Loading subtasks...</p>;
  if (isError) return <p>Error fetching subtasks</p>;

  return (
    <div>
      <h1>Subtasks for Task {taskId}</h1>

      {data?.map((subtask: any) => (
        <div
          key={subtask.id}
          style={{ border: "1px solid black", margin: "10px", padding: "10px" }}
        >
          <p><b>ID:</b> {subtask.id}</p>
          <p><b>Title:</b> {subtask.title}</p>
          <p><b>Status:</b> {subtask.status}</p>
          <p><b>Task ID:</b> {subtask.task_id}</p>
          <p><b>Sprint:</b> {subtask.sprint}</p>

          {/* ✅ USERS */}
          <div>
            <b>Users:</b>
            {!subtask.users?.length ? (
              <p>No users</p>
            ) : (
              <ul>
                {subtask.users.map((user: any) => (
                  <li key={user.id}>
                    {user.username} ({user.team_name})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ✅ COMMENTS */}
          <div>
            <b>Comments:</b>

            <p>Count: {subtask.comments?.count}</p>

            {!subtask.comments?.data?.length ? (
              <p>No comments</p>
            ) : (
              <ul>
                {subtask.comments.data.map((c: any) => (
                  <li key={c.id}>
                    {c.content} — {c.user?.username}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ✅ ADD COMMENT */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const form = e.target as any;

              const content = form.content.value;
              const user_id = Number(form.user_id.value);

              try {
                await addSubtaskComment({
                  subtaskId: subtask.id,
                  data: { content, user_id },
                }).unwrap();

                alert("✅ Subtask comment added");

                form.reset();
              } catch (err) {
                console.error(err);
                alert("❌ Failed to add comment");
              }
            }}
          >
            <h4>Add Comment</h4>

            <input name="content" placeholder="Write comment" />
            <br />

            <input name="user_id" placeholder="User ID" />
            <br />

            <button type="submit">Add Comment</button>
          </form>
        </div>
      ))}
    </div>
  );
}
