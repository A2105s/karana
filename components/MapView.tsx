'use client';

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">Loading Gwalior Map...</p>
      </div>
    </div>
  ),
});

export default function MapView() {
  return <MapComponent />;
}
