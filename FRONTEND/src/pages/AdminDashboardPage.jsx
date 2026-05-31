import { AlertTriangle, CheckCircle2, Clock, FolderKanban } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { useToast } from "../context/ToastContext";
import { getDashboardStats } from "../services/complaintService";
import { formatLabel } from "../utils/formatters";

function BreakdownCard({ title, items }) {
  const entries = Object.entries(items || {});

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      <div className="mt-4 space-y-3">
        {!entries.length && <EmptyState title="No analytics yet" message="Data appears after complaints are created." />}
        {entries.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
            <span className="text-sm font-medium text-slate-700">{formatLabel(label)}</span>
            <span className="text-sm font-bold text-banking-navy">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (error) {
        showToast(error.message || "Unable to load dashboard", "error");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading dashboard" />;
  }

  return (
    <>
      <PageHeader title="Admin Dashboard" subtitle="Operational overview of banking complaints and escalation flow." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Complaints" value={stats?.total} icon={FolderKanban} />
        <StatCard title="Pending" value={stats?.pending} icon={Clock} accent="bg-amber-50 text-amber-700" />
        <StatCard title="Escalated" value={stats?.escalated} icon={AlertTriangle} accent="bg-red-50 text-red-700" />
        <StatCard title="Resolved" value={stats?.resolved} icon={CheckCircle2} accent="bg-emerald-50 text-emerald-700" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <BreakdownCard title="Complaints by Category" items={stats?.byCategory} />
        <BreakdownCard title="Complaints by Priority" items={stats?.byPriority} />
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-base font-bold text-slate-900">Most Common Issue Type</h2>
        <p className="mt-2 text-sm text-slate-500">
          {stats?.mostCommonIssueType
            ? `${formatLabel(stats.mostCommonIssueType.category)} has the highest number of complaints (${stats.mostCommonIssueType.count}).`
            : "No complaint trend is available yet."}
        </p>
      </div>
    </>
  );
}
