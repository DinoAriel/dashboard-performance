"use client";

import { ScheduleTopbar } from "@/components/ScheduleTopbar";
import { ReportSettings } from "@/components/ReportSettings";
import { ReportHistory } from "@/components/ReportHistory";

export default function ReportsPage() {
  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* We reuse the generic topbar from Schedule since they are visually identical */}
      <ScheduleTopbar />
      
      <div className="flex flex-1 overflow-hidden p-6 gap-6">
        <ReportSettings />
        <ReportHistory />
      </div>
    </div>
  );
}
