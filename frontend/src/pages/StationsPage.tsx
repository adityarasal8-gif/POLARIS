import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { 
  Building2, MapPin, Compass, Thermometer, Radio, 
  Calendar, Layers, Globe, ExternalLink, ShieldCheck, 
  Activity, ArrowUpRight, CheckCircle2, ArrowRight
} from 'lucide-react';
import L from 'leaflet';
import { fetchStations, fetchLiveObservatory } from '../api';
import { Station, StationWeather } from '../types';

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [weatherMap, setWeatherMap] = useState<Record<string, StationWeather>>({});
  const [selectedStationId, setSelectedStationId] = useState<string>('maitri');
  const [loading, setLoading] = useState(true);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [stationsData, weatherData] = await Promise.all([
          fetchStations(),
          fetchLiveObservatory().catch(() => [])
        ]);
        setStations(stationsData);
        
        const wMap: Record<string, StationWeather> = {};
        weatherData.forEach((w) => { wMap[w.station_id] = w; });
        setWeatherMap(wMap);
        
        if (stationsData.length > 0) {
          setSelectedStationId(stationsData[0].id);
        }
      } catch (err) {
        console.error('Failed to load stations data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeStation = stations.find((s) => s.id === selectedStationId) || stations[0];
  const activeWeather = activeStation ? weatherMap[activeStation.id] : null;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-30, 45],
      zoom: 2,
      minZoom: 2,
      maxZoom: 10,
      zoomControl: true,
      attributionControl: false
    });

    // OpenStreetMap clean cartographic tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || stations.length === 0) return;

    // Clear previous markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    stations.forEach((st) => {
      const isSelected = st.id === selectedStationId;
      const customIcon = L.divIcon({
        className: 'custom-station-pin',
        html: `
          <div style="
            width: ${isSelected ? '24px' : '18px'};
            height: ${isSelected ? '24px' : '18px'};
            border-radius: 9999px;
            background: ${isSelected ? '#111111' : '#FFFFFF'};
            border: 2px solid #111111;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            <div style="
              width: 6px;
              height: 6px;
              border-radius: 9999px;
              background: ${isSelected ? '#FFFFFF' : '#111111'};
            "></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([st.latitude, st.longitude], { icon: customIcon }).addTo(map);
      marker.on('click', () => setSelectedStationId(st.id));
      markersRef.current[st.id] = marker;
    });

    if (activeStation) {
      map.panTo([activeStation.latitude, activeStation.longitude], { animate: true, duration: 1 });
    }
  }, [stations, selectedStationId]);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111111] pb-24 font-sans selection:bg-[#111111] selection:text-white">
      
      {/* Header */}
      <div className="border-b border-[#E8E6E0] bg-[#FAFAF8] px-4 sm:px-8 py-12">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#555558] bg-[#F4F2EE] px-3 py-1 rounded-full border border-[#E8E6E0] font-medium tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
            <span>FIELD RESEARCH BASES · NCPOR INFRASTRUCTURE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-medium text-[#111111] tracking-tight">
            India's polar & high-altitude stations
          </h1>
          <p className="text-sm text-[#555558] max-w-3xl leading-relaxed">
            Permanent multidisciplinary observatories operated across Queen Maud Land, Larsemann Hills, Svalbard, and the Chandra Basin.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* Geographic Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {stations.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStationId(st.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono transition-all flex items-center gap-2 border ${
                st.id === selectedStationId
                  ? 'bg-[#111111] text-white border-[#111111] shadow-sm font-semibold'
                  : 'bg-[#F4F2EE] text-[#555558] hover:text-[#111111] hover:border-[#111111]/30 border-[#E8E6E0]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${st.id === selectedStationId ? 'bg-[#16A34A]' : 'bg-[#8E8E91]'}`} />
              <span>{st.name}</span>
              <span className="text-[10px] opacity-60">({st.region})</span>
            </button>
          ))}
        </div>

        {/* Split Geographic Interface: Left Interactive Map, Right Station Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Map Column */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-[#E8E6E0] h-[480px] lg:h-[620px] bg-[#F4F2EE] shadow-sm sticky top-24">
            <div ref={mapContainerRef} className="w-full h-full z-0" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-[#E8E6E0] text-xs font-mono text-[#111111] flex items-center justify-between shadow-sm">
              <span className="font-semibold">{activeStation?.name}</span>
              <span className="text-[#8E8E91]">{activeStation?.latitude.toFixed(2)}°, {activeStation?.longitude.toFixed(2)}°</span>
            </div>
          </div>

          {/* Station Dossier Column */}
          {activeStation && (
            <div className="lg:col-span-7 space-y-6">
              
              {/* Architecture Photo Banner */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#E8E6E0] bg-[#F4F2EE] shadow-sm">
                <img
                  src={activeStation.image_url}
                  alt={activeStation.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-mono text-[#111111] border border-white/40 font-semibold shadow-sm">
                    {activeStation.region}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#111111] text-white text-xs font-mono font-medium flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                    Active Year-Round
                  </span>
                </div>

                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs font-mono text-white/90">
                  <span>Photo Credit: {activeStation.image_credit}</span>
                  <span className="font-medium bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">Est. {activeStation.commissioned_year}</span>
                </div>
              </div>

              {/* Station Fact Sheet */}
              <div className="bg-white p-8 rounded-2xl border border-[#E8E6E0] space-y-6 shadow-sm">
                <div className="space-y-2">
                  <div className="text-xs font-mono text-[#8E8E91] uppercase tracking-wider">
                    {activeStation.location_description}
                  </div>
                  <h2 className="text-3xl font-serif font-medium text-[#111111] leading-snug">
                    {activeStation.name}
                  </h2>
                  <p className="text-sm text-[#555558] font-light leading-relaxed">
                    {activeStation.purpose}
                  </p>
                </div>

                {/* Technical Specifications Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E8E6E0] text-xs font-mono">
                  <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E8E6E0]/60">
                    <span className="text-[#8E8E91] block text-[10px] uppercase">Coordinates</span>
                    <span className="text-[#111111] font-semibold">{activeStation.latitude.toFixed(4)}°, {activeStation.longitude.toFixed(4)}°</span>
                  </div>
                  <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E8E6E0]/60">
                    <span className="text-[#8E8E91] block text-[10px] uppercase">Elevation</span>
                    <span className="text-[#111111] font-semibold">{activeStation.elevation_m} meters ASL</span>
                  </div>
                  <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E8E6E0]/60">
                    <span className="text-[#8E8E91] block text-[10px] uppercase">Commissioned</span>
                    <span className="text-[#111111] font-semibold">{activeStation.commissioned_year}</span>
                  </div>
                </div>

                {/* Research Themes */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono text-[#8E8E91] uppercase tracking-wider block">
                    Multidisciplinary Science Themes
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeStation.research_themes?.map((t) => (
                      <span key={t} className="px-3 py-1 rounded-full bg-[#F4F2EE] text-xs font-mono text-[#111111] border border-[#E8E6E0]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Live Weather Preview if available */}
                {activeWeather && (
                  <div className="pt-4 border-t border-[#E8E6E0] bg-[#FAFAF8] p-4 rounded-xl border border-[#E8E6E0] flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                        <span className="text-[10px] font-mono uppercase text-[#555558] tracking-wider block font-semibold">
                          Live Environmental Telemetry (Open-Meteo)
                        </span>
                      </div>
                      <div className="text-base font-mono font-bold text-[#111111]">
                        {activeWeather.temperature_c}°C · Wind: {activeWeather.wind_speed_kmh} km/h · {activeWeather.surface_pressure_hpa} hPa
                      </div>
                    </div>
                    <Link
                      href="/observatory"
                      className="px-4 py-2 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-mono font-medium flex items-center gap-1.5 transition"
                    >
                      <span>Observatory Console</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
