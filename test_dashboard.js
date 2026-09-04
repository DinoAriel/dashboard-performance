require('dotenv').config({ path: '.env.local' });
const { getDashboardDataAsync } = require('./lib/excel-service');

async function test() {
  console.log('Sheet ID:', process.env.GOOGLE_SHEETS_ID);
  try {
    const data = await getDashboardDataAsync();
    console.log('Success! Total Inventory:', data.kpiData.totalInventory);
    console.log('Equipment list length:', data.equipmentList.length);
    console.log('First 3 items:', data.equipmentList.slice(0, 3));
  } catch (err) {
    console.error('Error occurred in getDashboardDataAsync:', err);
  }
}

test();
