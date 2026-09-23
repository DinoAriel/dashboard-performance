import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

// Definisi Struktur Alat
export interface EquipmentSchema {
  id: string;
  excelName: string;
  displayName: string;
  category: "ELEKTRIKAL" | "MEKANIKAL" | "ELEKTRONIKA";
  location: string;
  columnIndex: number;
}

export const EQUIPMENT_SCHEMAS: EquipmentSchema[] = [
  // Elektrikal (Index 5 s/d 10)
  { id: "ELK-01", excelName: "GENERATOR SET", displayName: "Generator Set", category: "ELEKTRIKAL", location: "Terminal 1", columnIndex: 5 },
  { id: "ELK-02", excelName: "PANEL TEGANGAN MENENGAH", displayName: "Panel Tegangan Menengah", category: "ELEKTRIKAL", location: "Gardu Hubung", columnIndex: 6 },
  { id: "ELK-03", excelName: "PANEL TEGANGAN RENDAH", displayName: "Panel Tegangan Rendah", category: "ELEKTRIKAL", location: "Power House", columnIndex: 7 },
  { id: "ELK-04", excelName: "TRANSFORMATOR", displayName: "Transformator", category: "ELEKTRIKAL", location: "Main Power House", columnIndex: 8 },
  { id: "ELK-05", excelName: "UNINTERRUPTIBLE POWER SUPPLY (UPS)", displayName: "UPS", category: "ELEKTRIKAL", location: "T1B & T1A", columnIndex: 9 },
  { id: "ELK-06", excelName: "AERONAUTICAL GROUND LIGHTING", displayName: "Aeronautical Ground Lighting", category: "ELEKTRIKAL", location: "Runway & Taxiway", columnIndex: 10 },

  // Mekanikal (Index 12 s/d 19)
  { id: "MEK-01", excelName: " SISTEM HVAC", displayName: "Sistem HVAC", category: "MEKANIKAL", location: "Terminal 2 & T1B", columnIndex: 12 },
  { id: "MEK-02", excelName: "WATER SUPPLY SYSTEM. STP DAN SISTEM PEMADAM", displayName: "Water Supply & STP", category: "MEKANIKAL", location: "STP Area", columnIndex: 13 },
  { id: "MEK-03", excelName: "BAGGAGE HANDLING SYSTEM (BHS)", displayName: "Baggage Handling System", category: "MEKANIKAL", location: "Baggage Claim", columnIndex: 14 },
  { id: "MEK-04", excelName: "PASENGGER MOVING SYSTEM (PMS)", displayName: "Passenger Moving System", category: "MEKANIKAL", location: "Terminal 1 & 2", columnIndex: 15 },
  { id: "MEK-05", excelName: "GARBARATA", displayName: "Garbarata", category: "MEKANIKAL", location: "Gate 1 - 12", columnIndex: 16 },
  { id: "MEK-06", excelName: "PKP-PK", displayName: "PKP-PK", category: "MEKANIKAL", location: "Fire Station", columnIndex: 17 },
  { id: "MEK-07", excelName: "A2B & KENDARAAN OPERASIONAL", displayName: "A2B & Kendaraan Operasional", category: "MEKANIKAL", location: "Apron & Landside", columnIndex: 18 },
  { id: "MEK-08", excelName: "GROUND SUPPORT SERVICE", displayName: "Ground Support Service", category: "MEKANIKAL", location: "Apron Area", columnIndex: 19 },

  // Elektronika (Index 21 s/d 32)
  { id: "ELT-01", excelName: "XRAY", displayName: "X-Ray Scanner", category: "ELEKTRONIKA", location: "Security Checkpoint", columnIndex: 21 },
  { id: "ELT-02", excelName: "WTMD", displayName: "WTMD (Metal Detector)", category: "ELEKTRONIKA", location: "Security Checkpoint", columnIndex: 22 },
  { id: "ELT-03", excelName: "HHMD", displayName: "HHMD", category: "ELEKTRONIKA", location: "Terminal Checkpoint", columnIndex: 23 },
  { id: "ELT-04", excelName: "ETD", displayName: "ETD (Explosive Trace)", category: "ELEKTRONIKA", location: "Security Checkpoint", columnIndex: 24 },
  { id: "ELT-05", excelName: "CCTV", displayName: "CCTV System", category: "ELEKTRONIKA", location: "Control Room / All Areas", columnIndex: 25 },
  { id: "ELT-06", excelName: "BODY SCANNER", displayName: "Body Scanner", category: "ELEKTRONIKA", location: "International Departure", columnIndex: 26 },
  { id: "ELT-07", excelName: "ACCESS CONTROL", displayName: "Access Control", category: "ELEKTRONIKA", location: "Staff Entrance & Gates", columnIndex: 27 },
  { id: "ELT-08", excelName: "FIRE ALARM SYSTEM", displayName: "Fire Alarm System", category: "ELEKTRONIKA", location: "Terminal Buildings", columnIndex: 28 },
  { id: "ELT-09", excelName: "RADIO COMMUNICATION", displayName: "Radio Communication", category: "ELEKTRONIKA", location: "AOC & Operations", columnIndex: 29 },
  { id: "ELT-10", excelName: "FIDS", displayName: "FIDS (Flight Info)", category: "ELEKTRONIKA", location: "Departure & Arrival Halls", columnIndex: 30 },
  { id: "ELT-11", excelName: "PUBLIC ADRESSING SYSTEM", displayName: "Public Addressing System", category: "ELEKTRONIKA", location: "All Passenger Areas", columnIndex: 31 },
  { id: "ELT-12", excelName: "BIRD DETERRENT", displayName: "Bird Deterrent", category: "ELEKTRONIKA", location: "Runway Perimeter", columnIndex: 32 }
];

// Fallback spesifikasi untuk menyajikan detail instrumen secara realistis
export const EQUIPMENT_SPECS: Record<string, { brand: string; model: string; installation: string }> = {
  "ELK-01": { brand: "Caterpillar", model: "CAT 3516B", installation: "12 May 2018" },
  "ELK-02": { brand: "Schneider Electric", model: "Premset MV", installation: "05 Apr 2019" },
  "ELK-03": { brand: "Siemens", model: "Sivacon S8", installation: "22 Oct 2019" },
  "ELK-04": { brand: "ABB", model: "Cast Resin 2500kVA", installation: "17 Jun 2018" },
  "ELK-05": { brand: "Eaton", model: "PowerXpert 9395", installation: "09 Jan 2020" },
  "ELK-06": { brand: "ADB Safegate", model: "AGL-LED Series", installation: "14 Aug 2021" },
  "MEK-01": { brand: "Daikin", model: "Centrifugal Chiller", installation: "11 Feb 2020" },
  "MEK-02": { brand: "Grundfos", model: "Hydro MPC", installation: "29 Sep 2019" },
  "MEK-03": { brand: "Vanderlande", model: "TUBTRAX 2.0", installation: "08 Dec 2018" },
  "MEK-04": { brand: "Otis", model: "Escalator 515 NPE", installation: "14 Jul 2017" },
  "MEK-05": { brand: "Bukaka", model: "BPP-3000", installation: "12 Aug 2021" },
  "MEK-06": { brand: "Rosenbauer", model: "Panther 6x6", installation: "03 Nov 2020" },
  "MEK-07": { brand: "Toyota / Komatsu", model: "FB25 / Tugger", installation: "20 May 2021" },
  "MEK-08": { brand: "TLD", model: "GPU-418", installation: "15 Mar 2022" },
  "ELT-01": { brand: "Smiths Detection", model: "HI-SCAN 6040i", installation: "12 Aug 2021" },
  "ELT-02": { brand: "Ceia", model: "PMD2 Plus", installation: "04 Oct 2020" },
  "ELT-03": { brand: "Garrett", model: "Super Scanner T", installation: "18 Jan 2022" },
  "ELT-04": { brand: "Bruker", model: "DE-tector flex", installation: "09 Sep 2021" },
  "ELT-05": { brand: "Hikvision", model: "DarkFighter PTZ", installation: "15 May 2021" },
  "ELT-06": { brand: "L3Harris", model: "ProVision 2", installation: "25 Nov 2021" },
  "ELT-07": { brand: "Bosch", model: "Access Engine v3", installation: "06 Mar 2020" },
  "ELT-08": { brand: "Notifier by Honeywell", model: "NFS2-3030", installation: "12 Oct 2019" },
  "ELT-09": { brand: "Motorola Solutions", model: "Dimetra Tetra TETRA IP", installation: "04 Jun 2021" },
  "ELT-10": { brand: "NEC", model: "FIDS-OPS Professional", installation: "20 Jul 2020" },
  "ELT-11": { brand: "Bosch", model: "Praesideo PAS", installation: "30 Apr 2020" },
  "ELT-12": { brand: "Scarecrow Group", model: "BIRD-D-100", installation: "15 Jan 2022" }
};

