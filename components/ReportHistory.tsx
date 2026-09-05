"use client";

import { useEffect, useState } from "react";
import { Search, CalendarRange } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTH_MAP: Record<string, number> = {
  "januari": 0, "februari": 1, "maret": 2, "april": 3, "mei": 4, "juni": 5,
  "juli": 6, "agustus": 7, "september": 8, "oktober": 9, "november": 10, "desember": 11
};

function parseIndonesianDate(dateStr: string): Date | null {
  const parts = dateStr.split(" ");
  if (parts.length < 3) return null;
  const day = parseInt(parts[0]);
  const month = MONTH_MAP[parts[1].toLowerCase()];
  const year = parseInt(parts[2]);
  if (isNaN(day) || month === undefined || isNaN(year)) return null;
  return new Date(year, month, day);
}

export function ReportHistory() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [categories, setCategories] = useState({
    Elektrikal: true,
    Mekanikal: true,
    Elektronika: true,
  });

  useEffect(() => {
    fetch("/api/logs", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.maintenanceLogs) {
          setLogs(data.maintenanceLogs);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil log dari API:", err);
        setLoading(false);
      });
  }, []);

  const activeCats = Object.entries(categories)
    .filter(([_, v]) => v)
    .map(([k]) => k.toLowerCase());

  const filteredLogs = logs.filter(log => {
    // Filter kategori
    if (!activeCats.includes(log.category.toLowerCase())) return false;

    // Filter pencarian teks
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (
        !log.facility.toLowerCase().includes(term) &&
        !log.note.toLowerCase().includes(term) &&
        !log.date.toLowerCase().includes(term)
      ) return false;
    }

    // Filter rentang tanggal
    if (dateFrom || dateTo) {
      const logDate = parseIndonesianDate(log.date);
      if (!logDate) return true; // biarkan jika format tidak dikenali
      if (dateFrom) {
        const from = new Date(dateFrom + "T00:00:00");
        if (logDate < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo + "T23:59:59");
        if (logDate > to) return false;
      }
    }

    return true;
  });

  return (
    <div className="flex-1 bg-white border border-slate-200 rounded-lg flex flex-col overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-[17px] font-bold text-[#0F172A]">Buku Log Pemeliharaan</h2>
        <p className="text-sm text-slate-500 mt-1">Riwayat catatan teknisi lapangan dari waktu ke waktu.</p>
      </div>

      {/* Filter Bar - Horizontal */}
      <div className="flex flex-wrap items-end gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200">
        {/* Rentang Tanggal */}
        <div className="flex items-end gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Dari</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-700 bg-white hover:border-slate-300 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 outline-none transition-all"
            />
          </div>
          <span className="text-slate-400 pb-2">—</span>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Sampai</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              min={dateFrom || undefined}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-700 bg-white hover:border-slate-300 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-9 bg-slate-200 hidden sm:block" />

        {/* Kategori Chips */}
        <div className="flex items-center gap-2">
          {Object.entries(categories).map(([key, checked]) => (
            <button
              key={key}
              onClick={() => setCategories(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
              className={cn(
                "px-3 py-2 text-xs font-semibold rounded-lg border transition-all",
                checked
                  ? "bg-[#2563EB] text-white border-[#2563EB] shadow-sm"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              )}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-9 bg-slate-200 hidden sm:block" />

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Cari fasilitas / masalah..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all"
          />
        </div>
      </div>

      {/* Jumlah Hasil */}
      {!loading && (
        <div className="px-6 py-2 text-xs text-slate-500 border-b border-slate-100 bg-white">
          Menampilkan <strong className="text-slate-700">{filteredLogs.length}</strong> dari {logs.length} catatan
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="p-10 text-center text-slate-500">Memuat data histori...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-10 text-center text-slate-500">Tidak ada riwayat catatan yang sesuai filter.</div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-500 text-[11px] tracking-wider uppercase">Tanggal</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-[11px] tracking-wider uppercase">Fasilitas & Kategori</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-[11px] tracking-wider uppercase">Rincian Laporan Kendala</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">{report.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{report.facility}</span>
                      <span className="text-xs text-slate-500 font-medium">{report.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-600 whitespace-normal min-w-[300px]">
                      {report.note}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

