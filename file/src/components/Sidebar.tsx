import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ScanSearch, 
  Map as MapIcon, 
  Truck, 
  Recycle, 
  BarChart3,
  Waves
} from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Waves size={28} color="var(--color-teal-50)" />
        AquaClean AI
      </div>
      <nav>
        <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/detect" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <ScanSearch size={20} /> AI Detection
        </NavLink>
        <NavLink to="/hotspots" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <MapIcon size={20} /> Hotspot Map
        </NavLink>
        <NavLink to="/collection" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Truck size={20} /> Collection Route
        </NavLink>
        <NavLink to="/recycler" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Recycle size={20} /> Recycler Connect
        </NavLink>
        <NavLink to="/impact" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <BarChart3 size={20} /> Impact Report
        </NavLink>
      </nav>
    </aside>
  );
}
