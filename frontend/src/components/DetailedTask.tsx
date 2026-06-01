"use client";

import {
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { useAddTaskCommentMutation } from "@/services/api";

type Props = {
  task: any;
  onClose: () => void;
};

export default function DetailedTask({ task, onClose }: Props) {
  const [commentText, setCommentText] = useState("");

  const [addComment, { isLoading }] = useAddTaskCommentMutation();

  if (!task) return null;

  // ✅ POST COMMENT
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await addComment({
        taskId: task.id,
        data: {
          content: commentText,
          user_id: 5, // ✅ STATIC USER (TEMP FIX)
        },
      }).unwrap();

      setCommentText(""); // ✅ clear input
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
      }}
    >
      {/* ✅ HEADER */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {task.title}
        </Typography>

        <IconButton onClick={onClose}>✕</IconButton>
      </Box>

      {/* ✅ CONTENT */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {/* ✅ TOP DETAILS */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Row label="Assignee">
            {!task.users?.length
              ? "—"
              : task.users.map((u: any) => u.username).join(", ")}
          </Row>

          <Row label="Status">
            <Chip size="small" label={task.status} />
          </Row>

          <Row label="Sprint">{task.sprint || "—"}</Row>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ✅ DESCRIPTION */}
        <Box>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1 }}>
            Description
          </Typography>

          <Box
            sx={{
              p: 1.5,
              border: "1px solid #e5e7eb",
              borderRadius: 2,
              backgroundColor: "#f9fafb",
              fontSize: 14,
            }}
          >
            {task.description || "No description"}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ✅ SUBTASKS */}
        <Box>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1 }}>
            Subtasks
          </Typography>

          {!task.subtasks?.length ? (
            <Typography sx={{ color: "text.secondary" }}>
              No subtasks
            </Typography>
          ) : (
            task.subtasks.map((subtask: any) => (
              <Accordion
                key={subtask.id}
                sx={{
                  mb: 1,
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  boxShadow: "none",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography component="div">{subtask.title}</Typography>
                </AccordionSummary>

                <AccordionDetails>
                  {!subtask.comments?.data?.length ? (
                    <Typography component="div">No comments</Typography>
                  ) : (
                    subtask.comments.data.map((c: any) => (
                      <Typography
                        key={c.id}
                        component="div"
                        sx={{ fontSize: 13 }}
                      >
                        • {c.content}
                      </Typography>
                    ))
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ✅ COMMENTS */}
        <Box>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1 }}>
            Comments
          </Typography>

          {!task.comments?.data?.length ? (
            <Typography sx={{ color: "text.secondary" }}>
              No comments
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {task.comments.data.map((comment: any) => (
                <Box
                  key={comment.id}
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    backgroundColor: "#f5f7fa",
                  }}
                >
                  <Typography component="div" sx={{ fontSize: 14 }}>
                    {comment.content}
                  </Typography>

                  <Typography
                    component="div"
                    sx={{
                      fontSize: 12,
                      color: "text.secondary",
                    }}
                  >
                    — {comment.user?.username}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* ✅ COMMENT INPUT */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #e5e7eb",
          backgroundColor: "#fff",
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />

          <Box
            onClick={handleAddComment}
            sx={{
              px: 2,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              backgroundColor: "#1976d2",
              color: "#fff",
              borderRadius: 1,
              fontSize: 14,
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            Send
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* ✅ FIXED ROW COMPONENT */
function Row({ label, children }: any) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
        {label}
      </Typography>

      <Typography component="div" sx={{ fontSize: 14 }}>
        {children}
      </Typography>
    </Box>
  );
}
