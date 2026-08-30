"use client";

import { useState } from "react";
import { EquipmentTopbar } from "@/components/EquipmentTopbar";
import { EquipmentTable } from "@/components/EquipmentTable";
import { EquipmentDetailPanel } from "@/components/EquipmentDetailPanel";

export default function EquipmentPage() {
  // Default to ELT-02 to match the initial screenshot state
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>("ELT-02");

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <EquipmentTopbar title="Inventaris Fasilitas" />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Table Area */}
        <div className="flex-1 h-full overflow-hidden">
          <EquipmentTable 
            selectedId={selectedEquipmentId} 
            onSelect={setSelectedEquipmentId} 
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
            onClose={() => setSelectedEquipmentId(null)} 
          />
        </div>
      </div>
    </div>
  );
}
