import React from 'react';
import { Lightbulb, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SmartAdvisory() {
  const advisories = [
    {
      id: 1,
      observation: 'An uploaded image (South Slope) contains possible citrus canker symptoms.',
      source: 'Automated Image Analysis',
      nextStep: 'Isolate the affected area immediately and consult an agronomist before applying bactericides.',
      urgency: 'High',
      date: 'Today',
      verified: false
    },
    {
      id: 2,
      observation: 'A weather forecast suggests 30% chance of rain with high temperatures.',
      source: 'Live Weather System',
      nextStep: 'Review irrigation plans to avoid over-watering and inspect soil moisture.',
      urgency: 'Medium',
      date: 'Today',
      verified: true
    },
    {
      id: 3,
      observation: 'Nagpur North Zone has not been formally inspected in over 30 days.',
      source: 'System Monitor',
      nextStep: 'Schedule an Orchard Inspection task for this zone this week.',
      urgency: 'Low',
      date: 'Yesterday',
      verified: true
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-forest-900/10 shadow-sm bg-forest-950">
        <img
          src="/images/orange-tree.jpg"
          alt="Orange tree laden with ripe fruit"
          className="absolute inset-0 h-full w-full object-cover object-right opacity-45"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/85 to-forest-950/30" />
        <div className="relative p-6 md:p-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Smart Farming Advisory</h1>
          <p className="text-forest-100/90 mt-1 text-lg">
            Combined insights from weather, image analysis, and orchard observations.
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex gap-4 text-yellow-900">
        <Info className="w-8 h-8 shrink-0 text-yellow-600 mt-1" />
        <div>
          <h3 className="text-lg font-bold mb-2">Decision Support Disclaimer</h3>
          <p className="text-sm font-medium leading-relaxed">
            These are cautious decision-support suggestions based on system data, not automatic instructions. The system does not automatically trigger spraying or irrigation. Automated findings that lack expert verification should be treated as preliminary guidance.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {advisories.map(advisory => (
          <div key={advisory.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border
                  ${advisory.urgency === 'High' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                  ${advisory.urgency === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                  ${advisory.urgency === 'Low' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                `}>
                  {advisory.urgency} Urgency
                </span>
                <span className="text-sm font-medium text-gray-500">{advisory.date}</span>
                {advisory.verified ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-200 ml-auto">
                    <ShieldCheck className="w-4 h-4" /> System Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-orange-700 bg-orange-50 px-2 py-1 rounded-md border border-orange-200 ml-auto">
                    <AlertTriangle className="w-4 h-4" /> Unverified Finding
                  </span>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Observation</h4>
                <p className="text-lg font-bold text-forest-950">{advisory.observation}</p>
                <p className="text-sm text-gray-500 font-medium mt-1">Source: {advisory.source}</p>
              </div>
              
              <div className="bg-forest-50 p-4 rounded-xl border border-forest-100">
                <h4 className="text-xs font-bold text-forest-700 uppercase tracking-wider mb-1">Suggested Next Step</h4>
                <p className="text-forest-900 font-medium">{advisory.nextStep}</p>
              </div>
            </div>
            
            <div className="shrink-0 flex md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 w-full md:w-48">
              <button className="flex-1 md:flex-none px-4 py-2 bg-forest-900 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-forest-800 transition-colors">
                Create Task
              </button>
              <button className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
