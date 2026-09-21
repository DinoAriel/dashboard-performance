const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = path.join(process.cwd(), 'data_performance.xlsx');
const fileBuffer = fs.readFileSync(filePath);
const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
const sheet = workbook.Sheets['SUB'];
const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:AH1');

let maxRow = 0;
for(let i=0; i<=range.e.r; i++) {
   if(sheet[XLSX.utils.encode_cell({r:i, c:0})] !== undefined) maxRow=i;
}

const out = [];
out.push('Max row: ' + maxRow);
for(let c=5; c<=20; c++) {
    const cell = sheet[XLSX.utils.encode_cell({ r: maxRow, c })];
    out.push('Row ' + maxRow + ' Col ' + c + ': ' + (cell ? cell.v + ' (' + typeof cell.v + ')' : 'missing'));
}

if(maxRow > 1) {
  out.push('--- Previous Row ---');
  for(let c=5; c<=20; c++) {
      const cell = sheet[XLSX.utils.encode_cell({ r: maxRow-1, c })];
      out.push('Row ' + (maxRow-1) + ' Col ' + c + ': ' + (cell ? cell.v + ' (' + typeof cell.v + ')' : 'missing'));
  }
}

fs.writeFileSync('tmp_row_test.txt', out.join('\n'));
console.log('Written tmp_row_test.txt');
