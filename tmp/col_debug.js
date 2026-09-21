const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = path.join(process.cwd(), 'data_performance.xlsx');
const fileBuffer = fs.readFileSync(filePath);
const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
const sheet = workbook.Sheets['SUB'];
const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:AH1');

const out = [];

// Header row
out.push('=== HEADER ROW ===');
for (let c = 0; c <= range.e.c; c++) {
  const cell = sheet[XLSX.utils.encode_cell({ r: 0, c })];
  const v = cell ? String(cell.v).substring(0, 40) : '(empty)';
  out.push(`  Col ${c} (${XLSX.utils.encode_col(c)}): ${v}`);
}

// Last 3 data rows
out.push('\n=== LAST 3 DATA ROWS ===');
for (let r = Math.max(1, range.e.r - 2); r <= range.e.r; r++) {
  out.push(`--- Row ${r} ---`);
  for (let c = 0; c <= range.e.c; c++) {
    const cell = sheet[XLSX.utils.encode_cell({ r, c })];
    if (cell && cell.v !== null && cell.v !== undefined) {
      out.push(`  Col ${c} (${XLSX.utils.encode_col(c)}): ${JSON.stringify(cell.v)}`);
    }
  }
}

fs.writeFileSync('col_debug.txt', out.join('\n'), 'utf8');
console.log('Written to col_debug.txt');
console.log('Total columns:', range.e.c + 1);
console.log('Total rows:', range.e.r + 1);
