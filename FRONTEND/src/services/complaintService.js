import api from "./api";

export const createComplaint = (formData) => {
  return api.post("/complaints", formData);
};

export const getMyComplaints = (params = {}) => {
  return api.get("/complaints/my", { params });
};

export const getAllComplaints = (params = {}) => {
  return api.get("/complaints", { params });
};

export const searchComplaints = (params = {}) => {
  return api.get("/complaints/search", { params });
};

export const filterComplaints = (params = {}) => {
  return api.get("/complaints/filter", { params });
};

export const getDashboardStats = () => {
  return api.get("/complaints/dashboard");
};

export const updateComplaintStatus = (id, status) => {
  return api.put(`/complaints/status/${id}`, { status });
};

export const deleteComplaint = (id) => {
  return api.delete(`/complaints/${id}`);
};
