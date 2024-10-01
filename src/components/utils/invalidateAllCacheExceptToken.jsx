export const invalidateAllCacheExceptToken = () => {
  try {
    const token = localStorage.getItem("token");
    localStorage.clear();
    if (token) {
      localStorage.setItem("token", token);
    }
  } catch (e) {
    console.error("Failed to invalidate cache", e);
  }
};
