"use client";

import { useState, useEffect } from "react";
import { EquipmentTopbar } from "@/components/EquipmentTopbar";
import { EquipmentTable } from "@/components/EquipmentTable";
import { EquipmentDetailPanel } from "@/components/EquipmentDetailPanel";

export default function EquipmentPage() {
  // Default to ELT-02 to match the initial screenshot state
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>("ELT-02");
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setEquipmentList(data.equipmentList || []);
      })
      .catch((err) => console.error("Error fetching equipment list:", err))
      .finally(() => setIsLoading(false));
  }, []);


  const selectedEquipment = equipmentList.find(
    (item) => item.id === selectedEquipmentId
  );

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <EquipmentTopbar 
        title="Inventaris Fasilitas" 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Table Area */}
        <div className="flex-1 h-full overflow-hidden">
          <EquipmentTable 
            selectedId={selectedEquipmentId} 
            onSelect={setSelectedEquipmentId} 
            equipment={equipmentList}
            searchQuery={searchQuery}
            isLoading={isLoading}
          />
        </div>

        {/* Side Detail Panel */}
        <div 
          className={`transition-all duration-300 ease-in-out ${
            selectedEquipmentId ? "translate-x-0 w-[320px]" : "translate-x-full w-0"
          }`}
        >
          <EquipmentDetailPanel 
            equipmentId={selectedEquipmentId} 
            liveEquipment={selectedEquipment}
            onClose={() => setSelectedEquipmentId(null)} 
          />
        </div>
      </div>
    </div>
  );
}
