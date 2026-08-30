import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  caption: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor: string;
}

export function KPICard({ title, value, caption, icon: Icon, iconBgColor, iconColor }: KPICardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">{title}</span>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-full", iconBgColor)}>
          <Icon className={iconColor} size={20} strokeWidth={2.5} />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-4xl font-bold text-[#0F172A] tracking-tight">{value}</span>
      </div>
      <div className="mt-1">
        <span className="text-xs text-slate-500 font-medium">{caption}</span>
      </div>
    </div>
  );
}
