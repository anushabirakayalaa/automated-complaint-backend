import { Search } from "lucide-react";
import { CATEGORIES, PRIORITIES, STATUSES } from "../utils/constants";
import { formatLabel } from "../utils/formatters";
import Button from "./Button";

export default function ComplaintFilters({ filters, onChange, onApply, onReset, showPriority = true }) {
  const updateField = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <div className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-banking-blue"
          placeholder="Search title, category, or status"
          value={filters.keyword}
          onChange={(event) => updateField("keyword", event.target.value)}
        />
      </div>

      <select
        className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-banking-blue"
        value={filters.status}
        onChange={(event) => updateField("status", event.target.value)}
      >
        <option value="">All statuses</option>
        {STATUSES.map((status) => (
          <option key={status} value={status}>{formatLabel(status)}</option>
        ))}
      </select>

      <select
        className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-banking-blue"
        value={filters.category}
        onChange={(event) => updateField("category", event.target.value)}
      >
        <option value="">All categories</option>
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>{formatLabel(category)}</option>
        ))}
      </select>

      {showPriority && (
        <select
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-banking-blue"
          value={filters.priority}
          onChange={(event) => updateField("priority", event.target.value)}
        >
          <option value="">All priorities</option>
          {PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>{formatLabel(priority)}</option>
          ))}
        </select>
      )}

      <div className="flex gap-2">
        <Button onClick={onApply}>Apply</Button>
        <Button variant="secondary" onClick={onReset}>Reset</Button>
      </div>
    </div>
  );
}
