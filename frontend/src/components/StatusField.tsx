import { Select, MenuItem } from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import {
  useUpdateTaskMutation,
  useUpdateSubtaskMutation,
} from "@/services/api";

type Props = {
  entityId: number;
  entityType: "task" | "subtask";
  value: string;
};

const statusOptions = [
  "backlog",
  "todo",
  "in progress",
  "in review",

  "completed",
];

export default function StatusField({ entityId, entityType, value }: Props) {
  const [updateTask] = useUpdateTaskMutation();
  const [updateSubtask] = useUpdateSubtaskMutation();

  const handleChange = async (newStatus: string) => {
    try {
      if (entityType === "task") {
        await updateTask({
          id: entityId,
          data: { status: newStatus },
        }).unwrap();
      } else {
        await updateSubtask({
          id: entityId,
          data: { status: newStatus },
        }).unwrap();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Select
      value={value}
      onChange={(e) => handleChange(e.target.value as string)}
      size="small"
      IconComponent={ArrowDropDownIcon}
      sx={{
        fontSize: 14,
        textTransform: "capitalize",

        display: "inline-flex",
        alignItems: "center",

        ".MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },

        "& .MuiSelect-select": {
          padding: "0px 6px",
          display: "flex",
          alignItems: "center",
        },

        "& .MuiSelect-icon": {
          right: 0,
        },

        minWidth: "auto",
      }}
    >
      {statusOptions.map((status) => (
        <MenuItem key={status} value={status}>
          {status.replace("_", " ")}
        </MenuItem>
      ))}
    </Select>
  );
}
