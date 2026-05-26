export const formatDate = (date) => {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(date));
};

export const formatLabel = (value = "") => {
  return value.replaceAll("_", " ");
};

export const getInitials = (name = "User") => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export const unwrapComplaintList = (response) => {
  return Array.isArray(response) ? response : response?.complaints || [];
};
