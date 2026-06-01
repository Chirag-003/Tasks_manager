"use client";

import {
  Drawer,
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  task: any;
  onClose: () => void;
};

export default function DetailedTask({ task, onClose }: Props) {
  return (
    <Drawer
      anchor="right"
      open={!!task}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 420,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          padding: 2,
        },
      }}
    >
      {task && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* ✅ HEADER */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {task.title}
            </Typography>

            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Chip label={task.status} sx={{ mt: 1, alignSelf: "flex-start" }} />

          <Divider sx={{ my: 2 }} />

          {/* ✅ DESCRIPTION */}
          <Box>
            <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1 }}>
              Description
            </Typography>

            <Typography>{task.description || "No description"}</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* ✅ META */}
          <Box>
            <Typography>
              <strong>Sprint:</strong> {task.sprint || "—"}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <strong>Users:</strong>{" "}
              {!task.users?.length
                ? "—"
                : task.users.map((u: any) => u.username).join(", ")}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* ✅ STATS */}
          <Box>
            <Typography>
              <strong>Subtasks:</strong> {task.subtasks?.length || 0}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <strong>Comments:</strong> {task.comments?.data?.length || 0}
            </Typography>
          </Box>
        </Box>
      )}
    </Drawer>
  );
}
