const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(process.cwd(), 'data_performance.xlsx');
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['SUB'];

for (let r = 0; r < 5; r++) {
  console.log(`-- Row ${r} --`);
  for (let c = 0; c < 15; c++) {
    const cell = sheet[XLSX.utils.encode_cell({ r, c })];
    const valString = cell ? String(cell.v).substring(0, 50) : '(empty)';
    console.log(`  Col ${c}: ${valString}`);
  }
}
