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

  // Fix leaflet default icon issue
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
    
    const popupContent = `
      <div class="text-sm font-sans p-2">
        <h3 class="font-bold text-base">${title}</h3>
        <p class="text-xs text-gray-600">${dept}</p>
        <p class="text-xs mt-1">${start} to ${end}</p>
        <p class="text-xs">₹${(cost / 1000000).toFixed(1)}L</p>
        <p class="mt-1"><span class="text-xs px-2 py-1 rounded ${
          risk === 'HIGH' ? 'bg-red-200 text-red-800' :
          risk === 'MEDIUM' ? 'bg-yellow-200 text-yellow-800' :
          'bg-green-200 text-green-800'
        }">${risk}</span></p>
        ${clash_with ? `<p class="mt-2 text-xs text-red-600 font-semibold">⚠️ CLASH with ${clash_with}</p>` : '<p class="mt-2 text-xs text-green-600">✅ No conflicts</p>'}
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

  // Calculate clash summary
  const clashCount = (mockProjects as any).features.filter(
    (f: any) => f.properties.clash_with !== null
  ).length;
  
  const totalWaste = (mockProjects as any).features
    .filter((f: any) => f.properties.clash_with !== null)
    .reduce((sum: number, f: any) => sum + (f.properties.cost * 0.2), 0);

  return (
    <div className="w-full h-screen flex bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900">
      {/* Left Panel - Project List */}
      <div className="w-80 bg-black/40 backdrop-blur-xl border-r border-white/10 overflow-y-auto hidden lg:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Active Projects</h2>
          <div className="space-y-2">
            {Object.entries(deptColors).map(([dept, color]) => (
              <label key={dept} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={visibleDepts.has(dept)}
                  onChange={() => handleDeptToggle(dept)}
                  className="w-4 h-4 rounded"
                />
                <div
                  className="w-4 h-1 rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-sm text-gray-200 group-hover:text-white transition">
                  {dept}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex-1 p-6 space-y-4">
          {(mockProjects as any).features
            .filter((f: any) => visibleDepts.has(f.properties.dept))
            .map((feature: any) => (
              <div
                key={feature.properties.id}
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                <p className="font-semibold text-sm text-white">{feature.properties.title}</p>
                <div className="mt-2 space-y-1 text-xs text-gray-300">
                  <p className="flex items-center space-x-2">
                    <span
                      className="w-3 h-1 rounded-full"
                      style={{ backgroundColor: deptColors[feature.properties.dept] }}
                    ></span>
                    <span>{feature.properties.dept}</span>
                  </p>
                  <p>₹{(feature.properties.cost / 1000000).toFixed(1)}L</p>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      feature.properties.risk === 'HIGH'
                        ? 'bg-red-500/20 text-red-300'
                        : feature.properties.risk === 'MEDIUM'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-green-500/20 text-green-300'
                    }`}
                  >
                    {feature.properties.risk}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer
          center={[26.2298, 78.1734]}
          zoom={13}
          minZoom={12}
          maxZoom={17}
          maxBounds={[[26.18, 78.1], [26.28, 78.24]]}
          maxBoundsViscosity={1.0}
          className="w-full h-full"
          style={{ background: '#0f172a' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* Gwalior Boundary Overlay */}
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

          {/* Project Layers */}
          {filteredFeatures.map((feature: any, idx: number) => (
            <LayerGroup key={idx}>
              <GeoJSON
                data={feature}
                style={style}
                onEachFeature={onEachFeature}
              />
              
              {/* High Risk Pulsing Circle */}
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

        {/* Right Panel - Clash Summary */}
        <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-80 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-4">Conflict Summary</h3>
          
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-sm text-gray-300">Active Clashes</p>
              <p className="text-2xl font-bold text-red-400">{clashCount}</p>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
              <p className="text-sm text-gray-300">Total Waste Risk</p>
              <p className="text-2xl font-bold text-orange-400">
                ₹{(totalWaste / 10000000).toFixed(1)}Cr
              </p>
            </div>

            <button
              onClick={() => {
                const report = `
Karana Platform - Conflict Report
Date: ${new Date().toLocaleDateString()}

Active Clashes: ${clashCount}
Total Financial Risk: ₹${(totalWaste / 10000000).toFixed(1)} Crore

Clashing Projects:
${(mockProjects as any).features
  .filter((f: any) => f.properties.clash_with !== null)
  .map(
    (f: any) =>
      `- ${f.properties.dept}: ${f.properties.title} (₹${(f.properties.cost / 1000000).toFixed(1)}L)`
  )
  .join('\n')}
                `;
                
                const blob = new Blob([report], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'karana-conflict-report.txt';
                a.click();
              }}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 rounded-lg transition text-sm"
            >
              📄 Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
