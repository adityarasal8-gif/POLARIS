import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Layers, MapPin, Compass, Maximize2, Minimize2, 
  RotateCcw, Eye, Navigation, Thermometer, Wind, 
  Gauge, Satellite, Users, ArrowUpRight, CheckCircle2,
  Mountain, Anchor, Sparkles
} from 'lucide-react';
import { StationWeather } from '../types';

export interface PolarStationGeo {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  commissioned_year?: number;
  purpose?: string;
  image_url?: string;
  status?: string;
  commander?: string;
  crew_size?: number;
  uplink?: string;
}

interface DetailedPolarMapProps {
  stations?: PolarStationGeo[];
  stationsWeather?: StationWeather[];
  selectedStationId: string;
  onSelectStation: (stationId: string) => void;
  className?: string;
  height?: string;
  onViewTelemetry?: () => void;
}

// 4 High-Grade Scientific Tile Providers (Keyless, Zero-Watermark, Fast Global CDNs)
const BASEMAPS = {
  satellite: {
    id: 'satellite',
    label: 'Satellite Imagery',
    attribution: '&copy; Esri World Imagery, Earthstar Geographics',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 18,
    isDark: true
  },
  topo: {
    id: 'topo',
    label: 'Topographic & Glaciers',
    attribution: '&copy; Esri World Topo, Garmin, FAO, NOAA',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 18,
    isDark: false
  },
  ocean: {
    id: 'ocean',
    label: 'Ocean & Bathymetry',
    attribution: '&copy; Esri Ocean, GEBCO, NOAA, National Geographic',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 13,
    isDark: false
  },
  dark: {
    id: 'dark',
    label: 'Polar Command Dark',
    attribution: '&copy; Esri Dark Gray Base, DeLorme, HERE',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 16,
    isDark: true
  }
};

// Regional Camera Presets
const REGION_PRESETS = [
  { id: 'all', label: 'Pan-Polar Global', center: [-25, 45] as [number, number], zoom: 2 },
  { id: 'antarctica', label: 'Antarctica (Maitri & Bharati)', center: [-70.0, 44.0] as [number, number], zoom: 3 },
  { id: 'arctic', label: 'Arctic (Himadri Svalbard)', center: [78.92, 11.92] as [number, number], zoom: 6 },
  { id: 'himalaya', label: 'Western Himalaya (Himansh)', center: [32.40, 77.62] as [number, number], zoom: 8 }
];

// Indian Polar Expedition Supply Navigation Corridors
const SUPPLY_ROUTES = [
  {
    id: 'route_maitri',
    name: 'Goa ➔ Cape Town ➔ Maitri (Antarctic Logistics)',
    color: '#3B82F6',
    dashArray: '6, 6',
    points: [
      [15.40, 73.80],      // NCPOR Goa, India
      [-33.9249, 18.4241], // Cape Town
      [-55.0, 15.0],       // Roaring Forties / Southern Ocean transect
      [-65.0, 12.0],       // Pack Ice Edge
      [-70.7667, 11.7333]  // Maitri Base
    ]
  },
  {
    id: 'route_bharati',
    name: 'Goa ➔ Mauritius ➔ Bharati (Antarctic Logistics)',
    color: '#06B6D4',
    dashArray: '6, 6',
    points: [
      [15.40, 73.80],      // NCPOR Goa, India
      [-20.16, 57.50],     // Port Louis, Mauritius (Staging)
      [-55.0, 70.0],       // Southern Ocean Transect
      [-69.4072, 76.1872]  // Bharati Base
    ]
  },
  {
    id: 'route_himadri',
    name: 'Delhi ➔ Oslo ➔ Ny-Ålesund (Arctic Aviation)',
    color: '#10B981',
    dashArray: '4, 4',
    points: [
      [28.6139, 77.2090],  // New Delhi, India
      [59.9139, 10.7522],  // Oslo, Norway
      [78.2232, 15.6267],  // Longyearbyen Airport
      [78.55, 13.0],       // Forlandsundet Strait
      [78.9242, 11.9286]   // Himadri Station (Kings Bay)
    ]
  },
  {
    id: 'route_himansh',
    name: 'Manali ➔ Chandra Basin Glaciological Trail',
    color: '#F59E0B',
    dashArray: '4, 4',
    points: [
      [32.2396, 77.1887],  // Manali base
      [32.36, 77.20],      // Atal Tunnel North Portal
      [32.35, 77.61],      // Batal Alpine Staging
      [32.4011, 77.6097]   // Himansh Glaciological Hub
    ]
  }
];

