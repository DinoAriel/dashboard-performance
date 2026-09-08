"use client";

import { useState } from "react";
import { equipmentList as mockEquipmentList } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ChevronDown, Filter } from "lucide-react";

interface EquipmentTableProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  equipment?: {
    id: string;
    name: string;
    category: string;
    location: string;
    score: number;
    status: "SEHAT" | "PERINGATAN" | "KRITIS";
  }[];
  searchQuery?: string;
  isLoading?: boolean;
}

export function EquipmentTable({ selectedId, onSelect, equipment, searchQuery = "", isLoading = false }: EquipmentTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");
  const [selectedStatus, setSelectedStatus] = useState<string>("semua");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const listData = equipment || [];

  const filteredList = listData.filter((item) => {
    const matchCategory =
      selectedCategory === "semua" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchStatus =
      selectedStatus === "semua" ||
      item.status.toLowerCase() === selectedStatus.toLowerCase();

    const matchSearch =
      !searchQuery ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchStatus && matchSearch;
  });

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-full overflow-hidden">
      {/* Filters Area */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          {/* Category Filter */}
          <div className="flex flex-col gap-1 relative">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider">KATEGORI</span>
            <button 
              onClick={() => {
                setIsCategoryOpen(!isCategoryOpen);
                setIsStatusOpen(false);
              }}
              className="flex items-center justify-between w-40 px-3 py-1.5 text-sm border border-slate-200 rounded-md text-slate-700 bg-white hover:bg-slate-50 font-normal cursor-pointer select-none"
            >
              {selectedCategory === "semua"
                ? "Semua Kategori"
                : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).toLowerCase()}
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {isCategoryOpen && (
              <div className="absolute top-[52px] left-0 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-30 py-1">
                {["Semua Kategori", "ELEKTRIKAL", "MEKANIKAL", "ELEKTRONIKA"].map((cat) => {
                  const val = cat === "Semua Kategori" ? "semua" : cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(val.toLowerCase());
                        setIsCategoryOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 cursor-pointer",
                        selectedCategory === val.toLowerCase() ? "font-semibold text-[#0F52BA]" : "text-slate-600"
                      )}
                    >
                      {cat === "Semua Kategori" ? cat : cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1 relative">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider">STATUS KESEHATAN</span>
            <button 
              onClick={() => {
                setIsStatusOpen(!isStatusOpen);
                setIsCategoryOpen(false);
              }}
              className="flex items-center justify-between w-40 px-3 py-1.5 text-sm border border-slate-200 rounded-md text-slate-700 bg-white hover:bg-slate-50 font-normal cursor-pointer select-none"
            >
              {selectedStatus === "semua"
                ? "Semua Status"
                : selectedStatus.toUpperCase()}
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {isStatusOpen && (
              <div className="absolute top-[52px] left-0 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-30 py-1">
                {["Semua Status", "SEHAT", "PERINGATAN", "KRITIS"].map((status) => {
                  const val = status === "Semua Status" ? "semua" : status;
                  return (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedStatus(val.toLowerCase());
                        setIsStatusOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 cursor-pointer",
                        selectedStatus === val.toLowerCase() ? "font-semibold text-[#0F52BA]" : "text-slate-600"
                      )}
                    >
                      {status === "Semua Status" ? status : status.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>


      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
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
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  Memuat data alat...
                </td>
              </tr>
            ) : filteredList.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  Tidak ada alat yang ditemukan.
                </td>
              </tr>
            ) : filteredList.map((item) => (
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
