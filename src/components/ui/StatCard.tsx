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
  iconColor,
  trend,
}: StatCardProps) {
  // Use the new LoadLogic aesthetic: White card, black text, accent bar based on semantic color
  const getBorderColor = () => {
    if (iconColor?.includes('warning')) return 'border-orange-500';
    if (iconColor?.includes('danger')) return 'border-red-500';
    if (iconColor?.includes('success')) return 'border-green-500';
    return 'border-blue-500';
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-[120px]">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getBorderColor()}`}></div>
      <div className="flex items-center justify-between">
         <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-tight">{label}</div>
         <Icon size={16} className="text-gray-400" />
      </div>
      <div className="text-3xl font-black text-black tracking-tight mt-2">{value}</div>
      {trend && (
        <div className="flex items-center gap-1 text-xs mt-1 font-semibold">
          <span className={trend.isPositive ? "text-green-500" : "text-red-500"}>
            {trend.isPositive ? "↑" : "↓"} {trend.value}
          </span>
          <span className="text-gray-400">vs last period</span>
        </div>
      )}
    </div>
  );
}
