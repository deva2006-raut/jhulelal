import React, { useState, useEffect } from 'react';
import { initialAlerts, initialTasks, initialZones } from '../data/mockData';
import { Download, Printer, FileText, Filter, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Reports() {
  const [alerts, setAlerts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [zones, setZones] = useState([]);

  useEffect(() => {
    setAlerts(JSON.parse(localStorage.getItem('orange_alerts')) || initialAlerts);
    setTasks(JSON.parse(localStorage.getItem('orange_tasks')) || initialTasks);
    setZones(JSON.parse(localStorage.getItem('orange_zones')) || initialZones);
  }, []);

  const chartData = [
    { name: 'Week 1', healthy: 85, issues: 15 },
    { name: 'Week 2', healthy: 82, issues: 18 },
    { name: 'Week 3', healthy: 88, issues: 12 },
    { name: 'Week 4', healthy: 92, issues: 8 },
  ];

  const downloadCSV = () => {
    const headers = 'ID,Type,Severity,Status,Date\n';
    const rows = alerts.map(a => `${a.id},${a.type},${a.severity},${a.status},${a.date}`).join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'orchard_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto print:bg-white print:text-black">
      <div className="flex justify-between items-end print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold text-forest-950 tracking-tight">Orchard Reports</h1>
          <p className="text-gray-500 mt-1 text-lg">Export CSV data and view historical analytics.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={printReport}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Printer className="w-5 h-5" /> Print Layout
          </button>
          <button 
            onClick={downloadCSV}
            className="bg-forest-900 hover:bg-forest-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md"
          >
            <Download className="w-5 h-5" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 print:shadow-none print:border-none print:p-0">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-extrabold text-forest-950">Crop Health Trends (Last 4 Weeks)</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHealthy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="healthy" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorHealthy)" />
                <Area type="monotone" dataKey="issues" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorIssues)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 print:shadow-none print:border-none print:p-0">
          <h3 className="text-xl font-extrabold text-forest-950 mb-8">Summary Statistics</h3>
          
          <div className="space-y-8">
            <div>
              <div className="flex justify-between font-bold mb-2">
                <span className="text-gray-700">Tasks Completed</span>
                <span className="text-forest-900 text-lg">
                  {tasks.filter(t => t.status === 'Completed').length} <span className="text-gray-400 text-sm">/ {tasks.length}</span>
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-green-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${(tasks.filter(t => t.status === 'Completed').length / (tasks.length || 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-2">
                <span className="text-gray-700">Alerts Resolved</span>
                <span className="text-forest-900 text-lg">
                  {alerts.filter(a => a.status === 'Resolved').length} <span className="text-gray-400 text-sm">/ {alerts.length}</span>
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${(alerts.filter(a => a.status === 'Resolved').length / (alerts.length || 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200 print:border-black">
                <h4 className="font-bold text-yellow-900 flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5" /> Reporting Disclaimer
                </h4>
                <p className="text-sm text-yellow-800 font-medium leading-relaxed">
                  The data displayed in these reports is for demonstration purposes. In a production environment, this would sync with your real-time orchard sensors and inspection logs. Do not report invented model accuracy or unverified financial improvements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
