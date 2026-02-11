import { clearToken, getValidToken } from "./auth";

const handleUnauthorized = () => {
  clearToken();
  if (typeof window !== "undefined") {
    window.location.replace("/");
  }
};

export const apiFetch = async (url, options = {}) => {
  const token = getValidToken();
  if (!token) {
    handleUnauthorized();
    throw new Error("Unauthorized");
  }

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`
  };

  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    handleUnauthorized();
    throw new Error("Unauthorized");
  }
  return response;
};
