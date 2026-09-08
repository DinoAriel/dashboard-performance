"use client";

import { useState } from "react";
import { Bell, HelpCircle, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleTopbarProps {
  title?: string;
  alertLogs?: any[];
}

export function ScheduleTopbar({ title = "Maintenance Schedule", alertLogs = [] }: ScheduleTopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "KRITIS": return "text-red-600 bg-red-50";
      case "PERINGATAN": return "text-yellow-600 bg-yellow-50";
      default: return "text-blue-600 bg-blue-50";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "KRITIS": return <AlertTriangle size={16} className="text-red-600" />;
      case "PERINGATAN": return <AlertCircle size={16} className="text-yellow-600" />;
      default: return <Info size={16} className="text-blue-600" />;
    }
  };

  return (
    <div className="flex h-[110px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8 relative">
      {/* Title */}
      <h1 className="text-[22px] font-bold text-[#0F172A]">{title}</h1>

      {/* Right side: Icons & Profile */}
      <div className="flex items-center gap-4 relative">
        
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowHelp(false);
            }}
            className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <Bell size={20} />
            {alertLogs.length > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-white shadow-xl border border-slate-200 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-semibold text-slate-800">Notifikasi ({alertLogs.length})</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {alertLogs.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-500">
                    Tidak ada notifikasi aktif.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {alertLogs.map((log) => (
                      <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={cn("p-1.5 rounded-full shrink-0", getSeverityColor(log.severity))}>
                            {getSeverityIcon(log.severity)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800 mb-0.5">{log.facility}</p>
                            <p className="text-xs font-semibold text-slate-500 mb-1">{log.title}</p>
                            <p className="text-xs text-slate-600">{log.note}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Help Tutorial */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowHelp(!showHelp);
              setShowNotifications(false);
            }}
            className="p-2 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <HelpCircle size={20} />
          </button>
          
          {showHelp && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-white shadow-xl border border-slate-200 z-50 overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-semibold text-slate-800">Panduan Maintenance</h3>
                <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>
              <div className="p-4 text-sm text-slate-600 space-y-3">
                <p>
                  <strong>1. Menambah Jadwal:</strong> Klik pada tombol "Tambah Jadwal Baru" untuk menyisipkan agenda maintenance pada hari yang diinginkan.
                </p>
                <p>
                  <strong>2. Kalender:</strong> Anda bisa memindahkan bulan pada menu dropdown di pojok kalender untuk melihat jadwal di lain waktu.
                </p>
                <p>
                  <strong>3. Hapus Jadwal:</strong> Klik ikon silang kecil di samping judul jadwal pada kalender jika Anda ingin membatalkan/menghapus jadwal tersebut.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="ml-2 h-9 w-9 overflow-hidden rounded-full border border-slate-200">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="User avatar" 
            className="h-full w-full object-cover bg-slate-100"
          />
        </div>
      </div>
    </div>
  );
}
