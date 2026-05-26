import { CheckCircle2 } from "lucide-react";
import { formatDate } from "../utils/formatters";
import Badge from "./Badge";
import { statusStyles } from "../utils/constants";

export default function ComplaintTimeline({ history = [] }) {
  if (!history.length) {
    return <p className="text-sm text-slate-500">No status history available yet.</p>;
  }

  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <div key={`${item.status}-${item.updatedAt}-${index}`} className="flex gap-3">
          <div className="flex flex-col items-center">
            <CheckCircle2 className="h-5 w-5 text-banking-blue" />
            {index !== history.length - 1 && <span className="mt-1 h-full w-px bg-slate-200" />}
          </div>
          <div className="pb-3">
            <Badge value={item.status} styles={statusStyles[item.status]} />
            <p className="mt-1 text-sm text-slate-500">{formatDate(item.updatedAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
