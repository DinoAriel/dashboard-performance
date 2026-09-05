async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/dashboard');
    console.log('Status code:', res.status);
    const data = await res.json();
    console.log('Response keys:', Object.keys(data));
    if (data.equipmentList) {
      console.log('Total equipments returned:', data.equipmentList.length);
      console.log('First 5 equipments:', data.equipmentList.slice(0, 5));
    } else {
      console.log('No equipmentList key found in response:', data);
    }
  } catch (err) {
    console.error('Fetch failed:', err.message);
  }
}
run();
