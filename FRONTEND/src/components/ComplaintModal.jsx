import { X } from "lucide-react";
import { formatDate, formatLabel } from "../utils/formatters";
import { priorityStyles, statusStyles } from "../utils/constants";
import Badge from "./Badge";
import Button from "./Button";
import ComplaintTimeline from "./ComplaintTimeline";

export default function ComplaintModal({ complaint, onClose }) {
  if (!complaint) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-soft">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{complaint.title}</h2>
            <p className="text-sm text-slate-500">Created {formatDate(complaint.createdAt)}</p>
          </div>
          <Button variant="secondary" className="px-2" onClick={onClose} aria-label="Close complaint details">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1.2fr_0.8fr]">
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Complaint Details</h3>
            <div className="space-y-4 rounded-lg border border-slate-200 p-4">
              <p className="text-sm leading-6 text-slate-700">{complaint.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge value={complaint.status} styles={statusStyles[complaint.status]} />
                <Badge value={complaint.priority} styles={priorityStyles[complaint.priority]} />
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {formatLabel(complaint.category)}
                </span>
              </div>
            </div>

            <h3 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">Status Timeline</h3>
            <div className="rounded-lg border border-slate-200 p-4">
              <ComplaintTimeline history={complaint.history} />
            </div>
          </section>

          <aside>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">User Info</h3>
            <div className="rounded-lg border border-slate-200 p-4 text-sm">
              <p className="font-semibold text-slate-900">{complaint.user?.name || "Registered User"}</p>
              <p className="mt-1 text-slate-500">{complaint.user?.email || "Email not shown"}</p>
              <p className="mt-4 text-slate-500">Last updated</p>
              <p className="font-medium text-slate-800">{formatDate(complaint.updatedAt)}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
