const XLSX = require('xlsx');
const path = require('path');

const EQUIPMENT_SCHEMAS = [
  // Elektrikal (Col index 5 s/d 10)
  { id: "ELK-01", excelName: "GENERATOR SET", displayName: "Generator Set", category: "ELEKTRIKAL", location: "Terminal 1", columnIndex: 5 },
  { id: "ELK-02", excelName: "PANEL TEGANGAN MENENGAH", displayName: "Panel Tegangan Menengah", category: "ELEKTRIKAL", location: "Gardu Hubung", columnIndex: 6 },
  { id: "ELK-03", excelName: "PANEL TEGANGAN RENDAH", displayName: "Panel Tegangan Rendah", category: "ELEKTRIKAL", location: "Power House", columnIndex: 7 },
  { id: "ELK-04", excelName: "TRANSFORMATOR", displayName: "Transformator", category: "ELEKTRIKAL", location: "Main Power House", columnIndex: 8 },
  { id: "ELK-05", excelName: "UNINTERRUPTIBLE POWER SUPPLY (UPS)", displayName: "UPS", category: "ELEKTRIKAL", location: "T1B & T1A", columnIndex: 9 },
  { id: "ELK-06", excelName: "AERONAUTICAL GROUND LIGHTING", displayName: "Aeronautical Ground Lighting", category: "ELEKTRIKAL", location: "Runway & Taxiway", columnIndex: 10 },

  // Mekanikal (Col index 12 s/d 19)
  { id: "MEK-01", excelName: " SISTEM HVAC", displayName: "Sistem HVAC", category: "MEKANIKAL", location: "Terminal 2 & T1B", columnIndex: 12 },
  { id: "MEK-02", excelName: "WATER SUPPLY SYSTEM. STP DAN SISTEM PEMADAM", displayName: "Water Supply & STP", category: "MEKANIKAL", location: "STP Area", columnIndex: 13 },
  { id: "MEK-03", excelName: "BAGGAGE HANDLING SYSTEM (BHS)", displayName: "Baggage Handling System", category: "MEKANIKAL", location: "Baggage Claim", columnIndex: 14 },
  { id: "MEK-04", excelName: "PASENGGER MOVING SYSTEM (PMS)", displayName: "Passenger Moving System", category: "MEKANIKAL", location: "Terminal 1 & 2", columnIndex: 15 },
  { id: "MEK-05", excelName: "GARBARATA", displayName: "Garbarata", category: "MEKANIKAL", location: "Gate 1 - 12", columnIndex: 16 },
  { id: "MEK-06", excelName: "PKP-PK", displayName: "PKP-PK", category: "MEKANIKAL", location: "Fire Station", columnIndex: 17 },
  { id: "MEK-07", excelName: "A2B & KENDARAAN OPERASIONAL", displayName: "A2B & Kendaraan Operasional", category: "MEKANIKAL", location: "Appron & Landside", columnIndex: 18 },
  { id: "MEK-08", excelName: "GROUND SUPPORT SERVICE", displayName: "Ground Support Service", category: "MEKANIKAL", location: "Apron Area", columnIndex: 19 },

  // Elektronika (Col index 21 s/d 32)
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

function excelSerialToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  return new Date(utc_value * 1000);
}

