export const getPasswordStrength = (password: string) => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  const uniqueChars = new Set(password).size;

  if (uniqueChars >= 8) score++;

  return score;
};

export const getPasswordStrengthLabel = (score: number) => {
  if (score <= 2) {
    return {
      label: "Weak",
      color: "#ef4444",
    };
  }

  if (score <= 4) {
    return {
      label: "Fair",
      color: "#f59e0b",
    };
  }

  if (score <= 6) {
    return {
      label: "Good",
      color: "#3b82f6",
    };
  }

  return {
    label: "Strong",
    color: "#22c55e",
  };
};
