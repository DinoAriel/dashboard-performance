"use client";

import { cn } from "@/lib/utils";
import { calendarEvents } from "@/lib/mock-data";

export function CalendarGrid() {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generating a simple array of days for August 2024 for mockup purposes
  // August 2024 starts on a Thursday (index 4) and has 31 days.
  // The first week in the screenshot shows 28, 29, 30, 31 (from July) then 1, 2, 3
  const calendarDays = [
    { date: 28, isCurrentMonth: false }, { date: 29, isCurrentMonth: false }, { date: 30, isCurrentMonth: false }, { date: 31, isCurrentMonth: false }, { date: 1, isCurrentMonth: true }, { date: 2, isCurrentMonth: true }, { date: 3, isCurrentMonth: true },
    { date: 4, isCurrentMonth: true }, { date: 5, isCurrentMonth: true }, { date: 6, isCurrentMonth: true }, { date: 7, isCurrentMonth: true }, { date: 8, isCurrentMonth: true }, { date: 9, isCurrentMonth: true }, { date: 10, isCurrentMonth: true },
    { date: 11, isCurrentMonth: true }, { date: 12, isCurrentMonth: true }, { date: 13, isCurrentMonth: true }, { date: 14, isCurrentMonth: true }, { date: 15, isCurrentMonth: true, fullDate: '2024-08-15' }, { date: 16, isCurrentMonth: true }, { date: 17, isCurrentMonth: true },
    { date: 18, isCurrentMonth: true, fullDate: '2024-08-18' }, { date: 19, isCurrentMonth: true }, { date: 20, isCurrentMonth: true }, { date: 21, isCurrentMonth: true }, { date: 22, isCurrentMonth: true, fullDate: '2024-08-22' }, { date: 23, isCurrentMonth: true }, { date: 24, isCurrentMonth: true },
    { date: 25, isCurrentMonth: true }, { date: 26, isCurrentMonth: true }, { date: 27, isCurrentMonth: true }, { date: 28, isCurrentMonth: true }, { date: 29, isCurrentMonth: true }, { date: 30, isCurrentMonth: true }, { date: 31, isCurrentMonth: true }
  ];

  const getEventForDate = (fullDate?: string) => {
    if (!fullDate || !calendarEvents) return null;
    return calendarEvents.find(e => e.date === fullDate);
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50">
        {daysOfWeek.map((day) => (
          <div key={day} className="px-4 py-3 text-center text-xs font-semibold text-slate-500 border-r border-slate-200 last:border-r-0">
            {day}
          </div>
        ))}
      </div>
      
      <div className="flex-1 grid grid-cols-7 grid-rows-5">
        {calendarDays.map((day, idx) => {
          const event = getEventForDate(day.fullDate);
          const isToday = day.date === 22 && day.isCurrentMonth; // Hardcoded "today" selection based on screenshot
          
          return (
            <div 
              key={idx} 
              className="relative p-2 border-r border-b border-slate-200 last-in-row:border-r-0 flex flex-col min-h-[100px]"
            >
              <div className="flex justify-between items-start mb-1">
                <span className={cn(
                  "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                  day.isCurrentMonth ? "text-slate-700" : "text-slate-300",
                  isToday ? "bg-[#0F52BA] text-white" : ""
                )}>
                  {day.date}
                </span>
              </div>
              
              {event && (
                <div className={cn(
                  "text-[10px] font-medium px-2 py-1 rounded truncate mt-1 cursor-pointer hover:opacity-90",
                  event.type === 'routine' && "bg-[#1E70E8] text-white",
                  event.type === 'repair' && "bg-red-100 text-red-700",
                  event.type === 'inspection' && "bg-amber-100 text-amber-800"
                )}>
                  {event.title}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
