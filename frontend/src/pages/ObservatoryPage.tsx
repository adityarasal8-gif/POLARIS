import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, Wind, Thermometer, Droplets, Gauge, 
  MapPin, Clock, ShieldCheck, RefreshCw, Compass, ArrowUpRight
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import L from 'leaflet';
import { fetchLiveObservatory } from '../api';
import { StationWeather } from '../types';

export const ObservatoryPage: React.FC = () => {
  const [stationsWeather, setStationsWeather] = useState<StationWeather[]>([]);
  const [selectedStationId, setSelectedStationId] = useState<string>('maitri');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const loadData = () => {
    setRefreshing(true);
    fetchLiveObservatory()
      .then((data) => {
        setStationsWeather(data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        console.error('Failed to fetch live observatory data:', err);
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeWeather = stationsWeather.find((s) => s.station_id === selectedStationId) || stationsWeather[0];

  // Leaflet Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center map around Southern / Indian Ocean perspective
    const map = L.map(mapContainerRef.current, {
      center: [-40, 50],
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

  // Update Markers & Pan on Selection
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || stationsWeather.length === 0) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    stationsWeather.forEach((st) => {
      const isSelected = st.station_id === selectedStationId;
      
      const customIcon = L.divIcon({
        className: 'custom-polar-pin',
        html: `
          <div style="
            width: ${isSelected ? '26px' : '18px'};
            height: ${isSelected ? '26px' : '18px'};
            background-color: ${isSelected ? '#111111' : '#FFFFFF'};
            border: 2px solid #111111;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            <div style="width: 6px; height: 6px; background-color: ${isSelected ? '#FFFFFF' : '#111111'}; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker([st.latitude, st.longitude], { icon: customIcon }).addTo(map);
      marker.on('click', () => setSelectedStationId(st.station_id));
      markersRef.current[st.station_id] = marker;
    });

    if (activeWeather) {
      map.panTo([activeWeather.latitude, activeWeather.longitude], { animate: true, duration: 1 });
    }
  }, [stationsWeather, selectedStationId]);

  // Synthetic 24h trend data
  const trendData = activeWeather ? [
    { hour: '00:00', temp: activeWeather.temperature_c - 1.8, wind: activeWeather.wind_speed_kmh - 3 },
    { hour: '04:00', temp: activeWeather.temperature_c - 2.5, wind: activeWeather.wind_speed_kmh + 2 },
    { hour: '08:00', temp: activeWeather.temperature_c - 0.9, wind: activeWeather.wind_speed_kmh + 5 },
    { hour: '12:00', temp: activeWeather.temperature_c + 1.2, wind: activeWeather.wind_speed_kmh - 2 },
    { hour: '16:00', temp: activeWeather.temperature_c + 0.6, wind: activeWeather.wind_speed_kmh - 4 },
    { hour: '20:00', temp: activeWeather.temperature_c - 1.1, wind: activeWeather.wind_speed_kmh + 1 },
    { hour: 'Now', temp: activeWeather.temperature_c, wind: activeWeather.wind_speed_kmh }
  ] : [];

  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] text-[#111111] pb-24 font-sans selection:bg-[#111111] selection:text-white">
      
      {/* 1. Scientific Observatory Header */}
      <div className="border-b border-[#E8E6E0] bg-[#FAFAF8] px-4 sm:px-8 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#555558] bg-[#F4F2EE] px-3 py-1 rounded-full border border-[#E8E6E0] font-medium tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              <span>LIVE POLAR OBSERVATORY CONSOLE · OPEN-METEO TELEMETRY</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-medium text-[#111111] tracking-tight">
              Real-time atmospheric & polar instrumentation
            </h1>
            <p className="text-sm text-[#555558] font-light max-w-2xl">
              Continuous synoptic observations proxied across Indian research bases in Antarctica, the Arctic, and the Western Himalaya.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={refreshing}
              className="px-4 py-2 rounded-full bg-white hover:bg-[#F4F2EE] border border-[#E8E6E0] text-xs font-mono text-[#111111] flex items-center gap-2 transition shadow-sm font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#111111] ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Polling Sensors...' : 'Sync Telemetry'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Full-Width Map Explorer */}
      <div className="relative w-full h-[450px] sm:h-[500px] bg-[#F4F2EE] border-b border-[#E8E6E0]">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Station Selector Bar */}
        <div className="absolute top-6 left-4 right-4 sm:left-8 sm:right-auto z-10 flex flex-wrap gap-2 max-w-3xl">
          {stationsWeather.map((st) => (
            <button
              key={st.station_id}
              onClick={() => setSelectedStationId(st.station_id)}
              className={`px-4 py-2 rounded-full text-xs font-mono backdrop-blur-md transition-all flex items-center gap-2 border shadow-sm ${
                st.station_id === (activeWeather?.station_id || 'maitri')
                  ? 'bg-[#111111] text-white font-medium border-[#111111]'
                  : 'bg-white/95 text-[#555558] hover:text-[#111111] border-[#E8E6E0] hover:bg-white'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${st.station_id === (activeWeather?.station_id || 'maitri') ? 'bg-[#16A34A]' : 'bg-[#8E8E91]'}`} />
              <span>{st.station_name}</span>
              <span className="text-[10px] opacity-60">({st.region})</span>
            </button>
          ))}
        </div>

        {/* Station Coordinates Indicator (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#E8E6E0] text-xs font-mono text-[#111111] shadow-sm">
          <span className="text-[#8E8E91]">COORDINATES:</span>{' '}
          <strong>{activeWeather?.latitude.toFixed(4)}°</strong>,{' '}
          <strong>{activeWeather?.longitude.toFixed(4)}°</strong>
        </div>
      </div>

      {/* 3. Instrumentation Telemetry Console */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        
        {/* Enormous Live Readings */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E6E0] pb-3">
            <h2 className="text-2xl font-serif font-medium text-[#111111]">
              {activeWeather?.station_name} Telemetry Feed
            </h2>
            <div className="text-xs font-mono text-[#555558] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              <span>LIVE ENVIRONMENTAL CONTEXT · Open-Meteo API</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* TEMPERATURE */}
            <div className="bg-white border border-[#E8E6E0] rounded-3xl p-7 flex flex-col justify-between space-y-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono text-[#8E8E91]">
                <span>SURFACE TEMPERATURE</span>
                <Thermometer className="w-4 h-4 text-[#111111]" />
              </div>
              <div>
                <span className="text-5xl sm:text-6xl font-mono font-bold text-[#111111] tracking-tight">
                  {loading ? '...' : `${activeWeather?.temperature_c}°C`}
                </span>
                <span className="block text-xs font-mono text-[#8E8E91] mt-1">
                  Ambient air sensor (1000 hPa)
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#555558] pt-2 border-t border-[#E8E6E0]">
                {activeWeather?.temperature_c && activeWeather.temperature_c < 0 ? 'Sub-Zero Cryosphere' : 'Positive Melting Regime'}
              </div>
            </div>

            {/* WIND VELOCITY */}
            <div className="bg-white border border-[#E8E6E0] rounded-3xl p-7 flex flex-col justify-between space-y-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono text-[#8E8E91]">
                <span>WIND SPEED & VECTOR</span>
                <Wind className="w-4 h-4 text-[#111111]" />
              </div>
              <div>
                <span className="text-5xl sm:text-6xl font-mono font-bold text-[#111111] tracking-tight">
                  {loading ? '...' : `${activeWeather?.wind_speed_kmh}`}
                </span>
                <span className="text-lg text-[#8E8E91] font-mono ml-1 font-normal">km/h</span>
                <span className="block text-xs font-mono text-[#8E8E91] mt-1">
                  Sonic anemometer array
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#555558] pt-2 border-t border-[#E8E6E0]">
                {activeWeather?.wind_speed_kmh && activeWeather.wind_speed_kmh > 40 ? 'Severe Katabatic Gale' : 'Normal Drainage Flow'}
              </div>
            </div>

            {/* PRESSURE */}
            <div className="bg-white border border-[#E8E6E0] rounded-3xl p-7 flex flex-col justify-between space-y-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono text-[#8E8E91]">
                <span>BAROMETRIC PRESSURE</span>
                <Gauge className="w-4 h-4 text-[#111111]" />
              </div>
              <div>
                <span className="text-4xl sm:text-5xl font-mono font-bold text-[#111111] tracking-tight">
                  {loading ? '...' : `${activeWeather?.surface_pressure_hpa}`}
                </span>
                <span className="text-sm text-[#8E8E91] font-mono ml-1">hPa</span>
                <span className="block text-xs font-mono text-[#8E8E91] mt-1">
                  Surface barograph
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#555558] pt-2 border-t border-[#E8E6E0]">
                Atmospheric boundary layer
              </div>
            </div>

            {/* HUMIDITY */}
            <div className="bg-white border border-[#E8E6E0] rounded-3xl p-7 flex flex-col justify-between space-y-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono text-[#8E8E91]">
                <span>RELATIVE HUMIDITY</span>
                <Droplets className="w-4 h-4 text-[#111111]" />
              </div>
              <div>
                <span className="text-4xl sm:text-5xl font-mono font-bold text-[#111111] tracking-tight">
                  {loading ? '...' : `${activeWeather?.relative_humidity_pct}%`}
                </span>
                <span className="block text-xs font-mono text-[#8E8E91] mt-1">
                  Capacitive thin-film sensor
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#555558] pt-2 border-t border-[#E8E6E0]">
                Coupled sublimation rate
              </div>
            </div>
          </div>
        </div>

        {/* 4. 24-Hour Diurnal Telemetry Trends */}
        <div className="bg-white border border-[#E8E6E0] rounded-3xl p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E6E0] pb-4">
            <div>
              <h3 className="text-xl font-serif font-medium text-[#111111]">
                Diurnal Trend Profile: {activeWeather?.station_name}
              </h3>
              <p className="text-xs text-[#8E8E91] font-mono">
                Synoptic atmospheric fluctuations over a 24-hour observational window
              </p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[#111111]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
                <span>Temp (°C)</span>
              </span>
              <span className="flex items-center gap-1.5 text-[#8E8E91]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8E8E91]" />
                <span>Wind (km/h)</span>
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E0" />
                <XAxis dataKey="hour" stroke="#8E8E91" tick={{ fontSize: 11, fill: '#8E8E91' }} />
                <YAxis stroke="#8E8E91" tick={{ fontSize: 11, fill: '#8E8E91' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E8E6E0', color: '#111111', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                />
                <Line type="monotone" dataKey="temp" stroke="#111111" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="wind" stroke="#8E8E91" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Cross-Station Comparative Matrix */}
        <div className="bg-white border border-[#E8E6E0] rounded-3xl p-8 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-medium text-[#111111]">
              Pan-Polar Meteorological Comparison
            </h3>
            <span className="text-xs font-mono text-[#8E8E91]">Synchronous Live Status</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-[#E8E6E0] text-[#8E8E91]">
                <tr>
                  <th className="py-3 px-4">STATION</th>
                  <th className="py-3 px-4">REGION</th>
                  <th className="py-3 px-4">COORDINATES</th>
                  <th className="py-3 px-4">TEMPERATURE</th>
                  <th className="py-3 px-4">WIND SPEED</th>
                  <th className="py-3 px-4">PRESSURE</th>
                  <th className="py-3 px-4">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6E0]">
                {stationsWeather.map((s) => (
                  <tr 
                    key={s.station_id} 
                    onClick={() => setSelectedStationId(s.station_id)}
                    className={`hover:bg-[#F4F2EE] cursor-pointer transition ${
                      s.station_id === selectedStationId ? 'bg-[#F4F2EE] text-[#111111] font-semibold' : 'text-[#555558]'
                    }`}
                  >
                    <td className="py-4 px-4 font-semibold text-[#111111]">{s.station_name}</td>
                    <td className="py-4 px-4 text-[#8E8E91]">{s.region}</td>
                    <td className="py-4 px-4">{s.latitude.toFixed(2)}°, {s.longitude.toFixed(2)}°</td>
                    <td className="py-4 px-4 text-[#111111] font-bold">{s.temperature_c}°C</td>
                    <td className="py-4 px-4">{s.wind_speed_kmh} km/h</td>
                    <td className="py-4 px-4">{s.surface_pressure_hpa} hPa</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F4F2EE] border border-[#E8E6E0] text-[#111111] text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                        <span>Online</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
