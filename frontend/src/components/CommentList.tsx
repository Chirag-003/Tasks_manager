"use client";

import { Box, Typography } from "@mui/material";

type Props = {
  comments: any[];
};

export default function CommentList({ comments }: Props) {
  if (!comments?.length) {
    return (
      <Typography
        sx={{
          color: "text.secondary",
          mb: 1,
        }}
      >
        No comments
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        mb: 2,
      }}
    >
      {comments.map((comment: any) => (
        <Box
          key={comment.id}
          sx={{
            p: 1.5,
            borderRadius: 2,
            border: "1px solid #e5e7eb",
            backgroundColor: "#fafafa",
          }}
        >
          {comment.user?.username && (
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: "text.secondary",
                mb: 0.5,
              }}
            >
              {comment.user.username}
            </Typography>
          )}

          <Typography>{comment.content}</Typography>
        </Box>
      ))}
    </Box>
  );
}
