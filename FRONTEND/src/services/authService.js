import api from "./api";

export const registerUser = (formData) => {
  return api.post("/auth/register", formData);
};

export const loginUser = (formData) => {
  return api.post("/auth/login", formData);
};
