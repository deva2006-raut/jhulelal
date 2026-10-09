import React from 'react';
import { useAppStore } from '../store';
import { Leaf, Droplets, Wind } from 'lucide-react';

export default function Impact() {
  const { events } = useAppStore();

  const totalDetectedKg = events.reduce((sum, e) => sum + e.totalEstimatedWeightKg, 0);
  const totalCollectedKg = events.filter(e => !['Detected', 'Priority Assigned', 'Collection Assigned', 'In Progress'].includes(e.collectionStatus)).reduce((sum, e) => sum + e.totalEstimatedWeightKg, 0);
  const totalRecycledKg = events.filter(e => e.collectionStatus === 'Recycled').reduce((sum, e) => sum + e.totalEstimatedWeightKg, 0);

  const collectionEfficiency = totalDetectedKg > 0 ? (totalCollectedKg / totalDetectedKg) * 100 : 0;
  const recyclingRate = totalCollectedKg > 0 ? (totalRecycledKg / totalCollectedKg) * 100 : 0;
  const co2AvoidedKg = totalRecycledKg * 1.5; // simple prototype heuristic: 1.5kg CO2 per 1kg plastic

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Environmental Impact Report</h1>
        <p className="page-description">Track the real-world impact of the AquaClean AI platform.</p>
      </div>

      <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ background: 'var(--color-teal-900)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Droplets size={24} color="var(--color-teal-500)" />
            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Collection Efficiency</div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{collectionEfficiency.toFixed(1)}%</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.5rem' }}>{totalCollectedKg.toFixed(1)}kg collected / {totalDetectedKg.toFixed(1)}kg detected</div>
        </div>

        <div className="card" style={{ background: 'var(--color-teal-800)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Leaf size={24} color="var(--color-teal-500)" />
            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Recycling Rate</div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{recyclingRate.toFixed(1)}%</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.5rem' }}>{totalRecycledKg.toFixed(1)}kg recycled / {totalCollectedKg.toFixed(1)}kg collected</div>
        </div>

        <div className="card" style={{ background: '#0ea5e9', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Wind size={24} color="#e0f2fe" />
            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Est. CO₂ Avoided</div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{co2AvoidedKg.toFixed(1)} kg</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.5rem' }}>Based on recycled plastic mass</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Data Transparency (Prototype Notice)</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
          The metrics displayed above represent a live aggregation of data processed by the AquaClean AI platform. 
          Note that weight calculations and CO₂ conversion factors are estimates meant for the InnovateX Hackathon demonstration.
        </p>
      </div>
    </div>
  );
}
