"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { MonthlyDetailModal } from "./MonthlyDetailModal";

interface EquipmentData {
  id: string;
  name: string;
  category: string;
  score: number;
  status: "SEHAT" | "PERINGATAN" | "KRITIS";
  history?: { name: string; value: number }[];
}

interface DashboardTableProps {
  facilities?: EquipmentData[];
  categoriesList?: {
    id: string;
    label: string;
    count: number;
  }[];
}

// Fallback mock history if not provided by backend yet
const generateMockHistory = (scoreVal: any) => {
  const currentScore = Number(scoreVal) || 0;
  return [
    { name: "Apr", value: Math.max(0, currentScore - 5) },
    { name: "Mei", value: Math.max(0, currentScore - 2) },
    { name: "Jun", value: Math.max(0, currentScore - 4) },
    { name: "Jul", value: Math.min(100, currentScore + 1) },
    { name: "Agt", value: Math.max(0, currentScore - 1) },
    { name: "Sep", value: currentScore },
  ];
};

export function DashboardTable({ facilities, categoriesList }: DashboardTableProps) {
  const [selectedCategory, setSelectedCategory] = useState("elektrikal");
  const [selectedEquipmentForModal, setSelectedEquipmentForModal] = useState<string | null>(null);
  
  const facilitiesData: EquipmentData[] = (facilities && facilities.length > 0 ? facilities : []) as EquipmentData[];
  
  const defaultCategories = [
    { id: "ELEKTRIKAL", label: "Elektrikal", count: 6 },
    { id: "MEKANIKAL", label: "Mekanikal", count: 8 },
    { id: "ELEKTRONIKA", label: "Elektronika", count: 12 },
  ];
  
  const categoriesData = categoriesList && categoriesList.length > 0 
    ? categoriesList.filter(c => c.id !== "semua") // Remove 'semua' because Option B strictly uses category tabs
    : defaultCategories;

  // Make sure selected category correctly matches one of the options. Default is Elektrikal.
  const activeCategory = selectedCategory || categoriesData[0]?.id;

  const filteredFacilities = facilitiesData.filter(
    (facility) => facility.category.toLowerCase() === activeCategory.toLowerCase()
  );

  const getStatusColor = (status: string) => {
    if (status === "SEHAT") return "#16a34a";
    if (status === "PERINGATAN") return "#eab308";
    if (status === "KRITIS") return "#dc2626";
    return "#64748B";
  };

  const getStatusBg = (status: string) => {
    if (status === "SEHAT") return "bg-green-100 text-green-700";
    if (status === "PERINGATAN") return "bg-yellow-100 text-yellow-700";
    if (status === "KRITIS") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="mt-6 mb-10">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#0F172A] mb-1">
          Tren Performa Per Peralatan
        </h2>
        <p className="text-sm text-slate-500">
          Grafik riwayat kesehatan untuk masing-masing fasilitas
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-1 border-b-2 border-slate-200 mb-6 font-semibold overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {categoriesData.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "px-5 py-3 text-sm transition-colors border-b-2 -mb-[2px] flex items-center whitespace-nowrap",
              activeCategory === cat.id
                ? "border-[#0284C7] text-[#0284C7]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            {cat.label}
            <span
              className={cn(
                "ml-2 flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold",
                activeCategory === cat.id
                  ? "bg-blue-100 text-[#0284C7]"
                  : "bg-slate-100 text-slate-500"
              )}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* GRID CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility, index) => {
          const hasValidHistory = facility.history && facility.history.length > 0;
          const chartData = hasValidHistory ? facility.history! : generateMockHistory(facility.score);
          const strokeColor = getStatusColor(facility.status);

          // Hitung trend label
          let trendLabel = "0%";
          let trendCls = "bg-slate-100 text-slate-600";
          if (chartData.length >= 2) {
            const last = chartData[chartData.length - 1].value;
            const prev = chartData[chartData.length - 2].value;
            const diff = last - prev;
            if (diff > 0) {
              trendLabel = `+${diff}%`;
              trendCls = "bg-green-100 text-green-700";
            } else if (diff < 0) {
              trendLabel = `${diff}%`;
              trendCls = "bg-red-100 text-red-700";
            }
          }

          return (
            <div
              key={facility.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md flex flex-col min-w-0"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-[#0F172A] leading-tight mb-1 text-[15px]">
                    {facility.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400">
                    {facility.id}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
                    getStatusBg(facility.status)
                  )}
                >
                  {facility.status}
                </span>
              </div>

              {/* Chart */}
              <div className="h-[105px] w-full mt-2 mb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 10 }}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94A3B8", fontSize: 9 }}
                      dy={15}
                      padding={{ left: 15, right: 15 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis domain={[0, 105]} hide />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', padding: '4px 8px', fontSize: '12px' }}
                      labelStyle={{ display: 'none' }}
                      formatter={(val: any) => [`${val}%`, 'Skor']}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={strokeColor}
                      strokeWidth={3}
                      isAnimationActive={true}
                      dot={{ r: 3, fill: strokeColor, strokeWidth: 1 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Card Footer */}
              <div className="flex justify-between items-end mt-auto pt-2">
                <div style={{ color: strokeColor }} className="text-3xl font-black tracking-tight flex items-baseline">
                  {facility.score}%<span className="text-xs font-semibold text-slate-400 ml-1">/monthly</span>
                </div>
                <div className={cn("text-xs font-bold px-2 py-1 rounded-md mb-1", trendCls)}>
                  {trendLabel}
                </div>
              </div>

              {/* Link Detail Peralatan */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
                <a
                  href={`/equipment/${facility.id}`}
                  className="text-xs font-semibold text-[#0284C7] hover:text-[#0369a1] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Lihat Detail →
                </a>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredFacilities.length === 0 && (
        <div className="py-12 text-center text-slate-500 font-medium border-2 border-dashed border-slate-200 rounded-xl">
          Tidak ada data peralatan untuk kategori ini.
        </div>
      )}

      {/* Modal Detail Bulanan Real-time Excel */}
      <MonthlyDetailModal
        equipmentId={selectedEquipmentForModal}
        onClose={() => setSelectedEquipmentForModal(null)}
      />
    </div>
  );
}
