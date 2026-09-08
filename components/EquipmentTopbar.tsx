"use client";

import { useState } from "react";
import { Bell, HelpCircle, Search, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EquipmentTopbarProps {
  title: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick?: () => void;
  alertLogs?: any[];
}

export function EquipmentTopbar({ title, searchQuery, onSearchChange, onAddClick, alertLogs = [] }: EquipmentTopbarProps) {
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
      <h1 className="text-[22px] font-bold text-[#0F172A]">{title}</h1>

      <div className="flex items-center gap-6">
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search equipment..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all"
          />
        </div>

        <div className="flex items-center gap-4 border-l border-slate-200 pl-6 relative">
          
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
                  <h3 className="font-semibold text-slate-800">Tutor Singkat</h3>
                  <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-4 text-sm text-slate-600 space-y-3">
                  <p>
                    <strong>1. Melihat Detail:</strong> Klik pada salah satu baris di tabel peralatan untuk melihat detail indikator performanya di panel sebelah kanan.
                  </p>
                  <p>
                    <strong>2. Pencatatan Laporan:</strong> Pada panel detail, klik tombol merah <span className="font-semibold">"Catat Laporan Performa"</span> untuk mencatat maintenance, kendala, atau update skor ke dalam Google Sheets secara sinkron.
                  </p>
                  <p>
                    <strong>3. Fitur Filter:</strong> Gunakan opsi filter "Kategori" dan "Status Kesehatan" atau kolom pencarian untuk mempersempit daftar alat yang ditampilkan.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Plus button removed as requested */}
        </div>
      </div>
    </div>
  );
}
