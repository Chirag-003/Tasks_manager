export const hasToken = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return !!localStorage.getItem("access_token");
};