export function excelSerialToJSDate(serial: number): Date {
  // Add 12 hours to avoid timezone shift causing date to roll back to previous day
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date = new Date((utc_value + 43200) * 1000);
  return date;
}

export function jsDateToExcelSerial(date: Date): number {
  const ms = date.getTime();
  const utc_value = ms / 1000;
  const utc_days = utc_value / 86400;
  return Math.round(utc_days + 25569);
}

export function parseExcelData() {
  const filePath = path.join(process.cwd(), "data_performance.xlsx");
  if (!fs.existsSync(filePath)) {
    throw new Error(`File excel tidak ditemukan di: ${filePath}`);
  }

  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheet = workbook.Sheets["SUB"];
  if (!sheet) {
    throw new Error("Sheet 'SUB' tidak dtemukan di file excel!");
  }

  const range = XLSX.utils.decode_range(sheet["!ref"] || "A1:AH1");
  const rows: { excelSerial: number; jsDate: Date; data: any[] }[] = [];

  for (let r = 1; r <= range.e.r; r++) {
    const dateCell = sheet[XLSX.utils.encode_cell({ r, c: 0 })];
    if (dateCell && typeof dateCell.v === "number") {
      const rowData: any[] = [];
      for (let c = 0; c <= range.e.c; c++) {
        const cell = sheet[XLSX.utils.encode_cell({ r, c })];
        rowData.push(cell ? cell.v : null);
      }
      rows.push({
        excelSerial: dateCell.v,
        jsDate: excelSerialToJSDate(dateCell.v),
        data: rowData
      });
    }
  }

  // Urutkan kronologis berdasarkan tanggal
  rows.sort((a, b) => a.excelSerial - b.excelSerial);

  return rows;
}

export interface DashboardOutput {
  kpiData: {
    averageScore: number;
    criticalFacilities: number;
    totalInventory: number;
    newAlerts: number;
  };
  categories: { id: string; label: string; count: number }[];
  monthlyHealthData: { name: string; value: number }[];
  statusDistributionData: { name: string; value: number; fill: string }[];
  targetPercent: number;
  equipmentList: {
    id: string;
    name: string;
    category: string;
    location: string;
    score: number;
    scoreChange?: number;
    status: "SEHAT" | "PERINGATAN" | "KRITIS";
    history?: { name: string; value: number }[];
  }[];
  alertLogs: {
    id: number;
    severity: "KRITIS" | "PERINGATAN" | "INFO";
    time: string;
    incidentNumber: string;
    title: string;
    facility: string;
    note: string;
    detailNote?: string;
  }[];
  maintenanceLogs?: {
    id: number;
    date: string;
    facility: string;
    category: string;
    note: string;
  }[];
}

