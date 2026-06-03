"use client";

import { Box, Typography, Divider, IconButton, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddSubtaskCommentMutation } from "@/services/api";

type Props = {
  subtask: any;
};

export default function DetailedSubtask({ subtask }: Props) {
  const router = useRouter();
  const [commentText, setCommentText] = useState("");

  const [addComment, { isLoading }] = useAddSubtaskCommentMutation();

  if (!subtask) return null;

  // ✅ ADD COMMENT
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await addComment({
        subtaskId: subtask.id, // ✅ IMPORTANT: subtask id
        data: {
          content: commentText,
          user_id: 5,
        },
      }).unwrap();

      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        overflow: "hidden",
        backgroundColor: "#edeff0",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ✅ HEADER */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton onClick={() => router.back()}>
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {subtask.title}
          </Typography>
        </Box>

        {/* ✅ CONTENT */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
          }}
        >
          {/* ✅ DETAILS */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Row label="Status">
              <Typography sx={{ textTransform: "capitalize" }}>
                {subtask.status}
              </Typography>
            </Row>

            <Row label="Sprint">{subtask.sprint || "—"}</Row>

            <Row label="Assignee">
              {!subtask.users?.length
                ? "—"
                : subtask.users.map((u: any) => u.username).join(", ")}
            </Row>
          </Box>

          <Divider />

          {/* ✅ COMMENTS */}
          <Typography
            sx={{
              fontSize: 13,
              color: "text.secondary",
            }}
          >
            Comments
          </Typography>

          {!subtask?.comments?.data?.length ? (
            <Typography sx={{ color: "text.secondary" }}>
              No comments
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {subtask.comments.data.map((comment: any) => (
                <Box
                  key={comment.id}
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    backgroundColor: "#f5f7fa",
                  }}
                >
                  <Typography>{comment.content}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* ✅ COMMENT INPUT (SAME AS TASK PAGE) */}
        <Box sx={{ p: 2, borderTop: "1px solid #e5e7eb" }}>
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
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              Send
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* ✅ ROW COMPONENT */
function Row({ label, children }: any) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "120px 1fr",
        alignItems: "center",
        columnGap: 2,
      }}
    >
      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
        {label}
      </Typography>

      {/* ✅ FIXED */}
      <Box sx={{ fontSize: 14 }}>{children}</Box>
    </Box>
  );
}
