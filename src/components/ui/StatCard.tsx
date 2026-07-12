import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  trend?: { value: string; isPositive: boolean };
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconBg = "bg-primary/15",
  iconColor = "text-primary-light",
  trend,
}: StatCardProps) {
  return (
    <div className="p-6 bg-white/3 border border-border rounded-xl transition-all hover:border-border-hover hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-text-secondary font-medium">{label}</span>
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}
        >
          <Icon size={20} />
        </div>
      </div>
      <div className="text-3xl font-bold mb-1 leading-tight">{value}</div>
      {trend && (
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className={trend.isPositive ? "text-success" : "text-danger"}>
            {trend.isPositive ? "↑" : "↓"} {trend.value}
          </span>
          <span>vs last period</span>
        </div>
      )}
    </div>
  );
}
