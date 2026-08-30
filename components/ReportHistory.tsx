"use client";

import { monthlyReports } from "@/lib/mock-data";
import { Download, FileText, Table as TableIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReportHistory() {
  return (
    <div className="flex-1 bg-white border border-slate-200 rounded-lg flex flex-col overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <h2 className="text-[17px] font-bold text-[#0F172A]">Riwayat Laporan</h2>
        <button className="text-sm font-medium text-[#2563EB] hover:text-[#1d4ed8] transition-colors">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-500 text-[11px] tracking-wider uppercase">Nama Laporan</th>
              <th className="px-6 py-4 font-semibold text-slate-500 text-[11px] tracking-wider uppercase">Tanggal Dibuat</th>
              <th className="px-6 py-4 font-semibold text-slate-500 text-[11px] tracking-wider uppercase text-center">Tipe Data</th>
              <th className="px-6 py-4 font-semibold text-slate-500 text-[11px] tracking-wider uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {monthlyReports.map((report) => (
              <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {report.type === 'PDF' ? (
                      <FileText size={18} className="text-slate-400" />
                    ) : (
                      <TableIcon size={18} className="text-slate-400" />
                    )}
                    <span className="font-medium text-slate-700">{report.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500">{report.date}</td>
                <td className="px-6 py-4 text-center">
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                    report.type === 'PDF' ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
                  )}>
                    {report.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2563EB] hover:text-[#1d4ed8] transition-colors">
                    <Download size={16} />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
