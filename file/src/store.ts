import { create } from 'zustand';
import type { PollutionEvent, SmartAlert, RecyclerFacility, CollectionStatus } from './types';

interface AppState {
  events: PollutionEvent[];
  alerts: SmartAlert[];
  recyclers: RecyclerFacility[];
  
  // Actions
  addEvent: (event: Omit<PollutionEvent, 'id' | 'timestamp'>) => void;
  updateEventStatus: (id: string, status: CollectionStatus) => void;
  assignRecycler: (eventId: string, recyclerId: string) => void;
  markAlertRead: (alertId: string) => void;
}

// Sample recyclers directory
const sampleRecyclers: RecyclerFacility[] = [
  { id: 'r1', name: 'Coastal Plastics Recovery', location: { lat: 19.0760, lng: 72.8777, address: 'Mumbai Coast' }, acceptedCategories: ['PET Bottle', 'HDPE Container'], capacityKg: 5000 },
  { id: 'r2', name: 'EcoPoly Processing', location: { lat: 19.1000, lng: 72.8500, address: 'Suburban Hub' }, acceptedCategories: ['Plastic Bag', 'Wrapper', 'Foam'], capacityKg: 2000 },
];

export const useAppStore = create<AppState>((set) => ({
  events: [],
  alerts: [],
  recyclers: sampleRecyclers,

  addEvent: (eventData) => set((state) => {
    const newEvent: PollutionEvent = {
      ...eventData,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
    };

    const newAlerts = [...state.alerts];
    
    // Auto-generate alerts based on risk level
    if (newEvent.riskLevel === 'High' || newEvent.riskLevel === 'Critical') {
      newAlerts.push({
        id: Math.random().toString(36).substring(7),
        eventId: newEvent.id,
        timestamp: new Date().toISOString(),
        title: `${newEvent.riskLevel} Risk Detected`,
        description: `New pollution hotspot identified at ${newEvent.location.address}. Reason: ${newEvent.riskReason}`,
        type: 'Risk',
        isRead: false
      });
    }

    return {
      events: [...state.events, newEvent],
      alerts: newAlerts
    };
  }),

  updateEventStatus: (id, status) => set((state) => {
    const events = state.events.map(e => e.id === id ? { ...e, collectionStatus: status } : e);
    const newAlerts = [...state.alerts];

    // Generate alerts for workflow milestones
    if (status === 'Sent to Recycler') {
      newAlerts.push({
        id: Math.random().toString(36).substring(7),
        eventId: id,
        timestamp: new Date().toISOString(),
        title: `Waste Sent to Recycler`,
        description: `Waste from event ${id} is en route to recycling.`,
        type: 'Recycling',
        isRead: false
      });
    }

    return { events, alerts: newAlerts };
  }),

  assignRecycler: (eventId, recyclerId) => set((state) => {
    return {
      events: state.events.map(e => e.id === eventId ? { ...e, recyclerAssigned: recyclerId } : e)
    };
  }),

  markAlertRead: (alertId) => set((state) => ({
    alerts: state.alerts.map(a => a.id === alertId ? { ...a, isRead: true } : a)
  }))
}));
