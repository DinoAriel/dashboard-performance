"use client";

import { Calendar, Bell, HelpCircle } from "lucide-react";

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  return (
    <div className="flex h-[88px] items-center justify-between border-b border-slate-200 bg-white px-8">
      <h1 className="text-[22px] font-bold text-[#0F172A]">{title}</h1>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <Calendar size={18} className="text-slate-500" />
          <select className="bg-transparent text-sm font-medium text-slate-700 outline-none">
            <option>Januari</option>
            <option>Bulan Ini</option>
          </select>
        </div>

        <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
          <button className="relative p-2 text-slate-500 hover:text-slate-700">
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          
          <button className="p-2 text-slate-500 hover:text-slate-700">
            <HelpCircle size={20} />
          </button>

          <div className="ml-2 h-9 w-9 overflow-hidden rounded-full bg-slate-200 border border-slate-200">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="User avatar" 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
