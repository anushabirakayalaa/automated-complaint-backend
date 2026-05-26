export const STATUSES = ["PENDING", "ESCALATED", "RESOLVED"];
export const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];
export const CATEGORIES = ["ATM", "UPI", "LOAN", "CREDIT_CARD", "FRAUD", "NET_BANKING"];

export const statusStyles = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  ESCALATED: "bg-red-100 text-red-800 border-red-200",
  RESOLVED: "bg-emerald-100 text-emerald-800 border-emerald-200"
};

export const priorityStyles = {
  LOW: "bg-slate-100 text-slate-700 border-slate-200",
  MEDIUM: "bg-blue-100 text-blue-800 border-blue-200",
  HIGH: "bg-rose-100 text-rose-800 border-rose-200"
};
