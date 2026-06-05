import { Box, Typography, TextField } from "@mui/material";

import { useState, useEffect } from "react";

import {
  useUpdateTaskMutation,
  useUpdateSubtaskMutation,
} from "@/services/api";

type Props = {
  entityId: number;
  entityType: "task" | "subtask";
  value: string;
};

export default function DescriptionField({
  entityId,
  entityType,
  value,
}: Props) {
  const [updateTask] = useUpdateTaskMutation();
  const [updateSubtask] = useUpdateSubtaskMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(value || "");

  // ✅ sync when prop changes
  useEffect(() => {
    setDescription(value || "");
  }, [value]);

  const handleSave = async () => {
    const trimmed = description.trim();

    if (trimmed === value) {
      setIsEditing(false);
      return;
    }

    try {
      if (entityType === "task") {
        await updateTask({
          id: entityId,
          data: { description: trimmed },
        }).unwrap();
      } else {
        await updateSubtask({
          id: entityId,
          data: { description: trimmed },
        }).unwrap();
      }

      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setDescription(value); // ✅ revert
      setIsEditing(false);
    }
  };

  return (
    <Box
      sx={{
        p: 1.5,
        border: "1px solid #e5e7eb",
        borderRadius: 2,
        bgcolor: isEditing ? "#fff" : "#f9fafb",
        cursor: "pointer",

        "&:hover": {
          backgroundColor: !isEditing ? "#f3f4f6" : "#fff",
        },
      }}
      onClick={() => {
        if (!isEditing) setIsEditing(true);
      }}
    >
      {!isEditing ? (
        <Typography
          sx={{
            fontSize: 14,
            whiteSpace: "pre-line",
            color: description ? "inherit" : "#6b7280",
          }}
        >
          {description || "Add a description..."}
        </Typography>
      ) : (
        <TextField
          multiline
          fullWidth
          autoFocus
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);

            // ✅ AUTO-EXPAND LOGIC
            const el = e.target as HTMLTextAreaElement;
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
          }}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setDescription(value);
              setIsEditing(false);
            }

            // ✅ Ctrl/Cmd + Enter → save
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              handleSave();
            }
          }}
          inputRef={(el) => {
            if (el) {
              const length = el.value.length;
              el.setSelectionRange(length, length); // ✅ move cursor to end
            }
          }}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },

            // ✅ remove padding around field
            "& .MuiInputBase-root": {
              padding: 0,
            },

            // ✅ STYLE TEXTAREA DIRECTLY
            "& textarea": {
              padding: 0,
              fontSize: 14,
              lineHeight: "1.5",
              resize: "none",
              overflow: "hidden",
            },
          }}
        />
      )}
    </Box>
  );
}
