import React, { useRef, useState, useEffect, useMemo } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { Crosshair, MapPin, Wind, Thermometer, Info, Compass } from 'lucide-react';
import * as THREE from 'three';
import { StationWeather } from '../types';

const STATION_META: Record<string, any> = {
  maitri: { color: '#2563EB', flag: '🇦🇶', crew: 25 },
  bharati: { color: '#16A34A', flag: '🇦🇶', crew: 47 },
  himadri: { color: '#9333EA', flag: '🇸🇯', crew: 8 },
  himansh: { color: '#F59E0B', flag: '🇮🇳', crew: 5 }
};

// Define flight corridors
const ARCS = [
  { startLat: -33.924, startLng: 18.423, endLat: -70.767, endLng: 11.733, color: ['#ffffff', '#2563EB'], name: 'Cape Town to Maitri' },
  { startLat: -33.924, startLng: 18.423, endLat: -69.407, endLng: 76.187, color: ['#ffffff', '#16A34A'], name: 'Cape Town to Bharati' },
  { startLat: 32.239, startLng: 77.188, endLat: 32.404, endLng: 77.611, color: ['#ffffff', '#F59E0B'], name: 'Manali to Himansh' }
];

interface PolarGlobe3DProps {
  stationsWeather?: StationWeather[];
  selectedStationId?: string;
  onSelectStation: (id: string) => void;
  onViewTelemetry?: () => void;
}

