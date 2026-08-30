"use client";

import { Search, Plus, AlertCircle } from "lucide-react";

export function AlertsTopbar() {
  return (
    <div className="flex h-[88px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div className="flex items-center gap-4">
        <h1 className="text-[22px] font-bold text-[#0F172A]">Log Alert & Permasalahan Aktif</h1>
        <div className="flex items-center gap-1.5 bg-red-100 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold border border-red-200">
          <AlertCircle size={14} />
          3 Kritis Belum Terselesaikan
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <Search size={20} />
        </button>

        <button className="flex items-center gap-2 bg-[#0F52BA] text-white font-medium px-4 py-2.5 rounded-md hover:bg-[#0b409c] transition-colors shadow-sm text-sm">
          <Plus size={18} />
          Create Ticket
        </button>
      </div>
    </div>
  );
}
