import { Box, Typography, Chip, IconButton, Paper } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { useState, useEffect } from "react";

import {
  useUpdateTaskMutation,
  useUpdateSubtaskMutation,
  useGetUsersQuery,
} from "@/services/api";

type Props = {
  entityId: number;
  entityType: "task" | "subtask";
  users: any[];
};

export default function AssigneeField({
  entityId,
  entityType,
  users: currentUsers,
}: Props) {
  const { data: users = [] } = useGetUsersQuery();

  const [updateTask] = useUpdateTaskMutation();
  const [updateSubtask] = useUpdateSubtaskMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [closeTimer, setCloseTimer] = useState<any>(null);

  const [selectedUsers, setSelectedUsers] = useState(currentUsers || []);

  useEffect(() => {
    setSelectedUsers(currentUsers || []);
  }, [currentUsers]);

  const updateUsers = async (updatedUsers: any[]) => {
    const ids = updatedUsers.map((u) => u.id);

    try {
      if (entityType === "task") {
        await updateTask({
          id: entityId,
          data: { users: ids },
        }).unwrap();
      } else {
        await updateSubtask({
          id: entityId,
          data: { users: ids },
        }).unwrap();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUser = async (user: any) => {
    if (selectedUsers.find((u) => u.id === user.id)) return;

    const updated = [...selectedUsers, user];

    setSelectedUsers(updated);
    updateUsers(updated);
  };

  const handleRemoveUser = async (userId: number) => {
    const updated = selectedUsers.filter((u) => u.id !== userId);

    setSelectedUsers(updated);
    updateUsers(updated);
  };

  return (
    <Box
      sx={{ position: "relative" }}
      onMouseLeave={() => {
        const timer = setTimeout(() => {
          setIsOpen(false);
        }, 800);

        setCloseTimer(timer);
      }}
      onMouseEnter={() => {
        if (closeTimer) {
          clearTimeout(closeTimer);
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {!selectedUsers.length && <Typography>No assignee</Typography>}

        {selectedUsers.map((user) => (
          <Chip
            key={user.id}
            label={user.username}
            size="small"
            onDelete={() => handleRemoveUser(user.id)}
            deleteIcon={<CloseIcon />}
          />
        ))}

        <IconButton
          size="small"
          onClick={() => setIsOpen((prev) => !prev)}
          sx={{
            "&:hover": {
              backgroundColor: "#f3f4f6",
            },
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* ✅ DROPDOWN */}
      {isOpen && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            mt: 1,
            width: 220,
            zIndex: 10,
            border: "1px solid #e5e7eb",
          }}
        >
          {users.map((user: any) => {
            const isSelected = selectedUsers.some((u) => u.id === user.id);

            return (
              <Box
                key={user.id}
                onClick={() => {
                  if (isSelected) {
                    handleRemoveUser(user.id);
                  } else {
                    handleAddUser(user);
                  }
                }}
                sx={{
                  px: 1.5,
                  py: 1,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",

                  backgroundColor: isSelected ? "#e5e7eb" : "transparent",

                  fontWeight: isSelected ? 600 : 400,

                  color: isSelected ? "#111827" : "inherit",

                  "&:hover": {
                    backgroundColor: "#f3f4f6",
                  },
                }}
              >
                {user.username}
              </Box>
            );
          })}
        </Paper>
      )}
    </Box>
  );
}
