import React from 'react';
import { useAppStore } from '../store';
import { ArrowRight, CheckCircle2, Truck } from 'lucide-react';
import type { CollectionStatus } from '../types';

const STATUS_FLOW: CollectionStatus[] = [
  'Detected',
  'Priority Assigned',
  'Collection Assigned',
  'In Progress',
  'Collected',
  'Sent for Sorting',
  'Sent to Recycler',
  'Recycled'
];

export default function Collection() {
  const { events, updateEventStatus } = useAppStore();
  const activeEvents = events.filter(e => e.collectionStatus !== 'Recycled').sort((a, b) => b.totalEstimatedWeightKg - a.totalEstimatedWeightKg);

  const handleNextStatus = (id: string, currentStatus: CollectionStatus) => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    if (currentIndex < STATUS_FLOW.length - 1) {
      updateEventStatus(id, STATUS_FLOW[currentIndex + 1]);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Collection Workflow & Routes</h1>
        <p className="page-description">Manage active pollution events and optimize collection routes.</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Truck /> Smart Collection Route (Suggested)
        </h2>
        {activeEvents.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>No active collections pending.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeEvents.map((event, index) => (
              <div key={event.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--color-sand-100)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-teal-600)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{event.location.address}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{event.totalEstimatedWeightKg.toFixed(1)} kg • {event.riskLevel} Risk</div>
                </div>
                <div>
                  <span className={`badge badge-${event.riskLevel.toLowerCase()}`} style={{ marginRight: '1rem' }}>{event.collectionStatus}</span>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleNextStatus(event.id, event.collectionStatus)}
                  >
                    Advance Status <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
