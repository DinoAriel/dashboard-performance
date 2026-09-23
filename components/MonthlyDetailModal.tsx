"use client";

import { useEffect, useState } from "react";
import { X, Calendar, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus, Wrench, CheckCircle2, AlertTriangle, AlertCircle, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { EquipmentMonthlyDetail } from "@/lib/excel-service";

interface MonthlyDetailModalProps {
  equipmentId: string | null;
  initialMonth?: string;
  onClose: () => void;
}

export function MonthlyDetailModal({ equipmentId, initialMonth = "2026-09", onClose }: MonthlyDetailModalProps) {
  const [data, setData] = useState<EquipmentMonthlyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  useEffect(() => {
    if (!equipmentId) return;
    setLoading(true);
    fetch(`/api/dashboard/monthly?equipmentId=${equipmentId}&month=${selectedMonth}`)
      .then((res) => res.json())
      .then((resData) => {
        if (!resData.error) {
          setData(resData);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [equipmentId, selectedMonth]);

  if (!equipmentId) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-[#0284C7] rounded tracking-wider uppercase">
                {data?.equipment.category || "Fasilitas"}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{equipmentId}</span>
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] mt-0.5">
              {data?.equipment.name || "Detail Performa Peralatan"}
            </h2>
            <p className="text-xs text-slate-500">
              {data?.equipment.location} • Brand: {data?.equipment.brand || "-"} ({data?.equipment.model || "-"})
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Selector Bulan */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-transparent outline-none cursor-pointer px-2 py-1"
              />
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-12 h-12 border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-sm text-slate-500 font-medium animate-pulse">
              Memuat data histori Excel {selectedMonth}...
            </p>
          </div>
        ) : !data ? (
          <div className="py-20 text-center text-slate-500 font-medium">
            Tidak ada data untuk periode bulan ini di Excel.
          </div>
        ) : (
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Rata-rata Bulan Ini
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-[#0F172A]">
                    {data.summary.averageScore}%
                  </span>
                  {data.summary.change !== 0 && (
                    <span
                      className={`text-xs font-bold flex items-center gap-0.5 ${
                        data.summary.change > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {data.summary.change > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {data.summary.change > 0 ? `+${data.summary.change}%` : `${data.summary.change}%`} vs bln lalu
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Skor Tertinggi & Terendah
                </span>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <span className="text-xs text-slate-500 block">Tertinggi</span>
                    <span className="text-lg font-bold text-green-600">{data.summary.highestScore}%</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200"></div>
                  <div>
                    <span className="text-xs text-slate-500 block">Terendah</span>
                    <span className="text-lg font-bold text-red-600">{data.summary.lowestScore}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Frekuensi Laporan
                </span>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-[#0F172A]">
                    {data.summary.daysReported} Hari
                  </span>
                  <span className="text-xs text-slate-500 block">
                    dari total {data.summary.daysInRange} hari di {data.monthLabel}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Status Distribusi Harian
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-md">
                    {data.statusDistribution.sehat} Sehat
                  </span>
                  <span className="text-xs font-bold px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md">
                    {data.statusDistribution.peringatan} Peringatan
                  </span>
                  <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-700 rounded-md">
                    {data.statusDistribution.kritis} Kritis
                  </span>
                </div>
              </div>
            </div>

            {/* Line Chart Histori 1 Bulan Penuh */}
            <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-xs">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    Grafik Tren Performa Harian ({data.monthLabel})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Menampilkan seluruh data dari awal hingga akhir bulan sesuai database Excel
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="w-3 h-0.5 bg-red-400 border border-dashed border-red-500"></span>
                  <span>Target Performa ({data.target}%)</span>
                </div>
              </div>

              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.dailyData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="date" tick={{ fill: "#64748B", fontSize: 11 }} dy={5} />
                    <YAxis domain={[0, 105]} tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={(val) => `${val}%`} />
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "12px" }}
                      formatter={(value: any) => [`${value}%`, "Skor Performa"]}
                      labelFormatter={(label, items) => {
                        if (items && items[0]) {
                          return items[0].payload.fullDate;
                        }
                        return label;
                      }}
                    />
                    <ReferenceLine y={data.target} stroke="#EF4444" strokeDasharray="4 4" />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#0284C7"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#0284C7", strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Log Maintenance / Issue Bulan Ini */}
            <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-xs">
              <h3 className="text-base font-bold text-[#0F172A] mb-3 flex items-center gap-2">
                <Wrench size={18} className="text-[#0284C7]" />
                Catatan Laporan Kendala & Maintenance ({data.monthLabel})
              </h3>

              {data.maintenanceLogs.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  Tidak ada catatan masalah/maintenance khusus untuk {data.equipment.name} pada {data.monthLabel}.
                </div>
              ) : (
                <div className="space-y-2">
                  {data.maintenanceLogs.map((log, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
                      <span className="text-xs font-bold text-slate-500 shrink-0 mt-0.5">{log.date}</span>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">{log.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
