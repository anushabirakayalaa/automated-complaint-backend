import api from "./api";

export const registerUser = (formData) => {
  return api.post("/auth/register", formData);
};

export const loginUser = (formData) => {
  return api.post("/auth/login", formData);
};

export const refreshAccessToken = (refreshToken) => {
  return api.post("/auth/refresh", { refreshToken });
};

export const logoutUser = () => {
  return api.post("/auth/logout");
};
