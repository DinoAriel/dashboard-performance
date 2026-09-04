"use client";

import { ScheduleTopbar } from "@/components/ScheduleTopbar";
import { ReportHistory } from "@/components/ReportHistory";

export default function ReportsPage() {
  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <ScheduleTopbar />
      
      <div className="flex flex-1 overflow-hidden p-6">
        <ReportHistory />
      </div>
    </div>
  );
}