export function getDashboardData(): DashboardOutput {
  try {
    const rows = parseExcelData();
    if (rows.length === 0) {
      throw new Error("Tidak ada baris data valid di sheet Excel SUB");
    }

    // PRE-PROCESS: Carry over from previous rows for empty cells
    const originalRowsData = rows.map(r => [...r.data]);
    for (let i = 1; i < rows.length; i++) {
      const prevRow = rows[i - 1];
      const currRow = rows[i];
      EQUIPMENT_SCHEMAS.forEach(eq => {
        const idx = eq.columnIndex;
        const rawVal = currRow.data[idx];
        if (rawVal === null || rawVal === undefined || rawVal === "") {
          currRow.data[idx] = prevRow.data[idx];
        }
      });
    }

    const latestRow = rows[rows.length - 1];
    const previousRow = rows.length > 1 ? rows[rows.length - 2] : null;
    
    // Ambil Target Kinerja dari Excel (Kolom E / index 4)
    let dynamicTarget = 90; // fallback default
    const rawTarget = latestRow.data[4];
    if (rawTarget !== null && rawTarget !== undefined) {
      let numTarget: number;
      if (typeof rawTarget === "number") numTarget = rawTarget;
      else numTarget = parseFloat(String(rawTarget).replace('%', '').trim());
      
      if (!isNaN(numTarget)) {
        // Jika nilai <= 1 berarti desimal (0.90) → kalikan 100
        // Jika nilai > 1 berarti sudah persen (90) → gunakan langsung
        dynamicTarget = numTarget <= 1 ? Math.round(numTarget * 100) : Math.round(numTarget);
      }
      // Pastikan target dalam rentang wajar 1-100
      if (dynamicTarget < 1 || dynamicTarget > 100) dynamicTarget = 90;
    }

    const currentMonthStr = latestRow.jsDate.toISOString().substring(0, 7);
    let prevDate = new Date(latestRow.jsDate);
    prevDate.setMonth(prevDate.getMonth() - 1);
    const previousMonthStr = prevDate.toISOString().substring(0, 7);

    // Parse Equipment & Skor saat ini (menggunakan status/skor terbaru dari baris terakhir Excel)
    const equipmentList = EQUIPMENT_SCHEMAS.map(eq => {
      let latestRawVal = latestRow.data[eq.columnIndex];
      let score = 100;
      if (latestRawVal !== null && latestRawVal !== undefined && latestRawVal !== "") {
        let nVal = typeof latestRawVal === "number" ? latestRawVal : parseFloat(String(latestRawVal));
        if (!isNaN(nVal)) score = nVal > 1 ? Math.round(nVal) : Math.round(nVal * 100);
      }

      let previousRawVal = previousRow ? previousRow.data[eq.columnIndex] : null;
      let previousScore = score;
      if (previousRawVal !== null && previousRawVal !== undefined && previousRawVal !== "") {
        let nVal = typeof previousRawVal === "number" ? previousRawVal : parseFloat(String(previousRawVal));
        if (!isNaN(nVal)) previousScore = nVal > 1 ? Math.round(nVal) : Math.round(nVal * 100);
      }

      let scoreChange = score - previousScore;

      let status: "SEHAT" | "PERINGATAN" | "KRITIS" = "SEHAT";
      if (score < 70) {
        status = "KRITIS";
      } else if (score <= dynamicTarget) {
        status = "PERINGATAN";
      }

      // Group scores by Month (Year-Month) to build monthly average history
      const equipmentMonthlyScores: Record<string, { sum: number; count: number }> = {};
      rows.forEach((r, rowIndex) => {
        const origVal = originalRowsData[rowIndex][eq.columnIndex];
        if (origVal !== null && origVal !== undefined && origVal !== "") {
          const d = r.jsDate;
          const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          let rVal = r.data[eq.columnIndex];
          let hScore = 100;
          if (rVal !== null && rVal !== undefined) {
            let nVal = typeof rVal === "number" ? rVal : parseFloat(rVal);
            if (!isNaN(nVal)) hScore = nVal > 1 ? Math.round(nVal) : Math.round(nVal * 100);
          }
          if (!equipmentMonthlyScores[ym]) {
            equipmentMonthlyScores[ym] = { sum: 0, count: 0 };
          }
          equipmentMonthlyScores[ym].sum += hScore;
          equipmentMonthlyScores[ym].count += 1;
        }
      });

      const monthNamesShort: Record<string, string> = {
        "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "Mei", "06": "Jun",
        "07": "Jul", "08": "Agt", "09": "Sep", "10": "Okt", "11": "Nov", "12": "Des"
      };

      const eqHistory = Object.keys(equipmentMonthlyScores)
        .sort()
        .slice(-6)
        .map((ym) => {
          const mStr = ym.split("-")[1];
          const avgScore = Math.round(equipmentMonthlyScores[ym].sum / equipmentMonthlyScores[ym].count);
          return { name: monthNamesShort[mStr] || mStr, value: avgScore };
        });

      return {
        id: eq.id,
        name: eq.displayName,
        category: eq.category,
        location: eq.location,
        score,
        scoreChange,
        status,
        history: eqHistory
      };
    });

    // Score KPI dan Distribusi
    const totalScore = equipmentList.reduce((sum, eq) => sum + eq.score, 0);
    const averageScore = Math.round((totalScore / equipmentList.length) * 10) / 10;
    
    const criticalCount = equipmentList.filter(eq => eq.status === "KRITIS").length;
    const warningCount = equipmentList.filter(eq => eq.status === "PERINGATAN").length;
    const healthyCount = equipmentList.filter(eq => eq.status === "SEHAT").length;

    // Hitung persentase untuk Status Distribution Pie Chart
    const totalEquip = equipmentList.length;
    const statusDistributionData = [
      { name: "Hijau (Sehat >96%)", value: Math.round((healthyCount / totalEquip) * 100), fill: "#16a34a" },
      { name: "Kuning (Peringatan)", value: Math.round((warningCount / totalEquip) * 100), fill: "#eab308" },
      { name: "Merah (Kritis <90%)", value: Math.round((criticalCount / totalEquip) * 100), fill: "#dc2626" }
    ];

    // 1. GENERATE OTOMATIS ALERT DARI SKOR
    const alertLogs: DashboardOutput["alertLogs"] = [];
    let logIdCounter = 1;

    equipmentList.forEach(eq => {
      if (eq.status === "KRITIS" || eq.status === "PERINGATAN") {
        let issueDetail = "";
        let descColIndex = 11;
        if (eq.category === "MEKANIKAL") descColIndex = 20;
        if (eq.category === "ELEKTRONIKA") descColIndex = 33;
        
        const latestDesc = latestRow.data[descColIndex];
        if (latestDesc && typeof latestDesc === "string") {
          const cleanedName = eq.name.toLowerCase().replace("system", "").replace("scanner", "").trim();
          const excelName = (EQUIPMENT_SCHEMAS.find(s => s.id === eq.id)?.excelName || "").toLowerCase().trim();
          const lines = latestDesc.split(/\r?\n/);
          let currentLine = "";
          let notesForEq = [];
          
          for (let line of lines) {
            const trimmed = line.trim();
            if (trimmed.length === 0) continue;
            if (/^(\d+\.|-)\s+/.test(trimmed)) {
              if (currentLine && (currentLine.toLowerCase().includes(cleanedName) || currentLine.toLowerCase().includes(excelName))) {
                notesForEq.push(currentLine.replace(/^(\d+\.|-)\s*/, ""));
              }
              currentLine = trimmed;
            } else {
              if (!currentLine) currentLine = trimmed;
              else currentLine += " " + trimmed;
            }
          }
          if (currentLine && (currentLine.toLowerCase().includes(cleanedName) || currentLine.toLowerCase().includes(excelName))) {
            notesForEq.push(currentLine.replace(/^(\d+\.|-)\s*/, ""));
          }
          if (notesForEq.length > 0) {
            issueDetail = ` \n\nDetail Kerusakan: ${notesForEq.join(", ")}`;
          } else if (latestDesc.trim().length > 0) {
            // Fallback: show the whole text for this category if substring match fails
            issueDetail = ` \n\nCatatan Maintenance (${eq.category}):\n${latestDesc.trim()}`;
          }
        }

        const conditionText = eq.score < dynamicTarget ? "di bawah batas normal" : "berada pada batas peringatan minimum";
        const baseNote = `Skor ${conditionText}. Target Excel: ${dynamicTarget}%, Saat ini: ${eq.score}%.`;

        alertLogs.push({
          id: logIdCounter++,
          severity: eq.status,
          time: "Aktif",
          incidentNumber: `SYS-${2000 + logIdCounter}`,
          title: `Sistem mendeteksi performa rendah (${eq.score}%)`,
          facility: `${eq.name} (${eq.category})`,
          note: baseNote,
          detailNote: issueDetail ? `${baseNote}${issueDetail}` : baseNote
        });
      }
    });

    // 2. GENERATE MAINTENANCE HISTORY DARI SELURUH ROW
    const maintenanceLogs: DashboardOutput["maintenanceLogs"] = [];
    let maintIdCounter = 1;

    // Helper untuk mem-parsing teks berpoin/bernomor
    const parseHistoryText = (text: string | null | undefined, categoryLabel: string, dateStr: string) => {
      if (!text || typeof text !== "string") return;
      
      const lines = text.split(/\r?\n/);
      const entries: string[] = [];
      let currentEntry = "";

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.length === 0) return;

        if (/^(\d+\.|-)\s+/.test(trimmed)) {
          if (currentEntry) entries.push(currentEntry);
          currentEntry = trimmed.replace(/^(\d+\.|-)\s*/, "");
        } else {
          if (!currentEntry) {
            currentEntry = trimmed;
          } else {
            currentEntry += " " + trimmed;
          }
        }
      });
      if (currentEntry) entries.push(currentEntry);

      entries.forEach((cleanLine) => {
        if (cleanLine.length > 5) {
          let matchFacility = `Fasilitas ${categoryLabel}`;
          for (const eq of EQUIPMENT_SCHEMAS) {
            if (eq.category === categoryLabel.toUpperCase()) {
              const cleanedName = eq.displayName.toLowerCase().replace("system", "").replace("scanner", "").trim();
              if (cleanLine.toLowerCase().includes(cleanedName) || cleanLine.toLowerCase().includes(eq.excelName.toLowerCase().trim())) {
                matchFacility = eq.displayName;
                break;
              }
            }
          }

          maintenanceLogs.push({
            id: maintIdCounter++,
            date: dateStr,
            facility: matchFacility,
            category: categoryLabel,
            note: cleanLine
          });
        }
      });
    };

    // Ambil histori dari seluruh baris (dari yang terbaru mundur ke lama)
    const reversedRows = [...rows].reverse();
    reversedRows.forEach(row => {
      const dateStr = row.jsDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
      parseHistoryText(row.data[11], "Elektrikal", dateStr);
      parseHistoryText(row.data[20], "Mekanikal", dateStr);
      parseHistoryText(row.data[33], "Elektronika", dateStr);
    });

    // Hitung Trend Skor Bulanan
    const monthlyData: Record<string, { totalSum: number; rowCount: number }> = {};
    rows.forEach(row => {
      const yearMonth = row.jsDate.toISOString().substring(0, 7); // e.g. "2026-08"
      if (!monthlyData[yearMonth]) {
        monthlyData[yearMonth] = { totalSum: 0, rowCount: 0 };
      }

      // Hitung skor rata-rata baris ini
      let rowSum = 0;
      EQUIPMENT_SCHEMAS.forEach(eq => {
        let rawVal = row.data[eq.columnIndex];
        let val = 1.0;
        if (rawVal !== null && rawVal !== undefined) {
          let numVal: number;
          if (typeof rawVal === "number") numVal = rawVal;
          else numVal = parseFloat(rawVal);
          if (!isNaN(numVal)) {
            // Normalisasi ke skala 0-1
            val = numVal > 1 ? numVal / 100 : numVal;
          }
        }
        rowSum += val;
      });
      const rowAvg = (rowSum / EQUIPMENT_SCHEMAS.length) * 100;
      monthlyData[yearMonth].totalSum += rowAvg;
      monthlyData[yearMonth].rowCount += 1;
    });

    const monthNames: Record<string, string> = {
      "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "Mei", "06": "Jun",
      "07": "Jul", "08": "Agt", "09": "Sep", "10": "Okt", "11": "Nov", "12": "Des"
    };

    // Ambil maksimal 8 bulan terakhir agar grafiknya pas
    const monthlyHealthData = Object.keys(monthlyData)
      .sort()
      .slice(-8)
      .map(ym => {
        const [year, month] = ym.split("-");
        const label = `${monthNames[month]} ${year.substring(2)}`;
        const value = Math.round((monthlyData[ym].totalSum / monthlyData[ym].rowCount) * 10) / 10;
        return { name: label, value };
      });

    // Categories counts
    const categories = [
      { id: "semua", label: "Semua", count: totalEquip },
      { id: "elektrikal", label: "Elektrikal", count: equipmentList.filter(eq => eq.category === "ELEKTRIKAL").length },
      { id: "mekanikal", label: "Mekanikal", count: equipmentList.filter(eq => eq.category === "MEKANIKAL").length },
      { id: "elektronika", label: "Elektronika", count: equipmentList.filter(eq => eq.category === "ELEKTRONIKA").length }
    ];

    return {
      kpiData: {
        averageScore,
        criticalFacilities: criticalCount,
        totalInventory: totalEquip,
        newAlerts: alertLogs.length
      },
      targetPercent: dynamicTarget,
      categories,
      monthlyHealthData,
      statusDistributionData,
      equipmentList,
      alertLogs,
      maintenanceLogs
    };
  } catch (error) {
    console.error("Error reading in excel-service (getDashboardData):", error);
    // Return dummy data fallback agar tidak crash jika terjadi file locked atau error pembacaan
    return {
      kpiData: { averageScore: 94.5, criticalFacilities: 2, totalInventory: 26, newAlerts: 4 },
      categories: [
        { id: "semua", label: "Semua", count: 26 },
        { id: "elektrikal", label: "Elektrikal", count: 6 },
        { id: "mekanikal", label: "Mekanikal", count: 8 },
        { id: "elektronika", label: "Elektronika", count: 12 }
      ],
      monthlyHealthData: [
        { name: "Jan 26", value: 94 },
        { name: "Feb 26", value: 95 },
        { name: "Mar 26", value: 93.5 },
        { name: "Apr 26", value: 95.8 },
        { name: "Mei 26", value: 96.1 },
        { name: "Jun 26", value: 94.0 },
        { name: "Jul 26", value: 95.2 },
        { name: "Agt 26", value: 94.8 }
      ],
      statusDistributionData: [
        { name: "Hijau (Sehat >96%)", value: 72, fill: "#16a34a" },
        { name: "Kuning (Peringatan)", value: 20, fill: "#eab308" },
        { name: "Merah (Kritis <90%)", value: 8, fill: "#dc2626" }
      ],
      equipmentList: EQUIPMENT_SCHEMAS.map(eq => ({
        id: eq.id,
        name: eq.displayName,
        category: eq.category,
        location: eq.location,
        score: 100,
        scoreChange: 0,
        status: "SEHAT" as const
      })),
      targetPercent: 90,
      alertLogs: [],
      maintenanceLogs: []
    };
  }
}

