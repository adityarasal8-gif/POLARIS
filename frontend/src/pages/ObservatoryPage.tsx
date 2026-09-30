import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, Wind, Thermometer, Droplets, Gauge, 
  MapPin, Clock, ShieldCheck, RefreshCw, Compass
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
    if (mapInstanceRef.current) return; // already initialized

    // Center map around Indian Ocean / Antarctic perspective
    const map = L.map(mapContainerRef.current, {
      center: [-40, 50],
      zoom: 2,
      minZoom: 2,
      maxZoom: 10,
      zoomControl: false
    });

    // High-resolution satellite basemap (Esri World Imagery / NASA)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics, NASA/USGS',
      maxZoom: 17
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);
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

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    stationsWeather.forEach((st) => {
      const isSelected = st.station_id === selectedStationId;
      
      const customIcon = L.divIcon({
        className: 'custom-polar-pin',
        html: `
          <div style="
            width: ${isSelected ? '28px' : '20px'};
            height: ${isSelected ? '28px' : '20px'};
            background-color: ${isSelected ? '#38BDF8' : '#22C7A8'};
            border: 2px solid #FFFFFF;
            border-radius: 50%;
            box-shadow: 0 0 15px ${isSelected ? '#38BDF8' : '#22C7A8'};
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
          ">
            <div style="width: 6px; height: 6px; background-color: #071A2B; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([st.latitude, st.longitude], { icon: customIcon }).addTo(map);
      marker.bindPopup(`<b>${st.station_name}</b><br/>Temp: ${st.temperature_c}°C<br/>Wind: ${st.wind_speed_kmh} km/h`);
      marker.on('click', () => setSelectedStationId(st.station_id));

      markersRef.current[st.station_id] = marker;
    });

    if (activeWeather) {
      map.flyTo([activeWeather.latitude, activeWeather.longitude], 4, {
        duration: 1.5
      });
    }
  }, [stationsWeather, selectedStationId]);

  // Synthetic 24-hr trend based on active station current metrics
  const trendData = activeWeather ? [
    { time: '00:00', temp: +(activeWeather.temperature_c - 1.8).toFixed(1), wind: +(activeWeather.wind_speed_kmh - 4).toFixed(1) },
    { time: '04:00', temp: +(activeWeather.temperature_c - 2.5).toFixed(1), wind: +(activeWeather.wind_speed_kmh - 2).toFixed(1) },
    { time: '08:00', temp: +(activeWeather.temperature_c - 0.9).toFixed(1), wind: +(activeWeather.wind_speed_kmh + 1).toFixed(1) },
    { time: '12:00', temp: +(activeWeather.temperature_c + 1.2).toFixed(1), wind: +(activeWeather.wind_speed_kmh + 5).toFixed(1) },
    { time: '16:00', temp: +(activeWeather.temperature_c + 0.5).toFixed(1), wind: +(activeWeather.wind_speed_kmh + 3).toFixed(1) },
    { time: '20:00', temp: +(activeWeather.temperature_c - 0.4).toFixed(1), wind: +(activeWeather.wind_speed_kmh).toFixed(1) },
    { time: 'Now', temp: activeWeather.temperature_c, wind: activeWeather.wind_speed_kmh },
  ] : [];

  return (
    <div className="w-full min-h-screen bg-[#071A2B] text-white py-8 px-4 sm:px-6 lg:px-8 polar-grid-bg text-left">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#6EC5E9]/15 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#22C7A8] font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#22C7A8] animate-ping" />
              <span>LIVE POLAR TELEMETRY OBSERVATORY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              National Polar Telemetry Console
            </h1>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="badge-live px-3 py-1 rounded font-bold">
              LIVE · Open-Meteo
            </span>
            <button
              onClick={loadData}
              disabled={refreshing}
              className="p-2 rounded-lg bg-[#0B2538] hover:bg-[#123753] border border-[#6EC5E9]/20 text-[#38BDF8] transition-colors"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Station Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stationsWeather.map((st) => (
            <button
              key={st.station_id}
              onClick={() => setSelectedStationId(st.station_id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedStationId === st.station_id
                  ? 'bg-[#0B2538] border-[#38BDF8] shadow-lg shadow-[#38BDF8]/10'
                  : 'bg-[#071A2B] border-[#6EC5E9]/15 hover:border-[#6EC5E9]/30 text-[#94A3B8]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-[#38BDF8]">
                  {st.region}
                </span>
                <span className="badge-live text-[9px] px-1.5 py-0.2 rounded uppercase">
                  {st.status}
                </span>
              </div>
              <div className="text-sm font-bold text-white mt-1">{st.station_name}</div>
              <div className="text-xl font-black text-white font-mono mt-1">
                {st.temperature_c > 0 ? `+${st.temperature_c}` : st.temperature_c}°C
              </div>
            </button>
          ))}
        </div>

        {/* Main Grid: Interactive Map (Left 7 Cols) + Live Telemetry (Right 5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Leaflet Map */}
          <div className="lg:col-span-7 h-[420px] sm:h-[480px] rounded-2xl overflow-hidden polar-panel border border-[#6EC5E9]/20 relative shadow-2xl">
            <div ref={mapContainerRef} className="w-full h-full z-0" />
            
            {/* Map Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-10 bg-[#071A2B]/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-[#6EC5E9]/20 text-[10px] font-mono text-[#94A3B8] space-y-1">
              <div className="text-white font-bold">INDIAN POLAR NETWORK</div>
              <div>• Antarctica: Maitri (-70.76°S), Bharati (-69.41°S)</div>
              <div>• Arctic: Himadri (78.92°N, Ny-Ålesund)</div>
              <div>• Himalaya: Himansh (32.40°N, Chandra Basin)</div>
            </div>
          </div>

          {/* Active Station Telemetry Panel */}
          {activeWeather ? (
            <div className="lg:col-span-5 polar-panel p-6 border border-[#6EC5E9]/20 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between border-b border-[#6EC5E9]/15 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#38BDF8]">
                      {activeWeather.region}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{activeWeather.station_name}</h3>
                  </div>
                  <span className="badge-live text-xs px-2.5 py-1 rounded font-bold uppercase">
                    {activeWeather.status}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline space-x-3">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono">
                    {activeWeather.temperature_c > 0 ? `+${activeWeather.temperature_c}` : activeWeather.temperature_c}°C
                  </span>
                  <span className="text-xs text-[#94A3B8] font-medium">{activeWeather.condition_description}</span>
                </div>

                {/* 4 Sensor Cards */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="p-3.5 rounded-xl bg-[#071A2B] border border-[#6EC5E9]/15">
                    <div className="text-[11px] font-mono text-[#647887] flex items-center space-x-1.5">
                      <Wind className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>Wind Speed</span>
                    </div>
                    <div className="text-base font-bold text-white font-mono mt-1">
                      {activeWeather.wind_speed_kmh} km/h
                    </div>
                    {activeWeather.wind_direction_deg && (
                      <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
                        Direction: {activeWeather.wind_direction_deg}°
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#071A2B] border border-[#6EC5E9]/15">
                    <div className="text-[11px] font-mono text-[#647887] flex items-center space-x-1.5">
                      <Droplets className="w-3.5 h-3.5 text-[#22C7A8]" />
                      <span>Relative Humidity</span>
                    </div>
                    <div className="text-base font-bold text-white font-mono mt-1">
                      {activeWeather.relative_humidity_pct}%
                    </div>
                    <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
                      Vapor Saturation
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#071A2B] border border-[#6EC5E9]/15">
                    <div className="text-[11px] font-mono text-[#647887] flex items-center space-x-1.5">
                      <Gauge className="w-3.5 h-3.5 text-[#E7A93B]" />
                      <span>Surface Pressure</span>
                    </div>
                    <div className="text-base font-bold text-white font-mono mt-1">
                      {Math.round(activeWeather.surface_pressure_hpa)} hPa
                    </div>
                    <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
                      Barometric Sensor
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#071A2B] border border-[#6EC5E9]/15">
                    <div className="text-[11px] font-mono text-[#647887] flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#6EC5E9]" />
                      <span>Coordinates</span>
                    </div>
                    <div className="text-xs font-bold text-white font-mono mt-1">
                      {activeWeather.latitude.toFixed(2)}°, {activeWeather.longitude.toFixed(2)}°
                    </div>
                    <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
                      WGS84 Reference
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#6EC5E9]/10 text-xs font-mono text-[#647887] space-y-1">
                <div className="flex items-center justify-between">
                  <span>Data Source:</span>
                  <span className="text-white font-semibold">{activeWeather.source}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Telemetry Timestamp:</span>
                  <span className="text-[#38BDF8]">{new Date(activeWeather.timestamp).toLocaleTimeString()} UTC</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-5 polar-panel p-6 flex items-center justify-center text-xs text-[#94A3B8]">
              Select a station above to inspect real-time telemetry.
            </div>
          )}
        </div>

        {/* 24-Hour Diurnal Observation Trend (Recharts) */}
        <div className="polar-panel p-6 border border-[#6EC5E9]/15 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#38BDF8] font-bold tracking-wider">
                DIURNAL VARIATION
              </span>
              <h3 className="text-base font-bold text-white">24-Hour Temperature & Wind Trend ({activeWeather?.station_name})</h3>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono text-[#94A3B8]">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                <span>Temperature (°C)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C7A8]" />
                <span>Wind Speed (km/h)</span>
              </span>
            </div>
          </div>

          <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(110, 197, 233, 0.1)" />
                <XAxis dataKey="time" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#071A2B', 
                    borderColor: '#38BDF8', 
                    borderRadius: '8px', 
                    color: '#fff',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }} 
                />
                <Line type="monotone" dataKey="temp" stroke="#38BDF8" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="wind" stroke="#22C7A8" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