// Surrounding Science Landmarks for High-Resolution Context
const SCIENCE_LANDMARKS = [
  // Maitri Area
  { name: 'Priyadarshini Lake (NCPOR Preservation)', lat: -70.762, lon: 11.738, type: 'lake', stationId: 'maitri' },
  { name: 'Schirmacher Oasis Ice-Free Plateau', lat: -70.750, lon: 11.650, type: 'oasis', stationId: 'maitri' },
  { name: 'Novolazarevskaya Runway (DROMLAN Gateway)', lat: -70.776, lon: 11.830, type: 'airfield', stationId: 'maitri' },

  // Bharati Area
  { name: 'Grovnes Peninsula Promontory', lat: -69.402, lon: 76.180, type: 'peninsula', stationId: 'bharati' },
  { name: 'Prydz Bay Coastal Marine Transect', lat: -69.350, lon: 76.220, type: 'marine', stationId: 'bharati' },
  { name: 'Progress II Station (Russian Antarctic)', lat: -69.378, lon: 76.381, type: 'station', stationId: 'bharati' },

  // Himadri Area
  { name: 'Kongsfjorden Fjord Marine Observatory', lat: -78.950, lon: 11.950, type: 'fjord', stationId: 'himadri' },
  { name: 'Zeppelin Atmospheric Observatory (474m ASL)', lat: 78.907, lon: 11.888, type: 'observatory', stationId: 'himadri' },
  { name: 'Midtre Lovénbreen Glacier Snout', lat: 78.880, lon: 12.050, type: 'glacier', stationId: 'himadri' },

  // Himansh Area
  { name: 'Sutri Dhaka Glacier Terminus', lat: 32.405, lon: 77.620, type: 'glacier', stationId: 'himansh' },
  { name: 'Chandra River Hydrological Gauge', lat: 32.380, lon: 77.580, type: 'river', stationId: 'himansh' },
  { name: 'Samudra Tapu Glacial Lake', lat: 32.480, lon: 77.520, type: 'lake', stationId: 'himansh' }
];

// Default baseline station coords
const DEFAULT_STATIONS: PolarStationGeo[] = [
  {
    id: 'maitri',
    name: 'Maitri Research Station',
    region: 'Antarctica',
    latitude: -70.7667,
    longitude: 11.7333,
    elevation_m: 117.0,
    commissioned_year: 1988,
    status: 'Operational / Year-Round',
    purpose: 'Atmospheric Sciences, Geomagnetism, Meteorology & Permafrost Limnology in ice-free rocky terrain.',
    image_url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
    commander: 'Dr. Shailendra Saini',
    crew_size: 25,
    uplink: 'INSAT-3DR Geostationary C-Band'
  },
  {
    id: 'bharati',
    name: 'Bharati Research Station',
    region: 'Antarctica',
    latitude: -69.4072,
    longitude: 76.1872,
    elevation_m: 35.0,
    commissioned_year: 2012,
    status: 'Operational / Year-Round',
    purpose: 'Oceanography, Satellite Telemetry, Coastal Marine Ecology & Continental Breakup studies.',
    image_url: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=1200&q=80',
    commander: 'Dr. Vipin Kumar',
    crew_size: 23,
    uplink: 'INSAT-3DR Ku-Band + Inmarsat'
  },
  {
    id: 'himadri',
    name: 'Himadri Arctic Station',
    region: 'Arctic',
    latitude: 78.9242,
    longitude: 11.9286,
    elevation_m: 10.0,
    commissioned_year: 2008,
    status: 'Operational / Year-Round',
    purpose: 'Arctic Climate teleconnections with Indian Summer Monsoon, Fjord Oceanography & Glacier Snout dynamics.',
    image_url: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=1200&q=80',
    commander: 'Dr. K.P. Krishnan',
    crew_size: 12,
    uplink: 'Kings Bay High-Speed Fiber Gateway'
  },
  {
    id: 'himansh',
    name: 'Himansh Glaciological Hub',
    region: 'Himalaya',
    latitude: 32.4011,
    longitude: 77.6097,
    elevation_m: 4050.0,
    commissioned_year: 2016,
    status: 'Operational / Seasonal & Winter Telemetry',
    purpose: 'High-altitude Western Himalayan Cryosphere, Glacier Mass Balance, Snow Density & Hydrological Runoff.',
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    commander: 'Dr. Parmanand Sharma',
    crew_size: 6,
    uplink: 'Iridium SBD Short Burst Transceiver'
  }
];

