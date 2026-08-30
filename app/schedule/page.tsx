"use client";

import { ScheduleTopbar } from "@/components/ScheduleTopbar";
import { ScheduleHeader } from "@/components/ScheduleHeader";
import { CalendarGrid } from "@/components/CalendarGrid";
import { UpcomingTasks } from "@/components/UpcomingTasks";

export default function SchedulePage() {
  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <ScheduleTopbar />
      <ScheduleHeader />
      
      <div className="flex flex-1 overflow-hidden px-8 pb-8 gap-6 pt-2">
        {/* Main Calendar Area */}
        <div className="flex-1 h-full min-w-0">
          <CalendarGrid />
        </div>

        {/* Side Panel for Tasks */}
        <UpcomingTasks />
      </div>
    </div>
  );
}
