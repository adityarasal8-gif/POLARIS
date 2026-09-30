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
      zoomControl: false
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics',
      maxZoom: 17
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Pan
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || stations.length === 0) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    stations.forEach((st) => {
      const isSelected = st.id === selectedStationId;
      const customIcon = L.divIcon({
        className: 'custom-polar-pin',
        html: `
          <div style="
            width: ${isSelected ? '26px' : '18px'};
            height: ${isSelected ? '26px' : '18px'};
            background-color: ${isSelected ? '#74B8CC' : '#5BB7A5'};
            border: 2px solid #FFFFFF;
            border-radius: 50%;
            box-shadow: 0 0 14px ${isSelected ? '#74B8CC' : '#5BB7A5'};
            cursor: pointer;
            transition: all 0.3s ease;
          "></div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
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
    <div className="min-h-screen bg-[#07151F] text-[#F7F8F5] pb-20 font-sans selection:bg-[#74B8CC]/30 selection:text-[#07151F]">
      
      {/* Header */}
      <div className="border-b border-[#B9DDE7]/10 bg-[#0A1B28] px-4 sm:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#74B8CC] font-semibold tracking-widest uppercase">
            <Globe className="w-4 h-4 text-[#74B8CC]" />
            <span>FIELD RESEARCH BASES · NCPOR INFRASTRUCTURE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            India's polar & high-altitude stations
          </h1>
          <p className="text-xs sm:text-sm text-[#8E9EA7] font-light max-w-3xl leading-relaxed">
            Permanent multidisciplinary observatories operated across Queen Maud Land, Larsemann Hills, Svalbard, and the Chandra Basin.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* Geographic Selector Tabs */}
        <div className="flex flex-wrap gap-2.5">
          {stations.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStationId(st.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono transition flex items-center gap-2 border ${
                st.id === selectedStationId
                  ? 'bg-[#74B8CC] text-[#07151F] font-bold border-[#74B8CC] shadow-lg'
                  : 'bg-[#0D2735] text-[#8E9EA7] hover:text-white border-[#B9DDE7]/15'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${st.id === selectedStationId ? 'bg-[#07151F]' : 'bg-[#5BB7A5]'}`} />
              <span className="font-semibold">{st.name}</span>
              <span className="text-[10px] opacity-75">({st.region})</span>
            </button>
          ))}
        </div>

        {/* Split Geographic Interface: Left Interactive Satellite Map, Right Station Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Map Column */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-[#B9DDE7]/15 h-[480px] lg:h-[620px] bg-[#050F17] shadow-xl sticky top-24">
            <div ref={mapContainerRef} className="w-full h-full z-0" />
            <div className="absolute bottom-4 left-4 right-4 bg-[#07151F]/90 backdrop-blur-md p-3 rounded-xl border border-[#B9DDE7]/15 text-xs font-mono text-[#DCEEF2] flex items-center justify-between">
              <span>{activeStation?.name}</span>
              <span className="text-[#8E9EA7]">{activeStation?.latitude.toFixed(2)}°, {activeStation?.longitude.toFixed(2)}°</span>
            </div>
          </div>

          {/* Station Dossier Column */}
          {activeStation && (
            <div className="lg:col-span-7 space-y-6">
              
              {/* Architecture Photo Banner */}
              <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-[#B9DDE7]/15 bg-[#0D2735] shadow-2xl">
                <img
                  src={activeStation.image_url}
                  alt={activeStation.name}
                  className="w-full h-full object-cover brightness-[0.8]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07151F] via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#07151F]/80 backdrop-blur-md text-xs font-mono text-white border border-[#B9DDE7]/20 font-semibold">
                    {activeStation.region}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#5BB7A5] text-[#07151F] text-xs font-mono font-bold">
                    Active Year-Round
                  </span>
                </div>

                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs font-mono text-[#8E9EA7]">
                  <span>Photo Credit: {activeStation.image_credit}</span>
                  <span className="text-[#74B8CC]">Established {activeStation.commissioned_year}</span>
                </div>
              </div>

              {/* Station Fact Sheet */}
              <div className="bg-[#0D2735] p-8 rounded-3xl border border-[#B9DDE7]/15 space-y-6 shadow-xl">
                <div className="space-y-2">
                  <div className="text-xs font-mono text-[#5BB7A5] uppercase tracking-wider">
                    {activeStation.location_description}
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-white leading-snug">
                    {activeStation.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#DCEEF2]/85 font-light leading-relaxed">
                    {activeStation.purpose}
                  </p>
                </div>

                {/* Technical Specifications Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#B9DDE7]/10 text-xs font-mono">
                  <div>
                    <span className="text-[#8E9EA7] block">Coordinates</span>
                    <span className="text-white font-semibold">{activeStation.latitude.toFixed(4)}°, {activeStation.longitude.toFixed(4)}°</span>
                  </div>
                  <div>
                    <span className="text-[#8E9EA7] block">Elevation</span>
                    <span className="text-white font-semibold">{activeStation.elevation_m} meters ASL</span>
                  </div>
                  <div>
                    <span className="text-[#8E9EA7] block">Commissioned</span>
                    <span className="text-white font-semibold">{activeStation.commissioned_year}</span>
                  </div>
                </div>

                {/* Research Themes */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono text-[#8E9EA7] uppercase tracking-wider block">
                    Multidisciplinary Science Themes
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeStation.research_themes?.map((t) => (
                      <span key={t} className="px-3 py-1 rounded-lg bg-[#07151F] text-xs font-mono text-[#74B8CC] border border-[#B9DDE7]/10">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Live Weather Preview if available */}
                {activeWeather && (
                  <div className="pt-4 border-t border-[#B9DDE7]/10 bg-[#07151F]/70 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase text-[#5BB7A5] tracking-wider block">
                        Live Environmental Telemetry (Open-Meteo)
                      </span>
                      <div className="text-lg font-mono font-bold text-white">
                        {activeWeather.temperature_c}°C · Wind: {activeWeather.wind_speed_kmh} km/h · {activeWeather.surface_pressure_hpa} hPa
                      </div>
                    </div>
                    <Link
                      href="/observatory"
                      className="text-xs font-mono text-[#74B8CC] hover:underline flex items-center gap-1 font-bold"
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
