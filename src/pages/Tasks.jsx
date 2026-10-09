import React, { useState, useEffect } from 'react';
import { initialTasks, initialZones } from '../data/mockData';
import { Plus, CheckSquare, Clock, AlertCircle, Edit } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [zones, setZones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', type: 'Orchard Inspection', zoneId: '', priority: 'Medium', dueDate: '', status: 'Pending', notes: '' });

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('orange_tasks'));
    const savedZones = JSON.parse(localStorage.getItem('orange_zones'));
    
    if (savedTasks) setTasks(savedTasks);
    else {
      setTasks(initialTasks);
      localStorage.setItem('orange_tasks', JSON.stringify(initialTasks));
    }
    
    if (savedZones) setZones(savedZones);
    else setZones(initialZones);
  }, []);

  const saveToLocal = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem('orange_tasks', JSON.stringify(newTasks));
  };

  const updateStatus = (id, newStatus) => {
    const newTasks = tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    );
    saveToLocal(newTasks);
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData(task);
    } else {
      setEditingTask(null);
      setFormData({ title: '', type: 'Orchard Inspection', zoneId: '', priority: 'Medium', dueDate: new Date().toISOString().split('T')[0], status: 'Pending', notes: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      saveToLocal(tasks.map(t => t.id === editingTask.id ? { ...formData, id: t.id } : t));
    } else {
      saveToLocal([...tasks, { ...formData, id: uuidv4() }]);
    }
    setIsModalOpen(false);
  };

  const getZoneName = (zoneId) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone ? zone.name : 'Unassigned';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-forest-950 tracking-tight">Farm Tasks</h1>
          <p className="text-gray-500 mt-1 text-lg">Organize and track your daily orchard activities.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-forest-900 hover:bg-forest-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shrink-0"
        >
          <Plus className="w-5 h-5" /> Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Column */}
        <div className="bg-gray-100 rounded-2xl p-5 flex flex-col h-full border border-gray-200">
          <h3 className="text-lg font-extrabold text-gray-700 mb-5 flex items-center gap-2 uppercase tracking-wider">
            <Clock className="w-5 h-5" /> Pending
            <span className="ml-auto bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-sm">{tasks.filter(t => t.status === 'Pending').length}</span>
          </h3>
          <div className="space-y-4 flex-1">
            {tasks.filter(t => t.status === 'Pending').map(task => (
              <TaskCard key={task.id} task={task} zoneName={getZoneName(task.zoneId)} onStatusChange={updateStatus} onEdit={() => openModal(task)} nextStatus="In Progress" />
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-blue-50 rounded-2xl p-5 flex flex-col h-full border border-blue-100">
          <h3 className="text-lg font-extrabold text-blue-800 mb-5 flex items-center gap-2 uppercase tracking-wider">
            <AlertCircle className="w-5 h-5" /> In Progress
            <span className="ml-auto bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-sm">{tasks.filter(t => t.status === 'In Progress').length}</span>
          </h3>
          <div className="space-y-4 flex-1">
            {tasks.filter(t => t.status === 'In Progress').map(task => (
              <TaskCard key={task.id} task={task} zoneName={getZoneName(task.zoneId)} onStatusChange={updateStatus} onEdit={() => openModal(task)} nextStatus="Completed" />
            ))}
          </div>
        </div>

        {/* Completed Column */}
        <div className="bg-green-50 rounded-2xl p-5 flex flex-col h-full border border-green-100">
          <h3 className="text-lg font-extrabold text-green-800 mb-5 flex items-center gap-2 uppercase tracking-wider">
            <CheckSquare className="w-5 h-5" /> Completed
            <span className="ml-auto bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-sm">{tasks.filter(t => t.status === 'Completed').length}</span>
          </h3>
          <div className="space-y-4 flex-1">
            {tasks.filter(t => t.status === 'Completed').map(task => (
              <TaskCard key={task.id} task={task} zoneName={getZoneName(task.zoneId)} onStatusChange={updateStatus} onEdit={() => openModal(task)} nextStatus={null} />
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-forest-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xl font-extrabold text-forest-950">{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Task Title</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-forest-500 outline-none" placeholder="e.g. Apply fertilizer" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-forest-500 outline-none">
                    <option value="Orchard Inspection">Orchard Inspection</option>
                    <option value="Irrigation Review">Irrigation Review</option>
                    <option value="Image Collection">Image Collection</option>
                    <option value="Expert Consultation">Expert Consultation</option>
                    <option value="Spraying Review">Spraying Review</option>
                    <option value="General Maintenance">General Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Priority</label>
                  <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-forest-500 outline-none">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Target Zone</label>
                <select required value={formData.zoneId} onChange={(e) => setFormData({...formData, zoneId: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-forest-500 outline-none">
                  <option value="" disabled>Select a zone</option>
                  {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Due Date</label>
                <input required type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-forest-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Notes & Instructions</label>
                <textarea rows="3" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-forest-500 outline-none" placeholder="Provide additional details..."></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-700 font-bold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-forest-900 hover:bg-forest-800 text-white font-bold rounded-xl transition-all shadow-md">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, zoneName, onStatusChange, onEdit, nextStatus }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative">
      <button onClick={onEdit} className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-forest-600 hover:bg-forest-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
        <Edit className="w-4 h-4" />
      </button>
      
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">{task.type}</span>
        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${
          task.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
          task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-blue-50 text-blue-700 border-blue-200'
        }`}>
          {task.priority}
        </span>
      </div>
      
      <h4 className="font-extrabold text-forest-950 mb-1 text-lg leading-tight pr-8">{task.title}</h4>
      <p className="text-sm font-medium text-gray-500 mb-3">{zoneName} • Due: {task.dueDate}</p>
      
      {task.notes && (
        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 mb-4 border border-gray-100">
          {task.notes}
        </div>
      )}
      
      <div className="flex justify-end pt-2 border-t border-gray-50">
        {nextStatus && (
          <button 
            onClick={() => onStatusChange(task.id, nextStatus)}
            className="text-sm font-bold text-forest-700 hover:text-forest-900 hover:bg-forest-50 px-4 py-2 rounded-lg transition-colors border border-forest-100"
          >
            Mark as {nextStatus}
          </button>
        )}
      </div>
    </div>
  );
}
