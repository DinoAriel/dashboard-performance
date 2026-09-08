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
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  return new Date(utc_value * 1000);
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
  equipmentList: {
    id: string;
    name: string;
    category: string;
    location: string;
    score: number;
    status: "SEHAT" | "PERINGATAN" | "KRITIS";
  }[];
  alertLogs: {
    id: number;
    severity: "KRITIS" | "PERINGATAN" | "INFO";
    time: string;
    incidentNumber: string;
    title: string;
    facility: string;
    note: string;
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

    const latestRow = rows[rows.length - 1];
    
    // Ambil Target Kinerja dari Excel (Kolom E / index 4)
    let dynamicTarget = 90; // fallback default
    const rawTarget = latestRow.data[4];
    if (rawTarget !== null && rawTarget !== undefined) {
      if (typeof rawTarget === "number") dynamicTarget = Math.round(rawTarget * 100);
      else {
         const p = parseFloat(rawTarget);
         if (!isNaN(p)) dynamicTarget = Math.round(p * 100);
      }
      if (dynamicTarget < 1) dynamicTarget = dynamicTarget * 100; // antisipasi jika bernilai 0.90 dsb
    }
    if (dynamicTarget <= 1) dynamicTarget = 90; // Fallback jika parsing salah

    // Parse Equipment & Skor saat ini
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
          // Jika nilai > 1, user memasukkan langsung sebagai persen (misal: 40, 60, 90)
          // Jika nilai <= 1, nilai dalam bentuk desimal (misal: 0.40, 0.60, 0.90)
          score = numVal > 1 ? Math.round(numVal) : Math.round(numVal * 100);
        }
      }

      let status: "SEHAT" | "PERINGATAN" | "KRITIS" = "SEHAT";
      if (score < 70) {
        status = "KRITIS";
      } else if (score < dynamicTarget) {
        status = "PERINGATAN";
      }

      return {
        id: eq.id,
        name: eq.displayName,
        category: eq.category,
        location: eq.location,
        score,
        status
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
        alertLogs.push({
          id: logIdCounter++,
          severity: eq.status,
          time: "Aktif",
          incidentNumber: `SYS-${2000 + logIdCounter}`,
          title: `Sistem mendeteksi performa rendah (${eq.score}%)`,
          facility: `${eq.name} (${eq.category})`,
          note: `Skor di bawah batas normal. Target Excel: ${dynamicTarget}%, Saat ini: ${eq.score}%.`
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
        score: 100, // Dummy score
        status: "SEHAT" as const
      })),
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
      // APPEND BARIS BARU DI AKHIR SHEET
      const newRowIdx = range.e.r + 1;
      
      // Update Range Ref Sheet
      range.e.r = newRowIdx;
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

      // Isi default 100% (1) untuk semua peralatan
      EQUIPMENT_SCHEMAS.forEach(eq => {
        sheet[XLSX.utils.encode_cell({ r: newRowIdx, c: eq.columnIndex })] = { t: "n", v: 1.0 };
      });

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

export async function getDashboardDataAsync(): Promise<DashboardOutput> {
  const rows = await parseExcelDataAsync();
  if (rows.length === 0) {
    throw new Error("Tidak ada baris data valid di sheet Excel SUB");
  }

  const latestRow = rows[rows.length - 1];
  
  // Ambil Target Kinerja dari Excel
  let dynamicTarget = 90;
  const rawTarget = latestRow.data[4];
  if (rawTarget !== null && rawTarget !== undefined) {
    if (typeof rawTarget === "number") dynamicTarget = Math.round(rawTarget * 100);
    else {
       const p = parseFloat(rawTarget);
       if (!isNaN(p)) dynamicTarget = Math.round(p * 100);
    }
    if (dynamicTarget < 1) dynamicTarget = dynamicTarget * 100;
  }
  if (dynamicTarget <= 1) dynamicTarget = 90;
  
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
        // Jika nilai > 1, user memasukkan langsung sebagai persen (misal: 40, 60, 90)
        // Jika nilai <= 1, nilai dalam bentuk desimal (misal: 0.40, 0.60, 0.90)
        score = numVal > 1 ? Math.round(numVal) : Math.round(numVal * 100);
      }
    }

    let status: "SEHAT" | "PERINGATAN" | "KRITIS" = "SEHAT";
    if (score < 70) {
      status = "KRITIS";
    } else if (score < dynamicTarget) {
      status = "PERINGATAN";
    }

    return {
      id: eq.id,
      name: eq.displayName,
      category: eq.category,
      location: eq.location,
      score,
      status
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
      alertLogs.push({
        id: logIdCounter++,
        severity: eq.status,
        time: "Aktif",
        incidentNumber: `SYS-${2000 + logIdCounter}`,
        title: `Sistem mendeteksi performa rendah (${eq.score}%)`,
        facility: `${eq.name} (${eq.category})`,
        note: `Skor di bawah batas normal. Target Excel: ${dynamicTarget}%, Saat ini: ${eq.score}%.`
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

  return {
    kpiData: {
      averageScore,
      criticalFacilities: criticalCount,
      totalInventory: equipmentList.length,
      newAlerts: alertLogs.length
    },
    categories,
    monthlyHealthData,
    statusDistributionData,
    equipmentList,
    alertLogs,
    maintenanceLogs
  };
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
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
  if (scriptUrl) {
    try {
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateString,
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
