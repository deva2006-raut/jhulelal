export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type PlasticCategory = 'PET Bottle' | 'HDPE Container' | 'Plastic Bag' | 'Wrapper' | 'Foam' | 'Other';
export type CollectionStatus = 'Detected' | 'Priority Assigned' | 'Collection Assigned' | 'In Progress' | 'Collected' | 'Sent for Sorting' | 'Sent to Recycler' | 'Recycled';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface PlasticItem {
  category: PlasticCategory;
  confidence: number;
  count: number;
  estimatedWeightKg: number;
}

export interface PollutionEvent {
  id: string;
  timestamp: string;
  imageBlobUrl?: string; // prototype preview
  items: PlasticItem[];
  totalEstimatedWeightKg: number;
  location: Location;
  riskLevel: RiskLevel;
  riskReason: string;
  recommendedAction: string;
  collectionStatus: CollectionStatus;
  recyclerAssigned?: string;
}

export interface RecyclerFacility {
  id: string;
  name: string;
  location: Location;
  acceptedCategories: PlasticCategory[];
  capacityKg: number;
}

export interface SmartAlert {
  id: string;
  eventId: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'Risk' | 'Collection' | 'Recycling';
  isRead: boolean;
}
