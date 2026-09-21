"use client";

import { useState, useEffect } from "react";
import { AlertsTopbar } from "@/components/AlertsTopbar";
import { AlertList } from "@/components/AlertList";
import { AlertFilters } from "@/components/AlertFilters";

export interface AlertFilterState {
  severity: { KRITIS: boolean; PERINGATAN: boolean; INFO: boolean };
}

export default function AlertsPage() {
  const [alertLogs, setAlertLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<AlertFilterState>({
    severity: { KRITIS: true, PERINGATAN: true, INFO: true },
  });

  // Single fetch — data diteruskan ke AlertsTopbar dan AlertList
  useEffect(() => {
    fetch("/api/logs", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.alertLogs) {
          setAlertLogs(data.alertLogs);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <AlertsTopbar alertLogs={alertLogs} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left main list area — data sudah ada, tidak perlu fetch ulang */}
        <AlertList alertLogs={alertLogs} isLoading={isLoading} filters={filters} />

        {/* Right side filters */}
        <AlertFilters filters={filters} onFiltersChange={setFilters} />
      </div>
    </div>
  );
}
