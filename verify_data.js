const XLSX = require("xlsx");
const path = require("path");

const filePath = path.join(__dirname, "data_performance.xlsx");
const wb = XLSX.read(require("fs").readFileSync(filePath), { type: "buffer" });
const sheet = wb.Sheets["SUB"];
const range = XLSX.utils.decode_range(sheet["!ref"]);

console.log("=== HEADER ROW (Baris 0) ===");
for (let c = 0; c <= Math.min(range.e.c, 35); c++) {
  const cell = sheet[XLSX.utils.encode_cell({ r: 0, c })];
  console.log(`  Kolom ${c}: ${cell ? cell.v : "(KOSONG)"}`);
}

// Ambil 3 baris terakhir
const totalRows = range.e.r;
console.log(`\nTotal baris data: ${totalRows}`);
console.log("\n=== 3 BARIS TERAKHIR ===");
for (let r = Math.max(1, totalRows - 2); r <= totalRows; r++) {
  const dateCell = sheet[XLSX.utils.encode_cell({ r, c: 0 })];
  if (!dateCell) continue;
  
  let dateStr = dateCell.v;
  if (typeof dateCell.v === "number") {
    const utcDays = Math.floor(dateCell.v - 25569);
    const d = new Date(utcDays * 86400 * 1000);
    dateStr = d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  }
  
  console.log(`\n--- Baris ${r} | Tanggal: ${dateStr} ---`);
  
  // Kolom penting
  const important = [
    { c: 4, label: "Target (Kol E)" },
    { c: 5, label: "GenSet (Kol F)" },
    { c: 9, label: "UPS (Kol J)" },
    { c: 11, label: "Ket. Elektrikal (Kol L)" },
    { c: 16, label: "Garbarata (Kol Q)" },
    { c: 20, label: "Ket. Mekanikal (Kol U)" },
    { c: 25, label: "CCTV (Kol Z)" },
    { c: 33, label: "Ket. Elektronika (Kol AH)" },
  ];
  
  for (const col of important) {
    const cell = sheet[XLSX.utils.encode_cell({ r, c: col.c })];
    let val = cell ? cell.v : "(KOSONG)";
    if (typeof val === "string" && val.length > 80) val = val.substring(0, 80) + "...";
    if (typeof val === "number" && val < 2) val = `${val} (= ${Math.round(val * 100)}%)`;
    console.log(`  ${col.label}: ${val}`);
  }
}