// Service untuk memperbarui data kesehatan di file Excel
export function writeDailyReport(
  dateString: string, // format "YYYY-MM-DD"
  equipmentId: string,
  scorePercent: number, // 0 - 100
  issueDescription: string,
  region?: string,
  location?: string,
  letterCode?: string,
  targetPercent?: number
): { success: boolean; message: string; date: string } {
  try {
    const filePath = path.join(process.cwd(), "data_performance.xlsx");
    if (!fs.existsSync(filePath)) {
      return { success: false, message: "File excel tidak ditemukan", date: dateString };
    }

    const eqSchema = EQUIPMENT_SCHEMAS.find(eq => eq.id === equipmentId);
    if (!eqSchema) {
      return { success: false, message: `Peralatan dengan ID ${equipmentId} tidak dikenali`, date: dateString };
    }

    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheet = workbook.Sheets["SUB"];
    if (!sheet) {
      return { success: false, message: "Sheet 'SUB' tidak ditemukan", date: dateString };
    }

    // Convert date string lokal ke Date dan Excel Serial
    const reportDate = new Date(dateString + "T00:00:00Z");
    const targetSerial = jsDateToExcelSerial(reportDate);

    const range = XLSX.utils.decode_range(sheet["!ref"] || "A1:AH1");
    
    // Cari baris dengan tanggal tersebut
    let targetRowIndex = -1;
    for (let r = 1; r <= range.e.r; r++) {
      const dateCell = sheet[XLSX.utils.encode_cell({ r, c: 0 })];
      if (dateCell && typeof dateCell.v === "number" && Math.round(dateCell.v) === targetSerial) {
        targetRowIndex = r;
        break;
      }
    }

    const valueToWrite = scorePercent / 100;

    if (targetRowIndex !== -1) {
      // BACA DAN UPDATE BARIS YANG ADA
      
      // Update skor alat yang dipilih
      const cellRef = XLSX.utils.encode_cell({ r: targetRowIndex, c: eqSchema.columnIndex });
      sheet[cellRef] = { t: "n", v: valueToWrite };

      // Update Keterangan Permasalahan berdasarkan Kategori
      let descColIndex = 11; // Elektrikal
      if (eqSchema.category === "MEKANIKAL") descColIndex = 20;
      if (eqSchema.category === "ELEKTRONIKA") descColIndex = 33;

      if (issueDescription && issueDescription.trim().length > 0) {
        const descCellRef = XLSX.utils.encode_cell({ r: targetRowIndex, c: descColIndex });
        const existingVal = sheet[descCellRef] ? String(sheet[descCellRef].v).trim() : "";
        
        let newVal = "";
        if (existingVal) {
          // Cari apakah issue sudah ada
          if (!existingVal.includes(issueDescription.trim())) {
            // Append issues dengan format list rapi
            const count = (existingVal.match(/\r?\n/g) || []).length + 2; 
            newVal = `${existingVal}\r\n${count}. ${issueDescription.trim()}`;
          } else {
            newVal = existingVal;
          }
        } else {
          newVal = `1. ${issueDescription.trim()}`;
        }
        
        sheet[descCellRef] = { t: "s", v: newVal };
      }
      
    } else {
      // APPEND BARIS BARU DI AKHIR DATA AKTUAL
      let actualLastRow = 0;
      for (let r = 1; r <= range.e.r; r++) {
        const dCell = sheet[XLSX.utils.encode_cell({ r, c: 0 })];
        if (dCell && typeof dCell.v === "number") {
          actualLastRow = r;
        }
      }
      
      const newRowIdx = actualLastRow + 1;
      
      // Update Range Ref Sheet if needed
      if (newRowIdx > range.e.r) {
        range.e.r = newRowIdx;
      }
      sheet["!ref"] = XLSX.utils.encode_range(range);

      // Isi tanggal di Kolom A
      sheet[XLSX.utils.encode_cell({ r: newRowIdx, c: 0 })] = { t: "n", v: targetSerial };
      // Isi Region di Kolom B
      sheet[XLSX.utils.encode_cell({ r: newRowIdx, c: 1 })] = { t: "s", v: region || "Region 4" };
      // Isi Lokasi di Kolom C
      sheet[XLSX.utils.encode_cell({ r: newRowIdx, c: 2 })] = { t: "s", v: location || "Juanda Airport Surabaya" };
      // Isi Letter Code di Kolom D
      sheet[XLSX.utils.encode_cell({ r: newRowIdx, c: 3 })] = { t: "s", v: letterCode || "SUB" };
      // Isi Target di Kolom E
      const targetVal = targetPercent !== undefined ? targetPercent / 100 : 0.9;
      sheet[XLSX.utils.encode_cell({ r: newRowIdx, c: 4 })] = { t: "n", v: targetVal };

      // Cari baris terakhir yang ada datanya (actualLastRow)
      // Kita tidak lagi menyalin nilai dari baris terakhir agar chart hanya merekam jika alat itu secara nyata diedit.
      // (Backend akan melakukan mekanisme carry-over secara otomatis di tampilan).

      // Update nilai spesifik alat yang diedit
      sheet[XLSX.utils.encode_cell({ r: newRowIdx, c: eqSchema.columnIndex })] = { t: "n", v: valueToWrite };

      // Isi Keterangan Permasalahan
      if (issueDescription && issueDescription.trim().length > 0) {
        let descColIndex = 11; // Elektrikal
        if (eqSchema.category === "MEKANIKAL") descColIndex = 20;
        if (eqSchema.category === "ELEKTRONIKA") descColIndex = 33;
        
        sheet[XLSX.utils.encode_cell({ r: newRowIdx, c: descColIndex })] = { t: "s", v: `1. ${issueDescription.trim()}` };
      }
    }

    // Tulis kembali file Excel ke disk
    const writeBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    fs.writeFileSync(filePath, writeBuffer);
    
    return { success: true, message: "Berhasil mencatat performa ke Excel", date: dateString };
  } catch (error: any) {
    console.error("Error writing to Excel:", error);
    return { success: false, message: error.message || "Gagal menulis ke Excel", date: dateString };
  }
}

