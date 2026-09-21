import { getDashboardDataAsync } from "../lib/excel-service";

async function run() {
  const data = await getDashboardDataAsync();
  console.log(JSON.stringify(data.alertLogs, null, 2));
}

run().catch(console.error);
