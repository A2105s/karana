'use client';

import mockProjectsData from '@/data/mockProjects.json';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Circle,
    GeoJSON,
    LayerGroup,
    MapContainer,
    TileLayer,
    useMap,
} from 'react-leaflet';
import SaveProjectModal, { type ProjectForm } from './SaveProjectModal';

// â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const DEPT_COLORS: Record<string, string> = {
  PWD: '#EF4444',
  WATER: '#3B82F6',
  BESCOM: '#F59E0B',
  MUNICIPAL: '#8B5CF6',
  TELECOM: '#10B981',
};

type TileType = 'street' | 'satellite' | 'hybrid';

const TILE_CONFIG: Record<
  TileType,
  { url: string; attribution: string; maxZoom: number; label: string; icon: string }
> = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    label: 'Street',
    icon: 'ðŸ—ºï¸',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics',
    maxZoom: 19,
    label: 'Satellite',
    icon: 'ðŸ›°ï¸',
  },
  hybrid: {
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps',
    maxZoom: 20,
    label: 'Hybrid',
    icon: 'ðŸŒ',
  },
};

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface GeoJsonFeature {
  type: 'Feature';
  properties: {
    id: number;
    dept: string;
    title: string;
    start: string;
    end: string;
    cost: number;
    risk: string;
    clash_with: string | null;
    description?: string;
  };
  geometry: {
    type: string;
    coordinates: number[][] | number[];
  };
}

interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning';
  message: string;
}

// â”€â”€â”€ Draw Control (inner component â€” needs useMap) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface DrawControlProps {
  onDrawCreated: (geojson: GeoJSON.Feature) => void;
}

