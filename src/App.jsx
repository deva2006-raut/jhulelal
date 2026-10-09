import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Image as ImageIcon, Map, AlertTriangle, CheckSquare, FileText, CloudRain, Lightbulb, Settings as SettingsIcon } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import ImageAnalysis from './pages/ImageAnalysis';
import OrchardManagement from './pages/OrchardManagement';
import LiveWeather from './pages/LiveWeather';
import SmartAdvisory from './pages/SmartAdvisory';
import Alerts from './pages/Alerts';
import Tasks from './pages/Tasks';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function SidebarItem({ to, icon: Icon, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
        isActive 
          ? 'bg-forest-900 text-white shadow-md' 
          : 'text-forest-100 hover:bg-forest-800 hover:text-white'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-orange-400' : 'text-forest-300'}`} /> 
      {children}
    </Link>
  );
}

function Sidebar() {
  return (
    <aside className="w-72 bg-forest-950 border-r border-forest-900 flex flex-col text-white shadow-2xl z-10">
      <div className="p-6 border-b border-forest-900">
        <h1 className="text-2xl font-bold flex items-center gap-3 text-white">
          <span className="text-3xl drop-shadow-md">🍊</span> 
          <span>OrangeGuard <span className="text-orange-400">AI</span></span>
        </h1>
        <p className="text-sm text-forest-300 mt-2 font-medium">Smart Orchard Management</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
        <SidebarItem to="/" icon={Home}>Dashboard</SidebarItem>
        <SidebarItem to="/analysis" icon={ImageIcon}>Image Analysis</SidebarItem>
        <SidebarItem to="/orchard" icon={Map}>Orchard Zones</SidebarItem>
        <SidebarItem to="/weather" icon={CloudRain}>Live Weather</SidebarItem>
        <SidebarItem to="/advisory" icon={Lightbulb}>Smart Advisory</SidebarItem>
        <SidebarItem to="/alerts" icon={AlertTriangle}>Alerts</SidebarItem>
        <SidebarItem to="/tasks" icon={CheckSquare}>Farm Tasks</SidebarItem>
        <SidebarItem to="/reports" icon={FileText}>Reports</SidebarItem>
      </nav>
      <div className="p-4 border-t border-forest-900">
        <SidebarItem to="/settings" icon={SettingsIcon}>Settings</SidebarItem>
      </div>
    </aside>
  );
}

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
        <Sidebar />

        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex justify-between items-center px-8 shrink-0 sticky top-0 z-10 shadow-sm">
            <h2 className="text-xl font-bold text-forest-900">Platform Overview</h2>
            <div className="flex items-center gap-4">
              <span className="demo-badge">DEMO MODE</span>
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold border border-orange-200">
                F
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analysis" element={<ImageAnalysis />} />
                <Route path="/orchard" element={<OrchardManagement />} />
                <Route path="/weather" element={<LiveWeather />} />
                <Route path="/advisory" element={<SmartAdvisory />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
