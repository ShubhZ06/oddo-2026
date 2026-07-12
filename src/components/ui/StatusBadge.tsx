import { titleCase, getStatusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  label?: string;
}

const colorMap: Record<string, string> = {
  success: "bg-green-500 text-white border-green-600",
  info: "bg-blue-500 text-white border-blue-600",
  warning: "bg-orange-500 text-white border-orange-600",
  danger: "bg-red-500 text-white border-red-600",
  muted: "bg-gray-200 text-gray-700 border-gray-300",
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const color = getStatusColor(status);
  const classes = colorMap[color] || colorMap.muted;
  const displayLabel = label || titleCase(status);

  return (
    <span
      className={`px-3 py-1 rounded-lg text-xs font-bold border shadow-sm whitespace-nowrap inline-flex items-center justify-center ${classes}`}
    >
      {displayLabel}
    </span>
  );
}
