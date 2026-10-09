export const initialZones = [
  { id: '1', name: 'Nagpur North Zone', trees: 150, variety: 'Nagpur Mandarin', plantedYear: '2015', status: 'Healthy', lastInspected: '2023-10-01', observations: 'Good growth, well irrigated.' },
  { id: '2', name: 'Vidarbha East Plot', trees: 200, variety: 'Kinnow', plantedYear: '2018', status: 'Warning', lastInspected: '2023-10-05', observations: 'Some leaf yellowing observed.' },
  { id: '3', name: 'South Slope', trees: 120, variety: 'Nagpur Mandarin', plantedYear: '2012', status: 'Critical', lastInspected: '2023-10-08', observations: 'Canker spots detected.' },
];

export const initialAlerts = [
  { id: '1', zoneId: '3', source: 'Image Analysis', type: 'Citrus Canker Detected', severity: 'High', date: '2023-10-08', status: 'New', recommendation: 'Apply copper-based bactericide immediately.' },
  { id: '2', zoneId: '2', source: 'Manual Inspection', type: 'Aphids Detection', severity: 'Medium', date: '2023-10-06', status: 'Reviewed', recommendation: 'Spray neem oil or insecticidal soap.' },
  { id: '3', zoneId: '1', source: 'Weather System', type: 'Heavy Rain Forecast', severity: 'Low', date: '2023-10-09', status: 'Resolved', recommendation: 'Ensure proper drainage in low areas.' }
];

export const initialTasks = [
  { id: '1', title: 'Spray copper bactericide', type: 'Spraying', zoneId: '3', priority: 'High', dueDate: '2023-10-10', status: 'Pending', notes: 'Use recommended dosage. Avoid spraying during high winds.' },
  { id: '2', title: 'Inspect leaves for aphids', type: 'Inspection', zoneId: '2', priority: 'Medium', dueDate: '2023-10-12', status: 'In Progress', notes: 'Check underside of leaves.' },
  { id: '3', title: 'Irrigate North Zone', type: 'Irrigation', zoneId: '1', priority: 'Low', dueDate: '2023-10-15', status: 'Completed', notes: 'Soil moisture was good, watered lightly.' }
];
