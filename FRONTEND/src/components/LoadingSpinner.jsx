export default function LoadingSpinner({ label = "Loading" }) {
  return (
    <div className="flex min-h-48 items-center justify-center gap-3 text-slate-600">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-banking-blue" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
