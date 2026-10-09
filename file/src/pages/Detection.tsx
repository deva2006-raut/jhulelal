import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Upload, Loader2, CheckCircle } from 'lucide-react';
import type { PlasticItem, RiskLevel } from '../types';

export default function Detection() {
  const addEvent = useAppStore(state => state.addEvent);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const simulateDetection = () => {
    setIsProcessing(true);
    setLastResult(null);

    // Simulate AI processing delay
    setTimeout(() => {
      // Generate random detection data
      const items: PlasticItem[] = [
        { category: 'PET Bottle', confidence: 0.92, count: Math.floor(Math.random() * 15) + 1, estimatedWeightKg: Math.random() * 2 },
        { category: 'Plastic Bag', confidence: 0.88, count: Math.floor(Math.random() * 20) + 1, estimatedWeightKg: Math.random() * 1.5 }
      ];
      
      const totalEstimatedWeightKg = items.reduce((sum, item) => sum + item.estimatedWeightKg, 0);
      
      let riskLevel: RiskLevel = 'Low';
      if (totalEstimatedWeightKg > 3) riskLevel = 'Medium';
      if (totalEstimatedWeightKg > 5) riskLevel = 'High';
      if (totalEstimatedWeightKg > 8) riskLevel = 'Critical';

      // Mumbai coast random coordinates
      const lat = 18.9 + Math.random() * 0.2;
      const lng = 72.8 + Math.random() * 0.1;

      addEvent({
        items,
        totalEstimatedWeightKg,
        location: { lat, lng, address: `Coastal Zone (${lat.toFixed(4)}, ${lng.toFixed(4)})` },
        riskLevel,
        riskReason: `Accumulation of ${totalEstimatedWeightKg.toFixed(1)}kg plastic waste near drainage outfall. Simulated rainfall adds overflow risk.`,
        recommendedAction: 'Immediate collection recommended before high tide.',
        collectionStatus: 'Detected'
      });

      setIsProcessing(false);
      setLastResult('Detection complete! View Hotspot Map or Dashboard for updates.');
    }, 2000);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">AI Plastic Detection</h1>
        <p className="page-description">Upload images from coastal areas to detect and classify plastic waste.</p>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--color-teal-50)', borderRadius: '50%', color: 'var(--color-teal-600)', marginBottom: '1rem' }}>
            <Upload size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Upload Drone or CCTV Image</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>JPEG, PNG up to 10MB</p>
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
          onClick={simulateDetection}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <><Loader2 className="animate-spin" size={20} /> Processing Image (Prototype Analysis)...</>
          ) : (
            'Run AI Analysis'
          )}
        </button>

        {lastResult && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#dcfce7', color: '#16a34a', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <CheckCircle size={20} />
            {lastResult}
          </div>
        )}

        <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          * Results labeled "Prototype / Demonstration Analysis" use simulated ML outputs for InnovateX Hackathon demonstration purposes.
        </div>
      </div>
    </div>
  );
}
