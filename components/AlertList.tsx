"use client";

import { useState, useEffect } from "react";
import { Clock, UserPlus, CheckCircle2, Calendar, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AlertFilterState } from "@/app/alerts/page";

interface AlertListProps {
  alertLogs: any[];
  isLoading: boolean;
  filters?: AlertFilterState;
}

export function AlertList({ alertLogs, isLoading, filters }: AlertListProps) {
  const [facilityFilter, setFacilityFilter] = useState<string | null>(null);
  const [selectedAlertNote, setSelectedAlertNote] = useState<string | null>(null);

  // Read ?facility=... URL param once on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setFacilityFilter(params.get("facility"));
    }
  }, []);

  const byFacility = facilityFilter
    ? alertLogs.filter((log) =>
        log.facility.toLowerCase().includes(facilityFilter.toLowerCase())
      )
    : alertLogs;

  const filteredLogs = filters
    ? byFacility.filter((log) => {
        const sev = (log.severity || "").toUpperCase() as keyof AlertFilterState["severity"];
        return filters.severity[sev] ?? true;
      })
    : byFacility;

  return (
    <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-4">
      {facilityFilter && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm font-medium">
          <span>Menampilkan log perbaikan untuk: <strong>{facilityFilter}</strong></span>
          <button 
            onClick={() => {
              setFacilityFilter(null);
              if (typeof window !== "undefined") {
                window.history.replaceState({}, "", window.location.pathname);
              }
            }}
            className="text-xs text-[#0F52BA] hover:underline font-semibold cursor-pointer"
          >
            Hapus Filter
          </button>
        </div>
      )}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-10 mt-10">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-12 h-12 border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-sm text-slate-500 font-medium animate-pulse">Memuat data alert...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 mt-10 bg-green-50 border border-green-200 rounded-lg text-center">
          <CheckCircle2 size={48} className="text-green-500 mb-4" />
          <h3 className="text-lg font-bold text-green-800">Semua Fasilitas Sehat!</h3>
          <p className="text-sm text-green-700 mt-2">
            Tidak ada {facilityFilter ? `alert untuk ${facilityFilter}` : "peralatan dengan skor di bawah target performa saat ini"}.
          </p>
        </div>
      ) : (
        filteredLogs.map((alert) => {
          const isKritis = alert.severity === 'KRITIS';
          
          return (
            <div 
              key={alert.id} 
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm"
            >
              {/* Header info */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-white tracking-wider",
                    isKritis ? "bg-[#B91C1C]" : "bg-slate-500",
                    alert.severity === "PERINGATAN" ? "bg-amber-500" : ""
                  )}>
                    {alert.severity}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {alert.time}
                  </span>
                  <span># {alert.incidentNumber}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {isKritis ? (
                    <button className="flex items-center gap-2 bg-[#0F52BA] text-white text-sm font-semibold px-4 py-2 rounded hover:bg-[#0b409c] transition-colors">
                      <UserPlus size={16} />
                      Tugaskan Teknisi
                    </button>
                  ) : (
                    <>
                      <button className="flex items-center gap-2 bg-slate-100 text-slate-700 text-sm font-semibold px-4 py-2 rounded border border-slate-200 hover:bg-slate-200 transition-colors">
                        <CheckCircle2 size={16} />
                        Tandai Selesai
                      </button>
                      <button className="flex items-center gap-2 bg-slate-100 text-slate-700 text-sm font-semibold px-4 py-2 rounded border border-slate-200 hover:bg-slate-200 transition-colors">
                        <Calendar size={16} />
                        Jadwalkan Pengecekan
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Title & Actions Row */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-[19px] font-bold text-[#0F172A]">{alert.title}</h3>
                <button 
                  onClick={() => setSelectedAlertNote(alert.detailNote || alert.note)}
                  className="text-sm font-medium text-[#0F52BA] hover:underline"
                >
                  Lihat Detail Log
                </button>
              </div>

              {/* Note & Facility Row */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-100/80 border border-slate-200 px-3 py-2 rounded-md text-sm text-slate-600 font-medium">
                  {/* SVG Icon Placeholder based on facility */}
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  Facility: {alert.facility}
                </div>
                
                <div className={cn(
                  "flex items-center gap-2 text-sm font-semibold",
                  isKritis ? "text-red-600" : (alert.severity === "PERINGATAN" ? "text-amber-600" : "text-slate-500")
                )}>
                  <AlertCircle size={18} />
                  {alert.note}
                </div>
              </div>
            </div>
          );
        })
      )}

      {selectedAlertNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3 text-[#0F52BA]">
                <AlertCircle size={20} />
                <h2 className="text-base font-bold text-slate-800">Detail Log Alert</h2>
              </div>
              <button 
                onClick={() => setSelectedAlertNote(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-6 font-medium leading-relaxed whitespace-pre-line">
                {selectedAlertNote}
              </p>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedAlertNote(null)}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0F52BA] rounded-md hover:bg-[#0b409c] transition-colors shadow-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
