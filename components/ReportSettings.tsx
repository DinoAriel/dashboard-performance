"use client";

import { ChevronDown, FileText } from "lucide-react";

export function ReportSettings() {
  return (
    <div className="w-[380px] shrink-0 bg-white border border-slate-200 rounded-lg flex flex-col p-6 shadow-sm">
      <h2 className="text-[17px] font-bold text-[#0F172A] mb-8">Pengaturan Laporan</h2>

      <div className="flex-1 flex flex-col gap-6">
        {/* Rentang Waktu */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Rentang Waktu</label>
          <div className="relative">
            <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm border border-slate-200 rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors">
              Jan - Agt 2026
              <ChevronDown size={16} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Kategori Data */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-slate-700 mb-1">Kategori Data</label>
          
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              defaultChecked 
              className="w-4 h-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
            />
            <span className="text-sm text-slate-700 group-hover:text-slate-900">Elektrikal</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              defaultChecked 
              className="w-4 h-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
            />
            <span className="text-sm text-slate-700 group-hover:text-slate-900">Mekanikal</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              defaultChecked 
              className="w-4 h-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
            />
            <span className="text-sm text-slate-700 group-hover:text-slate-900">Elektronika</span>
          </label>
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-8">
        <button className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white font-medium py-2.5 rounded-lg hover:bg-[#1d4ed8] transition-colors shadow-sm">
          <FileText size={18} />
          Generate Report
        </button>
      </div>
    </div>
  );
}
