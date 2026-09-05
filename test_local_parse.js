const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const EQUIPMENT_SCHEMAS = [
  { id: "ELK-01", columnIndex: 5 },
  { id: "ELK-02", columnIndex: 6 },
  { id: "ELK-03", columnIndex: 7 },
  { id: "ELK-04", columnIndex: 8 },
  { id: "ELK-05", columnIndex: 9 },
  { id: "ELK-06", columnIndex: 10 },
  { id: "MEK-01", columnIndex: 12 },
  { id: "MEK-02", columnIndex: 13 },
  { id: "MEK-03", columnIndex: 14 },
  { id: "MEK-04", columnIndex: 15 },
  { id: "MEK-05", columnIndex: 16 },
  { id: "MEK-06", columnIndex: 17 },
  { id: "MEK-07", columnIndex: 18 },
  { id: "MEK-08", columnIndex: 19 },
  { id: "ELT-01", columnIndex: 21 },
  { id: "ELT-02", columnIndex: 22 },
  { id: "ELT-03", columnIndex: 23 },
  { id: "ELT-04", columnIndex: 24 },
  { id: "ELT-05", columnIndex: 25 },
  { id: "ELT-06", columnIndex: 26 },
  { id: "ELT-07", columnIndex: 27 },
  { id: "ELT-08", columnIndex: 28 },
  { id: "ELT-09", columnIndex: 29 },
  { id: "ELT-10", columnIndex: 30 },
  { id: "ELT-11", columnIndex: 31 },
  { id: "ELT-12", columnIndex: 32 }
];

function parseExcelData() {
  const filePath = path.join(__dirname, "data_performance.xlsx");
  if (!fs.existsSync(filePath)) {
    throw new Error("File not found");
  }
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheet = workbook.Sheets["SUB"];
  const range = XLSX.utils.decode_range(sheet["!ref"] || "A1:AH1");
  const rows = [];
  for (let r = 1; r <= range.e.r; r++) {
    const dateCell = sheet[XLSX.utils.encode_cell({ r, c: 0 })];
    if (dateCell && typeof dateCell.v === "number") {
      const rowData = [];
      for (let c = 0; c <= range.e.c; c++) {
        rowData.push(sheet[XLSX.utils.encode_cell({ r, c })]?.v || null);
      }
      rows.push({
        excelSerial: dateCell.v,
        data: rowData
      });
    }
  }
  return rows;
}

try {
  const rows = parseExcelData();
  console.log('Total rows read:', rows.length);
  if (rows.length > 0) {
    const latestRow = rows[rows.length - 1];
    console.log('Latest row date serial:', latestRow.excelSerial);
    console.log('Latest row values length:', latestRow.data.length);
    EQUIPMENT_SCHEMAS.forEach(eq => {
      console.log(`${eq.id}: col index ${eq.columnIndex} value = ${latestRow.data[eq.columnIndex]}`);
    });
  }
} catch (err) {
  console.error("Local parsing error:", err);
}
