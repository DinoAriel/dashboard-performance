"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { X, AlertTriangle, TrendingDown, Wrench, CheckCircle } from "lucide-react";
import { equipmentDetail as mockEquipmentDetail } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface EquipmentDetailPanelProps {
  equipmentId: string | null;
  onClose: () => void;
  liveEquipment?: {
    id: string;
    name: string;
    category: string;
    location: string;
    score: number;
    status: "SEHAT" | "PERINGATAN" | "KRITIS";
  };
}

// Client-side specs mapping for all 26 equipment items
const EQUIPMENT_SPECS_CLIENT: Record<string, { brand: string; model: string; installation: string }> = {
  "ELK-01": { brand: "Caterpillar", model: "CAT 3516B", installation: "12 Mei 2018" },
  "ELK-02": { brand: "Schneider Electric", model: "Premset MV", installation: "05 Apr 2019" },
  "ELK-03": { brand: "Siemens", model: "Sivacon S8", installation: "22 Okt 2019" },
  "ELK-04": { brand: "ABB", model: "Cast Resin 2500kVA", installation: "17 Jun 2018" },
  "ELK-05": { brand: "Eaton", model: "PowerXpert 9395", installation: "09 Jan 2020" },
  "ELK-06": { brand: "ADB Safegate", model: "AGL-LED Series", installation: "14 Agst 2021" },
  "MEK-01": { brand: "Daikin", model: "Centrifugal Chiller", installation: "11 Feb 2020" },
  "MEK-02": { brand: "Grundfos", model: "Hydro MPC", installation: "29 Sep 2019" },
  "MEK-03": { brand: "Vanderlande", model: "TUBTRAX 2.0", installation: "08 Des 2018" },
  "MEK-04": { brand: "Otis", model: "Escalator 515 NPE", installation: "14 Jul 2017" },
  "MEK-05": { brand: "Bukaka", model: "BPP-3000", installation: "12 Agst 2021" },
  "MEK-06": { brand: "Rosenbauer", model: "Panther 6x6", installation: "03 Nop 2020" },
  "MEK-07": { brand: "Toyota / Komatsu", model: "FB25 / Tugger", installation: "20 Mei 2021" },
  "MEK-08": { brand: "TLD", model: "GPU-418", installation: "15 Mar 2022" },
  "ELT-01": { brand: "Smiths Detection", model: "HI-SCAN 6040i", installation: "12 Agst 2021" },
  "ELT-02": { brand: "Ceia", model: "PMD2 Plus", installation: "04 Okt 2020" },
  "ELT-03": { brand: "Garrett", model: "Super Scanner T", installation: "18 Jan 2022" },
  "ELT-04": { brand: "Bruker", model: "DE-tector flex", installation: "09 Sep 2021" },
  "ELT-05": { brand: "Hikvision", model: "DarkFighter PTZ", installation: "15 Mei 2021" },
  "ELT-06": { brand: "L3Harris", model: "ProVision 2", installation: "25 Nop 2021" },
  "ELT-07": { brand: "Bosch", model: "Access Engine v3", installation: "06 Mar 2020" },
  "ELT-08": { brand: "Notifier by Honeywell", model: "NFS2-3030", installation: "12 Okt 2019" },
  "ELT-09": { brand: "Motorola Solutions", model: "Dimetra Tetra TETRA IP", installation: "04 Jun 2021" },
  "ELT-10": { brand: "NEC", model: "FIDS-OPS Professional", installation: "20 Jul 2020" },
  "ELT-11": { brand: "Bosch", model: "Praesideo PAS", installation: "30 Apr 2020" },
  "ELT-12": { brand: "Scarecrow Group", model: "BIRD-D-100", installation: "15 Jan 2022" }
};

