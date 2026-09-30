import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Building2, MapPin, Compass, Thermometer, Radio, 
  Calendar, Layers, Globe, ExternalLink, ShieldCheck, 
  Activity, ArrowUpRight, CheckCircle2, ArrowRight,
  Users, Ship, Wifi, Zap, Droplets, Gauge
} from 'lucide-react';
import { fetchStations, fetchLiveObservatory } from '../api';
import { Station, StationWeather } from '../types';
import { DetailedPolarMap } from '../components/DetailedPolarMap';
import { PolarGlobe3D } from '../components/PolarGlobe3D';

const STATION_LOGISTICS: Record<string, {
  summerCrew: string;
  winterCrew: string;
  lifeline: string;
  comms: string;
  power: string;
  water: string;
  architecture: string;
}> = {
  maitri: {
    summerCrew: '65 Personnel',
    winterCrew: '25 Winter-Over',
    lifeline: 'M/V Vasiliy Golovnin (Cape Town ➔ Princess Astrid Coast)',
    comms: 'GSAT-14 Satellite Link + Inmarsat FleetBroadband',
    power: 'CHP Cogeneration + Arctic Low-Pour Gensets',
    water: 'Lake Priyadarshini Heated Pipeline Catchment',
    architecture: 'Containerized Steel Habitat & Astronomical Dome'
  },
  bharati: {
    summerCrew: '47 Personnel',
    winterCrew: '24 Winter-Over',
    lifeline: 'M/V Vasiliy Golovnin / S.A. Agulhas II (Prydz Bay Anchorage)',
    comms: 'Raw Earth Station (IRS Downlink) + Ka-band Dedicated IP',
    power: '3x 100 kW Low-Emission CHP + Solar Array',
    water: 'Reverse Osmosis Desalination & Meltwater Plant',
    architecture: 'Aerodynamic Stilt-Elevated Modular Two-Story Deck'
  },
  himadri: {
    summerCrew: '12 Researchers',
    winterCrew: '4 Winter-Over (Year-Round)',
    lifeline: 'Longyearbyen ➔ Ny-Ålesund Air & Sea Ice Corridor',
    comms: 'SvalSat High-Latitude Dedicated Fiber Array',
    power: 'Kings Bay Community District Heating Grid',
    water: 'Kongsfjorden Glacio-Lacustrine Distribution',
    architecture: 'Heritage Polar Timber Complex & Physics Labs'
  },
  himansh: {
    summerCrew: '15 High-Altitude Researchers',
    winterCrew: 'Automated Telemetry AWS (Winter Autonomous)',
    lifeline: 'Manali ➔ Rohtang ➔ Batal ➔ Sutri Dhaka Traverse',
    comms: 'VSAT Terminal & IRIDIUM SBD Burst Array',
    power: 'High-Altitude Solar PV + Lithium Cold-Pack',
    water: 'Samudra Tapu Glacial Stream Headwaters',
    architecture: 'Cold-Insulated High-Altitude Weather Haven Dome'
  }
};

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [weatherList, setWeatherList] = useState<StationWeather[]>([]);
  const [weatherMap, setWeatherMap] = useState<Record<string, StationWeather>>({});
  const [selectedStationId, setSelectedStationId] = useState<string>('maitri');
  const [mapMode, setMapMode] = useState<'2d' | '3d'>('2d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [stationsData, weatherData] = await Promise.all([
          fetchStations(),
          fetchLiveObservatory().catch(() => [])
        ]);
        setStations(stationsData);
        setWeatherList(weatherData);
        
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
  const activeLogistics = activeStation ? STATION_LOGISTICS[activeStation.id] || STATION_LOGISTICS['maitri'] : null;

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111111] pb-24 font-sans selection:bg-[#111111] selection:text-white">
      
      {/* 1. Header */}
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

      {/* 2. Tactical Polar Observation Deck with 2D/3D Mode Switcher */}
      <div className="border-b border-[#E8E6E0]">
        
        {/* View Switcher Subheader Bar */}
        <div className="bg-[#F4F2EE] border-b border-[#E8E6E0] px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#555558]">
            <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="font-semibold uppercase tracking-wider text-[#111111]">Tactical Polar Deck</span>
            <span className="hidden sm:inline text-[#8E8E91]">
              · {mapMode === '2d' ? '2D Polar Stereographic & Continental Projections' : '3D Real-Time WebGL Planetary Orbit Console'}
            </span>
          </div>

          <div className="inline-flex items-center p-1 bg-white rounded-xl border border-[#E8E6E0] shadow-2xs">
            <button
              onClick={() => setMapMode('2d')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                mapMode === '2d'
                  ? 'bg-[#111111] text-white shadow-xs font-semibold'
                  : 'text-[#555558] hover:text-[#111111]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2D Tactical Map</span>
            </button>
            <button
              onClick={() => setMapMode('3d')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                mapMode === '3d'
                  ? 'bg-[#111111] text-white shadow-xs font-semibold'
                  : 'text-[#555558] hover:text-[#111111]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>3D Planetary Orbit</span>
            </button>
          </div>
        </div>

        {/* Dynamic Map Render Deck */}
        {mapMode === '2d' ? (
          <DetailedPolarMap
            stations={stations}
            stationsWeather={weatherList}
            selectedStationId={selectedStationId}
            onSelectStation={setSelectedStationId}
            height="540px"
            onViewTelemetry={() => {
              document.getElementById('station-dossier-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        ) : (
          <div className="relative w-full h-[540px] bg-[#07151F] border-b border-[#E8E6E0] overflow-hidden">
            <PolarGlobe3D
              onSelectStation={(id) => {
                setSelectedStationId(id);
                document.getElementById('station-dossier-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <div className="absolute top-4 left-4 z-10 pointer-events-none bg-[#071A2B]/85 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#38BDF8]/20 text-xs font-mono text-[#E2E8F0] shadow-xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
                <span className="text-[#38BDF8] font-bold">Interactive 3D Polar Telemetry</span>
              </div>
              <p className="text-[11px] text-[#94A3B8] mt-1">
                Drag to orbit globe · Hover or click station beacons to inspect scientific dossier
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Detailed Station Architectural & Scientific Dossier */}
      <div id="station-dossier-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
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

        {/* Station Dossier Grid: Left Photo & Logistics, Right Comprehensive Fact Sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Station Photo & Logistics Column */}
          {activeStation && (
            <div className="lg:col-span-5 space-y-4">
              
              {/* Authentic Station Photo */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#E8E6E0] bg-[#F4F2EE] shadow-sm">
                <img
                  src={activeStation.image_url}
                  alt={activeStation.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-mono text-[#111111] border border-white/40 font-semibold shadow-sm">
                    {activeStation.region}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#111111] text-white text-xs font-mono font-medium flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                    {activeStation.status || 'Active Year-Round'}
                  </span>
                </div>

                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs font-mono text-white/90">
                  <span className="truncate max-w-[200px]">Credit: {activeStation.image_credit}</span>
                  <span className="font-medium bg-black/50 px-2.5 py-0.5 rounded backdrop-blur-sm">Est. {activeStation.commissioned_year}</span>
                </div>
              </div>

              {/* Station Geographic Quick Bar */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8E6E0] flex items-center justify-between text-xs font-mono text-[#111111] shadow-2xs">
                <div className="flex items-center gap-2 text-[#555558]">
                  <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>COORDINATES:</span>
                </div>
                <span className="font-semibold">
                  {Math.abs(activeStation.latitude).toFixed(4)}°{activeStation.latitude >= 0 ? 'N' : 'S'}, {Math.abs(activeStation.longitude).toFixed(4)}°{activeStation.longitude >= 0 ? 'E' : 'W'}
                </span>
                <span className="text-[#8E8E91] pl-2 border-l border-[#E8E6E0]">ALT {activeStation.elevation_m}m</span>
              </div>

              {/* Operational Logistics & Life Support Card */}
              {activeLogistics && (
                <div className="bg-white p-5 rounded-2xl border border-[#E8E6E0] space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-[#E8E6E0] pb-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#2563EB] font-semibold uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                      <span>Operational Life Support</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#8E8E91] uppercase">NCPOR Protocols</span>
                  </div>

                  <div className="space-y-3 text-xs font-sans">
                    <div className="flex items-start gap-2.5">
                      <Users className="w-4 h-4 text-[#555558] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-mono text-[#8E8E91] uppercase">Crew Capacity</div>
                        <div className="text-[#111111] font-medium">{activeLogistics.summerCrew} · {activeLogistics.winterCrew}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Ship className="w-4 h-4 text-[#555558] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-mono text-[#8E8E91] uppercase">Resupply Lifeline</div>
                        <div className="text-[#111111] font-medium leading-snug">{activeLogistics.lifeline}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Wifi className="w-4 h-4 text-[#555558] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-mono text-[#8E8E91] uppercase">Telemetry Link</div>
                        <div className="text-[#111111] font-medium leading-snug">{activeLogistics.comms}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Zap className="w-4 h-4 text-[#555558] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-mono text-[#8E8E91] uppercase">Primary Microgrid</div>
                        <div className="text-[#111111] font-medium leading-snug">{activeLogistics.power}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Station Technical Dossier Column (No Duplicate Image Glitch!) */}
          {activeStation && (
            <div className="lg:col-span-7 space-y-6">
              
              {/* Station Fact Sheet */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E6E0] space-y-6 shadow-2xs">
                
                {/* Header Information */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8E8E91] uppercase tracking-wider">
                    <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{activeStation.location_description}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#111111] leading-snug">
                    {activeStation.name}
                  </h2>
                  <p className="text-sm text-[#555558] font-normal leading-relaxed">
                    {activeStation.purpose}
                  </p>
                </div>

                {/* 6-Metric Technical Specifications Grid */}
                <div className="space-y-2 pt-2 border-t border-[#E8E6E0]">
                  <span className="text-[11px] font-mono text-[#8E8E91] uppercase tracking-wider block font-semibold">
                    Technical Specifications & Environmental Baseline
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-[#E8E6E0]/80 space-y-1">
                      <span className="text-[#8E8E91] block text-[10px] uppercase font-medium">Coordinates</span>
                      <span className="text-[#111111] font-semibold text-[11px]">
                        {Math.abs(activeStation.latitude).toFixed(3)}°{activeStation.latitude >= 0 ? 'N' : 'S'}, {Math.abs(activeStation.longitude).toFixed(3)}°{activeStation.longitude >= 0 ? 'E' : 'W'}
                      </span>
                    </div>

                    <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-[#E8E6E0]/80 space-y-1">
                      <span className="text-[#8E8E91] block text-[10px] uppercase font-medium">Elevation ASL</span>
                      <span className="text-[#111111] font-semibold text-[11px]">{activeStation.elevation_m} meters</span>
                    </div>

                    <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-[#E8E6E0]/80 space-y-1">
                      <span className="text-[#8E8E91] block text-[10px] uppercase font-medium">Commissioned</span>
                      <span className="text-[#111111] font-semibold text-[11px]">{activeStation.commissioned_year}</span>
                    </div>

                    <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-[#E8E6E0]/80 space-y-1">
                      <span className="text-[#8E8E91] block text-[10px] uppercase font-medium">Architecture</span>
                      <span className="text-[#111111] font-semibold text-[11px] truncate block" title={activeLogistics?.architecture}>
                        {activeLogistics ? activeLogistics.architecture.split('&')[0] : 'Modular Habitat'}
                      </span>
                    </div>

                    <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-[#E8E6E0]/80 space-y-1">
                      <span className="text-[#8E8E91] block text-[10px] uppercase font-medium">Microgrid</span>
                      <span className="text-[#111111] font-semibold text-[11px] truncate block" title={activeLogistics?.power}>
                        {activeLogistics ? activeLogistics.power.split('+')[0] : 'CHP Cogeneration'}
                      </span>
                    </div>

                    <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-[#E8E6E0]/80 space-y-1">
                      <span className="text-[#8E8E91] block text-[10px] uppercase font-medium">Water Source</span>
                      <span className="text-[#111111] font-semibold text-[11px] truncate block" title={activeLogistics?.water}>
                        {activeLogistics ? activeLogistics.water.split('&')[0] : 'Glacial Meltwater'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Multidisciplinary Science Themes */}
                <div className="space-y-2.5 pt-2 border-t border-[#E8E6E0]">
                  <span className="text-xs font-mono text-[#8E8E91] uppercase tracking-wider block font-semibold">
                    Core Multidisciplinary Scientific Mandate
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeStation.research_themes?.map((t) => (
                      <span key={t} className="px-3 py-1.5 rounded-full bg-[#F4F2EE] text-xs font-mono text-[#111111] border border-[#E8E6E0] font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Live Environmental Telemetry Banner */}
                {activeWeather && (
                  <div className="pt-4 border-t border-[#E8E6E0] bg-[#FAFAF8] p-4 sm:p-5 rounded-2xl border border-[#E8E6E0] flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                        <span className="text-[10px] font-mono uppercase text-[#555558] tracking-wider block font-semibold">
                          Live Meteorological Telemetry (Open-Meteo High-Resolution)
                        </span>
                      </div>
                      <div className="text-lg font-mono font-bold text-[#111111] flex items-center gap-3">
                        <span>{activeWeather.temperature_c}°C</span>
                        <span className="text-xs font-normal text-[#555558]">·</span>
                        <span className="text-xs font-normal text-[#555558]">Wind: {activeWeather.wind_speed_kmh} km/h</span>
                        <span className="text-xs font-normal text-[#555558]">·</span>
                        <span className="text-xs font-normal text-[#555558]">{activeWeather.surface_pressure_hpa} hPa</span>
                      </div>
                    </div>
                    <Link
                      href="/observatory"
                      className="px-4 py-2.5 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-mono font-medium flex items-center gap-2 transition shadow-xs"
                    >
                      <span>Observatory Console</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />
                    </Link>
                  </div>
                )}

                {/* Mission & Archive Connections Quick Nav */}
                <div className="pt-4 border-t border-[#E8E6E0] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#555558]">
                  <span>Explore cross-referenced archives:</span>
                  <div className="flex items-center gap-3">
                    <Link href={`/expeditions?region=${encodeURIComponent(activeStation.region)}`} className="text-[#2563EB] hover:underline flex items-center gap-1 font-medium">
                      <span>Field Expeditions</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                    <span className="text-[#E8E6E0]">|</span>
                    <Link href={`/datasets?station=${activeStation.id}`} className="text-[#2563EB] hover:underline flex items-center gap-1 font-medium">
                      <span>Observation Datasets</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