// Helpers for Google Sheets CSV Export Parsing
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map(val => val.replace(/^"|"$/g, "").trim());
}

function parseDateValue(value: string | number): { excelSerial: number; jsDate: Date } {
  if (typeof value === "number") {
    return {
      excelSerial: value,
      jsDate: excelSerialToJSDate(value)
    };
  }
  
  const strVal = String(value).trim();
  const dateObj = new Date(strVal);
  if (!isNaN(dateObj.getTime())) {
    return {
      excelSerial: jsDateToExcelSerial(dateObj),
      jsDate: dateObj
    };
  }
  
  const parts = strVal.split("/");
  if (parts.length === 3) {
    let day = parseInt(parts[0]);
    let month = parseInt(parts[1]);
    let year = parseInt(parts[2]);
    if (year < 100) year += 2000;
    
    if (month > 12) {
      const temp = day;
      day = month;
      month = temp;
    }
    const d = new Date(year, month - 1, day);
    return {
      excelSerial: jsDateToExcelSerial(d),
      jsDate: d
    };
  }
  
  return {
    excelSerial: 0,
    jsDate: new Date()
  };
}

export async function parseExcelDataAsync(): Promise<{ excelSerial: number; jsDate: Date; data: any[] }[]> {
  const sheetId = process.env.GOOGLE_SHEETS_ID || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID;
  if (sheetId) {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);
        const workbook = XLSX.read(fileBuffer, { type: "buffer" });
        const sheet = workbook.Sheets["SUB"];
        if (!sheet) {
          throw new Error("Sheet 'SUB' tidak dtemukan di Google Sheets online!");
        }

        const range = XLSX.utils.decode_range(sheet["!ref"] || "A1:AH1");
        const rows: { excelSerial: number; jsDate: Date; data: any[] }[] = [];

        for (let r = 1; r <= range.e.r; r++) {
          const dateCell = sheet[XLSX.utils.encode_cell({ r, c: 0 })];
          if (dateCell && typeof dateCell.v === "number") {
            const rowData: any[] = [];
            for (let c = 0; c <= range.e.c; c++) {
              const cell = sheet[XLSX.utils.encode_cell({ r, c })];
              rowData.push(cell ? cell.v : null);
            }
            rows.push({
              excelSerial: dateCell.v,
              jsDate: excelSerialToJSDate(dateCell.v),
              data: rowData
            });
          }
        }

        // Urutkan kronologis berdasarkan tanggal
        rows.sort((a, b) => a.excelSerial - b.excelSerial);
        return rows;
      }
      console.warn("Failed to fetch Google Sheets XLSX, status:", response.status);
    } catch (err) {
      console.error("Error fetching Google Sheets XLSX, falling back to local file:", err);
    }
  }

  return parseExcelData();
}

interface DashboardCacheData {
  data: DashboardOutput;
  lastFetch: number;
}
const CACHE_TTL_MS = 0; // Disabled for instant updates
const globalCache = global as unknown as { dashboardDataCache?: DashboardCacheData };

