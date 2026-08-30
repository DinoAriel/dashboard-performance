"use client";

import { ListFilter } from "lucide-react";

export function AlertFilters() {
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
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              defaultChecked 
              className="w-4 h-4 rounded border-slate-300 text-[#B91C1C] focus:ring-[#B91C1C]"
            />
            <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <span className="w-2 h-2 rounded-full bg-[#B91C1C]" />
              Kritis
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-slate-300 text-slate-500 focus:ring-slate-500"
            />
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 group-hover:text-slate-800">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              Peringatan
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-slate-300 text-[#0F52BA] focus:ring-[#0F52BA]"
            />
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 group-hover:text-slate-800">
              <span className="w-2 h-2 rounded-full bg-[#0F52BA]" />
              Info
            </div>
          </label>
        </div>
      </div>

      {/* Status */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-4">
          Status Pengerjaan
        </h3>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              defaultChecked
              className="w-4 h-4 rounded border-slate-300 text-[#0F52BA] focus:ring-[#0F52BA]"
            />
            <span className="text-sm font-medium text-slate-800">Baru</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-slate-300 text-[#0F52BA] focus:ring-[#0F52BA]"
            />
            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800">Sedang Dikerjakan</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-slate-300 text-[#0F52BA] focus:ring-[#0F52BA]"
            />
            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800">Diselesaikan</span>
          </label>
        </div>
      </div>
    </div>
  );
}
