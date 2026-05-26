import { Eye, Trash2 } from "lucide-react";
import { STATUSES, priorityStyles, statusStyles } from "../utils/constants";
import { formatDate, formatLabel } from "../utils/formatters";
import Badge from "./Badge";
import Button from "./Button";
import EmptyState from "./EmptyState";

export default function ComplaintTable({
  complaints,
  isAdmin = false,
  onView,
  onStatusChange,
  onDelete
}) {
  if (!complaints.length) {
    return <EmptyState title="No complaints found" message="Try changing the search or filter options." />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Complaint</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              {isAdmin && <th className="px-4 py-3">User</th>}
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {complaints.map((complaint) => (
              <tr key={complaint._id} className="hover:bg-slate-50">
                <td className="max-w-xs px-4 py-4">
                  <p className="font-semibold text-slate-900">{complaint.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{complaint.description}</p>
                </td>
                <td className="px-4 py-4 text-slate-700">{formatLabel(complaint.category)}</td>
                <td className="px-4 py-4">
                  <Badge value={complaint.priority} styles={priorityStyles[complaint.priority]} />
                </td>
                <td className="px-4 py-4">
                  {isAdmin ? (
                    <select
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold outline-none focus:border-banking-blue"
                      value={complaint.status}
                      onChange={(event) => onStatusChange(complaint._id, event.target.value)}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>{formatLabel(status)}</option>
                      ))}
                    </select>
                  ) : (
                    <Badge value={complaint.status} styles={statusStyles[complaint.status]} />
                  )}
                </td>
                {isAdmin && (
                  <td className="px-4 py-4 text-slate-600">
                    <p className="font-medium text-slate-800">{complaint.user?.name || "User"}</p>
                    <p className="text-xs text-slate-500">{complaint.user?.email || "No email"}</p>
                  </td>
                )}
                <td className="whitespace-nowrap px-4 py-4 text-slate-500">{formatDate(complaint.createdAt)}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" className="px-2" onClick={() => onView(complaint)} aria-label="View complaint">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {!isAdmin && (
                      <Button variant="danger" className="px-2" onClick={() => onDelete(complaint._id)} aria-label="Delete complaint">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
