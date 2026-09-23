"use client";

import { useState, useEffect } from "react";
import { ScheduleTopbar } from "@/components/ScheduleTopbar";
import { ScheduleHeader } from "@/components/ScheduleHeader";
import { CalendarGrid } from "@/components/CalendarGrid";
import { AddScheduleModal } from "@/components/AddScheduleModal";
import { ConfirmModal } from "@/components/ConfirmModal";

interface ScheduleEvent {
  id: string;
  date: string;
  title: string;
  type: string;
}

export default function SchedulePage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [alertLogs, setAlertLogs] = useState<any[]>([]);

  // Confirmation Modal State
  const [eventToDelete, setEventToDelete] = useState<{ id: string; date: string; title: string } | null>(null);

  // Format: YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });

  // Fetch persisted events & alert logs once on mount
  useEffect(() => {
    fetch("/api/schedule", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.events)) {
          setEvents(data.events);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingEvents(false));

    fetch("/api/dashboard", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setAlertLogs(data.alertLogs || []))
      .catch(() => {});
  }, []);

  const handleDeleteEventClick = (eventDate: string, eventTitle: string) => {
    // Find the event by date + title to get its id
    const found = events.find((e) => e.date === eventDate && e.title === eventTitle);
    if (found) {
      setEventToDelete({ id: found.id, date: eventDate, title: eventTitle });
    }
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      const res = await fetch("/api/schedule", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventToDelete.id }),
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
      }
    } catch {
      // Silent fail — CalendarGrid still reflects local state
    }
    setEventToDelete(null);
  };

  const handleAddEvent = async (newEvent: { date: string; title: string; type: string }) => {
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      const data = await res.json();
      if (res.ok && data.success && data.event) {
        setEvents((prev) => [...prev, data.event]);
      }
    } catch {
      // Optimistic fallback with a temp id
      setEvents((prev) => [
        ...prev,
        { ...newEvent, id: `tmp-${Date.now()}` },
      ]);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <ScheduleTopbar alertLogs={alertLogs} />
      <ScheduleHeader
        onOpenAddModal={() => setIsAddModalOpen(true)}
        selectedMonth={selectedMonth}
        onMonthChange={(e) => setSelectedMonth(e.target.value)}
      />

      <div className="flex flex-1 overflow-hidden px-8 pb-8 gap-6 pt-2">
        {/* Main Calendar Area */}
        <div className="flex-1 h-full min-w-0">
          {isLoadingEvents ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-sm text-slate-500 font-medium animate-pulse">Memuat jadwal...</p>
              </div>
            </div>
          ) : (
            <CalendarGrid
              selectedMonth={selectedMonth}
              events={events}
              onDeleteEvent={handleDeleteEventClick}
            />
          )}
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
        message={
          eventToDelete
            ? `Apakah Anda yakin ingin menghapus jadwal "${eventToDelete.title}"? Jadwal yang dihapus tidak dapat dikembalikan.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setEventToDelete(null)}
      />
    </div>
  );
}
