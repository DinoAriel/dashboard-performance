"use client";

import { cn } from "@/lib/utils";

export function CalendarGrid({ 
  selectedMonth,
  events = [],
  onDeleteEvent
}: { 
  selectedMonth?: string;
  events?: Array<{ date: string; title: string; type: string }>;
  onDeleteEvent?: (date: string, title: string) => void;
}) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Parse month and year from selectedMonth
  const now = new Date();
  const year = selectedMonth ? parseInt(selectedMonth.split('-')[0]) : now.getFullYear();
  const month = selectedMonth ? parseInt(selectedMonth.split('-')[1]) - 1 : now.getMonth();
  
  // Calculate days for the grid
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = lastDayOfMonth.getDate();
  
  const calendarDays = [];
  
  // Fill previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({ 
      date: prevMonthLastDay - i, 
      isCurrentMonth: false 
    });
  }
  
  // Fill current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({ 
      date: i, 
      isCurrentMonth: true, 
      fullDate: dateStr,
      isToday: dateStr === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    });
  }
  
  // Fill next month leading days to complete grid (either 35 or 42 total cells)
  const totalCells = calendarDays.length > 35 ? 42 : 35;
  let nextMonthDay = 1;
  while (calendarDays.length < totalCells) {
    calendarDays.push({ 
      date: nextMonthDay++, 
      isCurrentMonth: false 
    });
  }

  const getEventForDate = (fullDate?: string) => {
    if (!fullDate || !events) return null;
    return events.find(e => e.date === fullDate);
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
      
      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {calendarDays.map((day, idx) => {
          const event = getEventForDate(day.fullDate);
          const isToday = day.isToday; // Menggunakan properti dari array dinamis
          
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
                <div 
                  onClick={() => onDeleteEvent && onDeleteEvent(event.date, event.title)}
                  className={cn(
                    "text-[10px] font-medium px-2 py-1 rounded truncate mt-1 cursor-pointer hover:opacity-90 hover:ring-1 hover:ring-slate-300 transition-all",
                    event.type === 'routine' && "bg-[#1E70E8] text-white",
                    event.type === 'repair' && "bg-red-100 text-red-700",
                    event.type === 'inspection' && "bg-amber-100 text-amber-800"
                  )}
                  title="Klik untuk menghapus"
                >
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