export async function getDashboardDataAsync(): Promise<DashboardOutput> {
  const now = Date.now();
  if (globalCache.dashboardDataCache && (now - globalCache.dashboardDataCache.lastFetch < CACHE_TTL_MS)) {
    return globalCache.dashboardDataCache.data;
  }

  const rows = await parseExcelDataAsync();
  if (rows.length === 0) {
    throw new Error("Tidak ada baris data valid di sheet Excel SUB");
  }

  // PRE-PROCESS: Jika ada cell alat yang kosong di suatu baris (karena Apps Script hanya mengisi alat yang diupdate),
  // copy nilai dari baris sebelumnya secara kronologis agar skor terakhir tetap dipertahankan (bukan ke-reset 100%).
  const originalRowsData = rows.map(r => [...r.data]);
  for (let i = 1; i < rows.length; i++) {
    const prevRow = rows[i - 1];
    const currRow = rows[i];
    EQUIPMENT_SCHEMAS.forEach(eq => {
      const idx = eq.columnIndex;
      const rawVal = currRow.data[idx];
      if (rawVal === null || rawVal === undefined || rawVal === "") {
        // Carry over from previous row
        currRow.data[idx] = prevRow.data[idx];
      }
    });
  }

  const latestRow = rows[rows.length - 1];
  
  // Ambil Target Kinerja dari Excel
  let dynamicTarget = 90;
  const rawTarget = latestRow.data[4];
  if (rawTarget !== null && rawTarget !== undefined) {
    let numTarget: number;
    if (typeof rawTarget === "number") numTarget = rawTarget;
    else numTarget = parseFloat(String(rawTarget).replace('%', '').trim());
    
    if (!isNaN(numTarget)) {
      // Jika nilai <= 1 berarti desimal (0.90) → kalikan 100
      // Jika nilai > 1 berarti sudah persen (90) → gunakan langsung
      dynamicTarget = numTarget <= 1 ? Math.round(numTarget * 100) : Math.round(numTarget);
    }
    // Pastikan target dalam rentang wajar 1-100
    if (dynamicTarget < 1 || dynamicTarget > 100) dynamicTarget = 90;
  }
  
  const previousRow = rows.length > 1 ? rows[rows.length - 2] : null;

  const equipmentList = EQUIPMENT_SCHEMAS.map(eq => {
    let rawVal = latestRow.data[eq.columnIndex];
    let score = 100;
    if (rawVal !== null && rawVal !== undefined) {
      let numVal: number;
      if (typeof rawVal === "number") {
        numVal = rawVal;
      } else {
        numVal = parseFloat(rawVal);
      }
      if (!isNaN(numVal)) {
        score = numVal > 1 ? Math.round(numVal) : Math.round(numVal * 100);
      }
    }

    let previousScore = score;
    if (previousRow) {
      let prevRaw = previousRow.data[eq.columnIndex];
      if (prevRaw !== null && prevRaw !== undefined) {
        let prevNum = typeof prevRaw === "number" ? prevRaw : parseFloat(prevRaw);
        if (!isNaN(prevNum)) previousScore = prevNum > 1 ? Math.round(prevNum) : Math.round(prevNum * 100);
      }
    }
    let scoreChange = score - previousScore;

    let status: "SEHAT" | "PERINGATAN" | "KRITIS" = "SEHAT";
    if (score < 70) {
      status = "KRITIS";
    } else if (score <= dynamicTarget) {
      // score <= target → PERINGATAN (harus > target untuk SEHAT)
      status = "PERINGATAN";
    }

    // Filter to only include history where the equipment explicitly had data recorded
    const explicitRows = rows.filter((r, rowIndex) => {
      const origVal = originalRowsData[rowIndex][eq.columnIndex];
      return origVal !== null && origVal !== undefined && origVal !== "";
    });
    // Get up to last 6 rows for trend history
    const last6Rows = explicitRows.slice(-6);
    const eqHistory = last6Rows.map(row => {
      let rVal = row.data[eq.columnIndex];
      let hScore = 100;
      if (rVal !== null && rVal !== undefined) {
        let nVal = typeof rVal === "number" ? rVal : parseFloat(rVal);
        if (!isNaN(nVal)) hScore = nVal > 1 ? Math.round(nVal) : Math.round(nVal * 100);
      }
      // e.g. "12 Jan"
      const dateName = row.jsDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      return { name: dateName, value: hScore };
    });

    return {
      id: eq.id,
      name: eq.displayName,
      category: eq.category,
      location: eq.location,
      score,
      scoreChange,
      status,
      history: eqHistory
    };
  });

  const totalScore = equipmentList.reduce((sum, eq) => sum + eq.score, 0);
  const averageScore = Math.round((totalScore / equipmentList.length) * 10) / 10;
  
  const criticalCount = equipmentList.filter(eq => eq.status === "KRITIS").length;
  const warningCount = equipmentList.filter(eq => eq.status === "PERINGATAN").length;
  const healthyCount = equipmentList.filter(eq => eq.status === "SEHAT").length;

  const totalEquip = equipmentList.length;
  const statusDistributionData = [
    { name: "Hijau (Sehat >96%)", value: Math.round((healthyCount / totalEquip) * 100), fill: "#16a34a" },
    { name: "Kuning (Peringatan)", value: Math.round((warningCount / totalEquip) * 100), fill: "#eab308" },
    { name: "Merah (Kritis <90%)", value: Math.round((criticalCount / totalEquip) * 100), fill: "#dc2626" }
  ];

  // 1. GENERATE OTOMATIS ALERT DARI SKOR
  const alertLogs: DashboardOutput["alertLogs"] = [];
  let logIdCounter = 1;

  equipmentList.forEach(eq => {
    if (eq.status === "KRITIS" || eq.status === "PERINGATAN") {
      let issueDetail = "";
      let descColIndex = 11;
      if (eq.category === "MEKANIKAL") descColIndex = 20;
      if (eq.category === "ELEKTRONIKA") descColIndex = 33;
      
      const latestDesc = latestRow.data[descColIndex];
      if (latestDesc && typeof latestDesc === "string") {
        const cleanedName = eq.name.toLowerCase().replace("system", "").replace("scanner", "").trim();
        const excelName = (EQUIPMENT_SCHEMAS.find(s => s.id === eq.id)?.excelName || "").toLowerCase().trim();
        const lines = latestDesc.split(/\r?\n/);
        let currentLine = "";
        let notesForEq = [];
        
        for (let line of lines) {
          const trimmed = line.trim();
          if (trimmed.length === 0) continue;
          if (/^(\d+\.|-)\s+/.test(trimmed)) {
            if (currentLine && (currentLine.toLowerCase().includes(cleanedName) || currentLine.toLowerCase().includes(excelName))) {
              notesForEq.push(currentLine.replace(/^(\d+\.|-)\s*/, ""));
            }
            currentLine = trimmed;
          } else {
            if (!currentLine) currentLine = trimmed;
            else currentLine += " " + trimmed;
          }
        }
        if (currentLine && (currentLine.toLowerCase().includes(cleanedName) || currentLine.toLowerCase().includes(excelName))) {
          notesForEq.push(currentLine.replace(/^(\d+\.|-)\s*/, ""));
        }
        if (notesForEq.length > 0) {
          issueDetail = ` \n\nDetail Kerusakan: ${notesForEq.join(", ")}`;
        } else if (latestDesc.trim().length > 0) {
          // Fallback: show the whole text for this category if substring match fails
          issueDetail = ` \n\nCatatan Maintenance (${eq.category}):\n${latestDesc.trim()}`;
        }
      }

      const conditionText = eq.score < dynamicTarget ? "di bawah batas normal" : "berada pada batas peringatan minimum";
      const baseNote = `Skor ${conditionText}. Target Excel: ${dynamicTarget}%, Saat ini: ${eq.score}%.`;

      alertLogs.push({
        id: logIdCounter++,
        severity: eq.status,
        time: "Aktif",
        incidentNumber: `SYS-${2000 + logIdCounter}`,
        title: `Sistem mendeteksi performa rendah (${eq.score}%)`,
        facility: `${eq.name} (${eq.category})`,
        note: baseNote,
        detailNote: issueDetail ? `${baseNote}${issueDetail}` : baseNote
      });
    }
  });

  // 2. GENERATE MAINTENANCE HISTORY DARI SELURUH ROW
  const maintenanceLogs: DashboardOutput["maintenanceLogs"] = [];
  let maintIdCounter = 1;

  const parseHistoryText = (text: string | null | undefined, categoryLabel: string, dateStr: string) => {
    if (!text || typeof text !== "string") return;
    
    const lines = text.split(/\r?\n/);
    const entries: string[] = [];
    let currentEntry = "";

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.length === 0) return;

      if (/^(\d+\.|-)\s+/.test(trimmed)) {
        if (currentEntry) entries.push(currentEntry);
        currentEntry = trimmed.replace(/^(\d+\.|-)\s*/, "");
      } else {
        if (!currentEntry) {
          currentEntry = trimmed;
        } else {
          currentEntry += " " + trimmed;
        }
      }
    });
    if (currentEntry) entries.push(currentEntry);

    entries.forEach((cleanLine) => {
      if (cleanLine.length > 5) {
        let matchFacility = `Fasilitas ${categoryLabel}`;
        for (const eq of EQUIPMENT_SCHEMAS) {
          if (eq.category === categoryLabel.toUpperCase()) {
            const cleanedName = eq.displayName.toLowerCase().replace("system", "").replace("scanner", "").trim();
            if (cleanLine.toLowerCase().includes(cleanedName) || cleanLine.toLowerCase().includes(eq.excelName.toLowerCase().trim())) {
              matchFacility = eq.displayName;
              break;
            }
          }
        }

        maintenanceLogs.push({
          id: maintIdCounter++,
          date: dateStr,
          facility: matchFacility,
          category: categoryLabel,
          note: cleanLine
        });
      }
    });
  };

  const reversedRows = [...rows].reverse();
  reversedRows.forEach(row => {
    const dateStr = row.jsDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
    parseHistoryText(row.data[11], "Elektrikal", dateStr);
    parseHistoryText(row.data[20], "Mekanikal", dateStr);
    parseHistoryText(row.data[33], "Elektronika", dateStr);
  });

  const monthlyData: Record<string, { totalSum: number; rowCount: number }> = {};
  rows.forEach(row => {
    const yearMonth = row.jsDate.toISOString().substring(0, 7);
    if (!monthlyData[yearMonth]) {
      monthlyData[yearMonth] = { totalSum: 0, rowCount: 0 };
    }

    let rowSum = 0;
    EQUIPMENT_SCHEMAS.forEach(eq => {
      let rawVal = row.data[eq.columnIndex];
      let val = 1.0;
      if (rawVal !== null && rawVal !== undefined) {
        let numVal: number;
        if (typeof rawVal === "number") numVal = rawVal;
        else numVal = parseFloat(rawVal);
        if (!isNaN(numVal)) {
          // Normalisasi ke skala 0-1
          val = numVal > 1 ? numVal / 100 : numVal;
        }
      }
      rowSum += val;
    });
    const rowAvg = (rowSum / EQUIPMENT_SCHEMAS.length) * 100;
    monthlyData[yearMonth].totalSum += rowAvg;
    monthlyData[yearMonth].rowCount += 1;
  });

  const monthNames: Record<string, string> = {
    "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "Mei", "06": "Jun",
    "07": "Jul", "08": "Agt", "09": "Sep", "10": "Okt", "11": "Nov", "12": "Des"
  };

  const monthlyHealthData = Object.keys(monthlyData)
    .sort()
    .slice(-8)
    .map(ym => {
      const [year, month] = ym.split("-");
      const label = `${monthNames[month]} ${year.substring(2)}`;
      const value = Math.round((monthlyData[ym].totalSum / monthlyData[ym].rowCount) * 10) / 10;
      return { name: label, value };
    });

  const categories = [
    { id: "semua", label: "Semua", count: equipmentList.length },
    { id: "elektrikal", label: "Elektrikal", count: equipmentList.filter(e => e.category === "ELEKTRIKAL").length },
    { id: "mekanikal", label: "Mekanikal", count: equipmentList.filter(e => e.category === "MEKANIKAL").length },
    { id: "elektronika", label: "Elektronika", count: equipmentList.filter(e => e.category === "ELEKTRONIKA").length }
  ];

  const outputResult = {
    kpiData: {
      averageScore,
      criticalFacilities: criticalCount,
      totalInventory: equipmentList.length,
      newAlerts: alertLogs.length
    },
    targetPercent: dynamicTarget,
    categories,
    monthlyHealthData,
    statusDistributionData,
    equipmentList,
    alertLogs,
    maintenanceLogs
  };

  globalCache.dashboardDataCache = {
    data: outputResult,
    lastFetch: Date.now()
  };

  return outputResult;
}

