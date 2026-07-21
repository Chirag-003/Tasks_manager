"use client";

import { Box, Typography, Divider, Avatar, Button } from "@mui/material";

import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { useGetCurrentUserQuery, useGetUsersQuery } from "@/services/api";
import { useState } from "react";
import { hasPermission } from "@/utils/permission";

import DeleteUserDialog from "@/components/users/DeleteUserDialog";
import EditUserDialog from "@/components/users/EditUserDialog";

export default function UsersPage() {
  const { data, isError } = useGetUsersQuery();

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openResetDialog, setOpenResetDialog] = useState(false);

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
          backgroundColor: "#f8fafc",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            Users
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              fontSize: 14,
            }}
          >
            Manage and view all registered users
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
                    gridTemplateColumns: "80px 1fr 1.5fr 180px",
                    alignItems: "center",
                    px: 3,
                    py: 1,
                    transition: "all 0.2s ease",

                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#2563eb",
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
                      variant="outlined"
                      startIcon={<EditOutlinedIcon />}
                      onClick={() => {
                        setSelectedUser(user);
                        setOpenEditDialog(true);
                      }}
                      sx={{
                        textTransform: "capitalize",
                        height: 36,
                      }}
                    >
                      Edit
                    </Button>

                    {hasPermission(
                      currentUser?.permissions,
                      "user.reset_password",
                    ) && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setSelectedUser(user);
                          setOpenDeleteDialog(true);
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
