const XLSX = require('xlsx');
const path = require('path');

try {
  const filePath = path.join(__dirname, 'data_performance.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets['SUB'];
  const range = XLSX.utils.decode_range(sheet['!ref']);
  
  let validDates = [];
  for (let r = 1; r <= range.e.r; r++) {
    const cell = sheet[XLSX.utils.encode_cell({ r, c: 0 })];
    if (cell && typeof cell.v === 'number') {
      const date = new Date(Math.round((cell.v - 25569) * 24 * 3600 * 1000));
      validDates.push(date.toISOString().split('T')[0]);
    } else if (cell && cell.v) {
      validDates.push(String(cell.v));
    }
  }
  
  console.log('Total:', validDates.length, 'rows');
  console.log('Rentang Tanggal:', validDates[0], 's/d', validDates[validDates.length - 1]);
} catch (error) {
  console.error('Error:', error);
}
