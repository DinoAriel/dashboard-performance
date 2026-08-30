"use client";

import { facilityDetails, categories } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function DashboardTable() {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm mb-10">
      <div className="p-6 pb-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-[#0F172A] mb-4">
          Detail Kesehatan Fasilitas
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, index) => (
            <button
              key={cat.id}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors border",
                index === 0
                  ? "bg-[#2563EB] text-white border-[#2563EB]"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              )}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>
      </div>
      
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium">ID</th>
              <th className="px-6 py-4 font-medium">Nama Peralatan</th>
              <th className="px-6 py-4 font-medium">Kategori</th>
              <th className="px-6 py-4 font-medium">Skor (%)</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {facilityDetails.map((facility) => (
              <tr key={facility.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 text-slate-600 font-medium">{facility.id}</td>
                <td className="px-6 py-4 text-[#0F172A] font-semibold">{facility.name}</td>
                <td className="px-6 py-4 text-slate-500">{facility.category}</td>
                <td className="px-6 py-4 text-slate-700 font-medium">{facility.score}%</td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wide",
                      facility.status === "SEHAT" && "bg-green-100 text-green-700",
                      facility.status === "PERINGATAN" && "bg-yellow-100 text-yellow-700",
                      facility.status === "KRITIS" && "bg-red-100 text-red-700"
                    )}
                  >
                    {facility.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="rounded border border-slate-200 px-4 py-1.5 text-sm font-medium text-[#2563EB] hover:bg-slate-50">
                    Detail
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
