"use client";

import { Bell, HelpCircle, Search, Plus } from "lucide-react";

interface EquipmentTopbarProps {
  title: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick?: () => void;
}

export function EquipmentTopbar({ title, searchQuery, onSearchChange, onAddClick }: EquipmentTopbarProps) {
  return (
    <div className="flex h-[88px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8">
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

        <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
          <button className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          
          <button className="p-2 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
            <HelpCircle size={20} />
          </button>

          <button 
            onClick={onAddClick}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F52BA] text-white hover:bg-[#0b409c] transition-colors ml-2 shadow-sm cursor-pointer"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
