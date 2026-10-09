import React, { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';

export default function Settings() {
  const [formData, setFormData] = useState({
    farmName: 'OrangeGuard Demo Farm',
    location: 'Nagpur, Maharashtra, India',
    units: 'metric',
    modelConfig: 'demo'
  });
  
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('orange_settings'));
    if (savedSettings) {
      // Clean up old api key if exists
      if (savedSettings.weatherApiKey !== undefined) delete savedSettings.weatherApiKey;
      setFormData(savedSettings);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('orange_settings', JSON.stringify(formData));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-forest-950 tracking-tight">System Settings</h1>
        <p className="text-gray-500 mt-1 text-lg">Configure your farm preferences and external integrations.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-extrabold text-forest-950 mb-6">General Information</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Farm Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.farmName}
                  onChange={(e) => setFormData({...formData, farmName: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-forest-500 outline-none transition-shadow" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Default Location</label>
                <input 
                  required
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-forest-500 outline-none transition-shadow" 
                  placeholder="e.g. Nagpur, Maharashtra"
                />
                <p className="text-xs text-gray-500 mt-1 font-medium">Used as fallback if browser location is denied.</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Units</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name="units" 
                    value="metric"
                    checked={formData.units === 'metric'}
                    onChange={(e) => setFormData({...formData, units: e.target.value})}
                    className="text-forest-600 focus:ring-forest-500 w-4 h-4"
                  />
                  <span className="font-medium">Metric (°C, km/h, mm)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name="units" 
                    value="imperial"
                    disabled
                    checked={formData.units === 'imperial'}
                    onChange={(e) => setFormData({...formData, units: e.target.value})}
                    className="text-gray-400 focus:ring-gray-300 w-4 h-4 cursor-not-allowed"
                  />
                  <span className="font-medium text-gray-400">Imperial (°F, mph, in) - Coming Soon</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-extrabold text-forest-950 mb-6">Integrations</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Weather Service</label>
              <p className="text-sm text-gray-600 font-medium">
                Live Weather is currently powered by the free Open-Meteo API. No API key is required.
              </p>
            </div>

            <div className="pt-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">AI Image Analysis Model</label>
              <select 
                value={formData.modelConfig}
                onChange={(e) => setFormData({...formData, modelConfig: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-forest-500 outline-none transition-shadow"
              >
                <option value="demo">Prototype Mode (No AI Connection)</option>
                <option value="external" disabled>External API (Requires Configuration)</option>
                <option value="local" disabled>Local TensorFlow.js Model (Not Installed)</option>
              </select>
              <p className="text-xs text-gray-500 mt-2 font-medium">
                In prototype mode, the system will not invent disease predictions and will instruct users to seek expert consultation.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          {saved && (
            <span className="flex items-center gap-2 text-green-600 font-bold animate-in fade-in">
              <CheckCircle className="w-5 h-5" /> Settings Saved
            </span>
          )}
          <button 
            type="submit" 
            className="px-8 py-3 bg-forest-900 hover:bg-forest-800 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <Save className="w-5 h-5" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
