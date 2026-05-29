"use client";

import { useGetUsersQuery } from "@/services/api";

export default function UsersPage() {
  const { data, isLoading, isError } = useGetUsersQuery();

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Error fetching users</p>;

  return (
    <div>
      <h1>Users</h1>

      {data?.map((user: any) => (
        <div
          key={user.id}
          style={{
            border: "1px solid black",
            margin: "10px",
            padding: "10px",
          }}
        >
          <p>
            <b>ID:</b> {user.id}
          </p>
          <p>
            <b>Username:</b> {user.username}
          </p>
          <p>
            <b>Email:</b> {user.email}
          </p>
          <p>
            <b>Team:</b> {user.team_name}
          </p>
        </div>
      ))}
    </div>
  );
}
