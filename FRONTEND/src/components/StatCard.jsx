export default function StatCard({ title, value, icon: Icon, accent = "bg-blue-50 text-banking-blue" }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value ?? 0}</p>
        </div>
        {Icon && (
          <div className={`rounded-lg p-3 ${accent}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
}