export function EquipmentDetailPanel({ equipmentId, onClose, liveEquipment }: EquipmentDetailPanelProps) {
  const router = useRouter();
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketSeverity, setTicketSeverity] = useState("KRITIS");
  const [showToast, setShowToast] = useState(false);

  // New States for Dynamic Excel Row Configuration and Score Setting
  const [ticketDate, setTicketDate] = useState("");
  const [ticketScore, setTicketScore] = useState<number>(100);
  const [ticketTarget, setTicketTarget] = useState<number>(90);
  const [ticketRegion, setTicketRegion] = useState("Region 4");
  const [ticketLocation, setTicketLocation] = useState("Juanda Airport Surabaya");
  const [ticketLetterCode, setTicketLetterCode] = useState("SUB");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);


  if (!equipmentId) return null;

  // Fallback to mock data if live details are not provided
  const data = liveEquipment ? {
    id: liveEquipment.id,
    name: liveEquipment.name,
    category: liveEquipment.category,
    location: liveEquipment.location,
    score: liveEquipment.score,
    status: liveEquipment.status,
    scoreChange: liveEquipment.score < 96 ? "-2.4%" : "+0.5%",
    alertMessage: liveEquipment.status === 'KRITIS' ? "Peralatan membutuhkan pengecekan dan perbaikan segera." : ""
  } : mockEquipmentDetail;

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
              {data.scoreChange}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-slate-200 bg-white flex flex-col gap-3">
        <button 
          onClick={() => {
            const today = new Date();
            const y = today.getFullYear();
            const m = String(today.getMonth() + 1).padStart(2, '0');
            const d = String(today.getDate()).padStart(2, '0');
            setTicketDate(`${y}-${m}-${d}`);
            setTicketScore(data.score ?? 100);
            setTicketTarget(90);
            setTicketRegion("Region 4");
            setTicketLocation("Juanda Airport Surabaya");
            setTicketLetterCode("SUB");
            setTicketDescription("");
            setTicketSeverity(data.status);
            setIsAdvancedOpen(false);
            setIsTicketModalOpen(true);
          }}
          className="w-full flex items-center justify-center gap-2 bg-[#B91C1C] text-white font-semibold py-2.5 rounded-lg hover:bg-[#991b1b] transition-colors shadow-sm cursor-pointer select-none"
        >
          <Wrench size={18} />
          Buat Tiket Perbaikan
        </button>

        <button 
          onClick={() => {
            router.push(`/alerts?facility=${encodeURIComponent(data.name)}`);
          }}
          className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-medium py-2.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer select-none text-center"
        >
          Lihat Log Lengkap
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-800 text-white px-5 py-3 rounded-lg shadow-xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle className="text-green-500" size={20} />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Tiket Berhasil Dibuat</span>
            <span className="text-xs text-slate-400">Peralatan {data.name} telah terdaftar untuk pengecekan.</span>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {isTicketModalOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Wrench className="text-[#B91C1C]" size={20} />
                <h3 className="font-bold text-[#0F172A]">Buat Tiket Perbaikan</h3>
              </div>
              <button 
                onClick={() => setIsTicketModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            {/* Modal Form */}
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await fetch("/api/logs", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      date: ticketDate,
                      equipmentId: data.id,
                      score: ticketScore,
                      description: `${data.name} - ${ticketDescription.trim()}`,
                      region: ticketRegion,
                      location: ticketLocation,
                      letterCode: ticketLetterCode,
                      target: ticketTarget
                    })
                  });

                  if (res.ok) {
                    setIsTicketModalOpen(false);
                    setShowToast(true);
                    setTimeout(() => {
                      setShowToast(false);
                      // Reload window to fetch updated excel data
                      window.location.reload();
                    }, 1500);
                  } else {
                    const errData = await res.json();
                    alert("Gagal menyimpan tiket: " + (errData.error || "Undeclared error"));
                  }
                } catch (err: any) {
                  alert("Gagal tersambung ke server: " + err.message);
                }
              }}
              className="p-6 flex flex-col gap-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    ID Alat
                  </label>
                  <input 
                    type="text" 
                    value={data.id}
                    disabled
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 font-semibold outline-none text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Nama Fasilitas
                  </label>
                  <input 
                    type="text" 
                    value={data.name}
                    disabled
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 font-semibold outline-none text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Kategori
                  </label>
                  <input 
                    type="text" 
                    value={data.category}
                    disabled
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 font-semibold outline-none text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Lokasi
                  </label>
                  <input 
                    type="text" 
                    value={data.location}
                    disabled
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 font-semibold outline-none text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Tanggal Laporan
                  </label>
                  <input 
                    type="date"
                    required
                    value={ticketDate}
                    onChange={(e) => setTicketDate(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-slate-800 outline-none text-sm focus:border-[#B91C1C] focus:ring-1 focus:ring-[#B91C1C]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Skor Performa (%)
                  </label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    max="100"
                    value={ticketScore}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTicketScore(val);
                      if (val < 90) setTicketSeverity("KRITIS");
                      else if (val < 96) setTicketSeverity("PERINGATAN");
                      else setTicketSeverity("SEHAT");
                    }}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-slate-800 outline-none text-sm focus:border-[#B91C1C] focus:ring-1 focus:ring-[#B91C1C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Status Kesehatan
                </label>
                <select
                  value={ticketSeverity}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setTicketSeverity(newStatus);
                    if (newStatus === "SEHAT" && (ticketScore < 96 || ticketScore > 100)) {
                      setTicketScore(100);
                    } else if (newStatus === "PERINGATAN" && (ticketScore < 90 || ticketScore >= 96)) {
                      setTicketScore(93);
                    } else if (newStatus === "KRITIS" && ticketScore >= 90) {
                      setTicketScore(85);
                    }
                  }}
                  className="w-full h-10 px-3 border border-slate-250 rounded-lg text-slate-800 bg-white outline-none text-sm focus:border-[#B91C1C] focus:ring-1 focus:ring-[#B91C1C] cursor-pointer"
                >
                  <option value="SEHAT">SEHAT</option>
                  <option value="PERINGATAN">PERINGATAN</option>
                  <option value="KRITIS">KRITIS</option>
                </select>
              </div>

              {/* Collapsible Advanced Info */}
              <div className="border-t border-b border-slate-100 py-3">
                <button
                  type="button"
                  onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#0F52BA] hover:underline cursor-pointer select-none"
                >
                  {isAdvancedOpen ? "[-] Sembunyikan" : "[+] Tampilkan"} Detail Identitas Baris (Region, Lokasi, Target...)
                </button>

                {isAdvancedOpen && (
                  <div className="mt-3 p-4 border border-slate-200 rounded-lg bg-slate-50/50 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-150">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Region
                        </label>
                        <input 
                          type="text" 
                          value={ticketRegion}
                          onChange={(e) => setTicketRegion(e.target.value)}
                          className="w-full h-9 px-2.5 border border-slate-200 rounded-md bg-white text-slate-800 outline-none text-xs focus:border-[#B91C1C] focus:ring-1 focus:ring-[#B91C1C]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Letter Code
                        </label>
                        <input 
                          type="text" 
                          value={ticketLetterCode}
                          onChange={(e) => setTicketLetterCode(e.target.value)}
                          className="w-full h-9 px-2.5 border border-slate-200 rounded-md bg-white text-slate-800 outline-none text-xs focus:border-[#B91C1C] focus:ring-1 focus:ring-[#B91C1C]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Lokasi (Location)
                        </label>
                        <input 
                          type="text" 
                          value={ticketLocation}
                          onChange={(e) => setTicketLocation(e.target.value)}
                          className="w-full h-9 px-2.5 border border-slate-200 rounded-md bg-white text-slate-800 outline-none text-xs focus:border-[#B91C1C] focus:ring-1 focus:ring-[#B91C1C]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Target Performa (%)
                        </label>
                        <input 
                          type="number" 
                          min="0"
                          max="100"
                          value={ticketTarget}
                          onChange={(e) => setTicketTarget(Number(e.target.value))}
                          className="w-full h-9 px-2.5 border border-slate-200 rounded-md bg-white text-slate-800 outline-none text-xs focus:border-[#B91C1C] focus:ring-1 focus:ring-[#B91C1C]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                  Deskripsi Kerusakan / Catatan
                </label>
                <textarea 
                  required
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder="Detail permasalahan, suara bising, fluktuasi suhu, dll..."
                  className="w-full h-20 p-3 border border-slate-200 rounded-lg text-slate-800 outline-none text-sm focus:border-[#B91C1C] focus:ring-1 focus:ring-[#B91C1C] resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#B91C1C] hover:bg-[#991b1b] rounded-lg shadow-sm cursor-pointer"
                >
                  Kirim Tiket
                </button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}
    </div>
  );
}
