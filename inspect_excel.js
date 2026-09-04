const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(process.cwd(), 'data_performance.xlsx');
const workbook = XLSX.readFile(filePath);
console.log('Sheet Names:', workbook.SheetNames);

for (const name of workbook.SheetNames) {
  const sheet = workbook.Sheets[name];
  const range = XLSX.utils.decode_range(sheet['!ref']);
  console.log(`\nSheet: ${name}, Rows: ${range.e.r + 1}, Cols: ${range.e.c + 1}`);
  
  // Print row 0 (headers)
  const headers = [];
  for (let c = 0; c <= Math.min(range.e.c, 35); c++) {
    const cell = sheet[XLSX.utils.encode_cell({ r: 0, c })];
    headers.push(cell ? cell.v : '');
  }
  console.log('Row 0 Headers:', headers.slice(0, 15));
  
  // Print row 1
  const row1 = [];
  for (let c = 0; c <= Math.min(range.e.c, 15); c++) {
    const cell = sheet[XLSX.utils.encode_cell({ r: 1, c })];
    row1.push(cell ? cell.v : '');
  }
  console.log('Row 1 Values:', row1);
}
