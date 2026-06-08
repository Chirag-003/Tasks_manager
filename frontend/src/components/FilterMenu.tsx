import { Box, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { useState, useEffect } from "react";

import { useGetUsersQuery, useGetSprintsQuery } from "@/services/api";

export default function FilterMenu({ onChange }: any) {
  const [filters, setFilters] = useState({
    status: "",
    sprint: "",
    user_id: "",
  });

  // ✅ Users from API
  const { data: users } = useGetUsersQuery();

  // ✅ Sprints from backend
  const { data: sprints } = useGetSprintsQuery();

  // ✅ Auto apply
  useEffect(() => {
    onChange(filters);
  }, [filters]);

  const handleChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* ✅ STATUS */}
      <FormControl fullWidth size="small">
        <InputLabel>Status</InputLabel>
        <Select
          value={filters.status}
          label="Status"
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="backlog">Backlog</MenuItem>
          <MenuItem value="todo">Todo</MenuItem>
          <MenuItem value="in progress">In Progress</MenuItem>
          <MenuItem value="in review">In Review</MenuItem>
          <MenuItem value="qa">QA</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      </FormControl>

      {/* ✅ SPRINT */}
      <FormControl fullWidth size="small">
        <InputLabel>Sprint</InputLabel>
        <Select
          value={filters.sprint}
          label="Sprint"
          onChange={(e) => handleChange("sprint", e.target.value)}
        >
          <MenuItem value="">All</MenuItem>

          {sprints?.map((sprint: string) => (
            <MenuItem key={sprint} value={sprint}>
              {sprint}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* ✅ USERS */}
      <FormControl fullWidth size="small">
        <InputLabel>Assignee</InputLabel>
        <Select
          value={filters.user_id}
          label="Assignee"
          onChange={(e) => handleChange("user_id", e.target.value)}
        >
          <MenuItem value="">All</MenuItem>

          {users?.map((user: any) => (
            <MenuItem key={user.id} value={user.id}>
              {user.username}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
``;
