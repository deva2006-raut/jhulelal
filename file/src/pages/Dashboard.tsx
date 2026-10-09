import React from 'react';
import { useAppStore } from '../store';
import { AlertTriangle, MapPin, Recycle, Weight } from 'lucide-react';

export default function Dashboard() {
  const { events, alerts, markAlertRead } = useAppStore();

  const totalDetectedKg = events.reduce((sum, e) => sum + e.totalEstimatedWeightKg, 0);
  const totalRecycledKg = events.filter(e => e.collectionStatus === 'Recycled').reduce((sum, e) => sum + e.totalEstimatedWeightKg, 0);
  const activeHotspots = events.filter(e => e.collectionStatus !== 'Recycled').length;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Platform Overview</h1>
        <p className="page-description">Real-time summary of coastal plastic pollution and management.</p>
      </div>

      <div className="grid-cols-3">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--color-teal-50)', borderRadius: 'var(--radius-md)', color: 'var(--color-teal-600)' }}>
              <Weight size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Total Detected</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totalDetectedKg.toFixed(1)} kg</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--color-coral-light)', borderRadius: 'var(--radius-md)', color: 'var(--color-coral)' }}>
              <MapPin size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Active Hotspots</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{activeHotspots}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#dcfce7', borderRadius: 'var(--radius-md)', color: '#16a34a' }}>
              <Recycle size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Successfully Recycled</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totalRecycledKg.toFixed(1)} kg</div>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.25rem' }}>Smart Alerts</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {alerts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No active alerts at the moment.
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', borderLeft: !alert.isRead ? '4px solid var(--color-coral)' : 'none' }}>
              <AlertTriangle color={alert.type === 'Risk' ? 'var(--color-coral)' : 'var(--color-teal-500)'} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{alert.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{alert.description}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                  {new Date(alert.timestamp).toLocaleString()}
                </div>
              </div>
              {!alert.isRead && (
                <button className="btn btn-outline" onClick={() => markAlertRead(alert.id)}>Mark Read</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