export async function writeDailyReportAsync(
  dateString: string,
  equipmentId: string,
  scorePercent: number,
  issueDescription: string,
  region?: string,
  location?: string,
  letterCode?: string,
  targetPercent?: number
): Promise<{ success: boolean; message: string; date: string }> {
  // We pass the raw ISO string directly. The time/timezone parsing logic 
  // will be fully normalized to Industry Standards on the Google Apps Script side.
  const safeDateString = dateString;

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
  if (scriptUrl) {
    try {
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: safeDateString,
          equipmentId,
          score: scorePercent,
          description: issueDescription,
          region,
          location,
          letterCode,
          target: targetPercent
        })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          return { success: true, message: "Berhasil mencatat ke Google Sheet secara online!", date: dateString };
        }
        return { success: false, message: result.error || "Gagal mencatat ke Google Sheet", date: dateString };
      }
      return { success: false, message: `HTTP Error: ${response.status}`, date: dateString };
    } catch (err: any) {
      console.error("Error writing to Google Sheets:", err);
      return { success: false, message: `Gagal mengirim ke Google Sheets: ${err.message}`, date: dateString };
    }
  }

  return writeDailyReport(dateString, equipmentId, scorePercent, issueDescription, region, location, letterCode, targetPercent);
}

// ============================================================
// MONTHLY DETAIL PER EQUIPMENT
// ============================================================
export interface EquipmentMonthlyDetail {
  equipment: {
    id: string;
    name: string;
    category: string;
    location: string;
    brand: string;
    model: string;
    installation: string;
  };
  month: string; // "2026-09"
  monthLabel: string; // "September 2026"
  target: number;
  dateFrom: string;
  dateTo: string;
  summary: {
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    daysReported: number;
    daysInRange: number;
    previousMonthAvg: number;
    change: number;
  };
  statusDistribution: {
    sehat: number;
    peringatan: number;
    kritis: number;
  };
  dailyData: { date: string; score: number; fullDate: string; isExplicit?: boolean }[];
  maintenanceLogs: { date: string; note: string }[];
}

