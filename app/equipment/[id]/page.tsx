"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Calendar, Wrench, TrendingUp, TrendingDown, 
  CheckCircle2, AlertTriangle, AlertCircle, ShieldCheck, 
  Layers, MapPin, Tag, Activity, RefreshCw, Filter, Clock
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from "recharts";
import { EquipmentMonthlyDetail } from "@/lib/excel-service";

export default function EquipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const equipmentId = resolvedParams.id;

  const [data, setData] = useState<EquipmentMonthlyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const fetchData = (from?: string, to?: string) => {
    setLoading(true);
    const query = from && to ? `&dateFrom=${from}&dateTo=${to}` : "";
    fetch(`/api/dashboard/monthly?equipmentId=${equipmentId}${query}`)
      .then((res) => res.json())
      .then((resData) => {
        if (!resData.error) {
          setData(resData);
          if (resData.dateFrom) setDateFrom(resData.dateFrom);
          if (resData.dateTo) setDateTo(resData.dateTo);
        }
      })
      .catch((err) => console.error("Error fetching detail:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [equipmentId]);

  // Helper to format YYYY-MM-DD to DD/MM/YYYY
  const formatDisplayDate = (isoStr: string) => {
    if (!isoStr || !isoStr.includes("-")) return isoStr;
    const parts = isoStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return isoStr;
  };

  const handleApplyFilter = () => {
    fetchData(dateFrom, dateTo);
  };

  const getStatusBadge = (score: number, target: number) => {
    if (score < 70) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          KRITIS
        </span>
      );
    }
    if (score <= target) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          PERINGATAN
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        SEHAT
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      {/* Top Navbar Header (Theme Dashboard Utama) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft size={16} />
            Kembali ke Dashboard
          </Link>
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-100 text-[#0F52BA]">
                {data?.equipment.category || "Fasilitas"}
              </span>
              <span className="text-xs font-mono text-slate-400 font-semibold">{equipmentId}</span>
            </div>
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight mt-0.5">
              {data?.equipment.name || "Detail Performa Fasilitas"}
            </h1>
          </div>
        </div>

        {/* Date Range Selector Filter (Dari Tanggal -> Sampai Tanggal) */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dari</span>
            <div className="relative flex items-center">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-md text-slate-700 bg-white outline-none focus:border-[#0F52BA] cursor-pointer"
              />
              <span className="absolute left-2.5 pointer-events-none text-xs font-bold text-slate-700 bg-white pr-6 py-0.5">
                {formatDisplayDate(dateFrom)}
              </span>
            </div>
          </div>

          <span className="text-slate-400 font-bold">—</span>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sampai</span>
            <div className="relative flex items-center">
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-md text-slate-700 bg-white outline-none focus:border-[#0F52BA] cursor-pointer"
              />
              <span className="absolute left-2.5 pointer-events-none text-xs font-bold text-slate-700 bg-white pr-6 py-0.5">
                {formatDisplayDate(dateTo)}
              </span>
            </div>
          </div>

          <button
            onClick={handleApplyFilter}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F52BA] hover:bg-[#0b409c] text-white text-xs font-semibold rounded-md transition-colors shadow-xs cursor-pointer"
          >
            <Filter size={14} />
            Terapkan
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-16 h-16 border-4 border-blue-200 rounded-full animate-ping opacity-30"></div>
              <div className="w-10 h-10 border-4 border-blue-200 border-t-[#0F52BA] rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-sm text-slate-500 font-medium animate-pulse">
              Mengambil Data Excel Harian Peralatan...
            </p>
          </div>
        ) : !data ? (
          <div className="py-24 text-center bg-white border border-slate-200 rounded-2xl shadow-xs">
            <AlertCircle size={48} className="mx-auto text-slate-400 mb-3" />
            <h3 className="text-lg font-bold text-[#0F172A]">Data Tidak Ditemukan</h3>
            <p className="text-sm text-slate-500 mt-1">Tidak ada data tercatat di Excel untuk rentang tanggal tersebut.</p>
          </div>
        ) : (
          <>
            {/* Overview Profile & Summary Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Equipment Main Profile Card */}
              <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                      <Tag size={14} className="text-[#0F52BA]" />
                      Spesifikasi Fasilitas
                    </span>
                    {getStatusBadge(data.summary.averageScore, data.target)}
                  </div>

                  <h2 className="text-2xl font-black text-[#0F172A] leading-tight mb-2">
                    {data.equipment.name}
                  </h2>
                  
                  <div className="space-y-3 mt-6 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500 flex items-center gap-2">
                        <MapPin size={15} className="text-slate-400" /> Lokasi
                      </span>
                      <span className="font-semibold text-slate-800">{data.equipment.location}</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500 flex items-center gap-2">
                        <Layers size={15} className="text-slate-400" /> Kategori
                      </span>
                      <span className="font-semibold text-slate-800">{data.equipment.category}</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500 flex items-center gap-2">
                        <Activity size={15} className="text-slate-400" /> Brand & Model
                      </span>
                      <span className="font-semibold text-slate-800">
                        {data.equipment.brand} ({data.equipment.model})
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500 flex items-center gap-2">
                        <ShieldCheck size={15} className="text-slate-400" /> Target Performa
                      </span>
                      <span className="font-bold text-[#0F52BA]">{data.target}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Database Excel Real-time</span>
                  <span className="font-medium text-slate-700">{formatDisplayDate(data.dateFrom)} s/d {formatDisplayDate(data.dateTo)}</span>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rata-rata Skor */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Rata-Rata Performa ({data.monthLabel})
                    </span>
                    <div className="p-2 bg-blue-50 text-[#0F52BA] rounded-xl">
                      <Activity size={20} />
                    </div>
                  </div>

                  <div className="my-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-extrabold text-[#0F172A] tracking-tight">
                        {data.summary.averageScore}%
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">/periode</span>
                    </div>

                    {data.summary.change !== 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg ${
                            data.summary.change > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {data.summary.change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {data.summary.change > 0 ? `+${data.summary.change}%` : `${data.summary.change}%`}
                        </span>
                        <span className="text-xs text-slate-500">vs bulan sebelumnya</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-500">
                    Berdasarkan {data.summary.daysReported} entri laporan dari rentang {data.summary.daysInRange} hari.
                  </div>
                </div>

                {/* Tertinggi & Terendah */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Batas Performa Harian
                    </span>
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                      <TrendingUp size={20} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 my-3">
                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                      <span className="text-xs text-slate-500 block mb-1">Skor Tertinggi</span>
                      <span className="text-2xl font-bold text-green-600">{data.summary.highestScore}%</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                      <span className="text-xs text-slate-500 block mb-1">Skor Terendah</span>
                      <span className="text-2xl font-bold text-red-600">{data.summary.lowestScore}%</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">
                    Variasi nilai performa sepanjang rentang tanggal terpilih.
                  </div>
                </div>

                {/* Status Breakdown */}
                <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-4">
                    Distribusi Status Operasional Harian
                  </span>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center gap-3">
                      <div className="p-2.5 bg-green-100 text-green-700 rounded-lg shrink-0">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <span className="text-2xl font-black text-green-800 block leading-none">
                          {data.statusDistribution.sehat} <span className="text-xs font-normal text-slate-500">Hari</span>
                        </span>
                        <span className="text-xs text-green-700 font-semibold">Status SEHAT</span>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-center gap-3">
                      <div className="p-2.5 bg-yellow-100 text-yellow-700 rounded-lg shrink-0">
                        <AlertTriangle size={20} />
                      </div>
                      <div>
                        <span className="text-2xl font-black text-yellow-800 block leading-none">
                          {data.statusDistribution.peringatan} <span className="text-xs font-normal text-slate-500">Hari</span>
                        </span>
                        <span className="text-xs text-yellow-700 font-semibold">PERINGATAN</span>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3">
                      <div className="p-2.5 bg-red-100 text-red-700 rounded-lg shrink-0">
                        <AlertCircle size={20} />
                      </div>
                      <div>
                        <span className="text-2xl font-black text-red-800 block leading-none">
                          {data.statusDistribution.kritis} <span className="text-xs font-normal text-slate-500">Hari</span>
                        </span>
                        <span className="text-xs text-red-700 font-semibold">Status KRITIS</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Chart (Full Timeline Date Range) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                    <Activity size={20} className="text-[#0F52BA]" />
                    Grafik Riwayat Performa Harian Lengkap ({data.dateFrom} s/d {data.dateTo})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Menampilkan garis waktu harian penuh dari Excel (menggunakan carry-over data untuk hari tanpa laporan)
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#0F52BA]" />
                    <span className="text-slate-700">Skor Performa (%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-red-500 border border-dashed border-red-500" />
                    <span className="text-slate-500">Target ({data.target}%)</span>
                  </div>
                </div>
              </div>

              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreGradientLight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F52BA" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#0F52BA" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} dy={5} />
                    <YAxis domain={[0, 105]} stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(val) => `${val}%`} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: "#FFFFFF", 
                        borderColor: "#E2E8F0", 
                        borderRadius: "12px", 
                        color: "#0F172A",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                      }}
                      formatter={(value: any) => [`${value}%`, "Skor Performa"]}
                      labelFormatter={(label, items) => items?.[0]?.payload?.fullDate || label}
                    />
                    <ReferenceLine y={data.target} stroke="#EF4444" strokeDasharray="4 4" strokeWidth={1.5} />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#0F52BA"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#scoreGradientLight)"
                      dot={{ r: 3, fill: "#0F52BA", strokeWidth: 2, stroke: "#FFFFFF" }}
                      activeDot={{ r: 6, fill: "#2563EB" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Maintenance & Notes Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                <Wrench size={20} className="text-[#0F52BA]" />
                Catatan Laporan Kendala & Maintenance
              </h3>

              {data.maintenanceLogs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                  Tidak ada kendala atau catatan pemeliharaan yang dilaporkan di Excel untuk {data.equipment.name} pada rentang tanggal ini.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.maintenanceLogs.map((log, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3"
                    >
                      <span className="text-xs font-mono font-bold text-[#0F52BA] shrink-0 bg-blue-100 px-2.5 py-1 rounded-md">
                        {log.date}
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">{log.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
