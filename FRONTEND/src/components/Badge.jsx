import { formatLabel } from "../utils/formatters";

export default function Badge({ value, styles }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles}`}>
      {formatLabel(value)}
    </span>
  );
}