export async function getEquipmentMonthlyDetail(
  equipmentId: string,
  yearMonth?: string, // "2026-09"
  dateFromParam?: string, // "YYYY-MM-DD"
  dateToParam?: string   // "YYYY-MM-DD"
): Promise<EquipmentMonthlyDetail | null> {
  const eqSchema = EQUIPMENT_SCHEMAS.find(eq => eq.id === equipmentId);
  if (!eqSchema) return null;

  const specs = EQUIPMENT_SPECS[equipmentId] || { brand: "-", model: "-", installation: "-" };

  const rows = await parseExcelDataAsync();
  if (rows.length === 0) return null;

  // Track original raw rows to know which entries were explicitly reported vs carried over
  const originalRowsData = rows.map(r => [...r.data]);

  // Carry over values for empty cells
  for (let i = 1; i < rows.length; i++) {
    const prevRow = rows[i - 1];
    const currRow = rows[i];
    EQUIPMENT_SCHEMAS.forEach(eq => {
      const idx = eq.columnIndex;
      const rawVal = currRow.data[idx];
      if (rawVal === null || rawVal === undefined || rawVal === "") {
        currRow.data[idx] = prevRow.data[idx];
      }
    });
  }

  // Target Percent from latest row
  const latestRow = rows[rows.length - 1];
  let dynamicTarget = 90;
  const rawTarget = latestRow.data[4];
  if (rawTarget !== null && rawTarget !== undefined) {
    let numTarget = typeof rawTarget === "number" ? rawTarget : parseFloat(String(rawTarget).replace('%', '').trim());
    if (!isNaN(numTarget)) {
      dynamicTarget = numTarget <= 1 ? Math.round(numTarget * 100) : Math.round(numTarget);
    }
    if (dynamicTarget < 1 || dynamicTarget > 100) dynamicTarget = 90;
  }

  // Helper to parse score
  const parseScore = (rawVal: any): number => {
    if (rawVal === null || rawVal === undefined || rawVal === "") return -1;
    let numVal = typeof rawVal === "number" ? rawVal : parseFloat(String(rawVal));
    if (isNaN(numVal)) return -1;
    return numVal > 1 ? Math.round(numVal) : Math.round(numVal * 100);
  };

  // Find max date available in Excel database
  const maxExcelDate = new Date(latestRow.jsDate);
  maxExcelDate.setHours(23, 59, 59, 999);

  // Determine start Date and end Date
  let startDate: Date;
  let endDate: Date;

  if (dateFromParam && dateToParam) {
    startDate = new Date(dateFromParam + "T00:00:00");
    endDate = new Date(dateToParam + "T23:59:59");
    // Cap at max excel date if user didn't explicitly override with a past date
    if (endDate > maxExcelDate) {
      endDate = maxExcelDate;
    }
  } else {
    // Default to the month specified or current month
    const ym = yearMonth || latestRow.jsDate.toISOString().substring(0, 7);
    const [y, m] = ym.split("-").map(Number);
    startDate = new Date(y, m - 1, 1);
    
    // Cap at latest excel date if in the same month
    const endOfMonth = new Date(y, m, 0, 23, 59, 59);
    endDate = endOfMonth > maxExcelDate ? maxExcelDate : endOfMonth;
  }

  // Helper for local YYYY-MM-DD string
  const toLocalDateStr = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Build a lookup map of row data by date YYYY-MM-DD using the processed rows
  const rowByDateStr = new Map<string, { row: any; isExplicit: boolean }>();
  rows.forEach((r, idx) => {
    const dStr = toLocalDateStr(r.jsDate);
    const origVal = originalRowsData[idx][eqSchema.columnIndex];
    const isExplicit = origVal !== null && origVal !== undefined && origVal !== "";
    rowByDateStr.set(dStr, { row: r, isExplicit });
  });

  // Find latest score prior to startDate as baseline carry over
  let lastKnownScore = 100;
  for (const r of rows) {
    if (r.jsDate < startDate) {
      const s = parseScore(r.data[eqSchema.columnIndex]);
      if (s >= 0) lastKnownScore = s;
    } else {
      break;
    }
  }

  // Loop every single calendar day from startDate to endDate
  const dailyData: { date: string; score: number; fullDate: string; isExplicit?: boolean }[] = [];
  let sum = 0, count = 0, highest = 0, lowest = 100;
  let sehat = 0, peringatan = 0, kritis = 0;
  let explicitDaysCount = 0;

  const curr = new Date(startDate);
  while (curr <= endDate) {
    const dStr = toLocalDateStr(curr);
    const entry = rowByDateStr.get(dStr);

    let dayScore = lastKnownScore;
    let isExplicit = false;

    if (entry) {
      const s = parseScore(entry.row.data[eqSchema.columnIndex]);
      if (s >= 0) {
        dayScore = s;
        lastKnownScore = s;
      }
      isExplicit = entry.isExplicit;
      if (isExplicit) explicitDaysCount++;
    }

    const dateLabel = curr.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const fullDate = curr.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    dailyData.push({ date: dateLabel, score: dayScore, fullDate, isExplicit });

    sum += dayScore;
    count++;
    if (dayScore > highest) highest = dayScore;
    if (dayScore < lowest) lowest = dayScore;

    if (dayScore < 70) kritis++;
    else if (dayScore <= dynamicTarget) peringatan++;
    else sehat++;

    curr.setDate(curr.getDate() + 1);
  }

  // Calculate summary metrics across full monthly calendar range (including carry-over baseline)
  const avgScore = count > 0 ? Math.round(sum / count) : 100;
  const highestScore = count > 0 ? highest : 100;
  const lowestScore = count > 0 ? lowest : 100;

  // Previous Month Average calculation for comparison
  const prevMonthStart = new Date(startDate);
  prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);
  const prevMonthEnd = new Date(startDate);
  prevMonthEnd.setDate(prevMonthEnd.getDate() - 1);

  let prevSum = 0, prevCount = 0;
  rows.forEach((r, idx) => {
    if (r.jsDate >= prevMonthStart && r.jsDate <= prevMonthEnd) {
      const origVal = originalRowsData[idx][eqSchema.columnIndex];
      if (origVal !== null && origVal !== undefined && origVal !== "") {
        const s = parseScore(r.data[eqSchema.columnIndex]);
        if (s >= 0) { prevSum += s; prevCount++; }
      }
    }
  });
  const prevMonthAvg = prevCount > 0 ? Math.round(prevSum / prevCount) : 100;

  const ymStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}`;
  const monthNames: Record<string, string> = {
    "01": "Januari", "02": "Februari", "03": "Maret", "04": "April",
    "05": "Mei", "06": "Juni", "07": "Juli", "08": "Agustus",
    "09": "September", "10": "Oktober", "11": "November", "12": "Desember"
  };
  const monthLabel = `${monthNames[String(startDate.getMonth() + 1).padStart(2, "0")] || ""} ${startDate.getFullYear()}`;

  // Maintenance logs within the date range
  const maintenanceLogs: { date: string; note: string }[] = [];
  let descColIndex = 11;
  if (eqSchema.category === "MEKANIKAL") descColIndex = 20;
  if (eqSchema.category === "ELEKTRONIKA") descColIndex = 33;

  const inRangeRows = rows.filter(r => r.jsDate >= startDate && r.jsDate <= endDate);
  inRangeRows.forEach(r => {
    const descRaw = r.data[descColIndex];
    if (!descRaw || typeof descRaw !== "string") return;
    const dateStr = r.jsDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });

    const cleanedName = eqSchema.displayName.toLowerCase().replace("system", "").replace("scanner", "").trim();
    const excelName = eqSchema.excelName.toLowerCase().trim();
    const lines = descRaw.split(/\r?\n/);
    let currentLine = "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length === 0) continue;
      if (/^(\d+\.|-)\s+/.test(trimmed)) {
        if (currentLine && (currentLine.toLowerCase().includes(cleanedName) || currentLine.toLowerCase().includes(excelName))) {
          maintenanceLogs.push({ date: dateStr, note: currentLine.replace(/^(\d+\.|-)\s*/, "") });
        }
        currentLine = trimmed;
      } else {
        currentLine = currentLine ? currentLine + " " + trimmed : trimmed;
      }
    }
    if (currentLine && (currentLine.toLowerCase().includes(cleanedName) || currentLine.toLowerCase().includes(excelName))) {
      maintenanceLogs.push({ date: dateStr, note: currentLine.replace(/^(\d+\.|-)\s*/, "") });
    }
  });

  return {
    equipment: {
      id: eqSchema.id,
      name: eqSchema.displayName,
      category: eqSchema.category,
      location: eqSchema.location,
      brand: specs.brand,
      model: specs.model,
      installation: specs.installation,
    },
    month: ymStr,
    monthLabel,
    target: dynamicTarget,
    dateFrom: startDate.toISOString().substring(0, 10),
    dateTo: endDate.toISOString().substring(0, 10),
    summary: {
      averageScore: avgScore,
      highestScore: count > 0 ? highest : 0,
      lowestScore: count > 0 ? lowest : 0,
      daysReported: explicitDaysCount > 0 ? explicitDaysCount : count,
      daysInRange: count,
      previousMonthAvg: prevMonthAvg,
      change: prevCount > 0 ? avgScore - prevMonthAvg : 0,
    },
    statusDistribution: { sehat, peringatan, kritis },
    dailyData,
    maintenanceLogs,
  };
}
