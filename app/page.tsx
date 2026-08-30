import { Topbar } from "@/components/Topbar";
import { KPICard } from "@/components/KPICard";
import { DashboardCharts } from "@/components/DashboardCharts";
import { DashboardTable } from "@/components/DashboardTable";
import { kpiData } from "@/lib/mock-data";
import { CheckCircle2, AlertCircle, ClipboardList, AlertTriangle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#F8FAFC] pb-10">
      <Topbar title="Overview Performa Fasilitas" />

      
      <div className="px-8 mt-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPICard 
            title="Skor Rata-rata" 
            value={`${kpiData.averageScore}%`}
            caption="Normal Operasional"
            icon={CheckCircle2}
            iconColor="text-green-500"
          />
          <KPICard 
            title="Fasilitas Kritis" 
            value={kpiData.criticalFacilities}
            caption="Perlu perhatian segera"
            icon={AlertCircle}
            iconColor="text-red-500"
          />
          <KPICard 
            title="Total Inventaris" 
            value={`${kpiData.totalInventory} Alat`}
            caption="Terdaftar di sistem"
            icon={ClipboardList}
            iconColor="text-slate-500"
          />
          <KPICard 
            title="Alert Baru" 
            value={`${kpiData.newAlerts} Peringatan`}
            caption="Dalam 24 jam terakhir"
            icon={AlertTriangle}
            iconColor="text-yellow-500"
          />
        </div>

        <DashboardCharts />
        <DashboardTable />
      </div>
    </div>
  );
}
