const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = path.join(process.cwd(), 'data_performance.xlsx');
const fileBuffer = fs.readFileSync(filePath);
const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
const sheet = workbook.Sheets['SUB'];
const range = XLSX.utils.decode_range(sheet['!ref']);

let maxRow = 0;
for(let i=0; i<=range.e.r; i++) {
   if(sheet[XLSX.utils.encode_cell({r:i, c:0})] !== undefined) maxRow=i;
}

const out = [];
out.push('Max row: ' + maxRow);
out.push('Range max row: ' + range.e.r);

for (let r = maxRow - 5; r <= maxRow; r++) {
  out.push('--- Row ' + r + ' ---');
  for (let c = 0; c <= 20; c++) {
    const cell = sheet[XLSX.utils.encode_cell({ r, c })];
    if (cell) {
       out.push('  Col ' + c + ': ' + cell.v);
    }
  }
}

fs.writeFileSync('tmp_row_test_2.txt', out.join('\n'));
console.log('Written tmp_row_test_2.txt');
