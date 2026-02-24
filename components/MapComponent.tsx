'use client';

import mockProjects from '@/data/mockProjects.json';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { Circle, GeoJSON, LayerGroup, MapContainer, TileLayer } from 'react-leaflet';

const deptColors: Record<string, string> = {
  PWD: '#EF4444',
  WATER: '#3B82F6',
  BESCOM: '#F59E0B',
  MUNICIPAL: '#8B5CF6',
  TELECOM: '#10B981',
};

export default function MapComponent() {
  const [visibleDepts, setVisibleDepts] = useState<Set<string>>(
    new Set(Object.keys(deptColors))
  );

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }, []);

  const onEachFeature = (feature: any, layer: any) => {
    const { title, dept, start, end, cost, risk, clash_with } = feature.properties;

    const riskBg = risk === 'HIGH' ? 'background:#fca5a5;color:#991b1b' :
                   risk === 'MEDIUM' ? 'background:#fde68a;color:#92400e' :
                   'background:#bbf7d0;color:#166534';

    const clashHtml = clash_with
      ? `<p style="margin-top:8px;font-size:12px;color:#f87171;font-weight:600">CLASH with ${clash_with}</p>`
      : `<p style="margin-top:8px;font-size:12px;color:#4ade80">No conflicts</p>`;

    const popupContent = `
      <div style="font-family:system-ui,sans-serif;padding:4px">
        <h3 style="font-weight:700;font-size:14px;margin:0">${title}</h3>
        <p style="font-size:11px;color:#9ca3af;margin:2px 0">${dept}</p>
        <p style="font-size:11px;margin:2px 0">${start} to ${end}</p>
        <p style="font-size:11px;margin:2px 0">Cost: ₹${(cost / 1000000).toFixed(1)}L</p>
        <span style="display:inline-block;font-size:11px;padding:2px 8px;border-radius:4px;${riskBg}">${risk}</span>
        ${clashHtml}
      </div>
    `;

    layer.bindPopup(popupContent);
  };

  const style = (feature: any): any => {
    const dept = feature.properties.dept;
    const isVisible = visibleDepts.has(dept);

    return {
      color: deptColors[dept] || '#666',
      weight: 4,
      opacity: isVisible ? 0.9 : 0,
      dashArray: '5, 5',
      lineCap: 'round' as const,
      lineJoin: 'round' as const,
    };
  };

  const filteredFeatures = (mockProjects as any).features.filter(
    (feature: any) => visibleDepts.has(feature.properties.dept)
  );

  const handleDeptToggle = (dept: string) => {
    const newSet = new Set(visibleDepts);
    if (newSet.has(dept)) {
      newSet.delete(dept);
    } else {
      newSet.add(dept);
    }
    setVisibleDepts(newSet);
  };

  const clashCount = (mockProjects as any).features.filter(
    (f: any) => f.properties.clash_with !== null
  ).length;

  const totalWaste = (mockProjects as any).features
    .filter((f: any) => f.properties.clash_with !== null)
    .reduce((sum: number, f: any) => sum + (f.properties.cost * 0.2), 0);

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Left Panel */}
      <aside className="hidden w-80 flex-col overflow-y-auto border-r border-border bg-card lg:flex">
        <div className="border-b border-border p-6">
          <h2 className="text-lg font-semibold">Active Projects</h2>
          <div className="mt-4 space-y-2">
            {Object.entries(deptColors).map(([dept, color]) => (
              <label key={dept} className="flex cursor-pointer items-center gap-3 group">
                <input
                  type="checkbox"
                  checked={visibleDepts.has(dept)}
                  onChange={() => handleDeptToggle(dept)}
                  className="h-4 w-4 rounded border-border"
                />
                <span
                  className="h-1 w-4 rounded-full"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {dept}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-3 p-6">
          {(mockProjects as any).features
            .filter((f: any) => visibleDepts.has(f.properties.dept))
            .map((feature: any) => (
              <div
                key={feature.properties.id}
                className="rounded-lg border border-border bg-muted/40 p-3 hover:bg-muted/60 transition-colors"
              >
                <p className="text-sm font-medium">{feature.properties.title}</p>
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span
                      className="h-1 w-3 rounded-full"
                      style={{ backgroundColor: deptColors[feature.properties.dept] }}
                      aria-hidden="true"
                    />
                    <span>{feature.properties.dept}</span>
                  </p>
                  <p>₹{(feature.properties.cost / 1000000).toFixed(1)}L</p>
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${
                      feature.properties.risk === 'HIGH'
                        ? 'bg-destructive/10 text-red-700'
                        : feature.properties.risk === 'MEDIUM'
                        ? 'bg-yellow-500/10 text-yellow-700'
                        : 'bg-emerald-500/10 text-emerald-700'
                    }`}
                  >
                    {feature.properties.risk}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </aside>

      {/* Map */}
      <div className="relative flex-1">
        <MapContainer
          center={[26.2298, 78.1734]}
          zoom={13}
          minZoom={12}
          maxZoom={17}
          maxBounds={[[26.18, 78.1], [26.28, 78.24]]}
          maxBoundsViscosity={1.0}
          className="h-full w-full"
          style={{ background: '#f8fafc' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          <LayerGroup>
            <Circle
              center={[26.2298, 78.1734]}
              radius={6000}
              pathOptions={{
                color: '#1e3a8a',
                fill: true,
                fillOpacity: 0.04,
                weight: 2,
                dashArray: '5, 5',
              }}
            />
          </LayerGroup>

          {filteredFeatures.map((feature: any, idx: number) => (
            <LayerGroup key={idx}>
              <GeoJSON
                data={feature}
                style={style}
                onEachFeature={onEachFeature}
              />
              {feature.properties.risk === 'HIGH' && (
                <Circle
                  center={[
                    (feature.geometry.coordinates[0][1] + feature.geometry.coordinates[1][1]) / 2,
                    (feature.geometry.coordinates[0][0] + feature.geometry.coordinates[1][0]) / 2,
                  ]}
                  radius={300}
                  pathOptions={{
                    color: '#EF4444',
                    fill: true,
                    fillOpacity: 0.15,
                    weight: 1,
                  }}
                />
              )}
            </LayerGroup>
          ))}
        </MapContainer>

        {/* Clash Summary Panel */}
        <div className="absolute right-6 top-6 w-72 rounded-xl border border-border bg-card/90 p-5 shadow-xl backdrop-blur-lg">
          <h3 className="text-sm font-semibold">Conflict Summary</h3>

          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
              <p className="text-xs text-muted-foreground">Active Clashes</p>
              <p className="text-xl font-bold text-red-600">{clashCount}</p>
            </div>

            <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-3">
              <p className="text-xs text-muted-foreground">Total Waste Risk</p>
              <p className="text-xl font-bold text-orange-600">
                ₹{(totalWaste / 10000000).toFixed(1)}Cr
              </p>
            </div>

            <button
              onClick={() => {
                const report = `Karana Platform - Conflict Report\nDate: ${new Date().toLocaleDateString()}\n\nActive Clashes: ${clashCount}\nTotal Financial Risk: ₹${(totalWaste / 10000000).toFixed(1)} Crore\n\nClashing Projects:\n${(mockProjects as any).features
                  .filter((f: any) => f.properties.clash_with !== null)
                  .map(
                    (f: any) =>
                      `- ${f.properties.dept}: ${f.properties.title} (₹${(f.properties.cost / 1000000).toFixed(1)}L)`
                  )
                  .join('\n')}`;

                const blob = new Blob([report], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'karana-conflict-report.txt';
                a.click();
              }}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
