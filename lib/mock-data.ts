export const kpiData = {
  averageScore: 94.8,
  criticalFacilities: 2,
  totalInventory: 26,
  newAlerts: 5,
};

export const categories = [
  { id: 'semua', label: 'Semua', count: 26 },
  { id: 'elektrikal', label: 'Elektrikal', count: 6 },
  { id: 'mekanikal', label: 'Mekanikal', count: 8 },
  { id: 'elektronika', label: 'Elektronika', count: 12 },
];

export const monthlyHealthData = [
  { name: 'Jan', value: 95 },
  { name: 'Feb', value: 93.5 },
  { name: 'Mar', value: 96 },
  { name: 'Apr', value: 90 },
  { name: 'Mei', value: 94 },
  { name: 'Jun', value: 96.5 },
  { name: 'Jul', value: 97.5 },
  { name: 'Agt', value: 98 },
];

export const statusDistributionData = [
  { name: 'Hijau (Sehat >96%)', value: 70, fill: '#16a34a' },
  { name: 'Kuning (Peringatan)', value: 20, fill: '#eab308' },
  { name: 'Merah (Kritis <90%)', value: 10, fill: '#dc2626' },
];

export const facilityDetails = [
  { id: 'ELK-01', name: 'Generator Set', category: 'Elektrikal', score: 100, status: 'SEHAT' },
  { id: 'MEK-02', name: 'Sistem HVAC', category: 'Mekanikal', score: 92, status: 'PERINGATAN' },
  { id: 'ELT-05', name: 'XRAY', category: 'Elektronika', score: 89, status: 'KRITIS' },
];

export const equipmentList = [
  { id: 'ELK-01', name: 'Generator Set', category: 'ELEKTRIKAL', location: 'Terminal 1', score: 100, status: 'SEHAT' },
  { id: 'MEK-05', name: 'Garbarata', category: 'MEKANIKAL', location: 'Gate 3', score: 95, status: 'PERINGATAN' },
  { id: 'ELT-02', name: 'XRAY', category: 'ELEKTRONIKA', location: 'Area Keamanan', score: 88, status: 'KRITIS' },
  { id: 'MEK-12', name: 'Baggage Carousel', category: 'MEKANIKAL', location: 'Arrival Hall B', score: 99, status: 'SEHAT' },
];

export const equipmentDetail = {
  id: 'ELT-02',
  name: 'XRAY',
  location: 'Area Keamanan',
  category: 'Elektronika',
  status: 'KRITIS',
  score: 88,
  scoreChange: -4,
  alertMessage: 'Health score dropped to 88%. Motor anomaly detected in scanning belt.',
  specifications: {
    brand: 'Smiths Detection',
    model: 'HI-SCAN 6040i',
    installation: '12 Aug 2021',
    lastMaintenance: '04 Oct 2023',
  }
};

export const calendarEvents = [
  { date: '2024-08-15', title: 'Cek Rutin ...', type: 'routine' },
  { date: '2024-08-18', title: 'Perbaikan ...', type: 'repair' },
  { date: '2024-08-22', title: 'Inspeksi F...', type: 'inspection' },
];

export const upcomingTasks = [
  {
    id: 1,
    title: 'Kalibrasi XRAY',
    urgent: true,
    deadline: 'Tenggat: Besok',
    location: 'Sec. Checkpoint B',
    completed: false,
  },
  {
    id: 2,
    title: 'Inspeksi Visual Aeronautical Ground Lighting',
    urgent: false,
    deadline: '24 Aug 2024, 23:00',
    location: 'Runway 27L',
    completed: false,
  }
];

export const monthlyReports = [
  { id: 1, name: 'Laporan Performa - Agustus 2026', date: '01 Sep 2026, 08:30 AM', type: 'PDF' },
  { id: 2, name: 'Laporan Performa - Juli 2026', date: '01 Agt 2026, 09:15 AM', type: 'PDF' },
  { id: 3, name: 'Laporan Performa - Juni 2026', date: '01 Jul 2026, 08:45 AM', type: 'PDF' },
  { id: 4, name: 'Laporan Performa - Mei 2026', date: '01 Jun 2026, 09:00 AM', type: 'CSV' },
  { id: 5, name: 'Laporan Performa - April 2026', date: '01 Mei 2026, 08:30 AM', type: 'PDF' },
  { id: 6, name: 'Laporan Performa - Maret 2026', date: '01 Apr 2026, 10:10 AM', type: 'CSV' },
];

export const alertLogs = [
  {
    id: 1,
    severity: 'KRITIS',
    time: '15 Menit lalu',
    incidentNumber: 'INC-2039',
    title: 'Tegangan tidak stabil',
    facility: 'Panel Tegangan Menengah (Elektrikal)',
    note: 'Fluktuasi > 15% dari batas aman'
  },
  {
    id: 2,
    severity: 'KRITIS',
    time: '1 Jam lalu',
    incidentNumber: 'INC-2038',
    title: 'Suhu sistem berlebih',
    facility: 'Sistem HVAC (Mekanikal)',
    note: 'Zona T3-Selatan 28°C'
  },
  {
    id: 3,
    severity: 'PERINGATAN',
    time: '2 Hari lalu',
    incidentNumber: 'INC-2015',
    title: 'Kalibrasi sensor menurun',
    facility: 'WTMD (Elektronika)',
    note: 'Akurasi di bawah 95% threshold'
  }
];
