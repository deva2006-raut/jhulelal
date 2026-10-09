import React, { useState, useEffect } from 'react';
import { initialZones, initialAlerts, initialTasks } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Leaf, AlertCircle, CheckCircle2, ListTodo, Map } from 'lucide-react';

const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const [stats, setStats] = useState({ zones: 0, trees: 0, alerts: 0, tasks: 0, healthy: 0 });

  useEffect(() => {
    const zones = JSON.parse(localStorage.getItem('orange_zones')) || initialZones;
    const alerts = JSON.parse(localStorage.getItem('orange_alerts')) || initialAlerts;
    const tasks = JSON.parse(localStorage.getItem('orange_tasks')) || initialTasks;

    const healthyZones = zones.filter(z => z.status === 'Healthy').length;
    const pendingAlerts = alerts.filter(a => a.status === 'New').length;
    const pendingTasks = tasks.filter(t => t.status !== 'Completed').length;
    const totalTrees = zones.reduce((acc, z) => acc + Number(z.trees), 0);

    setStats({
      zones: zones.length,
      trees: totalTrees,
      alerts: pendingAlerts,
      tasks: pendingTasks,
      healthy: healthyZones
    });
  }, []);

  const pieData = [
    { name: 'Healthy', value: stats.healthy },
    { name: 'Warning', value: stats.zones - stats.healthy - (stats.zones > 0 ? 1 : 0) }, // mock safe calculation
    { name: 'Critical', value: stats.zones > 0 ? 1 : 0 }
  ];

  const barData = [
    { name: 'Mon', images: 5 },
    { name: 'Tue', images: 8 },
    { name: 'Wed', images: 12 },
    { name: 'Thu', images: 4 },
    { name: 'Fri', images: 15 },
    { name: 'Sat', images: 22 },
    { name: 'Sun', images: 14 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-forest-950 tracking-tight">Orchard Overview</h1>
          <p className="text-gray-500 mt-1 text-lg">Monitor the health and activities across your orange farm.</p>
        </div>
        <div className="text-sm font-medium px-4 py-2 bg-orange-100 text-orange-800 rounded-lg shadow-sm border border-orange-200">
          DEMO DATA — Replace with actual orchard records
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-forest-50 rounded-xl text-forest-600">
              <Map className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-forest-600 bg-forest-50 px-2 py-1 rounded-full">+2 this month</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Managed Zones</p>
            <h3 className="text-3xl font-extrabold text-forest-950 mt-1">{stats.zones}</h3>
            <p className="text-xs text-gray-400 mt-1">{stats.trees} total trees planted</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 rounded-xl text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            {stats.alerts > 0 && <span className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded-full animate-pulse">Action Needed</span>}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">New Alerts</p>
            <h3 className="text-3xl font-extrabold text-forest-950 mt-1">{stats.alerts}</h3>
            <p className="text-xs text-gray-400 mt-1">Requires your review</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <ListTodo className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
            <h3 className="text-3xl font-extrabold text-forest-950 mt-1">{stats.tasks}</h3>
            <p className="text-xs text-gray-400 mt-1">Scheduled farming activities</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Healthy Zones</p>
            <h3 className="text-3xl font-extrabold text-forest-950 mt-1">{stats.healthy}</h3>
            <p className="text-xs text-gray-400 mt-1">Operating optimally</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-forest-950 mb-6">Zone Health Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm font-medium">
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></span>Healthy</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-yellow-500 shadow-sm"></span>Warning</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></span>Critical</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-forest-950 mb-6">Recent Image Scans</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="images" fill="#fb923c" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
