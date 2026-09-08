"use client";

import { useState, useEffect } from "react";
import { AlertsTopbar } from "@/components/AlertsTopbar";
import { AlertList } from "@/components/AlertList";
import { AlertFilters } from "@/components/AlertFilters";

export default function AlertsPage() {
  const [alertLogs, setAlertLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/dashboard", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setAlertLogs(data.alertLogs || []))
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <AlertsTopbar alertLogs={alertLogs} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left main list area */}
        <AlertList />

        {/* Right side filters */}
        <AlertFilters />
      </div>
    </div>
  );
}
