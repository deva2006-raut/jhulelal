import React, { useState, useEffect } from 'react';
import { initialZones } from '../data/mockData';
import { Plus, Edit2, Trash2, MapPin, Search, Trees, Info } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function OrchardManagement() {
  const [zones, setZones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ 
    name: '', trees: '', variety: '', plantedYear: '', status: 'Healthy', lastInspected: '', observations: '' 
  });

  useEffect(() => {
    const savedZones = JSON.parse(localStorage.getItem('orange_zones'));
    if (savedZones) {
      setZones(savedZones);
    } else {
      setZones(initialZones);
      localStorage.setItem('orange_zones', JSON.stringify(initialZones));
    }
  }, []);

  const saveToLocal = (newZones) => {
    setZones(newZones);
    localStorage.setItem('orange_zones', JSON.stringify(newZones));
  };

  const handleOpenModal = (zone = null) => {
    if (zone) {
      setEditingZone(zone);
      setFormData(zone);
    } else {
      setEditingZone(null);
      setFormData({ name: '', trees: '', variety: '', plantedYear: '', status: 'Healthy', lastInspected: new Date().toISOString().split('T')[0], observations: '' });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to permanently delete this orchard zone?')) {
      const newZones = zones.filter(z => z.id !== id);
      saveToLocal(newZones);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingZone) {
      const newZones = zones.map(z => z.id === editingZone.id ? { ...formData, id: z.id } : z);
      saveToLocal(newZones);
    } else {
      const newZones = [...zones, { ...formData, id: uuidv4() }];
      saveToLocal(newZones);
    }
    setIsModalOpen(false);
  };

  const filteredZones = zones.filter(z => z.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-forest-950 tracking-tight">Orchard Zones</h1>
          <p className="text-gray-500 mt-1 text-lg">Manage plantation zones, tree counts, and recorded observations.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search zones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-forest-500 outline-none shadow-sm"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-forest-900 hover:bg-forest-800 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shrink-0"
          >
            <Plus className="w-5 h-5" /> Add Zone
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredZones.map((zone) => (
          <div key={zone.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-500"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-forest-50 rounded-xl text-forest-700">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-forest-950">{zone.name}</h3>
                    <span className={`inline-block px-2 py-0.5 mt-1 text-xs font-bold rounded-md border
                      ${zone.status === 'Healthy' ? 'bg-green-50 border-green-200 text-green-700' : ''}
                      ${zone.status === 'Warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : ''}
                      ${zone.status === 'Critical' ? 'bg-red-50 border-red-200 text-red-700' : ''}
                    `}>
                      {zone.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(zone)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(zone.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Trees className="w-3 h-3"/> Trees</span>
                  <p className="text-lg font-bold text-gray-800">{zone.trees}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase">Variety</span>
                  <p className="text-base font-bold text-gray-800 truncate" title={zone.variety}>{zone.variety || 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-3">
                {zone.observations && (
                  <div className="text-sm">
                    <span className="font-semibold text-gray-700 block">Latest Observations:</span>
                    <p className="text-gray-600 line-clamp-2">{zone.observations}</p>
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs font-medium text-gray-500">Planted: {zone.plantedYear || 'Unknown'}</span>
                  <span className="text-xs font-medium text-gray-500">Inspected: {zone.lastInspected}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredZones.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-500 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <Trees className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-xl font-bold text-forest-900 mb-2">No zones found</p>
            <p className="text-gray-500">Click "Add Zone" to map a new area of your orchard.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-forest-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-extrabold text-forest-950">{editingZone ? 'Edit Orchard Zone' : 'Add New Orchard Zone'}</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Zone Name</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-shadow" placeholder="e.g. North Plot" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Number of Trees</label>
                  <input required type="number" min="1" value={formData.trees} onChange={(e) => setFormData({...formData, trees: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-shadow" placeholder="e.g. 150" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Citrus Variety</label>
                  <input type="text" value={formData.variety} onChange={(e) => setFormData({...formData, variety: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-shadow" placeholder="e.g. Nagpur Mandarin" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Planting Year</label>
                  <input type="number" value={formData.plantedYear} onChange={(e) => setFormData({...formData, plantedYear: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-shadow" placeholder="e.g. 2018" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Current Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-shadow">
                    <option value="Healthy">Healthy</option>
                    <option value="Warning">Warning</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Last Inspected Date</label>
                  <input required type="date" value={formData.lastInspected} onChange={(e) => setFormData({...formData, lastInspected: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-shadow" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Recent Observations</label>
                <textarea rows="3" value={formData.observations} onChange={(e) => setFormData({...formData, observations: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-shadow" placeholder="Record visual signs, pest presence, or general condition..."></textarea>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-sm text-blue-800 border border-blue-100">
                <Info className="w-5 h-5 shrink-0 text-blue-600" />
                <p>Data entered here is saved to your local browser storage. No data is sent to external servers.</p>
              </div>
            </form>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-700 font-bold hover:bg-gray-200 rounded-xl transition-colors">
                Cancel
              </button>
              <button type="submit" onClick={handleSubmit} className="px-6 py-2.5 bg-forest-900 hover:bg-forest-800 text-white font-bold rounded-xl shadow-md transition-all">
                {editingZone ? 'Update Zone' : 'Save Zone'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
