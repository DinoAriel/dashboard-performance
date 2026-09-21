"use client";

import { ListFilter } from "lucide-react";
import { AlertFilterState } from "@/app/alerts/page";

interface AlertFiltersProps {
  filters: AlertFilterState;
  onFiltersChange: (f: AlertFilterState) => void;
}

export function AlertFilters({ filters, onFiltersChange }: AlertFiltersProps) {
  const toggleSeverity = (key: keyof AlertFilterState["severity"]) => {
    onFiltersChange({
      ...filters,
      severity: { ...filters.severity, [key]: !filters.severity[key] },
    });
  };

  const severityOptions: { key: keyof AlertFilterState["severity"]; label: string; color: string }[] = [
    { key: "KRITIS", label: "Kritis", color: "#B91C1C" },
    { key: "PERINGATAN", label: "Peringatan", color: "#F59E0B" },
    { key: "INFO", label: "Info", color: "#0F52BA" },
  ];

  return (
    <div className="w-[300px] shrink-0 bg-white border-l border-slate-200 flex flex-col p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <ListFilter size={20} className="text-slate-700" />
        <h2 className="text-[17px] font-bold text-[#0F172A]">Filter Masalah</h2>
      </div>

      {/* Severity */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-4">
          Tingkat Keparahan (Severity)
        </h3>
        <div className="flex flex-col gap-3">
          {severityOptions.map(({ key, label, color }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.severity[key]}
                onChange={() => toggleSeverity(key)}
                className="w-4 h-4 rounded border-slate-300 cursor-pointer"
              />
              <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                {label}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Active summary */}
      <div className="mt-auto pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400 font-medium">
          Menampilkan:{" "}
          {Object.entries(filters.severity)
            .filter(([, v]) => v)
            .map(([k]) => k)
            .join(", ") || "Tidak ada"}
        </p>
      </div>
    </div>
  );
}
