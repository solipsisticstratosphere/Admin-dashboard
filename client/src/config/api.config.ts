export const API_CONFIG = {
  url: import.meta.env.VITE_API_URL,
  isDevelopment: import.meta.env.VITE_NODE_ENV === "development",
  isProduction: import.meta.env.VITE_NODE_ENV === "production",
};
