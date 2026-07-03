import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";

import TuneIcon from "@mui/icons-material/Tune";
import Popover from "@mui/material/Popover";

import { useGetUsersQuery, useGetSprintsQuery } from "@/services/api";

type Props = {
  filters?: any;
  onChange: (filters: any) => void;
  onClear: () => void;
  type?: "task" | "subtask";
};

export default function FilterMenu({
  filters,
  onChange,
  onClear,
  type = "task",
}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  const handleOpenFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setAnchorEl(null);
  };

  // ✅ DEFAULT FILTERS
  const defaultFilters = {
    status: "",
    user_id: "",
    ...(type === "task" ? { sprint: "" } : {}),
  };

  const [localFilters, setLocalFilters] = useState(filters || defaultFilters);

  const { data: users } = useGetUsersQuery();

  const { data: sprints } = useGetSprintsQuery(undefined, {
    skip: type !== "task",
  });

  // ✅ SYNC WITH PARENT
  useEffect(() => {
    setLocalFilters(filters || defaultFilters);
  }, [filters]);

  const handleChange = (key: string, value: any) => {
    const updated = {
      ...localFilters,
      [key]: value,
    };

    setLocalFilters(updated);
    onChange(updated);
  };

  return (
    <>
      <Button onClick={handleOpenFilter}>
        <TuneIcon />
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseFilter}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box p={2} width={280}>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* HEADER */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography sx={{ fontWeight: 600 }}>Filters</Typography>

              <IconButton size="small" onClick={handleCloseFilter}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* STATUS */}
            {type === "subtask" && (
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>

                <Select
                  value={localFilters.status || ""}
                  label="Status"
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="backlog">Backlog</MenuItem>
                  <MenuItem value="todo">Todo</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="in_review">In Review</MenuItem>
                  <MenuItem value="qa">QA</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            )}

            {/* SPRINT */}
            {type === "task" && (
              <FormControl fullWidth size="small">
                <InputLabel>Sprint</InputLabel>

                <Select
                  value={localFilters.sprint || ""}
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
            )}

            {/* ASSIGNEE */}
            <FormControl fullWidth size="small">
              <InputLabel>Assignee</InputLabel>

              <Select
                value={localFilters.user_id || ""}
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

            {/* RESET */}
            <Box display="flex" justifyContent="flex-end">
              <Button
                size="small"
                color="error"
                onClick={() => {
                  const cleared = {
                    status: "",
                    user_id: "",
                    ...(type === "task" ? { sprint: "" } : {}),
                  };

                  setLocalFilters(cleared);
                  onClear();
                  handleCloseFilter();
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