export const DetailedPolarMap: React.FC<DetailedPolarMapProps> = ({
  stations = DEFAULT_STATIONS,
  stationsWeather = [],
  selectedStationId,
  onSelectStation,
  className = '',
  height = '520px',
  onViewTelemetry
}) => {
  const [activeBasemap, setActiveBasemap] = useState<keyof typeof BASEMAPS>('satellite');
  const [showSupplyRoutes, setShowSupplyRoutes] = useState(true);
  const [showPolarCircles, setShowPolarCircles] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ lat: number; lon: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layersGroupRef = useRef<{
    markers: L.LayerGroup;
    routes: L.LayerGroup;
    circles: L.LayerGroup;
    landmarks: L.LayerGroup;
  } | null>(null);

  const stationsList: PolarStationGeo[] = (stations && stations.length > 0 ? stations : DEFAULT_STATIONS).map((st) => {
    const defaultMeta = DEFAULT_STATIONS.find((d) => d.id === st.id);
    return {
      ...defaultMeta,
      ...st,
      commander: st.commander || defaultMeta?.commander || 'Station Commander',
      crew_size: st.crew_size || defaultMeta?.crew_size || 18,
      uplink: st.uplink || defaultMeta?.uplink || 'Satellite Carrier Link'
    };
  });

  const activeStation = stationsList.find((s) => s.id === selectedStationId) || stationsList[0];
  const activeWeather = stationsWeather.find((w) => w.station_id === selectedStationId);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-40, 50],
      zoom: 2,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    // Custom bottom-right attribution
    L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

    // Initial tile layer
    const initialBasemap = BASEMAPS[activeBasemap];
    const tileLayer = L.tileLayer(initialBasemap.url, {
      maxZoom: initialBasemap.maxZoom,
      attribution: initialBasemap.attribution
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Create layer groups for clean toggling
    layersGroupRef.current = {
      markers: L.layerGroup().addTo(map),
      routes: L.layerGroup().addTo(map),
      circles: L.layerGroup().addTo(map),
      landmarks: L.layerGroup().addTo(map)
    };

    // Track mouse coordinates
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setCursorPos({
        lat: parseFloat(e.latlng.lat.toFixed(4)),
        lon: parseFloat(e.latlng.lng.toFixed(4))
      });
    });

    // Ensure tiles render completely after layout settle
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    const handleWindowResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleWindowResize);

    mapInstanceRef.current = map;

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleWindowResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Basemap Switcher
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;

    const selectedCfg = BASEMAPS[activeBasemap];
    tileLayerRef.current.remove();

    const newLayer = L.tileLayer(selectedCfg.url, {
      maxZoom: selectedCfg.maxZoom,
      attribution: selectedCfg.attribution
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [activeBasemap]);

  // 3. Render Supply Routes
  useEffect(() => {
    const groups = layersGroupRef.current;
    if (!groups) return;

    groups.routes.clearLayers();

    if (showSupplyRoutes) {
      SUPPLY_ROUTES.forEach((route) => {
        const polyline = L.polyline(route.points as [number, number][], {
          color: route.color,
          weight: 2.5,
          opacity: 0.8,
          dashArray: route.dashArray,
          lineCap: 'round',
          lineJoin: 'round'
        });

        polyline.bindTooltip(
          `<div class="font-mono text-[11px] font-semibold text-[#111111] px-2 py-1 bg-white/95 rounded-lg shadow-md border border-[#E8E6E0]">${route.name}</div>`,
          { sticky: true, opacity: 0.95 }
        );

        groups.routes.addLayer(polyline);
      });
    }
  }, [showSupplyRoutes]);

  // 4. Render Polar Circles
  useEffect(() => {
    const groups = layersGroupRef.current;
    if (!groups) return;

    groups.circles.clearLayers();

    if (showPolarCircles) {
      // Antarctic Circle (-66.56° S)
      const antarcticCircle = L.polyline(
        Array.from({ length: 361 }, (_, i) => [-66.56, -180 + i] as [number, number]),
        {
          color: '#38BDF8',
          weight: 1.8,
          opacity: 0.85,
          dashArray: '8, 8'
        }
      );
      antarcticCircle.bindTooltip(
        '<div class="font-mono text-[10px] text-[#0284C7] bg-white/95 px-2 py-0.5 rounded border border-[#BAE6FD] font-semibold">ANTARCTIC CIRCLE (66°33′ S)</div>',
        { permanent: false, sticky: true }
      );
      groups.circles.addLayer(antarcticCircle);

      // Arctic Circle (+66.56° N)
      const arcticCircle = L.polyline(
        Array.from({ length: 361 }, (_, i) => [66.56, -180 + i] as [number, number]),
        {
          color: '#06B6D4',
          weight: 1.8,
          opacity: 0.85,
          dashArray: '8, 8'
        }
      );
      arcticCircle.bindTooltip(
        '<div class="font-mono text-[10px] text-[#0891B2] bg-white/95 px-2 py-0.5 rounded border border-[#A5F3FC] font-semibold">ARCTIC CIRCLE (66°33′ N)</div>',
        { permanent: false, sticky: true }
      );
      groups.circles.addLayer(arcticCircle);
    }
  }, [showPolarCircles]);

  // 5. Render Surrounding Scientific Landmarks
  useEffect(() => {
    const groups = layersGroupRef.current;
    if (!groups) return;

    groups.landmarks.clearLayers();

    if (showLandmarks) {
      SCIENCE_LANDMARKS.forEach((lm) => {
        const isAssociated = lm.stationId === selectedStationId;
        const iconHtml = `
          <div style="
            width: ${isAssociated ? '16px' : '12px'};
            height: ${isAssociated ? '16px' : '12px'};
            background-color: ${isAssociated ? '#2563EB' : '#64748B'};
            border: 2px solid #FFFFFF;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transform: rotate(45deg);
            cursor: pointer;
            transition: all 0.2s ease;
          "></div>
        `;

        const icon = L.divIcon({
          className: 'landmark-icon',
          html: iconHtml,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        const marker = L.marker([lm.lat, lm.lon], { icon });
        marker.bindTooltip(
          `<div class="font-mono text-[10px] text-[#111111] bg-white/95 px-2.5 py-1 rounded-lg border border-[#E8E6E0] shadow-md">
            <span class="text-[#2563EB] font-bold">LANDMARK:</span> ${lm.name}
          </div>`,
          { sticky: true, opacity: 0.95 }
        );
        groups.landmarks.addLayer(marker);
      });
    }
  }, [showLandmarks, selectedStationId]);

  // 6. Render Custom Station Beacons with Radar Ping
  useEffect(() => {
    const map = mapInstanceRef.current;
    const groups = layersGroupRef.current;
    if (!map || !groups || stationsList.length === 0) return;

    groups.markers.clearLayers();

    stationsList.forEach((st) => {
      const isSelected = st.id === selectedStationId;
      const weather = stationsWeather.find((w) => w.station_id === st.id);

      // Station Beacon HTML with Pulsing Radar Ring
      const beaconHtml = `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          ${isSelected ? `
            <div style="
              position: absolute;
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background-color: rgba(37, 99, 235, 0.3);
              animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
          ` : ''}
          <div style="
            position: relative;
            width: ${isSelected ? '32px' : '26px'};
            height: ${isSelected ? '32px' : '26px'};
            background: ${isSelected ? '#111111' : '#FFFFFF'};
            border: 2.5px solid ${isSelected ? '#2563EB' : '#111111'};
            border-radius: 50%;
            box-shadow: 0 4px 14px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.25s ease;
          ">
            <div style="
              width: ${isSelected ? '10px' : '8px'};
              height: ${isSelected ? '10px' : '8px'};
              background: ${isSelected ? '#3B82F6' : '#111111'};
              border-radius: 50%;
            "></div>
          </div>
          <div style="
            position: absolute;
            bottom: -18px;
            white-space: nowrap;
            background: ${isSelected ? '#111111' : 'rgba(255,255,255,0.95)'};
            color: ${isSelected ? '#FFFFFF' : '#111111'};
            font-family: monospace;
            font-size: 10px;
            font-weight: 700;
            padding: 1px 6px;
            border-radius: 6px;
            border: 1px solid ${isSelected ? '#2563EB' : '#E8E6E0'};
            box-shadow: 0 2px 6px rgba(0,0,0,0.18);
            pointer-events: none;
          ">
            ${st.name.split(' ')[0]} ${weather ? `· ${weather.temperature_c}°C` : ''}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-polar-beacon',
        html: beaconHtml,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const marker = L.marker([st.latitude, st.longitude], { icon: customIcon });

      marker.on('click', () => {
        onSelectStation(st.id);
        setShowInspector(true);
        map.flyTo([st.latitude, st.longitude], Math.max(map.getZoom(), 4), {
          duration: 1.2,
          easeLinearity: 0.25
        });
        if (onViewTelemetry) {
          setTimeout(() => onViewTelemetry(), 100);
        }
      });

      // Hover Tooltip
      marker.bindTooltip(`
        <div style="font-family: monospace; font-size: 11px; padding: 4px 6px;">
          <div style="font-weight: bold; color: #111111;">${st.name}</div>
          <div style="color: #64748B;">Region: ${st.region} | Alt: ${st.elevation_m}m ASL</div>
          ${weather ? `<div style="color: #2563EB; font-weight: bold; margin-top: 2px;">Temp: ${weather.temperature_c}°C | Wind: ${weather.wind_speed_kmh} km/h</div>` : ''}
        </div>
      `, { sticky: true, opacity: 0.95 });

      groups.markers.addLayer(marker);
    });
  }, [stationsList, stationsWeather, selectedStationId]);

  // Smooth Fly-to on station selection change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeStation) return;
    map.flyTo([activeStation.latitude, activeStation.longitude], Math.max(map.getZoom(), 4), {
      duration: 1.2,
      easeLinearity: 0.25
    });
  }, [selectedStationId]);

  const handleRegionJump = (preset: typeof REGION_PRESETS[0]) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo(preset.center, preset.zoom, { duration: 1.4 });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleReset = () => {
    mapInstanceRef.current?.flyTo([-25, 45], 2, { duration: 1.2 });
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-[#0A0D14] border-b border-[#E8E6E0] select-none ${className}`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* 1. Underlying Leaflet Map Engine */}
      <div ref={mapContainerRef} className="w-full h-full z-0 cursor-grab active:cursor-grabbing" />

      {/* 2. Top-Left: Station Quick Switcher Tabs */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 max-w-2xl pointer-events-auto">
        {stationsList.map((st) => {
          const isSelected = st.id === selectedStationId;
          const stationKey = st.name.split(' ')[0].toLowerCase();
          const weather = stationsWeather.find((w) => w.station_id === stationKey);
          return (
            <button
              key={st.id}
              onClick={() => {
                onSelectStation(st.id);
                if (onViewTelemetry) {
                  setTimeout(() => onViewTelemetry(), 100);
                }
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-mono transition-all flex items-center gap-2.5 backdrop-blur-md border shadow-lg ${
                isSelected
                  ? 'bg-[#111111]/95 text-white font-semibold border-[#2563EB] ring-2 ring-[#2563EB]/40'
                  : 'bg-white/90 text-[#333336] hover:text-[#111111] hover:bg-white border-[#E8E6E0]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#3B82F6] animate-pulse' : 'bg-[#16A34A]'}`} />
              <span>{st.name}</span>
              {weather && (
                <span className={`text-[11px] font-bold ${isSelected ? 'text-[#60A5FA]' : 'text-[#2563EB]'}`}>
                  {weather.temperature_c}°C
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Top-Right: Map View & Basemap Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2 pointer-events-auto">
        {/* Basemap Switcher Pill Group */}
        <div className="flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E8E6E0] shadow-md">
          {Object.values(BASEMAPS).map((b) => (
            <button
              key={b.id}
              onClick={() => setActiveBasemap(b.id as keyof typeof BASEMAPS)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono transition-all font-medium ${
                activeBasemap === b.id
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'text-[#555558] hover:text-[#111111] hover:bg-[#F4F2EE]'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Region Jump Presets */}
        <div className="flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E8E6E0] shadow-md">
          {REGION_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleRegionJump(p)}
              className="px-2.5 py-1 rounded-xl text-[10px] font-mono text-[#555558] hover:text-[#111111] hover:bg-[#F4F2EE] transition"
            >
              {p.label.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Layer Toggles & Utility Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E8E6E0] shadow-md text-xs font-mono">
          <button
            onClick={() => setShowSupplyRoutes(!showSupplyRoutes)}
            className={`px-2 py-1 rounded-xl transition flex items-center gap-1 text-[10px] ${
              showSupplyRoutes ? 'bg-[#EFF6FF] text-[#2563EB] font-bold' : 'text-[#8E8E91]'
            }`}
            title="Toggle supply ship corridors"
          >
            <Navigation className="w-3 h-3" />
            <span>Routes</span>
          </button>

          <button
            onClick={() => setShowPolarCircles(!showPolarCircles)}
            className={`px-2 py-1 rounded-xl transition flex items-center gap-1 text-[10px] ${
              showPolarCircles ? 'bg-[#EFF6FF] text-[#2563EB] font-bold' : 'text-[#8E8E91]'
            }`}
            title="Toggle Polar Circles 66.5°"
          >
            <Compass className="w-3 h-3" />
            <span>Circles</span>
          </button>

          <button
            onClick={() => setShowLandmarks(!showLandmarks)}
            className={`px-2 py-1 rounded-xl transition flex items-center gap-1 text-[10px] ${
              showLandmarks ? 'bg-[#EFF6FF] text-[#2563EB] font-bold' : 'text-[#8E8E91]'
            }`}
            title="Toggle research landmarks"
          >
            <Mountain className="w-3 h-3" />
            <span>Landmarks</span>
          </button>

          <div className="h-4 w-[1px] bg-[#E8E6E0] mx-0.5" />

          {/* Zoom & Fullscreen Controls */}
          <button
            onClick={handleZoomIn}
            className="w-6 h-6 rounded-lg hover:bg-[#F4F2EE] flex items-center justify-center font-bold text-xs"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-6 h-6 rounded-lg hover:bg-[#F4F2EE] flex items-center justify-center font-bold text-xs"
            title="Zoom Out"
          >
            −
          </button>
          <button
            onClick={handleReset}
            className="w-6 h-6 rounded-lg hover:bg-[#F4F2EE] flex items-center justify-center text-[#555558]"
            title="Reset Pan-Polar Camera"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="w-6 h-6 rounded-lg hover:bg-[#F4F2EE] flex items-center justify-center text-[#555558]"
            title="Toggle Fullscreen Map"
          >
            {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* 4. Bottom-Left: Live Floating Station Dossier Card */}
      {showInspector && activeStation && (
        <div className="absolute bottom-4 left-4 z-10 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-[#E8E6E0] shadow-2xl pointer-events-auto space-y-3.5 transition-all">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#BFDBFE] font-medium mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                <span>{activeStation.region.toUpperCase()} SECTOR · {activeStation.commissioned_year || 1988}</span>
              </div>
              <h4 className="text-base sm:text-lg font-serif font-semibold text-[#111111] leading-snug">
                {activeStation.name}
              </h4>
              <p className="text-[11px] font-mono text-[#64748B]">
                {activeStation.latitude.toFixed(4)}°N, {activeStation.longitude.toFixed(4)}°E · ALT {activeStation.elevation_m}m ASL
              </p>
            </div>
            <button
              onClick={() => setShowInspector(false)}
              className="text-[#8E8E91] hover:text-[#111111] text-xs font-mono p-1 rounded-full hover:bg-[#F4F2EE]"
              title="Minimize Inspector"
            >
              ✕
            </button>
          </div>

          {/* Live Telemetry Snapshot HUD */}
          {activeWeather && (
            <div className="grid grid-cols-3 gap-2 bg-[#FAFAF8] p-2.5 rounded-2xl border border-[#E8E6E0] text-center">
              <div>
                <span className="text-[9px] font-mono uppercase text-[#8E8E91] block">TEMP</span>
                <span className="text-sm font-mono font-bold text-[#111111]">
                  {activeWeather.temperature_c}°C
                </span>
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase text-[#8E8E91] block">WIND</span>
                <span className="text-sm font-mono font-bold text-[#111111]">
                  {activeWeather.wind_speed_kmh} <span className="text-[10px] font-normal text-[#8E8E91]">km/h</span>
                </span>
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase text-[#8E8E91] block">PRESSURE</span>
                <span className="text-sm font-mono font-bold text-[#111111]">
                  {activeWeather.surface_pressure_hpa} <span className="text-[10px] font-normal text-[#8E8E91]">hPa</span>
                </span>
              </div>
            </div>
          )}

          {/* Quick Specifications */}
          <div className="space-y-1.5 text-[11px] font-mono text-[#555558]">
            <div className="flex items-center justify-between">
              <span className="text-[#8E8E91]">Satellite Uplink:</span>
              <strong className="text-[#111111]">{activeStation.uplink || 'INSAT-3DR Synced'}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8E8E91]">Expedition Contingent:</span>
              <strong className="text-[#111111]">{activeStation.crew_size || 25} Personnel</strong>
            </div>
            {activeStation.commander && (
              <div className="flex items-center justify-between">
                <span className="text-[#8E8E91]">Commander:</span>
                <strong className="text-[#111111]">{activeStation.commander}</strong>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                mapInstanceRef.current?.flyTo([activeStation.latitude, activeStation.longitude], 9, { duration: 1.5 });
              }}
              className="flex-1 py-1.5 px-3 rounded-xl bg-[#F4F2EE] hover:bg-[#E8E6E0] text-[11px] font-mono font-medium text-[#111111] transition flex items-center justify-center gap-1"
            >
              <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Satellite Zoom (9x)</span>
            </button>

            {onViewTelemetry && (
              <button
                onClick={onViewTelemetry}
                className="py-1.5 px-3 rounded-xl bg-[#111111] hover:bg-[#2563EB] text-white text-[11px] font-mono font-medium transition flex items-center justify-center gap-1 shadow-sm"
              >
                <span>Telemetry</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Re-open Inspector Button if closed */}
      {!showInspector && (
        <button
          onClick={() => setShowInspector(true)}
          className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#E8E6E0] text-xs font-mono text-[#111111] shadow-lg flex items-center gap-2 font-medium hover:bg-white"
        >
          <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Show Station Dossier ({activeStation?.name.split(' ')[0]})</span>
        </button>
      )}

      {/* 5. Bottom-Right: Live Cursor Coordinates HUD & Scale */}
      <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#E8E6E0] text-[11px] font-mono text-[#111111] shadow-md flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[#555558]">
          <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>CURSOR:</span>
        </div>
        <strong>{cursorPos ? `${cursorPos.lat}°` : `${activeStation?.latitude.toFixed(4)}°`}</strong>,{' '}
        <strong>{cursorPos ? `${cursorPos.lon}°` : `${activeStation?.longitude.toFixed(4)}°`}</strong>
        <span className="text-[#8E8E91] pl-2 border-l border-[#E8E6E0]">
          WGS84 EPSG:4326
        </span>
      </div>
    </div>
  );
};
