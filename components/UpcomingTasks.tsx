"use client";

import { upcomingTasks } from "@/lib/mock-data";
import { Plus, Clock } from "lucide-react";

export function UpcomingTasks() {
  return (
    <div className="w-[320px] shrink-0 bg-white border border-slate-200 rounded-lg flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/30">
        <h3 className="text-[15px] font-bold text-[#0F172A]">Tugas 7 Hari Kedepan</h3>
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
          {upcomingTasks ? upcomingTasks.length : 0}
        </span>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {(upcomingTasks || []).map((task) => (
          <div key={task.id} className="border border-slate-200 rounded-lg p-4 bg-white flex gap-3 hover:border-slate-300 transition-colors">
            <div className="pt-0.5">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-slate-300 text-[#0F52BA] focus:ring-[#0F52BA]"
              />
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm font-semibold text-slate-800 leading-tight">
                  {task.title}
                </h4>
                {task.urgent && (
                  <span className="shrink-0 bg-[#B91C1C] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                    URGENT
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1.5 text-xs font-medium mb-3">
                <Clock size={14} className={task.urgent ? "text-red-500" : "text-slate-400"} />
                <span className={task.urgent ? "text-red-600" : "text-slate-600"}>
                  {task.deadline}
                </span>
              </div>
              
              <div>
                <span className="inline-flex items-center px-2 py-1 text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded uppercase tracking-wider">
                  {task.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Action */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <button className="w-full flex items-center justify-center gap-2 bg-[#0F52BA] text-white font-semibold py-2.5 rounded-md hover:bg-[#0b409c] transition-colors">
          <Plus size={18} />
          Buat Jadwal Baru
        </button>
      </div>
    </div>
  );
}
