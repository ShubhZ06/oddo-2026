import { titleCase, getStatusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  label?: string;
}

const colorMap: Record<string, string> = {
  success: "bg-success/15 text-success",
  info: "bg-info/15 text-info",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  muted: "bg-text-muted/15 text-text-muted",
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const color = getStatusColor(status);
  const classes = colorMap[color] || colorMap.muted;
  const displayLabel = label || titleCase(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wide whitespace-nowrap ${classes}`}
    >
      {displayLabel}
    </span>
  );
}
