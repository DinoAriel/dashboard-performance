"use client";

import { equipmentList } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ChevronDown, Filter } from "lucide-react";

interface EquipmentTableProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function EquipmentTable({ selectedId, onSelect }: EquipmentTableProps) {
  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-full overflow-hidden">
      {/* Filters Area */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider">KATEGORI</span>
            <button className="flex items-center justify-between w-40 px-3 py-1.5 text-sm border border-slate-200 rounded-md text-slate-700 bg-white hover:bg-slate-50">
              Semua Kategori
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider">STATUS KESEHATAN</span>
            <button className="flex items-center justify-between w-40 px-3 py-1.5 text-sm border border-slate-200 rounded-md text-slate-700 bg-white hover:bg-slate-50">
              Semua Status
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>
        </div>
        <button className="p-2 border border-slate-200 rounded-md text-slate-500 hover:bg-slate-50 mt-4">
          <Filter size={18} />
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50/50 sticky top-0 z-10 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-500 text-[11px] tracking-wider uppercase">ID Alat</th>
              <th className="px-6 py-3 font-semibold text-slate-500 text-[11px] tracking-wider uppercase">Nama Fasilitas</th>
              <th className="px-6 py-3 font-semibold text-slate-500 text-[11px] tracking-wider uppercase">Kategori</th>
              <th className="px-6 py-3 font-semibold text-slate-500 text-[11px] tracking-wider uppercase">Lokasi</th>
              <th className="px-6 py-3 font-semibold text-slate-500 text-[11px] tracking-wider uppercase">Skor (%)</th>
              <th className="px-6 py-3 font-semibold text-slate-500 text-[11px] tracking-wider uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {equipmentList.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => onSelect(item.id)}
                className={cn(
                  "cursor-pointer transition-colors",
                  selectedId === item.id 
                    ? "bg-slate-100" 
                    : "hover:bg-slate-50"
                )}
              >
                <td className="px-6 py-4 font-medium text-slate-700">{item.id}</td>
                <td className="px-6 py-4 font-semibold text-[#0F172A]">{item.name}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-1 text-[10px] font-bold text-slate-600 bg-slate-200/70 rounded uppercase tracking-wider">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{item.location}</td>
                <td className={cn(
                  "px-6 py-4 font-bold",
                  item.score < 90 ? "text-red-600" : "text-[#0F172A]"
                )}>{item.score}%</td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
                      item.status === "SEHAT" && "bg-green-100 text-green-700",
                      item.status === "PERINGATAN" && "bg-yellow-100 text-yellow-700",
                      item.status === "KRITIS" && "bg-red-100 text-red-700"
                    )}
                  >
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      item.status === "SEHAT" && "bg-green-500",
                      item.status === "PERINGATAN" && "bg-yellow-500",
                      item.status === "KRITIS" && "bg-red-500"
                    )} />
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
