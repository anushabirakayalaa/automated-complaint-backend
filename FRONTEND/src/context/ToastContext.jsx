import { createContext, useContext, useMemo, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const value = useMemo(() => ({ showToast }), []);
  const isError = toast?.type === "error";
  const Icon = isError ? XCircle : CheckCircle;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div className="fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-lg border bg-white p-4 text-sm shadow-soft">
          <Icon className={isError ? "h-5 w-5 text-red-600" : "h-5 w-5 text-emerald-600"} />
          <p className="font-medium text-slate-800">{toast.message}</p>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
