import React from 'react';
import { useAppStore } from '../store';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'Critical': return '#f43f5e';
    case 'High': return '#d97706';
    case 'Medium': return '#0ea5e9';
    default: return '#10b981';
  }
};

const createCustomIcon = (risk: string) => {
  const color = getRiskColor(risk);
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export default function Hotspots() {
  const { events } = useAppStore();
  const activeEvents = events.filter(e => e.collectionStatus !== 'Recycled');

  // Center on Mumbai coast
  const center: [number, number] = [19.0760, 72.8777];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Pollution Hotspot Map</h1>
        <p className="page-description">Live view of active coastal plastic pollution events and risk levels.</p>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="map-container">
          <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {activeEvents.map(event => (
              <Marker 
                key={event.id} 
                position={[event.location.lat, event.location.lng]}
                icon={createCustomIcon(event.riskLevel)}
              >
                <Popup>
                  <div style={{ padding: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{event.riskLevel} Risk Hotspot</h3>
                    <p style={{ margin: 0, fontSize: '0.875rem' }}><strong>Waste Detected:</strong> {event.totalEstimatedWeightKg.toFixed(1)} kg</p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}><strong>Status:</strong> {event.collectionStatus}</p>
                    <hr style={{ margin: '0.5rem 0', borderTop: '1px solid #eee' }} />
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>{event.riskReason}</p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', fontWeight: 500, color: '#0ea5e9' }}>Action: {event.recommendedAction}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
