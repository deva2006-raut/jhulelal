import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Detection from './pages/Detection';
import Hotspots from './pages/Hotspots';
import Collection from './pages/Collection';
import Recycler from './pages/Recycler';
import Impact from './pages/Impact';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/detect" element={<Detection />} />
            <Route path="/hotspots" element={<Hotspots />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/recycler" element={<Recycler />} />
            <Route path="/impact" element={<Impact />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
