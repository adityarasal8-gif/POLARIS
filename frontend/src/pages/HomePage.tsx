import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Compass, Radio, Database, ArrowRight, 
  Wind, Thermometer, Droplets, Gauge, ChevronRight,
  BookOpen, Search, Layers, Award, Sparkles, MapPin, 
  Calendar, FileText, CheckCircle2, Globe, Shield, Activity
} from 'lucide-react';
import { AgentShieldCanvas } from '../components/AgentShieldCanvas';
import { fetchStats, fetchLiveObservatory, fetchExpeditions, fetchPublications, unifiedSearch } from '../api';
import { Stats, StationWeather, Expedition, Publication, SearchResponse } from '../types';

export const HomePage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<Stats | null>(null);
  const [weatherList, setWeatherList] = useState<StationWeather[]>([]);
  const [selectedStationWeatherId, setSelectedStationWeatherId] = useState<string>('maitri');
  const [latestExpeditions, setLatestExpeditions] = useState<Expedition[]>([]);
  const [latestResearch, setLatestResearch] = useState<Publication[]>([]);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Search in homepage archive section
  const [homeSearchQuery, setHomeSearchQuery] = useState('Maitri atmosphere');
  const [homeSearchResults, setHomeSearchResults] = useState<SearchResponse | null>(null);
  const [homeSearchLoading, setHomeSearchLoading] = useState(false);

  useEffect(() => {
    // 1. Database stats
    fetchStats().then(setStats).catch(console.error);

    // 2. Live Open-Meteo telemetry
    fetchLiveObservatory()
      .then((data) => {
        setWeatherList(data);
        setWeatherLoading(false);
      })
      .catch((err) => {
        console.error('Weather fetch error:', err);
        setWeatherLoading(false);
      });

    // 3. Expeditions & Publications
    fetchExpeditions().then((res) => setLatestExpeditions(res.slice(0, 3))).catch(console.error);
    fetchPublications().then((res) => setLatestResearch(res.slice(0, 3))).catch(console.error);

    // 4. Initial archive search preview
    executeHomeSearch('Maitri atmosphere');
  }, []);

  const executeHomeSearch = async (q: string) => {
    if (!q.trim()) return;
    setHomeSearchLoading(true);
    try {
      const data = await unifiedSearch(q.trim());
      setHomeSearchResults(data);
    } catch (err) {
      console.error('Home search failed:', err);
    } finally {
      setHomeSearchLoading(false);
    }
  };

  const activeWeather = weatherList.find((w) => w.station_id === selectedStationWeatherId) || weatherList[0];

  const REGIONS = [
    {
      id: 'antarctica',
      name: 'ANTARCTICA',
      title: 'The Frozen Continent',
      desc: 'Decades of winter-over research at Maitri and Bharati stations exploring ice-sheet dynamics, ozone depletion chemistry, and paleoclimatology.',
      stations: 'Maitri (1988) · Bharati (2012)',
      themes: ['Cryosphere Stability', 'Atmospheric Physics', 'Paleoclimatology'],
      image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=85',
      coordinates: '70°46′S, 11°44′E',
      link: '/expeditions?region=Antarctica'
    },
    {
      id: 'arctic',
      name: 'ARCTIC',
      title: 'High-Latitude Amplification',
      desc: 'Station Himadri in Svalbard investigates Arctic amplification and its direct physical teleconnections with the Indian Summer Monsoon.',
      stations: 'Himadri (Ny-Ålesund, 2008)',
      themes: ['Fjord Oceanography', 'Aerosol Haze', 'Monsoon Teleconnections'],
      image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=1200&q=85',
      coordinates: '78°55′N, 11°55′E',
      link: '/expeditions?region=Arctic'
    },
    {
      id: 'himalaya',
      name: 'HIMALAYA',
      title: 'The Third Pole',
      desc: 'High-altitude observatory Himansh in Chandra Basin monitors benchmark glacier mass balances, snow-melt discharge, and black carbon deposition.',
      stations: 'Himansh (Spiti Valley, 2016)',
      themes: ['Glacier Mass Balance', 'Hydrological Runoff', 'Permafrost Dynamics'],
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
      coordinates: '32°24′N, 77°36′E (4,050m)',
      link: '/expeditions?region=Himalaya'
    },
    {
      id: 'southern-ocean',
      name: 'SOUTHERN OCEAN',
      title: 'Planetary Heat & Carbon Sink',
      desc: 'Oceanographic campaigns aboard research vessels traversing Sub-Antarctic and Polar Fronts to quantify oceanic carbon sequestration and deep water formation.',
      stations: 'Ocean Transects & Bio-Argo Floats',
      themes: ['Marine Biogeochemistry', 'CTD Profiling', 'Diatom Fluxes'],
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85',
      coordinates: '40°S – 68°S Transect',
      link: '/expeditions?region=Southern+Ocean'
    }
  ];

  const PIPELINE_STEPS = [
    {
      num: '01',
      title: 'FIELD EXPEDITION',
      subtitle: 'Field Operations',
      desc: 'Long-term scientific deployments across East Antarctica, Svalbard fjords, and Himalayan glaciers.',
      accent: '#D97706'
    },
    {
      num: '02',
      title: 'OBSERVATION',
      subtitle: 'Sensor Telemetry',
      desc: 'Autonomous weather stations, CTD profilers, fluxgate magnetometers, and shallow ice-core drilling.',
      accent: '#16A34A'
    },
    {
      num: '03',
      title: 'NPDC DATASET',
      subtitle: 'Data Standards',
      desc: 'Quality-calibrated, metadata-indexed open datasets archived under CC-BY-NC 4.0 policy.',
      accent: '#2563EB'
    },
    {
      num: '04',
      title: 'ANALYTICAL RESEARCH',
      subtitle: 'Cryosphere Modeling',
      desc: 'Planetary heat budgets, teleconnection modeling, and paleoclimate isotopic reconstructions.',
      accent: '#0EA5E9'
    },
    {
      num: '05',
      title: 'PEER-REVIEWED PUBLICATION',
      subtitle: 'Literature & DOIs',
      desc: 'High-impact research papers indexed across international cryosphere and atmospheric journals.',
      accent: '#7C3AED'
    },
    {
      num: '06',
      title: 'PUBLIC OUTREACH',
      subtitle: 'Source-Grounded Media',
      desc: 'Traceable scientific dissemination through the POLARIS editorial studio and student hub.',
      accent: '#111111'
    }
  ];

  return (
    <div className="w-full bg-[#FAFAF8] text-[#111111] selection:bg-[#111111] selection:text-[#FFFFFF]">
      
      {/* ========================================================================= */}
      {/* 1. AGENTSHIELD STYLE HERO: Clean Alabaster Canvas with Flowing Wave Ribbons */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-[#FAFAF8] pt-12 pb-16 border-b border-[#E8E6E0]">
        
        {/* Dynamic Sinusoidal Wave Canvas from AgentShield */}
        <AgentShieldCanvas />

        {/* Subtle Radial Dot-Matrix Grid Overlay */}
        <div 
          aria-hidden="true" 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ 
            backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.04) 1px, transparent 1px)', 
            backgroundSize: '28px 28px', 
            maskImage: 'radial-gradient(ellipse 75% 75% at 50% 40%, black, transparent)', 
            WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 40%, black, transparent)' 
          }} 
        />

        {/* Floating Perimeter Scientific Icons (like AgentShield) */}
        <div className="absolute left-[8%] top-[20%] text-[#D97706]/70 z-1 pointer-events-none drop-shadow-md hidden md:block">
          <Compass className="w-6 h-6" />
        </div>
        <div className="absolute left-[86%] top-[18%] text-[#2563EB]/70 z-1 pointer-events-none drop-shadow-md hidden md:block">
          <Globe className="w-6 h-6" />
        </div>
        <div className="absolute left-[6%] top-[62%] text-[#16A34A]/70 z-1 pointer-events-none drop-shadow-md hidden md:block">
          <Activity className="w-6 h-6" />
        </div>
        <div className="absolute left-[88%] top-[56%] text-[#7C3AED]/70 z-1 pointer-events-none drop-shadow-md hidden md:block">
          <Radio className="w-6 h-6" />
        </div>
        <div className="absolute left-[15%] top-[78%] text-[#0EA5E9]/70 z-1 pointer-events-none drop-shadow-md hidden md:block">
          <Search className="w-6 h-6" />
        </div>
        <div className="absolute left-[82%] top-[74%] text-[#16A34A]/70 z-1 pointer-events-none drop-shadow-md hidden md:block">
          <Shield className="w-6 h-6" />
        </div>

        {/* Center Hero Body */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full pt-4">

          {/* Headline in Playfair Display Serif */}
          <h1 className="font-serif text-[clamp(44px,7.5vw,86px)] font-light tracking-[-0.045em] leading-[1.02] text-[#111111] mb-6 max-w-3xl text-center">
            At the edge of the Earth,<br />
            India is <em className="italic font-normal">reading the planet.</em>
          </h1>

          {/* Subtitle in Inter */}
          <p className="font-sans text-[clamp(15px,1.3vw,18px)] leading-[1.76] text-[#555558] max-w-xl text-center mb-8">
            Explore India's research expeditions, polar stations, NPDC scientific datasets, and climate discoveries across Antarctica, the Arctic, the Himalayas, and the Southern Ocean.
          </p>

          {/* Action Button Pair (Pill Buttons) */}
          <div className="flex items-center gap-3 flex-wrap justify-center mb-10">
            <Link href="/expeditions" className="btn-primary">
              <span>Explore polar research</span>
              <span>→</span>
            </Link>
            <Link href="/observatory" className="btn-ghost">
              <span>Live observatory</span>
            </Link>
          </div>

          {/* Docked Search Bar (from AgentShield) */}
          <div className="w-full max-w-2xl bg-white border-[1.5px] border-[#E8E6E0] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] flex items-center p-1.5 focus-within:border-[#111111]/40 focus-within:shadow-[0_12px_40px_rgba(0,0,0,0.09)] transition-all mb-4">
            <input 
              type="text" 
              value={homeSearchQuery}
              onChange={(e) => setHomeSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeHomeSearch(homeSearchQuery)}
              placeholder="Ask anything about expeditions, stations, datasets, publications..."
              className="flex-1 h-12 px-4 bg-transparent outline-none text-[14.5px] text-[#111111] placeholder:text-[#8E8E91] font-sans"
            />
            <div className="hidden sm:flex items-center gap-1.5 pr-2">
              <button 
                type="button"
                onClick={() => { setHomeSearchQuery('Maitri atmosphere'); executeHomeSearch('Maitri atmosphere'); }}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#555558] bg-[#F4F2EE] border border-[#E8E6E0] hover:bg-[#E8E6E0] hover:text-[#111111] transition"
              >
                Maitri atmosphere
              </button>
              <button 
                type="button"
                onClick={() => { setHomeSearchQuery('45th ISEA'); executeHomeSearch('45th ISEA'); }}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#555558] bg-[#F4F2EE] border border-[#E8E6E0] hover:bg-[#E8E6E0] hover:text-[#111111] transition"
              >
                45th ISEA
              </button>
            </div>
            <button 
              type="button"
              onClick={() => executeHomeSearch(homeSearchQuery)}
              className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center hover:opacity-85 transition shrink-0"
              aria-label="Search archive"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Bottom Marquee Telemetry Band (AgentShield Ticker Style) */}
        <div className="absolute bottom-0 left-0 right-0 z-3 border-t border-[#E8E6E0] bg-[#FAFAF8]/90 backdrop-blur-md py-3 overflow-hidden">
          <p className="text-center text-[10.5px] font-bold tracking-[0.12em] uppercase text-[#8E8E91] mb-1.5 font-sans">
            Runtime Polar Telemetry and Scientific Controls
          </p>
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex w-max space-x-10 text-[13px] font-bold tracking-tight text-[#111111]/35 uppercase animate-pulse">
              <span>ANTARCTICA · MAITRI ({activeWeather?.temperature_c != null ? `${activeWeather.temperature_c}°C` : '-23.2°C'})</span>
              <span>·</span>
              <span>BHARATI (-12.2°C)</span>
              <span>·</span>
              <span>ARCTIC · HIMADRI (-3.7°C)</span>
              <span>·</span>
              <span>HIMALAYAS · HIMANSH (+4.0°C)</span>
              <span>·</span>
              <span>SOUTHERN OCEAN CAMPAIGN</span>
              <span>·</span>
              <span>45TH INDIAN SCIENTIFIC EXPEDITION</span>
              <span>·</span>
              <span>NPDC ATMOSPHERIC STANDARDS</span>
              <span>·</span>
              <span>OPEN-METEO LIVE FEED</span>
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. SECTION 1: "Four Regions. One Scientific Mission." (Clean Warm Grid)  */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8E6E0] pb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#D97706] mb-2 font-semibold">
              Geographic Scope
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#111111] tracking-tight">
              Four regions. One scientific mission.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#555558] max-w-xl font-normal leading-relaxed">
            India conducts uninterrupted year-round field research across the planetary cold spots that regulate climate, oceanic circulation, and global sea-level rise.
          </p>
        </div>

        {/* 4 Large Photographic Visual Chapters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {REGIONS.map((region) => (
            <Link 
              key={region.id} 
              href={region.link}
              className="group relative block aspect-[16/10] rounded-2xl overflow-hidden border border-[#E8E6E0] hover:border-[#111111]/30 transition duration-500 shadow-md hover:shadow-xl cursor-pointer bg-white"
            >
              {/* Background Photograph */}
              <img 
                src={region.image} 
                alt={region.title}
                className="w-full h-full object-cover polar-image-zoom brightness-[0.85] group-hover:brightness-95 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/40 to-transparent" />

              {/* Coordinates Pill */}
              <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono text-[#111111] border border-[#E8E6E0] shadow-xs">
                {region.coordinates}
              </div>

              {/* Bottom Editorial Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-3">
                <div className="text-xs font-mono tracking-widest uppercase text-[#5BB7A5] font-semibold">
                  {region.name} · {region.stations}
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-normal text-white group-hover:text-[#FAFAF8] transition-colors">
                  {region.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#F7F8F5]/90 line-clamp-2 font-normal leading-relaxed">
                  {region.desc}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#B9DDE7]">
                  <div className="flex flex-wrap gap-2">
                    {region.themes.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs border border-white/20 text-[10px] text-white">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="flex items-center gap-1 group-hover:translate-x-1.5 transition-transform font-bold text-white">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION 2: "From Fieldwork to Knowledge" (Warm Stone Horizontal Band)  */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#F4F2EE] border-y border-[#E8E6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-[#16A34A] font-semibold">
              The Scientific Method at 70° South
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#111111] tracking-tight">
              From fieldwork to planetary knowledge
            </h2>
            <p className="text-sm text-[#555558] font-normal leading-relaxed">
              How raw environmental observations in extreme polar environments transform into calibrated data, peer-reviewed discoveries, and verified public understanding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PIPELINE_STEPS.map((step) => (
              <div 
                key={step.num}
                className="bg-[#FFFFFF] border border-[#E8E6E0] p-5 rounded-2xl space-y-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs text-[#8E8E91]">
                    <span className="text-[#111111] font-bold">{step.num}</span>
                    <span className="uppercase text-[10px]">{step.subtitle}</span>
                  </div>
                  <h4 className="text-xs font-bold font-sans tracking-wide text-[#111111] uppercase">
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs text-[#555558] leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION 3: "Inside India's Polar Observatories" (Real-Scale Telemetry) */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8E6E0] pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#16A34A] mb-2 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span>LIVE ENVIRONMENTAL CONTEXT · Source: Open-Meteo</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#111111] tracking-tight">
              Inside India's polar observatories
            </h2>
          </div>
          <p className="text-sm text-[#555558] max-w-md">
            Continuous meteorological sensor telemetry streaming from Antarctica, the Arctic, and the high Himalayas.
          </p>
        </div>

        {/* Station Selector Pill Tabs */}
        <div className="flex flex-wrap gap-2.5">
          {weatherList.map((st) => (
            <button
              key={st.station_id}
              onClick={() => setSelectedStationWeatherId(st.station_id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold font-sans transition-all flex items-center gap-2 ${
                selectedStationWeatherId === st.station_id
                  ? 'bg-[#111111] text-white shadow-md'
                  : 'bg-white border border-[#E8E6E0] text-[#555558] hover:text-[#111111] hover:border-[#111111]/30'
              }`}
            >
              <span>{st.station_name}</span>
              <span className="font-mono text-[11px] opacity-80">
                {st.temperature_c != null ? `${st.temperature_c}°C` : '--'}
              </span>
            </button>
          ))}
        </div>

        {/* Real-Scale Telemetry Reading Grid */}
        <div className="bg-white border border-[#E8E6E0] rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E6E0] pb-6">
            <div>
              <span className="text-xs font-mono text-[#D97706] uppercase tracking-wider font-semibold">
                {activeWeather?.region || 'Antarctica'} · Active Telemetry Stream
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-normal text-[#111111]">
                {activeWeather?.station_name || 'Maitri Research Station'}
              </h3>
            </div>
            <Link
              href="/observatory"
              className="btn-primary text-xs !py-2.5 !px-5 w-fit"
            >
              <span>Open Observatory Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E8E6E0] space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#555558]">
                <Thermometer className="w-4 h-4 text-[#D97706]" />
                <span>SURFACE AIR TEMP</span>
              </div>
              <div className="text-3xl sm:text-5xl font-mono font-bold text-[#111111]">
                {activeWeather?.temperature_c != null ? `${activeWeather.temperature_c}°C` : '-23.2°C'}
              </div>
              <p className="text-[11px] text-[#8E8E91]">2m dry-bulb temperature sensor</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E8E6E0] space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#555558]">
                <Wind className="w-4 h-4 text-[#2563EB]" />
                <span>WIND SPEED & VECTOR</span>
              </div>
              <div className="text-3xl sm:text-5xl font-mono font-bold text-[#111111]">
                {activeWeather?.wind_speed_kmh != null ? `${activeWeather.wind_speed_kmh} km/h` : '6.5 km/h'}
              </div>
              <p className="text-[11px] text-[#8E8E91]">Ultrasonic 2-axis anemometer</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E8E6E0] space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#555558]">
                <Gauge className="w-4 h-4 text-[#0EA5E9]" />
                <span>BAROMETRIC PRESSURE</span>
              </div>
              <div className="text-3xl sm:text-5xl font-mono font-bold text-[#111111]">
                {activeWeather?.surface_pressure_hpa != null ? `${activeWeather.surface_pressure_hpa} hPa` : '972.6 hPa'}
              </div>
              <p className="text-[11px] text-[#8E8E91]">Digital barometric transducer</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E8E6E0] space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#555558]">
                <Droplets className="w-4 h-4 text-[#16A34A]" />
                <span>RELATIVE HUMIDITY</span>
              </div>
              <div className="text-3xl sm:text-5xl font-mono font-bold text-[#111111]">
                {activeWeather?.relative_humidity_pct != null ? `${activeWeather.relative_humidity_pct}%` : '72%'}
              </div>
              <p className="text-[11px] text-[#8E8E91]">Capacitive polymer hygrometer</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION 4: "Explore the Archive" (Unified Cross-Entity Discovery)      */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#F4F2EE] border-y border-[#E8E6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-semibold">
              The Central Product Interaction
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#111111] tracking-tight mt-1">
              What are you looking for in the polar archive?
            </h2>
            <p className="text-sm text-[#555558] mt-2">
              Search across campaigns, open research datasets, scientific stations, and peer-reviewed journals.
            </p>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {['Maitri atmosphere', '45th ISEA', 'Bharati', 'Himadri ice core', 'Larsemann Hills'].map((sample) => (
              <button
                key={sample}
                onClick={() => {
                  setHomeSearchQuery(sample);
                  executeHomeSearch(sample);
                }}
                className="px-3.5 py-1.5 rounded-full text-xs font-sans font-medium bg-white text-[#555558] hover:text-[#111111] border border-[#E8E6E0] transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>

          {/* Live Search Entity Connection Grid */}
          {homeSearchResults && (
            <div className="bg-white border border-[#E8E6E0] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#E8E6E0] pb-4">
                <span className="text-xs font-mono text-[#555558]">
                  Query: <strong className="text-[#111111]">"{homeSearchResults.query}"</strong> · {homeSearchResults.total_results} connected records
                </span>
                <Link href={`/repository?q=${encodeURIComponent(homeSearchResults.query)}`} className="text-xs font-bold text-[#111111] hover:underline flex items-center gap-1">
                  <span>View all in repository</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Station Result */}
                {homeSearchResults.results_by_type.stations?.[0] && (
                  <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0] space-y-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#111111] text-white">
                      Research Station
                    </span>
                    <h4 className="text-base font-serif font-bold text-[#111111]">
                      {homeSearchResults.results_by_type.stations[0].title}
                    </h4>
                    <p className="text-xs text-[#555558] line-clamp-2">
                      {homeSearchResults.results_by_type.stations[0].snippet}
                    </p>
                    <Link href={homeSearchResults.results_by_type.stations[0].url} className="text-xs font-semibold text-[#2563EB] hover:underline block pt-1">
                      Inspect station dossier →
                    </Link>
                  </div>
                )}

                {/* Dataset Result */}
                {homeSearchResults.results_by_type.datasets?.[0] && (
                  <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0] space-y-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#2563EB] text-white">
                      NPDC Dataset
                    </span>
                    <h4 className="text-base font-serif font-bold text-[#111111]">
                      {homeSearchResults.results_by_type.datasets[0].title}
                    </h4>
                    <p className="text-xs text-[#555558] line-clamp-2">
                      {homeSearchResults.results_by_type.datasets[0].snippet}
                    </p>
                    <Link href={homeSearchResults.results_by_type.datasets[0].url} className="text-xs font-semibold text-[#2563EB] hover:underline block pt-1">
                      Download data package →
                    </Link>
                  </div>
                )}

                {/* Expedition Result */}
                {homeSearchResults.results_by_type.expeditions?.[0] && (
                  <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0] space-y-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#D97706] text-white">
                      Field Campaign
                    </span>
                    <h4 className="text-base font-serif font-bold text-[#111111]">
                      {homeSearchResults.results_by_type.expeditions[0].title}
                    </h4>
                    <p className="text-xs text-[#555558] line-clamp-2">
                      {homeSearchResults.results_by_type.expeditions[0].snippet}
                    </p>
                    <Link href={homeSearchResults.results_by_type.expeditions[0].url} className="text-xs font-semibold text-[#2563EB] hover:underline block pt-1">
                      Explore field dossier →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SECTION 5: Featured Expedition (Editorial Showcase)                    */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-[#E8E6E0] pb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D97706] font-semibold">
            Active Campaign Dossier
          </span>
          <Link href="/expeditions" className="text-xs font-bold text-[#111111] hover:underline flex items-center gap-1">
            <span>Explore all expeditions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white border border-[#E8E6E0] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm">
          <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto relative">
            <img
              src="https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=85"
              alt="45th Indian Scientific Expedition to Antarctica"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-5 left-5 bg-white/95 px-3 py-1 rounded-full text-xs font-mono font-bold text-[#111111] shadow-xs">
              45TH ISEA · 2025–26
            </div>
          </div>
          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase text-[#16A34A] font-bold tracking-wider">
                ● Active Mission in Field
              </span>
              <h3 className="text-2xl sm:text-4xl font-serif font-normal text-[#111111] leading-tight">
                45th Indian Scientific Expedition to Antarctica
              </h3>
              <p className="text-sm text-[#555558] leading-relaxed">
                48-member interdisciplinary science contingent deployed aboard ice-class vessels to Maitri and Bharati stations for long-term climate modeling, sub-ice lake drilling, and atmospheric chemistry monitoring.
              </p>
              <div className="pt-2 space-y-2 text-xs font-mono text-[#555558]">
                <div><strong>Base:</strong> Maitri (Schirmacher Oasis) & Bharati (Larsemann Hills)</div>
                <div><strong>Voyage:</strong> Cape Town → Prydz Bay → Princess Astrid Coast</div>
                <div><strong>Science Themes:</strong> Deep Ice Coring, Ozone Depletion, Paleoseismology</div>
              </div>
            </div>

            <Link
              href="/expeditions/exp_45_isea"
              className="btn-primary w-fit text-xs !py-3 !px-6"
            >
              <span>Explore Complete Mission Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SECTION 6: Research & Publications (Editorial Article Layout)          */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#F4F2EE] border-y border-[#E8E6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E6E0] pb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-semibold">
                Peer-Reviewed Discoveries
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#111111] tracking-tight mt-1">
                Research from the polar frontier
              </h2>
            </div>
            <Link href="/publications" className="btn-ghost text-xs !py-2.5 !px-5 w-fit">
              <span>View Publications Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {latestResearch.map((paper, idx) => (
              <div
                key={paper.id}
                className={`p-6 sm:p-8 rounded-2xl bg-white border border-[#E8E6E0] space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                  idx === 0 ? 'lg:col-span-2' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-[#8E8E91]">
                    <span className="font-bold text-[#D97706]">{paper.year}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F4F2EE] border border-[#E8E6E0] text-[10px] text-[#555558]">
                      {paper.journal}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-normal text-[#111111] leading-snug">
                    {paper.title}
                  </h3>
                  <p className="text-xs text-[#555558] line-clamp-3 leading-relaxed">
                    {paper.abstract}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E8E6E0] flex items-center justify-between text-xs font-mono text-[#8E8E91]">
                  <span className="truncate max-w-[200px]">
                    {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                  </span>
                  <span className="text-[#2563EB] font-semibold">DOI: {paper.doi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. SECTION 7: Smart Education & Student Hub Preview                       */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="bg-[#111111] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#B9DDE7] border border-white/15">
              Smart Education Initiative · SIH26063
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal leading-tight text-white">
              Polar science is not only for scientists.
            </h2>
            <p className="text-sm sm:text-base text-[#DCEEF2]/85 leading-relaxed font-normal">
              Engage with interactive modules explaining ice-albedo climate feedback loops, Antarctic station engineering, cryospheric lexicons, and take our 5-question self-assessment quiz.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/learn" className="px-6 py-3.5 rounded-full bg-white hover:bg-[#F4F2EE] text-[#111111] font-semibold text-xs transition-all shadow-md">
                Launch Student Learning Hub
              </Link>
              <Link href="/knowledge-graph" className="px-6 py-3.5 rounded-full bg-transparent hover:bg-white/10 border border-white/20 text-white font-semibold text-xs transition-all">
                Explore Knowledge Graph
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
