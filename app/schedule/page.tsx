"use client";

import { useState } from "react";
import { ScheduleTopbar } from "@/components/ScheduleTopbar";
import { ScheduleHeader } from "@/components/ScheduleHeader";
import { CalendarGrid } from "@/components/CalendarGrid";
import { AddScheduleModal } from "@/components/AddScheduleModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { calendarEvents } from "@/lib/mock-data";

export default function SchedulePage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [events, setEvents] = useState(calendarEvents);
  
  // Confirmation Modal State
  const [eventToDelete, setEventToDelete] = useState<{date: string, title: string} | null>(null);
  
  // Format: YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const handleDeleteEventClick = (eventDate: string, eventTitle: string) => {
    setEventToDelete({ date: eventDate, title: eventTitle });
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      setEvents(events.filter(e => !(e.date === eventToDelete.date && e.title === eventToDelete.title)));
      setEventToDelete(null);
    }
  };

  const handleAddEvent = (newEvent: any) => {
    setEvents([...events, newEvent]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <ScheduleTopbar />
      <ScheduleHeader 
        onOpenAddModal={() => setIsAddModalOpen(true)} 
        selectedMonth={selectedMonth}
        onMonthChange={(e) => setSelectedMonth(e.target.value)}
      />
      
      <div className="flex flex-1 overflow-hidden px-8 pb-8 gap-6 pt-2">
        {/* Main Calendar Area */}
        <div className="flex-1 h-full min-w-0">
          <CalendarGrid 
            selectedMonth={selectedMonth} 
            events={events}
            onDeleteEvent={handleDeleteEventClick}
          />
        </div>
      </div>

      <AddScheduleModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddEvent}
      />

      <ConfirmModal
        isOpen={!!eventToDelete}
        title="Hapus Jadwal"
        message={eventToDelete ? `Apakah Anda yakin ingin menghapus jadwal "${eventToDelete.title}"? Jadwal yang dihapus tidak dapat dikembalikan.` : ""}
        onConfirm={confirmDelete}
        onCancel={() => setEventToDelete(null)}
      />
    </div>
  );
}