export const PolarGlobe3D: React.FC<PolarGlobe3DProps> = ({
  stationsWeather = [],
  selectedStationId = 'maitri',
  onSelectStation,
  onViewTelemetry
}) => {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [hoveredStation, setHoveredStation] = useState<any | null>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: 600 });

  const activeStation = useMemo(() => {
    if (!stationsWeather || stationsWeather.length === 0) return undefined;
    return stationsWeather.find(s => s.station_id === selectedStationId);
  }, [stationsWeather, selectedStationId]);

  const STATIONS = useMemo(() => {
    if (!stationsWeather || stationsWeather.length === 0) return [];
    return stationsWeather.map(s => {
      const meta = STATION_META[s.station_id] || { color: '#ffffff', flag: '🌐', crew: 0 };
      return {
        id: s.station_id,
        name: s.station_name,
        region: s.region,
        lat: s.latitude,
        lng: s.longitude,
        temp: `${s.temperature_c}°C`,
        wind: `${s.wind_speed_kmh} km/h`,
        color: meta.color,
        flag: meta.flag,
        crew: meta.crew
      };
    });
  }, [stationsWeather]);

  useEffect(() => {
    const handleResize = () => {
      // Find parent container width for responsive sizing
      const container = document.getElementById('globe-container');
      if (container) {
        setDimensions({ width: container.clientWidth, height: Math.min(window.innerHeight - 150, 700) });
      } else {
        setDimensions({ width: window.innerWidth, height: 600 });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    // Give it a tiny delay to ensure layout is done
    setTimeout(handleResize, 100);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Initial camera setup - fly to South Pole
    if (globeEl.current) {
      globeEl.current.controls().enableZoom = true;
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.pointOfView({ lat: -90, lng: 0, altitude: 2.0 }, 2000);
    }
  }, []);

  useEffect(() => {
    if (activeStation && globeEl.current) {
      focusCamera(activeStation.latitude, activeStation.longitude, 0.8);
    }
  }, [activeStation]);

  const focusCamera = (lat: number, lng: number, altitude: number = 1.5) => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = false;
      globeEl.current.pointOfView({ lat, lng, altitude }, 1500);
    }
  };

  return (
    <div id="globe-container" className="relative w-full min-h-[500px] h-[600px] lg:h-[calc(100vh-200px)] bg-[#050505] rounded-3xl overflow-hidden border border-[#2a2a2a] shadow-2xl flex items-center justify-center">
      
      {/* 3D Canvas */}
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        // Custom Atmosphere glow
        atmosphereColor="#3b82f6"
        atmosphereAltitude={0.15}
        
        // Data layers
        pointsData={STATIONS}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.05}
        pointRadius={0.5}
        pointResolution={32}
        pointsMerge={false}
        pointThreeObject={(d: any) => {
          // Create a glowing cone marker
          const material = new THREE.MeshPhongMaterial({
            color: d.color,
            emissive: d.color,
            emissiveIntensity: 0.6,
            shininess: 100,
            transparent: true,
            opacity: 0.9
          });
          const geometry = new THREE.ConeGeometry(0.8, 2, 16);
          geometry.translate(0, 1, 0); // shift pivot to bottom
          const mesh = new THREE.Mesh(geometry, material);
          
          // Add a subtle glowing ring
          const ringGeo = new THREE.RingGeometry(1, 1.2, 32);
          const ringMat = new THREE.MeshBasicMaterial({ color: d.color, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.rotation.x = Math.PI / 2;
          mesh.add(ring);
          
          return mesh;
        }}
        onPointClick={(point: any) => {
          onSelectStation(point.id);
          focusCamera(point.lat, point.lng, 0.8);
        }}
        onPointHover={setHoveredStation}
        
        // Flight corridors
        arcsData={ARCS}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={4}
        arcDashInitialGap={() => Math.random() * 5}
        arcDashAnimateTime={2000}
        arcAltitudeAutoScale={0.3}
        arcStroke={0.5}
      />

      {/* Camera Preset Controls */}
      <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
        <div className="bg-[#111111]/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg mb-2">
          <h4 className="text-white font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-[#3b82f6]" />
            Camera Presets
          </h4>
        </div>
        
        <button 
          onClick={() => focusCamera(-90, 0, 1.5)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-xl text-white text-xs font-mono font-medium transition-all text-left flex items-center justify-between group"
        >
          <span>Antarctic Focus</span>
          <Compass className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>
        <button 
          onClick={() => focusCamera(90, 0, 1.5)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-xl text-white text-xs font-mono font-medium transition-all text-left flex items-center justify-between group"
        >
          <span>Arctic Focus</span>
          <Compass className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>
        <button 
          onClick={() => focusCamera(30, 80, 1.2)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-xl text-white text-xs font-mono font-medium transition-all text-left flex items-center justify-between group"
        >
          <span>Third Pole Focus</span>
          <Compass className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>
        <button 
          onClick={() => {
            if (globeEl.current) {
              globeEl.current.controls().autoRotate = true;
              globeEl.current.pointOfView({ lat: 0, lng: 80, altitude: 2.5 }, 2000);
            }
          }}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-xl text-[#3b82f6] text-xs font-mono font-medium transition-all text-left flex items-center justify-between group mt-2"
        >
          <span>Auto-Orbit Overview</span>
        </button>
      </div>

      {/* Glassmorphism Info Card (Hover/Active) */}
      {(hoveredStation || activeStation) && (
        <div className="absolute right-6 top-6 w-80 bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-right-4 duration-300 z-10">
          
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono text-[#8E8E91] uppercase tracking-widest block">
                {(hoveredStation || STATIONS.find(s => s.id === activeStation?.station_id))?.region}
              </span>
              <h3 className="text-2xl font-serif text-white font-medium mt-1">
                {(hoveredStation || STATIONS.find(s => s.id === activeStation?.station_id))?.name}
              </h3>
            </div>
            <div className="text-4xl">{(hoveredStation || STATIONS.find(s => s.id === activeStation?.station_id))?.flag}</div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <Thermometer className="w-4 h-4 text-[#F59E0B] mb-1" />
                <span className="block text-[10px] font-mono text-[#8E8E91] uppercase">Temp</span>
                <span className="text-sm font-mono text-white font-bold">{(hoveredStation || STATIONS.find(s => s.id === activeStation?.station_id))?.temp}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <Wind className="w-4 h-4 text-[#38BDF8] mb-1" />
                <span className="block text-[10px] font-mono text-[#8E8E91] uppercase">Wind</span>
                <span className="text-sm font-mono text-white font-bold">{(hoveredStation || STATIONS.find(s => s.id === activeStation?.station_id))?.wind}</span>
              </div>
            </div>
            
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-mono text-[#8E8E91] uppercase">Active Crew</span>
                <span className="text-sm font-mono text-white font-bold">{(hoveredStation || STATIONS.find(s => s.id === activeStation?.station_id))?.crew} Members</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            </div>

            <div className="pt-2">
              <button 
                onClick={() => {
                  const targetId = hoveredStation ? hoveredStation.id : activeStation?.station_id;
                  if (targetId) {
                    onSelectStation(targetId);
                  }
                  onViewTelemetry?.();
                }}
                className="w-full py-3 bg-white hover:bg-gray-100 text-[#111111] text-xs font-mono font-bold rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                <Info className="w-4 h-4" />
                Explore Station Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtitle / Legend */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
        <div className="bg-[#111111]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
          <span className="text-xs font-mono text-white tracking-widest uppercase">Live Telemetry Link Active</span>
        </div>
        <div className="hidden md:flex gap-4 bg-[#111111]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <span className="text-[10px] font-mono text-white flex items-center gap-1"><span className="w-4 h-0.5 bg-white"></span> Supply Route</span>
          <span className="text-[10px] font-mono text-white flex items-center gap-1"><MapPin className="w-3 h-3 text-[#2563EB]" /> Research Base</span>
        </div>
      </div>
    </div>
  );
};
