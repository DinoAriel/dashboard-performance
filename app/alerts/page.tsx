"use client";

import { AlertsTopbar } from "@/components/AlertsTopbar";
import { AlertList } from "@/components/AlertList";
import { AlertFilters } from "@/components/AlertFilters";

export default function AlertsPage() {
  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <AlertsTopbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left main list area */}
        <AlertList />

        {/* Right side filters */}
        <AlertFilters />
      </div>
    </div>
  );
}
