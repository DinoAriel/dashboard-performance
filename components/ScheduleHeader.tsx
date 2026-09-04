"use client";

import { Plus, Calendar as CalendarIcon } from "lucide-react";

export function ScheduleHeader({ 
  onOpenAddModal,
  selectedMonth,
  onMonthChange
}: { 
  onOpenAddModal: () => void;
  selectedMonth: string;
  onMonthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex items-center justify-between px-8 py-6 bg-[#F8FAFC]">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Jadwal Pemeliharaan Fasilitas</h1>
        <p className="text-sm text-slate-500">Kelola dan pantau jadwal tugas pemeliharaan.</p>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Filter Bulan Kustom */}
        <div className="relative flex items-center">
          <CalendarIcon size={16} className="absolute left-3 text-slate-500" />
          <input 
            type="month"
            value={selectedMonth || ""}
            onChange={onMonthChange}
            className="pl-9 pr-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors focus:outline-none focus:ring-1 focus:ring-[#3B82F6] cursor-pointer"
          />
        </div>

        {/* Tombol Tambah Jadwal */}
        <button 
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0F52BA] rounded-md hover:bg-[#083A8A] transition-colors ml-2 shadow-sm"
        >
          <Plus size={16} />
          Tambah Jadwal
        </button>
      </div>
    </div>
  );
}
