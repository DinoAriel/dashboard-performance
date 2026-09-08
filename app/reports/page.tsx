"use client";

import { useState, useEffect } from "react";
import { ScheduleTopbar } from "@/components/ScheduleTopbar";
import { ReportHistory } from "@/components/ReportHistory";

export default function ReportsPage() {
  const [alertLogs, setAlertLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/dashboard", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setAlertLogs(data.alertLogs || []);
      })
      .catch((err) => console.error("Error fetching alert logs:", err));
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <ScheduleTopbar title="Riwayat Laporan" alertLogs={alertLogs} />
      
      <div className="flex flex-1 overflow-hidden p-6">
        <ReportHistory />
      </div>
    </div>
  );
}
