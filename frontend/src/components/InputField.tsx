"use client";

import { Controller } from "react-hook-form";
import {
  TextField,
  InputAdornment,
  MenuItem,
  TextFieldProps,
} from "@mui/material";

type Option = {
  label: string;
  value: string | number;
};

type InputFieldProps = {
  name: string;
  control: any;

  label: string;

  type?: "text" | "textarea" | "select" | "password";
  options?: Option[];

  icon?: React.ReactNode;

  errors?: any;
  extraError?: string;

  required?: boolean;

  rows?: number;

  onChangeExtra?: () => void;

  textFieldProps?: TextFieldProps;

  rules?: any; // ✅ ADD THIS
};

export default function InputField({
  name,
  control,
  label,

  type = "text",
  options = [],

  icon,

  errors,
  extraError,

  required = false,

  rows = 3,

  onChangeExtra,

  textFieldProps,

  rules, // ✅ RECEIVE HERE
}: InputFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules} // ✅ APPLY HERE
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          size="small"
          fullWidth
          required={required}
          select={type === "select"}
          multiline={type === "textarea"}
          minRows={type === "textarea" ? rows : undefined}
          type={type === "select" || type === "textarea" ? undefined : type}
          error={!!errors?.[name] || !!extraError}
          helperText={errors?.[name]?.message || extraError}
          onChange={(e) => {
            field.onChange(e);
            onChangeExtra?.();
          }}
          InputProps={
            icon
              ? {
                  startAdornment: (
                    <InputAdornment position="start">{icon}</InputAdornment>
                  ),
                }
              : undefined
          }
          sx={{
            backgroundColor: "#f9fafb",
            borderRadius: 2,
            ...textFieldProps?.sx,
          }}
          {...textFieldProps}
        >
          {type === "select" &&
            options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
        </TextField>
      )}
    />
  );
}
