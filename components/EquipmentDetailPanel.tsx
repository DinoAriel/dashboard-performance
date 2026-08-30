"use client";

import { X, AlertTriangle, TrendingDown, Wrench } from "lucide-react";
import { equipmentDetail } from "@/lib/mock-data";

interface EquipmentDetailPanelProps {
  equipmentId: string | null;
  onClose: () => void;
}

export function EquipmentDetailPanel({ equipmentId, onClose }: EquipmentDetailPanelProps) {
  if (!equipmentId) return null;

  // In a real app, you would fetch details based on equipmentId
  // For this UI mockup, we use the static equipmentDetail for ELT-02
  const data = equipmentDetail;

  return (
    <div className="w-[320px] shrink-0 bg-[#FAFAFA] border-l border-slate-200 flex flex-col h-full z-20">
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b border-slate-200">
        <div>
          <h3 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">DETAIL PERALATAN</h3>
          <h2 className="text-lg font-bold text-[#0F172A]">{data.name} ({data.id})</h2>
          <p className="text-xs text-slate-500 mt-0.5">{data.location} • {data.category}</p>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* Alert Box */}
        {data.status === 'KRITIS' && (
          <div className="border border-red-200 bg-red-50/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertTriangle size={18} />
              <span className="font-bold">Status: {data.status}</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {data.alertMessage}
            </p>
          </div>
        )}

        {/* Health Trend */}
        <div>
          <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-3 border-b border-slate-200 pb-2">
            HEALTH TREND (30 DAYS)
          </h3>
          <div className="border border-slate-200 bg-white rounded-lg p-6 flex items-end justify-between shadow-sm">
            <span className="text-4xl font-bold text-[#0F172A]">{data.score}%</span>
            <div className="flex items-center gap-1 text-red-500 font-medium text-sm mb-1">
              <TrendingDown size={16} />
              {data.scoreChange}%
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div>
          <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-3 border-b border-slate-200 pb-2">
            SPECIFICATIONS
          </h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <div>
              <p className="text-[10px] text-slate-500 font-semibold mb-0.5 uppercase tracking-wide">BRAND</p>
              <p className="text-sm text-slate-800 font-medium">{data.specifications.brand}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold mb-0.5 uppercase tracking-wide">MODEL</p>
              <p className="text-sm text-slate-800 font-medium">{data.specifications.model}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold mb-0.5 uppercase tracking-wide">INSTALLATION</p>
              <p className="text-sm text-slate-800 font-medium">{data.specifications.installation}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold mb-0.5 uppercase tracking-wide">LAST MAINTENANCE</p>
              <p className="text-sm text-slate-800 font-medium">{data.specifications.lastMaintenance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-slate-200 bg-white flex flex-col gap-3">
        <button className="w-full flex items-center justify-center gap-2 bg-[#B91C1C] text-white font-semibold py-2.5 rounded-lg hover:bg-[#991b1b] transition-colors shadow-sm">
          <Wrench size={18} />
          Buat Tiket Perbaikan
        </button>
        <button className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-medium py-2.5 rounded-lg hover:bg-slate-100 transition-colors">
          Lihat Log Lengkap
        </button>
      </div>
    </div>
  );
}
