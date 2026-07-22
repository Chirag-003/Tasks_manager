export const ROLE_CONFIG: Record<
  string,
  {
    bg: string;
    color: string;
  }
> = {
  Admin: {
    bg: "#fef2f2",
    color: "#dc2626",
  },

  Manager: {
    bg: "#eff6ff",
    color: "#2563eb",
  },

  Developer: {
    bg: "#f5f3ff",
    color: "#7c3aed",
  },

  QA: {
    bg: "#fffbeb",
    color: "#d97706",
  },

  default: {
    bg: "#f8fafc",
    color: "#475569",
  },
};
