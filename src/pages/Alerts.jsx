import React, { useState, useEffect } from 'react';
import { initialAlerts, initialZones } from '../data/mockData';
import { AlertTriangle, CheckCircle, Clock, Filter, Thermometer } from 'lucide-react';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [zones, setZones] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const savedAlerts = JSON.parse(localStorage.getItem('orange_alerts'));
    const savedZones = JSON.parse(localStorage.getItem('orange_zones'));
    
    if (savedAlerts) {
      setAlerts(savedAlerts);
    } else {
      setAlerts(initialAlerts);
      localStorage.setItem('orange_alerts', JSON.stringify(initialAlerts));
    }
    
    if (savedZones) {
      setZones(savedZones);
    } else {
      setZones(initialZones);
    }
  }, []);

  const saveToLocal = (newAlerts) => {
    setAlerts(newAlerts);
    localStorage.setItem('orange_alerts', JSON.stringify(newAlerts));
  };

  const updateStatus = (id, newStatus) => {
    const newAlerts = alerts.map(alert => 
      alert.id === id ? { ...alert, status: newStatus } : alert
    );
    saveToLocal(newAlerts);
  };

  const getZoneName = (zoneId) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone ? zone.name : 'Unknown Zone / General';
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity !== 'All' && alert.severity !== filterSeverity) return false;
    if (filterStatus !== 'All' && alert.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-forest-950 tracking-tight">Active Alerts</h1>
        <p className="text-gray-500 mt-1 text-lg">Review model-generated observations and weather advisories.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-gray-500 font-medium">
          <Filter className="w-5 h-5" /> Filters:
        </div>
        
        <select 
          value={filterSeverity} 
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-forest-500 outline-none"
        >
          <option value="All">All Severities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-forest-500 outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredAlerts.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className={`p-3 rounded-2xl shrink-0
                      ${alert.severity === 'High' ? 'bg-red-50 text-red-600' : ''}
                      ${alert.severity === 'Medium' ? 'bg-yellow-50 text-yellow-600' : ''}
                      ${alert.severity === 'Low' ? 'bg-blue-50 text-blue-600' : ''}
                    `}>
                      {alert.source === 'Weather System' ? <Thermometer className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3 className="text-xl font-bold text-forest-950">{alert.type}</h3>
                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md border uppercase tracking-wider
                          ${alert.severity === 'High' ? 'border-red-200 text-red-800 bg-red-100' : ''}
                          ${alert.severity === 'Medium' ? 'border-yellow-200 text-yellow-800 bg-yellow-100' : ''}
                          ${alert.severity === 'Low' ? 'border-blue-200 text-blue-800 bg-blue-100' : ''}
                        `}>
                          {alert.severity}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-4 font-medium">
                        <span>Source: <span className="text-gray-800">{alert.source}</span></span>
                        <span>Location: <span className="text-gray-800">{getZoneName(alert.zoneId)}</span></span>
                        <span>Date: <span className="text-gray-800">{alert.date}</span></span>
                      </div>
                      
                      <div className="bg-forest-50 border border-forest-100 p-4 rounded-xl text-sm text-forest-900 inline-block">
                        <span className="font-bold uppercase tracking-wider text-xs block text-forest-700 mb-1">Recommendation</span>
                        {alert.recommendation}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start md:items-end gap-3 shrink-0 border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-sm font-bold text-gray-500 flex items-center gap-2">Status: 
                      <span className={`px-3 py-1 rounded-md text-sm
                        ${alert.status === 'New' ? 'bg-gray-100 text-gray-800' : ''}
                        ${alert.status === 'Reviewed' ? 'bg-orange-100 text-orange-800' : ''}
                        ${alert.status === 'Resolved' ? 'bg-green-100 text-green-800' : ''}
                      `}>
                        {alert.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {alert.status === 'New' && (
                        <button 
                          onClick={() => updateStatus(alert.id, 'Reviewed')}
                          className="px-4 py-2 text-sm bg-white border border-gray-300 font-bold text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Mark Reviewed
                        </button>
                      )}
                      {alert.status !== 'Resolved' && (
                        <button 
                          onClick={() => updateStatus(alert.id, 'Resolved')}
                          className="px-4 py-2 text-sm bg-forest-900 text-white font-bold rounded-lg hover:bg-forest-800 transition-colors shadow-sm"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-extrabold text-forest-950 mb-2">No Active Alerts</h3>
            <p className="text-gray-500 font-medium">Your orchard looks healthy and clear of priority issues.</p>
          </div>
        )}
      </div>
    </div>
  );
}
