"use client";

import { ChevronDown } from "lucide-react";

export function ScheduleHeader() {
  return (
    <div className="flex items-center justify-between px-8 py-6 bg-[#F8FAFC]">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Jadwal Pemeliharaan Fasilitas</h1>
        <p className="text-sm text-slate-500">Manage and track upcoming maintenance tasks for Terminal A.</p>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200 transition-colors">
          Bulan Ini
        </button>
        <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-transparent border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
          Minggu Ini
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-transparent border border-slate-200 rounded-md hover:bg-slate-50 transition-colors ml-2">
          August 2024
          <ChevronDown size={16} className="text-slate-500" />
        </button>
      </div>
    </div>
  );
}
