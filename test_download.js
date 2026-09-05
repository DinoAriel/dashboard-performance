const XLSX = require('xlsx');
const fs = require('fs');

async function test() {
  try {
    const sheetId = '1YvmoBJJL-LXR_Ox7_84g2c8pUExY8bdfNUfiZ6uee-M';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP: ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    let out = `Sheet Names: ${workbook.SheetNames.join(', ')}\n\n`;
    const sheet = workbook.Sheets['SUB'];
    if (sheet) {
      out += `SUB ref: ${sheet['!ref']}\n`;
      const range = XLSX.utils.decode_range(sheet['!ref']);
      
      const headers = [];
      for (let c = 0; c <= range.e.c; c++) {
        headers.push(sheet[XLSX.utils.encode_cell({ r: 0, c })]?.v || '');
      }
      out += `Headers: ${headers.join(' | ')}\n\n`;
      
      const firstRow = [];
      for (let c = 0; c <= range.e.c; c++) {
        firstRow.push(sheet[XLSX.utils.encode_cell({ r: 1, c })]?.v || '');
      }
      out += `Row 1: ${firstRow.join(' | ')}\n`;
    } else {
      out += `SUB not found.\n`;
    }
    fs.writeFileSync('download_result.txt', out, 'utf-8');
    console.log('Test completed successfully and wrote to download_result.txt');
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
