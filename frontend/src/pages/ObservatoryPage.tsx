import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, Wind, Thermometer, Droplets, Gauge, 
  MapPin, Clock, ShieldCheck, RefreshCw, Compass, 
  ArrowUpRight, Download, Activity, Sun, Zap, Satellite,
  Users, CheckCircle2, AlertTriangle, ChevronRight
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import L from 'leaflet';
import { fetchLiveObservatory, fetchStationHistory, getStationTelemetryExportUrl } from '../api';
import { StationWeather, StationHistoryResponse, TelemetryHourlyReading } from '../types';

export const ObservatoryPage: React.FC = () => {
  const [stationsWeather, setStationsWeather] = useState<StationWeather[]>([]);
  const [selectedStationId, setSelectedStationId] = useState<string>('maitri');
  const [historyData, setHistoryData] = useState<StationHistoryResponse | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'temp' | 'wind' | 'pressure' | 'solar'>('temp');
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const loadLiveData = async () => {
    try {
      const data = await fetchLiveObservatory();
      setStationsWeather(data);
    } catch (err) {
      console.error('Failed to fetch live observatory data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryData = async (stationId: string) => {
    setHistoryLoading(true);
    try {
      const data = await fetchStationHistory(stationId);
      setHistoryData(data);
    } catch (err) {
      console.error(`Failed to fetch history for ${stationId}:`, err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      loadLiveData(),
      loadHistoryData(selectedStationId)
    ]);
    setRefreshing(false);
  };

  useEffect(() => {
    loadLiveData();
  }, []);

  useEffect(() => {
    loadHistoryData(selectedStationId);
  }, [selectedStationId]);

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
            width: ${isSelected ? '28px' : '18px'};
            height: ${isSelected ? '28px' : '18px'};
            background-color: ${isSelected ? '#111111' : '#FFFFFF'};
            border: 2px solid ${isSelected ? '#2563EB' : '#111111'};
            border-radius: 50%;
            box-shadow: 0 4px 14px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.25s ease;
          ">
            <div style="width: 7px; height: 7px; background-color: ${isSelected ? '#3B82F6' : '#111111'}; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([st.latitude, st.longitude], { icon: customIcon }).addTo(map);
      marker.on('click', () => setSelectedStationId(st.station_id));
      markersRef.current[st.station_id] = marker;
    });

    if (activeWeather) {
      map.panTo([activeWeather.latitude, activeWeather.longitude], { animate: true, duration: 1 });
    }
  }, [stationsWeather, selectedStationId]);

  // Chart data source from history readings
  const chartReadings = historyData?.readings || [];

  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] text-[#111111] pb-24 font-sans selection:bg-[#111111] selection:text-white">
      
      {/* 1. Scientific Observatory Header */}
      <div className="border-b border-[#E8E6E0] bg-[#FAFAF8] px-4 sm:px-8 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#555558] bg-[#F4F2EE] px-3.5 py-1.5 rounded-full border border-[#E8E6E0] font-medium tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span>LIVE POLAR OBSERVATORY CONSOLE · 24-HOUR DIURNAL TELEMETRY</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-medium text-[#111111] tracking-tight">
              Real-time atmospheric & polar instrumentation
            </h1>
            <p className="text-sm text-[#555558] font-light max-w-2xl">
              Continuous synoptic observations, 24-hour diurnal sensor histories, and operational health telemetry across Indian research bases in Antarctica, the Arctic, and the Western Himalaya.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Download CSV */}
            <a
              href={getStationTelemetryExportUrl(selectedStationId)}
              download={`${selectedStationId}_telemetry_24h.csv`}
              className="px-4 py-2.5 rounded-full bg-white hover:bg-[#F4F2EE] border border-[#E8E6E0] text-xs font-mono text-[#111111] flex items-center gap-2 transition shadow-sm font-medium hover:border-[#111111]"
              title="Download scientific CSV with metadata headers"
            >
              <Download className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Export CSV (ISO-19115)</span>
            </a>

            {/* Sync Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2.5 rounded-full bg-[#111111] hover:bg-[#2563EB] text-white text-xs font-mono flex items-center gap-2 transition shadow-sm font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
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
          {stationsWeather.map((st) => {
            const isSelected = st.station_id === (activeWeather?.station_id || 'maitri');
            return (
              <button
                key={st.station_id}
                onClick={() => setSelectedStationId(st.station_id)}
                className={`px-4 py-2.5 rounded-full text-xs font-mono backdrop-blur-md transition-all flex items-center gap-2 border shadow-sm ${
                  isSelected
                    ? 'bg-[#111111] text-white font-medium border-[#111111] ring-2 ring-[#2563EB]/40'
                    : 'bg-white/95 text-[#555558] hover:text-[#111111] border-[#E8E6E0] hover:bg-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#3B82F6] animate-pulse' : 'bg-[#16A34A]'}`} />
                <span className="font-semibold">{st.station_name}</span>
                <span className="text-[10px] opacity-60">({st.region})</span>
              </button>
            );
          })}
        </div>

        {/* Station Coordinates Indicator (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#E8E6E0] text-xs font-mono text-[#111111] shadow-md flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#555558]">
            <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>GEO-POS:</span>
          </div>
          <strong>{activeWeather?.latitude.toFixed(4)}°N</strong>,{' '}
          <strong>{activeWeather?.longitude.toFixed(4)}°E</strong>
          {historyData && (
            <span className="text-[#8E8E91] pl-2 border-l border-[#E8E6E0]">
              ALT {historyData.elevation_m}m ASL
            </span>
          )}
        </div>
      </div>

      {/* 3. Instrumentation Telemetry Console */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        
        {/* Enormous Live Readings */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E6E0] pb-3">
            <div>
              <h2 className="text-2xl font-serif font-medium text-[#111111]">
                {activeWeather?.station_name} Synoptic Telemetry
              </h2>
              <p className="text-xs font-mono text-[#8E8E91] mt-0.5">
                Observational snapshot timestamp: {activeWeather?.timestamp || 'Synchronizing...'} (UTC)
              </p>
            </div>
            <div className="text-xs font-mono text-[#555558] flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#E8E6E0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              <span>NCPOR AWS NETWORK · OPEN-METEO SYNC</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* TEMPERATURE */}
            <div className="bg-white border border-[#E8E6E0] rounded-3xl p-7 flex flex-col justify-between space-y-4 shadow-sm hover:border-[#111111] transition">
              <div className="flex items-center justify-between text-xs font-mono text-[#8E8E91]">
                <span>SURFACE AIR TEMP</span>
                <Thermometer className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div>
                <span className="text-5xl sm:text-6xl font-mono font-bold text-[#111111] tracking-tight">
                  {loading ? '...' : `${activeWeather?.temperature_c}°C`}
                </span>
                {historyData && (
                  <span className="block text-xs font-mono text-[#555558] mt-1.5">
                    Wind Chill: <strong>{historyData.readings[historyData.readings.length - 1]?.apparent_temperature_c ?? activeWeather?.temperature_c}°C</strong>
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-[#555558] pt-2 border-t border-[#E8E6E0] flex items-center justify-between">
                <span>{activeWeather?.temperature_c && activeWeather.temperature_c < 0 ? 'Sub-Zero Cryosphere' : 'Ablation Melting Regime'}</span>
                {historyData && (
                  <span className="text-[#8E8E91] font-mono text-[10px]">
                    24h: [{historyData.summary.min_temperature_c}° / {historyData.summary.max_temperature_c}°]
                  </span>
                )}
              </div>
            </div>

            {/* WIND VELOCITY */}
            <div className="bg-white border border-[#E8E6E0] rounded-3xl p-7 flex flex-col justify-between space-y-4 shadow-sm hover:border-[#111111] transition">
              <div className="flex items-center justify-between text-xs font-mono text-[#8E8E91]">
                <span>WIND SPEED & VECTOR</span>
                <Wind className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div>
                <span className="text-5xl sm:text-6xl font-mono font-bold text-[#111111] tracking-tight">
                  {loading ? '...' : `${activeWeather?.wind_speed_kmh}`}
                </span>
                <span className="text-lg text-[#8E8E91] font-mono ml-1 font-normal">km/h</span>
                <span className="block text-xs font-mono text-[#555558] mt-1.5 flex items-center gap-1.5">
                  <Compass className="w-3 h-3 text-[#2563EB]" />
                  <span>Direction: <strong>{activeWeather?.wind_direction_deg ?? 180}°</strong></span>
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#555558] pt-2 border-t border-[#E8E6E0] flex items-center justify-between">
                <span>{activeWeather?.wind_speed_kmh && activeWeather.wind_speed_kmh > 40 ? 'Severe Katabatic Gale' : 'Normal Drainage Flow'}</span>
                {historyData && (
                  <span className="text-[#8E8E91] font-mono text-[10px]">
                    Peak: {historyData.summary.max_wind_speed_kmh} km/h
                  </span>
                )}
              </div>
            </div>

            {/* PRESSURE */}
            <div className="bg-white border border-[#E8E6E0] rounded-3xl p-7 flex flex-col justify-between space-y-4 shadow-sm hover:border-[#111111] transition">
              <div className="flex items-center justify-between text-xs font-mono text-[#8E8E91]">
                <span>BAROMETRIC PRESSURE</span>
                <Gauge className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div>
                <span className="text-4xl sm:text-5xl font-mono font-bold text-[#111111] tracking-tight">
                  {loading ? '...' : `${activeWeather?.surface_pressure_hpa}`}
                </span>
                <span className="text-sm text-[#8E8E91] font-mono ml-1 font-normal">hPa</span>
                {historyData && (
                  <span className="block text-xs font-mono text-[#555558] mt-1.5">
                    24h Tendency: <strong className={historyData.summary.pressure_trend_hpa >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}>
                      {historyData.summary.pressure_trend_hpa >= 0 ? `+${historyData.summary.pressure_trend_hpa}` : historyData.summary.pressure_trend_hpa} hPa
                    </strong>
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-[#555558] pt-2 border-t border-[#E8E6E0]">
                {historyData && historyData.summary.pressure_trend_hpa > 1 ? 'High pressure anticyclone' : 'Frontal boundary active'}
              </div>
            </div>

            {/* HUMIDITY & SOLAR */}
            <div className="bg-white border border-[#E8E6E0] rounded-3xl p-7 flex flex-col justify-between space-y-4 shadow-sm hover:border-[#111111] transition">
              <div className="flex items-center justify-between text-xs font-mono text-[#8E8E91]">
                <span>HUMIDITY & SOLAR FLUX</span>
                <Sun className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div>
                <span className="text-4xl sm:text-5xl font-mono font-bold text-[#111111] tracking-tight">
                  {loading ? '...' : `${activeWeather?.relative_humidity_pct}%`}
                </span>
                <span className="text-sm text-[#8E8E91] font-mono ml-1 font-normal">RH</span>
                {historyData && (
                  <span className="block text-xs font-mono text-[#555558] mt-1.5">
                    Solar Flux: <strong>{historyData.readings[historyData.readings.length - 1]?.solar_radiation_wm2 ?? 0} W/m²</strong>
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-[#555558] pt-2 border-t border-[#E8E6E0] flex items-center justify-between">
                <span>Capacitive Thin-Film</span>
                {historyData && (
                  <span className="text-[#8E8E91] font-mono text-[10px]">
                    Peak Sun: {historyData.summary.peak_solar_radiation_wm2} W/m²
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4. 24-Hour Diurnal Telemetry Trends & Parameter Switching */}
        <div className="bg-white border border-[#E8E6E0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E8E6E0] pb-5">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-full border border-[#BFDBFE] font-medium mb-1.5">
                <Activity className="w-3 h-3" />
                <span>24-HOUR SYNOPTIC TIME-SERIES</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#111111]">
                Diurnal Atmospheric Profile: {activeWeather?.station_name}
              </h3>
              <p className="text-xs text-[#8E8E91] font-mono mt-0.5">
                Continuous 24-point diurnal cycle synchronized via Open-Meteo & NCPOR Station Telemetry Loggers
              </p>
            </div>

            {/* Metric Selector Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F4F2EE] rounded-2xl border border-[#E8E6E0]">
              <button
                onClick={() => setSelectedMetric('temp')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all font-medium flex items-center gap-1.5 ${
                  selectedMetric === 'temp'
                    ? 'bg-white text-[#111111] shadow-sm border border-[#E8E6E0]'
                    : 'text-[#555558] hover:text-[#111111]'
                }`}
              >
                <Thermometer className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Temperature (°C)</span>
              </button>
              <button
                onClick={() => setSelectedMetric('wind')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all font-medium flex items-center gap-1.5 ${
                  selectedMetric === 'wind'
                    ? 'bg-white text-[#111111] shadow-sm border border-[#E8E6E0]'
                    : 'text-[#555558] hover:text-[#111111]'
                }`}
              >
                <Wind className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Wind Speed (km/h)</span>
              </button>
              <button
                onClick={() => setSelectedMetric('pressure')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all font-medium flex items-center gap-1.5 ${
                  selectedMetric === 'pressure'
                    ? 'bg-white text-[#111111] shadow-sm border border-[#E8E6E0]'
                    : 'text-[#555558] hover:text-[#111111]'
                }`}
              >
                <Gauge className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Pressure (hPa)</span>
              </button>
              <button
                onClick={() => setSelectedMetric('solar')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all font-medium flex items-center gap-1.5 ${
                  selectedMetric === 'solar'
                    ? 'bg-white text-[#111111] shadow-sm border border-[#E8E6E0]'
                    : 'text-[#555558] hover:text-[#111111]'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Solar Flux (W/m²)</span>
              </button>
            </div>
          </div>

          {/* Quick Statistical Summary Bar */}
          {historyData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAFAF8] p-4 rounded-2xl border border-[#E8E6E0]">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E8E91]">24h Min Temp</span>
                <p className="text-base font-mono font-bold text-[#111111]">
                  {historyData.summary.min_temperature_c}°C
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E8E91]">24h Max Temp</span>
                <p className="text-base font-mono font-bold text-[#111111]">
                  {historyData.summary.max_temperature_c}°C
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E8E91]">Peak Wind Velocity</span>
                <p className="text-base font-mono font-bold text-[#111111]">
                  {historyData.summary.max_wind_speed_kmh} km/h
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E8E91]">Barometric Tendency</span>
                <p className={`text-base font-mono font-bold ${historyData.summary.pressure_trend_hpa >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                  {historyData.summary.pressure_trend_hpa >= 0 ? `+${historyData.summary.pressure_trend_hpa}` : historyData.summary.pressure_trend_hpa} hPa
                </p>
              </div>
            </div>
          )}

          {/* Dynamic Recharts Chart */}
          <div className="h-80 w-full pt-2">
            {historyLoading ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-xs font-mono text-[#8E8E91] gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-[#2563EB]" />
                <span>Loading 24-hour diurnal telemetry dataset...</span>
              </div>
            ) : chartReadings.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#8E8E91]">
                No hourly telemetry available. Click Sync Telemetry above.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {selectedMetric === 'temp' ? (
                  <LineChart data={chartReadings} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E0" vertical={false} />
                    <XAxis 
                      dataKey="hour_label" 
                      stroke="#8E8E91" 
                      tick={{ fontSize: 10, fill: '#8E8E91', fontFamily: 'monospace' }} 
                      interval={3}
                    />
                    <YAxis 
                      stroke="#8E8E91" 
                      tick={{ fontSize: 10, fill: '#8E8E91', fontFamily: 'monospace' }} 
                      unit="°C"
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E8E6E0', color: '#111111', borderRadius: '14px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontFamily: 'monospace', fontSize: '11px' }} 
                    />
                    <Line type="monotone" dataKey="temperature_c" name="Surface Air Temp (°C)" stroke="#111111" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="apparent_temperature_c" name="Wind Chill (°C)" stroke="#2563EB" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2.5 }} />
                  </LineChart>
                ) : selectedMetric === 'wind' ? (
                  <AreaChart data={chartReadings} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                    <defs>
                      <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E0" vertical={false} />
                    <XAxis 
                      dataKey="hour_label" 
                      stroke="#8E8E91" 
                      tick={{ fontSize: 10, fill: '#8E8E91', fontFamily: 'monospace' }} 
                      interval={3}
                    />
                    <YAxis 
                      stroke="#8E8E91" 
                      tick={{ fontSize: 10, fill: '#8E8E91', fontFamily: 'monospace' }} 
                      unit=" km/h"
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E8E6E0', color: '#111111', borderRadius: '14px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontFamily: 'monospace', fontSize: '11px' }} 
                    />
                    <Area type="monotone" dataKey="wind_speed_kmh" name="Wind Speed (km/h)" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#windGradient)" dot={{ r: 3 }} />
                  </AreaChart>
                ) : selectedMetric === 'pressure' ? (
                  <LineChart data={chartReadings} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E0" vertical={false} />
                    <XAxis 
                      dataKey="hour_label" 
                      stroke="#8E8E91" 
                      tick={{ fontSize: 10, fill: '#8E8E91', fontFamily: 'monospace' }} 
                      interval={3}
                    />
                    <YAxis 
                      stroke="#8E8E91" 
                      tick={{ fontSize: 10, fill: '#8E8E91', fontFamily: 'monospace' }} 
                      domain={['dataMin - 2', 'dataMax + 2']}
                      unit=" hPa"
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E8E6E0', color: '#111111', borderRadius: '14px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontFamily: 'monospace', fontSize: '11px' }} 
                    />
                    <Line type="monotone" dataKey="surface_pressure_hpa" name="Surface Pressure (hPa)" stroke="#111111" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                ) : (
                  <AreaChart data={chartReadings} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                    <defs>
                      <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EAB308" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#EAB308" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E0" vertical={false} />
                    <XAxis 
                      dataKey="hour_label" 
                      stroke="#8E8E91" 
                      tick={{ fontSize: 10, fill: '#8E8E91', fontFamily: 'monospace' }} 
                      interval={3}
                    />
                    <YAxis 
                      stroke="#8E8E91" 
                      tick={{ fontSize: 10, fill: '#8E8E91', fontFamily: 'monospace' }} 
                      unit=" W/m²"
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E8E6E0', color: '#111111', borderRadius: '14px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontFamily: 'monospace', fontSize: '11px' }} 
                    />
                    <Area type="monotone" dataKey="solar_radiation_wm2" name="Solar Radiation (W/m²)" stroke="#CA8A04" strokeWidth={2.5} fillOpacity={1} fill="url(#solarGradient)" dot={{ r: 3 }} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 5. NCPOR Sensor Calibration Registry & Operational Carrier Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sensor Calibration Health Registry (2 Cols) */}
          <div className="lg:col-span-2 bg-white border border-[#E8E6E0] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E8E6E0] pb-3">
              <div>
                <h3 className="text-xl font-serif font-medium text-[#111111]">
                  NCPOR Sensor Calibration Registry
                </h3>
                <p className="text-xs text-[#8E8E91] font-mono mt-0.5">
                  On-site physical instrumentation deployed at {activeWeather?.station_name}
                </p>
              </div>
              <span className="text-[10px] font-mono bg-[#F4F2EE] px-2.5 py-1 rounded-full text-[#555558] border border-[#E8E6E0]">
                {historyData?.sensors.length || 0} Instruments Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-[#E8E6E0] text-[#8E8E91]">
                  <tr>
                    <th className="py-2.5 px-3">SENSOR ID</th>
                    <th className="py-2.5 px-3">INSTRUMENT & MODEL</th>
                    <th className="py-2.5 px-3">PARAMETER</th>
                    <th className="py-2.5 px-3">ACCURACY</th>
                    <th className="py-2.5 px-3">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E6E0]">
                  {historyData?.sensors.map((sensor) => (
                    <tr key={sensor.sensor_id} className="hover:bg-[#FAFAF8] transition">
                      <td className="py-3 px-3 font-semibold text-[#111111]">{sensor.sensor_id}</td>
                      <td className="py-3 px-3">
                        <div className="text-[#111111] font-medium">{sensor.name}</div>
                        <div className="text-[10px] text-[#8E8E91]">{sensor.model}</div>
                      </td>
                      <td className="py-3 px-3 text-[#555558]">{sensor.parameter}</td>
                      <td className="py-3 px-3 text-[#8E8E91]">{sensor.accuracy}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                          sensor.status === 'Nominal' || sensor.status === 'Calibrated'
                            ? 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]'
                            : 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            sensor.status === 'Nominal' || sensor.status === 'Calibrated' ? 'bg-[#16A34A]' : 'bg-[#DC2626]'
                          }`} />
                          <span>{sensor.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!historyData || historyData.sensors.length === 0) && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-[#8E8E91]">
                        Loading sensor array telemetry...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Satellite Telemetry & Station Operations (1 Col) */}
          <div className="bg-white border border-[#E8E6E0] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-[#E8E6E0] pb-3">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#BFDBFE] font-medium mb-1">
                  <Satellite className="w-3 h-3" />
                  <span>TRANSMISSION TELEMETRY</span>
                </div>
                <h3 className="text-xl font-serif font-medium text-[#111111]">
                  Operational Status
                </h3>
              </div>

              {historyData && (
                <div className="space-y-3.5 text-xs font-mono">
                  {/* Carrier */}
                  <div className="bg-[#FAFAF8] p-3 rounded-2xl border border-[#E8E6E0] space-y-1">
                    <span className="text-[10px] text-[#8E8E91] uppercase tracking-wider">Uplink Carrier</span>
                    <div className="font-semibold text-[#111111] flex items-center justify-between">
                      <span className="text-xs">{historyData.operational.uplink_carrier}</span>
                      <span className="text-[10px] text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                        {historyData.operational.uplink_status}
                      </span>
                    </div>
                  </div>

                  {/* Latency & Packet Success */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#FAFAF8] p-3 rounded-2xl border border-[#E8E6E0] space-y-1">
                      <span className="text-[10px] text-[#8E8E91] uppercase tracking-wider">Ping RTT</span>
                      <div className="font-bold text-[#111111] text-sm">{historyData.operational.ping_latency_ms} ms</div>
                    </div>
                    <div className="bg-[#FAFAF8] p-3 rounded-2xl border border-[#E8E6E0] space-y-1">
                      <span className="text-[10px] text-[#8E8E91] uppercase tracking-wider">Packet Delivery</span>
                      <div className="font-bold text-[#16A34A] text-sm">{historyData.operational.packet_success_rate}%</div>
                    </div>
                  </div>

                  {/* Power & Microgrid */}
                  <div className="bg-[#FAFAF8] p-3 rounded-2xl border border-[#E8E6E0] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#8E8E91] uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#2563EB]" />
                        <span>Power Microgrid</span>
                      </span>
                      <span className="text-[10px] font-bold text-[#111111]">{historyData.operational.battery_bank_pct}% Storage</span>
                    </div>
                    <div className="w-full bg-[#E8E6E0] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#2563EB] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${historyData.operational.battery_bank_pct}%` }} 
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#555558] pt-1">
                      <span>Solar: <strong>{historyData.operational.solar_generation_kw} kW</strong></span>
                      <span>Wind: <strong>{historyData.operational.wind_generation_kw} kW</strong></span>
                    </div>
                  </div>

                  {/* Station Commander & Crew */}
                  <div className="bg-[#FAFAF8] p-3 rounded-2xl border border-[#E8E6E0] space-y-1">
                    <span className="text-[10px] text-[#8E8E91] uppercase tracking-wider flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#2563EB]" />
                      <span>Expedition Contingent</span>
                    </span>
                    <div className="text-xs text-[#111111] font-semibold">{historyData.operational.station_commander}</div>
                    <div className="text-[10px] text-[#555558]">
                      Wintering Crew: <strong>{historyData.operational.wintering_crew_size} Scientific & Logistical Personnel</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E8E6E0] text-[10px] font-mono text-[#8E8E91] flex items-center justify-between">
              <span>National Polar Data Center (NPDC)</span>
              <span className="text-[#2563EB] font-medium">NCPOR Ministry of Earth Sciences</span>
            </div>
          </div>
        </div>

        {/* 6. Cross-Station Comparative Matrix */}
        <div className="bg-white border border-[#E8E6E0] rounded-3xl p-8 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E6E0] pb-4">
            <div>
              <h3 className="text-xl font-serif font-medium text-[#111111]">
                Pan-Polar Meteorological Comparison Matrix
              </h3>
              <p className="text-xs text-[#8E8E91] font-mono mt-0.5">
                Multi-station synchronous comparison across Indian Antarctica, Arctic, and Himalayan nodes
              </p>
            </div>
            <span className="text-xs font-mono text-[#8E8E91] bg-[#F4F2EE] px-3 py-1 rounded-full border border-[#E8E6E0]">
              4 Synchronous Polar Feeds
            </span>
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
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6E0]">
                {stationsWeather.map((s) => {
                  const isCurrent = s.station_id === selectedStationId;
                  return (
                    <tr 
                      key={s.station_id} 
                      onClick={() => setSelectedStationId(s.station_id)}
                      className={`hover:bg-[#F4F2EE] cursor-pointer transition ${
                        isCurrent ? 'bg-[#F4F2EE] text-[#111111] font-semibold' : 'text-[#555558]'
                      }`}
                    >
                      <td className="py-4 px-4 font-semibold text-[#111111] flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-[#2563EB]' : 'bg-[#16A34A]'}`} />
                        <span>{s.station_name}</span>
                      </td>
                      <td className="py-4 px-4 text-[#8E8E91]">{s.region}</td>
                      <td className="py-4 px-4">{s.latitude.toFixed(2)}°, {s.longitude.toFixed(2)}°</td>
                      <td className="py-4 px-4 text-[#111111] font-bold">{s.temperature_c}°C</td>
                      <td className="py-4 px-4">{s.wind_speed_kmh} km/h</td>
                      <td className="py-4 px-4">{s.surface_pressure_hpa} hPa</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                          <span>Online Synced</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#2563EB] hover:underline font-mono">
                          <span>Focus Station</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
