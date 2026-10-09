import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Image as ImageIcon, Map, AlertTriangle, CheckSquare, FileText, CloudRain, Lightbulb, Settings as SettingsIcon, Menu, X, User } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import ImageAnalysis from './pages/ImageAnalysis';
import OrchardManagement from './pages/OrchardManagement';
import LiveWeather from './pages/LiveWeather';
import SmartAdvisory from './pages/SmartAdvisory';
import Alerts from './pages/Alerts';
import Tasks from './pages/Tasks';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Dashboard', title: 'Dashboard', subtitle: 'Platform overview and orchard health at a glance' },
  { to: '/analysis', icon: ImageIcon, label: 'Image Analysis', title: 'Image Analysis', subtitle: 'Classify leaf, fruit and orchard photographs' },
  { to: '/orchard', icon: Map, label: 'Orchard Zones', title: 'Orchard Zones', subtitle: 'Add, edit and inspect your managed zones' },
  { to: '/weather', icon: CloudRain, label: 'Live Weather', title: 'Live Weather', subtitle: 'Current conditions for your orchard locations' },
  { to: '/advisory', icon: Lightbulb, label: 'Smart Advisory', title: 'Smart Advisory', subtitle: 'Practical recommendations for your crops' },
  { to: '/alerts', icon: AlertTriangle, label: 'Alerts', title: 'Alerts', subtitle: 'Prioritised issues that need your review' },
  { to: '/tasks', icon: CheckSquare, label: 'Farm Tasks', title: 'Farm Tasks', subtitle: 'Plan and track day-to-day farming activities' },
  { to: '/reports', icon: FileText, label: 'Reports', title: 'Reports', subtitle: 'Trends and exportable CSV reports' },
  { to: '/settings', icon: SettingsIcon, label: 'Settings', title: 'Settings', subtitle: 'Configure this demo workspace' },
];

function SidebarItem({ to, icon: Icon, children, onNavigate }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onNavigate}
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

function Sidebar({ open, onNavigate }) {
  const mainItems = NAV_ITEMS.filter((item) => item.to !== '/settings');

  return (
    <aside
      className={`w-72 shrink-0 bg-forest-950 border-r border-forest-900 flex flex-col text-white shadow-2xl z-40 fixed inset-y-0 left-0 transition-transform duration-300 lg:static lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-6 border-b border-forest-900 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3 text-white">
            <span className="text-3xl drop-shadow-md">🍊</span>
            <span>OrangeGuard <span className="text-orange-400">AI</span></span>
          </h1>
          <p className="text-sm text-forest-300 mt-2 font-medium">Smart Orchard Management</p>
        </div>
        <button
          type="button"
          onClick={onNavigate}
          aria-label="Close navigation"
          className="lg:hidden rounded-lg p-2 text-forest-300 hover:bg-forest-800 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
        {mainItems.map((item) => (
          <SidebarItem key={item.to} to={item.to} icon={item.icon} onNavigate={onNavigate}>
            {item.label}
          </SidebarItem>
        ))}
      </nav>
      <div className="p-4 border-t border-forest-900">
        <SidebarItem to="/settings" icon={SettingsIcon} onNavigate={onNavigate}>
          Settings
        </SidebarItem>
      </div>
    </aside>
  );
}

function App() {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  const current = NAV_ITEMS.find((item) => item.to === location.pathname) || NAV_ITEMS[0];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {navOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />
      )}
      <Sidebar open={navOpen} onNavigate={() => setNavOpen(false)} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex justify-between items-center px-4 sm:px-8 shrink-0 sticky top-0 z-20 shadow-sm gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label="Open navigation"
              className="lg:hidden rounded-lg p-2 text-forest-700 hover:bg-forest-50 hover:text-forest-900 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-forest-900 truncate">{current.title}</h2>
              <p className="hidden sm:block text-xs text-gray-500 truncate">{current.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span className="demo-badge">DEMO MODE</span>
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 border border-orange-200">
              <User className="w-4 h-4" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
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
  );
}

export default function AppRoot() {
  return (
    <Router>
      <App />
    </Router>
  );
}
