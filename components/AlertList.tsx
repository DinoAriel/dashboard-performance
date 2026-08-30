"use client";

import { alertLogs } from "@/lib/mock-data";
import { Clock, UserPlus, CheckCircle2, Calendar, TrendingDown, Thermometer, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function AlertList() {
  return (
    <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-4">
      {(alertLogs || []).map((alert) => {
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
                  isKritis ? "bg-[#B91C1C]" : "bg-slate-500"
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
              <button className="text-sm font-medium text-[#0F52BA] hover:underline">
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
                isKritis ? "text-red-600" : "text-slate-500"
              )}>
                {/* Dynamic icon based on note context for accuracy with screenshot */}
                {alert.note.includes('Fluktuasi') && <TrendingDown size={18} />}
                {alert.note.includes('Suhu') && <Thermometer size={18} />}
                {!alert.note.includes('Fluktuasi') && !alert.note.includes('Suhu') && <AlertCircle size={18} />}
                {alert.note}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
