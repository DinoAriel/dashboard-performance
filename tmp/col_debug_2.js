const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = path.join(process.cwd(), 'data_performance.xlsx');
const fileBuffer = fs.readFileSync(filePath);
const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
const sheet = workbook.Sheets['SUB'];
const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:AH1');

const out = [];
for (let r = Math.max(1, range.e.r - 20); r <= range.e.r; r++) {
  out.push(`--- Row ${r} ---`);
  for (let c = 0; c <= 20; c++) {
    const cell = sheet[XLSX.utils.encode_cell({ r, c })];
    if (cell && cell.v !== null && cell.v !== undefined) {
      out.push(`  Col ${c}: ${cell.v}`);
    }
  }
}

fs.writeFileSync('col_debug_2.txt', out.join('\n'), 'utf8');
console.log('Written to col_debug_2.txt');
