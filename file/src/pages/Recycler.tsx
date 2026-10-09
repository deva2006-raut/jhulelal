import React from 'react';
import { useAppStore } from '../store';
import { Recycle, CheckCircle } from 'lucide-react';

export default function Recycler() {
  const { events, recyclers, assignRecycler } = useAppStore();
  
  // Show events that are ready for recycling (Collected, Sent for Sorting, Sent to Recycler) but not yet Recycled
  const pendingEvents = events.filter(e => 
    ['Collected', 'Sent for Sorting', 'Sent to Recycler'].includes(e.collectionStatus)
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Recycler Connect</h1>
        <p className="page-description">Match collected coastal plastic to appropriate recycling facilities.</p>
      </div>

      <div className="grid-cols-2">
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Pending Assignments</h2>
          {pendingEvents.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No collected waste pending recycler assignment.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingEvents.map(event => (
                <div key={event.id} style={{ padding: '1rem', border: '1px solid var(--color-sand-100)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Waste Batch {event.id.toUpperCase()}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                    {event.totalEstimatedWeightKg.toFixed(1)} kg • Current Status: {event.collectionStatus}
                  </div>
                  
                  {event.recyclerAssigned ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-teal-600)', fontSize: '0.875rem', fontWeight: 500 }}>
                      <CheckCircle size={16} /> Assigned to: {recyclers.find(r => r.id === event.recyclerAssigned)?.name}
                    </div>
                  ) : (
                    <div style={{ marginTop: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Assign Facility:</label>
                      <select 
                        className="form-control"
                        onChange={(e) => assignRecycler(event.id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Select a facility...</option>
                        {recyclers.map(r => (
                          <option key={r.id} value={r.id}>{r.name} ({r.capacityKg}kg capacity)</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Facility Directory</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recyclers.map(recycler => (
              <div key={recycler.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', background: 'var(--color-sand-50)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ padding: '0.75rem', background: 'white', borderRadius: '50%', color: 'var(--color-teal-600)' }}>
                  <Recycle size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{recycler.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{recycler.location.address}</div>
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                    {recycler.acceptedCategories.map(cat => (
                      <span key={cat} className="badge" style={{ background: '#e0f2fe', color: '#0284c7' }}>{cat}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