function DrawControl({ onDrawCreated }: DrawControlProps) {
  const map = useMap();
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const controlRef = useRef<any>(null);

  useEffect(() => {
    // Fix Leaflet default icon
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    // Dynamically load leaflet-draw only on client
    import('leaflet-draw').then(() => {
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      drawnItemsRef.current = drawnItems;

      const drawControl = new (L as any).Control.Draw({
        position: 'topleft',
        draw: {
          polyline: {
            shapeOptions: { color: '#1E3A8A', weight: 5 },
            metric: true,
          },
          polygon: false,
          circle: false,
          marker: true,
          rectangle: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: drawnItems,
          remove: true,
        },
      });

      map.addControl(drawControl);
      controlRef.current = drawControl;

      const handleCreated = (e: any) => {
        const layer = e.layer;
        drawnItems.addLayer(layer);
        onDrawCreated(layer.toGeoJSON() as GeoJSON.Feature);
      };

      map.on((L as any).Draw.Event.CREATED, handleCreated);

      return () => {
        map.off((L as any).Draw.Event.CREATED, handleCreated);
        if (controlRef.current) map.removeControl(controlRef.current);
        if (drawnItemsRef.current) map.removeLayer(drawnItemsRef.current);
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
}

// â”€â”€â”€ KML Control (inner component â€” needs useMap) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface KMLControlProps {
  onImport: (count: number, filename: string) => void;
  onError: (msg: string) => void;
}

function KMLControl({ onImport, onError }: KMLControlProps) {
  const map = useMap();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleKMLImport = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const kmlText = event.target?.result as string;
        try {
          const omnivore = await import('leaflet-omnivore').then((m) => m.default ?? m) as any;
          const kmlLayer: L.GeoJSON = omnivore.kml.parse(kmlText);

          let featureCount = 0;
          kmlLayer.eachLayer((layer: any) => {
            featureCount++;
            if (layer.setStyle) {
              layer.setStyle({ color: '#F59E0B', weight: 4, dashArray: '8, 4', opacity: 0.9 });
            }
            const props = layer.feature?.properties;
            const name = props?.name || 'KML Feature';
            // Strip HTML tags from description to prevent XSS
            const desc = props?.description
              ? String(props.description).replace(/<[^>]*>/g, '').slice(0, 120)
              : 'Google Earth imported layer';
            layer.bindPopup(
              `<div class="text-sm font-sans p-1">
                <b>ðŸ“‚ ${name}</b><br/>
                <span class="text-gray-600 text-xs">${desc}</span><br/>
                <span class="text-amber-600 font-semibold text-xs">âš ï¸ Run clash check to validate</span>
              </div>`
            );
          });

          kmlLayer.addTo(map);

          try {
            const bounds = (kmlLayer as any).getBounds?.();
            if (bounds && bounds.isValid()) map.fitBounds(bounds, { maxZoom: 15 });
          } catch { /* bounds may be invalid for empty KML */ }

          onImport(featureCount, file.name);
        } catch (err) {
          console.error('KML parse error:', err);
          onError('Failed to parse KML file. Ensure it is a valid .kml (not .kmz).');
        }
      };

      reader.onerror = () => onError('Could not read the file. Please try again.');
      reader.readAsText(file);
      if (fileRef.current) fileRef.current.value = '';
    },
    [map, onImport, onError]
  );

  return (
    <div className="absolute bottom-6 left-4 z-[1000]">
      <label
        htmlFor="kml-upload"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
        className="cursor-pointer bg-slate-900/80 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/20 transition-all flex items-center gap-2 shadow-lg select-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Import KML file from Google Earth"
      >
        ðŸ“‚ Import KML
        <input
          ref={fileRef}
          id="kml-upload"
          type="file"
          accept=".kml"
          className="hidden"
          onChange={handleKMLImport}
          aria-label="KML file input"
        />
      </label>
    </div>
  );
}

// â”€â”€â”€ Toast Notification â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  if (!toasts.length) return null;
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="absolute top-20 left-1/2 -translate-x-1/2 z-[9998] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-xl backdrop-blur-xl border pointer-events-auto
            ${t.type === 'success' ? 'bg-green-700/90 border-green-400/50' : ''}
            ${t.type === 'error' ? 'bg-red-700/90 border-red-400/50' : ''}
            ${t.type === 'warning' ? 'bg-amber-700/90 border-amber-400/50' : ''}
          `}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function MapComponent() {
  const initialFeatures = (mockProjectsData as any).features as GeoJsonFeature[];

  const [projectsList, setProjectsList] = useState<GeoJsonFeature[]>(initialFeatures);
  const [visibleDepts, setVisibleDepts] = useState<Set<string>>(new Set(Object.keys(DEPT_COLORS)));
  const [activeLayer, setActiveLayer] = useState<TileType>('street');
  const [drawnGeometry, setDrawnGeometry] = useState<GeoJSON.Geometry | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  // â”€â”€ Toast helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  // â”€â”€ Draw handler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleDrawCreated = useCallback((geojson: GeoJSON.Feature) => {
    setDrawnGeometry(geojson.geometry);
    setShowSaveModal(true);
  }, []);

  // â”€â”€ Save project + clash check â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSaveProject = useCallback(
    async (formData: ProjectForm) => {
      if (!drawnGeometry) return;

      const newFeature: GeoJsonFeature = {
        type: 'Feature',
        properties: {
          id: Date.now(),
          dept: formData.dept,
          title: formData.title,
          start: formData.startDate,
          end: formData.endDate,
          cost: formData.cost,
          risk: 'UNKNOWN',
          clash_with: null,
          description: formData.description,
        },
        geometry: drawnGeometry as any,
      };

      setProjectsList((prev) => [...prev, newFeature]);
      setShowSaveModal(false);
      setDrawnGeometry(null);
      addToast(`âœ… "${formData.title}" added to map`, 'success');

      try {
        const res = await fetch('/api/clashes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newProject: newFeature, existingProjects: projectsList }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.clashes && data.clashes.length > 0) {
            const clashNames = data.clashes.map((c: any) => c.dept || c.title).join(', ');
            addToast(`âš ï¸ CLASH DETECTED with: ${clashNames}`, 'warning');
            setProjectsList((prev) =>
              prev.map((f) =>
                f.properties.id === newFeature.properties.id
                  ? { ...f, properties: { ...f.properties, risk: 'HIGH', clash_with: clashNames } }
                  : f
              )
            );
          } else {
            addToast('âœ… No clashes detected â€” route is clear!', 'success');
          }
        }
      } catch {
        addToast('â„¹ï¸ Clash check skipped (API unavailable)', 'warning');
      }
    },
    [drawnGeometry, projectsList, addToast]
  );

  // â”€â”€ KML callbacks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleKMLImport = useCallback(
    (count: number, filename: string) =>
      addToast(`ðŸ“‚ KML imported: ${filename} (${count} feature${count !== 1 ? 's' : ''})`, 'success'),
    [addToast]
  );
  const handleKMLError = useCallback(
    (msg: string) => addToast(`âŒ ${msg}`, 'error'),
    [addToast]
  );

  // â”€â”€ Map styling â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const featureStyle = useCallback(
    (feature: any): L.PathOptions => ({
      color: DEPT_COLORS[feature.properties.dept] || '#666',
      weight: 4,
      opacity: 0.9,
      dashArray: '5, 5',
      lineCap: 'round',
      lineJoin: 'round',
    }),
    []
  );

  const onEachFeature = useCallback((feature: any, layer: any) => {
    const { title, dept, start, end, cost, risk, clash_with } = feature.properties;
    layer.bindPopup(
      `<div class="text-sm font-sans p-2 min-w-[160px]">
        <h3 class="font-bold text-base">${title}</h3>
        <p class="text-xs text-gray-500">${dept}</p>
        <p class="text-xs mt-1">${start} â†’ ${end}</p>
        <p class="text-xs">â‚¹${(cost / 1_000_000).toFixed(1)}L</p>
        <span class="inline-block mt-1 text-xs px-2 py-0.5 rounded font-semibold
          ${risk === 'HIGH' ? 'bg-red-200 text-red-800' : risk === 'MEDIUM' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}
        ">${risk}</span>
        ${clash_with
          ? `<p class="mt-2 text-xs text-red-600 font-semibold">âš ï¸ CLASH with ${clash_with}</p>`
          : '<p class="mt-2 text-xs text-green-600 font-semibold">âœ… No conflicts</p>'
        }
      </div>`
    );
  }, []);

  // â”€â”€ Derived values â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const filteredFeatures = projectsList.filter((f) => visibleDepts.has(f.properties.dept));
  const clashCount = projectsList.filter((f) => f.properties.clash_with).length;
  const totalWaste = projectsList
    .filter((f) => f.properties.clash_with)
    .reduce((sum, f) => sum + f.properties.cost * 0.2, 0);

  const handleDeptToggle = (dept: string) => {
    setVisibleDepts((prev) => {
      const next = new Set(prev);
      next.has(dept) ? next.delete(dept) : next.add(dept);
      return next;
    });
  };

  const activeTile = TILE_CONFIG[activeLayer];

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <>
      <div className="w-full h-screen flex bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900">

        {/* â”€â”€ Left Panel â”€â”€ */}
        <aside
          aria-label="Project list and department filters"
          className="w-80 bg-black/40 backdrop-blur-xl border-r border-white/10 overflow-y-auto hidden lg:flex flex-col"
        >
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Active Projects</h2>
            <fieldset>
              <legend className="sr-only">Filter by department</legend>
              <div className="space-y-2">
                {Object.entries(DEPT_COLORS).map(([dept, color]) => (
                  <label key={dept} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={visibleDepts.has(dept)}
                      onChange={() => handleDeptToggle(dept)}
                      aria-label={`Toggle ${dept} projects`}
                      className="w-4 h-4 rounded accent-blue-600"
                    />
                    <span
                      className="w-4 h-1 rounded-full"
                      style={{ backgroundColor: color }}
                      aria-hidden="true"
                    />
                    <span className="text-sm text-gray-200 group-hover:text-white transition">
                      {dept}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <ul className="flex-1 p-6 space-y-4" aria-label="Project cards">
            {filteredFeatures.map((feature) => (
              <li
                key={feature.properties.id}
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                <p className="font-semibold text-sm text-white">{feature.properties.title}</p>
                <div className="mt-2 space-y-1 text-xs text-gray-300">
                  <p className="flex items-center gap-2">
                    <span
                      className="w-3 h-1 rounded-full"
                      style={{ backgroundColor: DEPT_COLORS[feature.properties.dept] || '#888' }}
                      aria-hidden="true"
                    />
                    {feature.properties.dept}
                  </p>
                  <p>â‚¹{(feature.properties.cost / 1_000_000).toFixed(1)}L</p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      feature.properties.risk === 'HIGH'
                        ? 'bg-red-500/20 text-red-300'
                        : feature.properties.risk === 'MEDIUM'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : feature.properties.risk === 'UNKNOWN'
                        ? 'bg-gray-500/20 text-gray-300'
                        : 'bg-green-500/20 text-green-300'
                    }`}
                  >
                    {feature.properties.risk}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* â”€â”€ Map Area â”€â”€ */}
        <div className="flex-1 relative">
          <MapContainer
            center={[26.2298, 78.1734]}
            zoom={13}
            minZoom={12}
            maxZoom={20}
            maxBounds={[[26.18, 78.1], [26.28, 78.24]]}
            maxBoundsViscosity={1.0}
            className="w-full h-full"
            style={{ background: '#0f172a' }}
          >
            {/* Active Tile Layer â€” key forces react-leaflet to swap on change */}
            <TileLayer
              key={activeLayer}
              url={activeTile.url}
              attribution={activeTile.attribution}
              maxZoom={activeTile.maxZoom}
            />

            {/* Gwalior boundary circle */}
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

            {/* Project GeoJSON layers */}
            {filteredFeatures.map((feature) => (
              <LayerGroup key={feature.properties.id}>
                <GeoJSON
                  data={feature as any}
                  style={featureStyle}
                  onEachFeature={onEachFeature}
                />
                {feature.properties.risk === 'HIGH' &&
                  feature.geometry.type === 'LineString' &&
                  Array.isArray(feature.geometry.coordinates) &&
                  feature.geometry.coordinates.length >= 2 && (
                    <Circle
                      center={[
                        ((feature.geometry.coordinates as number[][])[0][1] +
                          (feature.geometry.coordinates as number[][])[1][1]) / 2,
                        ((feature.geometry.coordinates as number[][])[0][0] +
                          (feature.geometry.coordinates as number[][])[1][0]) / 2,
                      ]}
                      radius={300}
                      pathOptions={{ color: '#EF4444', fill: true, fillOpacity: 0.15, weight: 1 }}
                    />
                  )}
              </LayerGroup>
            ))}

            {/* Draw toolbar (inner â€” uses useMap) */}
            <DrawControl onDrawCreated={handleDrawCreated} />

            {/* KML import button (inner â€” uses useMap) */}
            <KMLControl onImport={handleKMLImport} onError={handleKMLError} />
          </MapContainer>

          {/* â”€â”€ Tile Layer Switcher â”€â”€ */}
          <div
            role="group"
            aria-label="Map layer switcher"
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-1 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-1 shadow-xl"
          >
            {(Object.keys(TILE_CONFIG) as TileType[]).map((type) => {
              const cfg = TILE_CONFIG[type];
              const isActive = activeLayer === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveLayer(type)}
                  aria-pressed={isActive}
                  aria-label={`Switch to ${cfg.label} view`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                    isActive
                      ? 'bg-blue-800 text-white shadow-md'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span aria-hidden="true">{cfg.icon}</span>
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* â”€â”€ Toast Notifications â”€â”€ */}
          <ToastContainer toasts={toasts} />

          {/* â”€â”€ Clash Summary Panel â”€â”€ */}
          <aside
            aria-label="Conflict summary"
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 w-72 shadow-2xl z-[1000]"
          >
            <h3 className="text-base font-bold text-white mb-3">Conflict Summary</h3>
            <div className="space-y-3">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-xs text-gray-300">Active Clashes</p>
                <p className="text-2xl font-bold text-red-400" aria-live="polite">{clashCount}</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                <p className="text-xs text-gray-300">Total Waste Risk</p>
                <p className="text-2xl font-bold text-orange-400" aria-live="polite">
                  â‚¹{(totalWaste / 10_000_000).toFixed(1)}Cr
                </p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-xs text-gray-300">Total Projects</p>
                <p className="text-2xl font-bold text-blue-400" aria-live="polite">
                  {projectsList.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const report = [
                    'Karana Platform â€” Conflict Report',
                    `Date: ${new Date().toLocaleDateString('en-IN')}`,
                    '',
                    `Active Clashes: ${clashCount}`,
                    `Financial Risk: â‚¹${(totalWaste / 10_000_000).toFixed(1)} Crore`,
                    `Total Projects: ${projectsList.length}`,
                    '',
                    'Clashing Projects:',
                    ...projectsList
                      .filter((f) => f.properties.clash_with)
                      .map(
                        (f) =>
                          `  - ${f.properties.dept}: ${f.properties.title} (â‚¹${(f.properties.cost / 1_000_000).toFixed(1)}L)`
                      ),
                  ].join('\n');
                  const blob = new Blob([report], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'karana-conflict-report.txt';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 rounded-lg transition text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                ðŸ“„ Export Report
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Save Modal â€” outside MapContainer to avoid z-index issues */}
      <SaveProjectModal
        isOpen={showSaveModal}
        geometryType={drawnGeometry?.type ?? ''}
        onSave={handleSaveProject}
        onClose={() => {
          setShowSaveModal(false);
          setDrawnGeometry(null);
        }}
      />
    </>
  );
}
