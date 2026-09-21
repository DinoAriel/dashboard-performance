const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = path.join(process.cwd(), 'data_performance.xlsx');
const fileBuffer = fs.readFileSync(filePath);
const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
const sheet = workbook.Sheets['SUB'];
const range = XLSX.utils.decode_range(sheet['!ref']);

let maxRowWithData = 0;
for (let r = 0; r <= range.e.r; r++) {
  const dateCell = sheet[XLSX.utils.encode_cell({ r, c: 0 })];
  if (dateCell && typeof dateCell.v === 'number') {
    maxRowWithData = r;
  }
}
console.log('Max row with actual date:', maxRowWithData);

// Remove the bad row we added (everything after maxRowWithData EXCEPT the legitimate rows).
// Wait, the legitimate rows should end much earlier, around row 150.
// Let's just find the last valid row and wipe everything below it.
// Actually, I can just read the data, keep only valid rows, and overwrite the sheet? No, this might wipe out formatting.
// Instead, let's just delete the cells in row 1267 (or maxRowWithData if it's the bad one).
// Let's identify the bad row. The bad row has 1.0 for everything, and date 46265 (which is way in the future or today?).
// 46265 = 2026-09-00 approximately.

for (let r = 1; r <= range.e.r; r++) {
  const dateCell = sheet[XLSX.utils.encode_cell({ r, c: 0 })];
  // If it's a date from Sept 2026 (the fake one we added during testing)
  if (dateCell && typeof dateCell.v === 'number' && dateCell.v >= 46200) {
    console.log('Deleting suspicious row:', r);
    for (let c = 0; c <= range.e.c; c++) {
      delete sheet[XLSX.utils.encode_cell({ r, c })];
    }
  }
}

// Adjust range ? Let's just write it back.
const writeBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
fs.writeFileSync(filePath, writeBuffer);
console.log('Fixed excel file written.');
