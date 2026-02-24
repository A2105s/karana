'use client';

import dynamic from 'next/dynamic';

// Dynamically import Leaflet to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Loading Gwalior Map...</p>
      </div>
    </div>
  ),
});

export default function MapView() {
  return <MapComponent />;
}