try {
  const filePath = path.join(__dirname, 'data_performance.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets['SUB'];
  const range = XLSX.utils.decode_range(sheet['!ref']);
  
  // Baca semua baris
  const rows = [];
  for (let r = 1; r <= range.e.r; r++) {
    const dateCell = sheet[XLSX.utils.encode_cell({ r, c: 0 })];
    if (dateCell && typeof dateCell.v === 'number') {
      const rowData = [];
      for (let c = 0; c <= range.e.c; c++) {
        const cell = sheet[XLSX.utils.encode_cell({ r, c })];
        rowData.push(cell ? cell.v : null);
      }
      rows.push({
        rowNumber: r + 1,
        excelSerial: dateCell.v,
        jsDate: excelSerialToJSDate(dateCell.v),
        data: rowData
      });
    }
  }
  
  // Urutkan berdasarkan tanggal menaik (terkecil ke terbesar)
  rows.sort((a, b) => a.excelSerial - b.excelSerial);
  
  console.log(`Berhasil memuat ${rows.length} records data terurut.`);
  
  const latestRow = rows[rows.length - 1];
  console.log('\nData Terbaru:', latestRow.jsDate.toISOString().split('T')[0]);
  
  // Hitung Skor Tiap Alat pada data terbaru
  const parsedEquipment = EQUIPMENT_SCHEMAS.map(eq => {
    let rawVal = latestRow.data[eq.columnIndex];
    let score = 100;
    if (rawVal !== null && rawVal !== undefined) {
      if (typeof rawVal === 'number') {
        score = Math.round(rawVal * 100);
      } else {
        const parsed = parseFloat(rawVal);
        if (!isNaN(parsed)) score = Math.round(parsed * 100);
      }
    }
    
    let status = "SEHAT";
    if (score < 90) status = "KRITIS";
    else if (score < 96) status = "PERINGATAN";
    
    return {
      ...eq,
      score,
      status,
      rawVal
    };
  });
  
  // Hitung KPI
  const totalScore = parsedEquipment.reduce((sum, eq) => sum + eq.score, 0);
  const averageScore = Math.round((totalScore / parsedEquipment.length) * 10) / 10;
  const criticalCount = parsedEquipment.filter(eq => eq.status === "KRITIS").length;
  const warningCount = parsedEquipment.filter(eq => eq.status === "PERINGATAN").length;
  const healthyCount = parsedEquipment.filter(eq => eq.status === "SEHAT").length;
  
  console.log('--- KPI Terhitung ---');
  console.log('Rata-rata Skor:', averageScore + '%');
  console.log('Sehat:', healthyCount, 'Peringatan:', warningCount, 'Kritis:', criticalCount);
  
  // Ekstrak Keterangan Permasalahan
  console.log('\n--- Keterangan Masalah ---');
  const txtElektrikal = latestRow.data[11];
  const txtMekanikal = latestRow.data[20];
  const txtElektronika = latestRow.data[33];
  
  console.log('Elektrikal:', txtElektrikal ? txtElektrikal.substring(0, 100) + '...' : 'Tidak ada');
  console.log('Mekanikal:', txtMekanikal ? txtMekanikal.substring(0, 100) + '...' : 'Tidak ada');
  console.log('Elektronika:', txtElektronika ? txtElektronika.substring(0, 100) + '...' : 'Tidak ada');
  
  // Bulanan Trend
  console.log('\n--- Trend Bulanan ---');
  const monthlyData = {};
  rows.forEach(row => {
    const yearMonth = row.jsDate.toISOString().substring(0, 7); // e.g. "2026-08"
    if (!monthlyData[yearMonth]) {
      monthlyData[yearMonth] = { total: 0, count: 0 };
    }
    
    // Hitung rata-rata untuk baris ini
    let rowSum = 0;
    EQUIPMENT_SCHEMAS.forEach(eq => {
      let rawVal = row.data[eq.columnIndex];
      let val = 1.0;
      if (rawVal !== null && rawVal !== undefined) {
        if (typeof rawVal === 'number') val = rawVal;
        else {
          const parsed = parseFloat(rawVal);
          if (!isNaN(parsed)) val = parsed;
        }
      }
      rowSum += val;
    });
    const rowAvg = (rowSum / EQUIPMENT_SCHEMAS.length) * 100;
    monthlyData[yearMonth].total += rowAvg;
    monthlyData[yearMonth].count += 1;
  });
  
  const monthLabels = {
    '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'Mei', '06': 'Jun',
    '07': 'Jul', '08': 'Agt', '09': 'Sep', '10': 'Okt', '11': 'Nov', '12': 'Des'
  };
  
  const monthlyTrends = Object.keys(monthlyData).sort().map(ym => {
    const [year, month] = ym.split('-');
    const label = `${monthLabels[month]} ${year.substring(2)}`;
    const avg = Math.round((monthlyData[ym].total / monthlyData[ym].count) * 10) / 10;
    return { name: label, value: avg };
  });
  
  console.log(monthlyTrends);
  
} catch (error) {
  console.error("Error running test parser:", error);
}
