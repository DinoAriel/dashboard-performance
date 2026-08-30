"use client";

import { Bell, HelpCircle, Search, LayoutGrid } from "lucide-react";

export function ScheduleTopbar() {
  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8">
      {/* Left side: Search */}
      <div className="relative flex items-center w-80">
        <Search size={18} className="absolute left-3 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="h-10 w-full rounded-md border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all"
        />
      </div>

      {/* Right side: Icons & Profile */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-slate-400 ring-2 ring-white" />
        </button>
        
        <button className="p-2 text-slate-500 hover:text-slate-700 transition-colors">
          <HelpCircle size={20} />
        </button>

        <button className="p-2 text-slate-500 hover:text-slate-700 transition-colors">
          <LayoutGrid size={20} />
        </button>

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
