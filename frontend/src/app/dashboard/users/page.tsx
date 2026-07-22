"use client";

import { Box, Typography, Divider, Avatar, Button } from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { useGetCurrentUserQuery, useGetUsersQuery } from "@/services/api";
import { useState } from "react";
import { hasPermission } from "@/utils/permission";

import DeleteUserDialog from "@/components/users/DeleteUserDialog";
import EditUserDialog from "@/components/users/EditUserDialog";

export default function UsersPage() {
  const { data, isError } = useGetUsersQuery();

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { data: currentUser } = useGetCurrentUserQuery(undefined);

  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  if (isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Error fetching users</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          height: "100%",
          p: 3,
          background: "linear-gradient(to bottom, #edeeef, #ffffff)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            User Management
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              fontSize: 14,
            }}
          >
            Manage user accounts, profile information, and security settings.
          </Typography>
        </Box>

        {/* CONTAINER */}
        <Box
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 4,
            overflow: "hidden",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "80px 1fr 1.5fr 180px",
              px: 3,
              py: 2,
              borderBottom: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc",
              fontSize: 13,
              fontWeight: 600,
              color: "#64748b",
            }}
          >
            <Box>User</Box>
            <Box>Username</Box>
            <Box>Email</Box>
            <Box>Actions</Box>
          </Box>

          {/* LIST */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",

              "&::-webkit-scrollbar": {
                width: "8px",
              },

              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#cbd5e1",
                borderRadius: "999px",
              },
            }}
          >
            {data?.map((user: any) => (
              <Box key={user.id}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr 1.5fr 220px",
                    alignItems: "center",
                    px: 3,
                    py: 1,
                    transition: "all 0.2s ease",

                    "&:hover": {
                      backgroundColor: "#f8fafc",
                      boxShadow: "inset 0 0 0 1px #e2e8f0",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      background: "linear-gradient(135deg, #2563eb, #7c3aed)",

                      boxShadow: "0 6px 16px rgba(37,99,235,0.25)",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {user.username?.charAt(0)?.toUpperCase()}
                  </Avatar>

                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#0f172a",
                    }}
                  >
                    {user.username}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: 14,
                    }}
                  >
                    {user.email}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >
                    <Button
                      startIcon={<EditOutlinedIcon />}
                      onClick={() => {
                        setSelectedUser(user);
                        setOpenEditDialog(true);
                      }}
                      sx={{
                        textTransform: "none",
                        minWidth: 80,
                        height: 32,

                        borderRadius: "10px",

                        background: "linear-gradient(135deg, #2563eb, #3b82f6)",

                        color: "#fff",

                        fontWeight: 600,

                        boxShadow: "0 4px 12px rgba(37,99,235,0.25)",

                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #1d4ed8, #2563eb)",

                          boxShadow: "0 8px 18px rgba(37,99,235,0.35)",
                        },
                      }}
                    >
                      Edit
                    </Button>

                    {hasPermission(currentUser?.permissions, "user.delete") && (
                      <Button
                        color="error"
                        variant="outlined"
                        startIcon={<DeleteOutlineIcon />}
                        onClick={() => {
                          setSelectedUser(user);
                          setOpenDeleteDialog(true);
                        }}
                        sx={{
                          textTransform: "none",

                          minWidth: 80,
                          height: 32,

                          borderRadius: "10px",

                          borderWidth: "1.5px",

                          fontWeight: 600,

                          "&:hover": {
                            borderWidth: "1.5px",
                            backgroundColor: "#fef2f2",
                          },
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </Box>
                </Box>

                <Divider />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <DeleteUserDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        user={selectedUser}
      />
      <EditUserDialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </>
  );
}
