const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = path.join(process.cwd(), 'data_performance.xlsx');
const fileBuffer = fs.readFileSync(filePath);
const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
const sheet = workbook.Sheets['SUB'];
const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:AH1');

let out = [];
for (let r = 0; r <= range.e.r; r++) {
  for (let c = 0; c <= range.e.c; c++) {
    const cell = sheet[XLSX.utils.encode_cell({ r, c })];
    if (cell && (cell.v === 0.89 || cell.v === 89 || cell.v === 0.899999999999999 || cell.v === '89%')) {
       out.push('Found 89% at Row ' + r + ' Col ' + c);
       out.push('Row ' + r + ' dumped:');
       for (let c2 = 0; c2 <= 20; c2++) {
         const cell2 = sheet[XLSX.utils.encode_cell({ r, c: c2 })];
         out.push('  Col ' + c2 + ': ' + (cell2 ? cell2.v : 'null'));
       }
    }
  }
}
fs.writeFileSync('tmp_89_results.txt', out.join('\n'));
console.log('Done');
