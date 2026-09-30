import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Compass, Radio, Database, ArrowRight, 
  Wind, Thermometer, Droplets, Gauge, ChevronRight,
  BookOpen, Search, Layers, Award, Sparkles, MapPin, 
  Calendar, FileText, CheckCircle2, Globe
} from 'lucide-react';
import { PolarGlobe3D } from '../components/PolarGlobe3D';
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
      accent: '#74B8CC'
    },
    {
      num: '02',
      title: 'OBSERVATION',
      subtitle: 'Sensor Telemetry',
      desc: 'Autonomous weather stations, CTD profilers, fluxgate magnetometers, and shallow ice-core drilling.',
      accent: '#5BB7A5'
    },
    {
      num: '03',
      title: 'NPDC DATASET',
      subtitle: 'Data Standards',
      desc: 'Quality-calibrated, metadata-indexed open datasets archived under CC-BY-NC 4.0 policy.',
      accent: '#B9DDE7'
    },
    {
      num: '04',
      title: 'ANALYTICAL RESEARCH',
      subtitle: 'Cryosphere Modeling',
      desc: 'Planetary heat budgets, teleconnection modeling, and paleoclimate isotopic reconstructions.',
      accent: '#D7A75D'
    },
    {
      num: '05',
      title: 'PEER-REVIEWED PUBLICATION',
      subtitle: 'Literature & DOIs',
      desc: 'High-impact research papers indexed across international cryosphere and atmospheric journals.',
      accent: '#74B8CC'
    },
    {
      num: '06',
      title: 'PUBLIC OUTREACH',
      subtitle: 'Source-Grounded Media',
      desc: 'Traceable scientific dissemination through the POLARIS editorial studio and student hub.',
      accent: '#5BB7A5'
    }
  ];

  return (
    <div className="w-full bg-[#07151F] text-[#F7F8F5] selection:bg-[#74B8CC]/30 selection:text-[#07151F]">
      
      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO: Full-Viewport Planetary Composition with 3D Earth       */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden border-b border-[#B9DDE7]/10 polar-hero-glow polar-subtle-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Narrative Block */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-[#0D2735] border border-[#74B8CC]/30 text-xs font-mono text-[#DCEEF2]">
                <span className="w-2 h-2 rounded-full bg-[#5BB7A5] animate-pulse" />
                <span>INDIA'S POLAR SCIENCE INITIATIVE · MoES</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.08]">
                At the edge of the Earth,<br />
                <span className="italic text-[#B9DDE7]">India is reading the planet.</span>
              </h1>

              <p className="text-base sm:text-xl text-[#8E9EA7] leading-relaxed max-w-2xl font-light">
                Explore four decades of scientific expeditions, year-round research stations, calibrated observational datasets, and planetary discoveries across Antarctica, the Arctic, the Himalayas, and the Southern Ocean.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-3">
                <Link
                  href="/repository"
                  className="px-6 py-3.5 rounded-lg bg-[#74B8CC] hover:bg-[#B9DDE7] text-[#07151F] font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center space-x-2.5 group"
                >
                  <Database className="w-4 h-4 text-[#07151F]" />
                  <span>EXPLORE POLAR RESEARCH</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/observatory"
                  className="px-6 py-3.5 rounded-lg bg-[#0D2735] hover:bg-[#143547] border border-[#B9DDE7]/20 text-[#F7F8F5] font-semibold text-xs uppercase tracking-wider transition-all flex items-center space-x-2.5"
                >
                  <Radio className="w-4 h-4 text-[#5BB7A5]" />
                  <span>VIEW LIVE OBSERVATORY</span>
                </Link>
              </div>

              {/* Verified Institutional Evidence Pill */}
              <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-[#8E9EA7] font-mono border-t border-[#B9DDE7]/10">
                <div className="flex items-center gap-2">
                  <span className="text-[#F7F8F5] font-bold">{stats?.expeditions || 10}</span>
                  <span>Expeditions</span>
                </div>
                <span className="text-[#61747E]">·</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#F7F8F5] font-bold">4</span>
                  <span>Polar Stations</span>
                </div>
                <span className="text-[#61747E]">·</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#F7F8F5] font-bold">{stats?.datasets || 20}</span>
                  <span>NPDC Datasets</span>
                </div>
                <span className="text-[#61747E]">·</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#F7F8F5] font-bold">{stats?.publications || 15}</span>
                  <span>Peer-Reviewed Papers</span>
                </div>
              </div>
            </div>

            {/* Right: Integrated 3D Polar Earth Globe (Seamlessly blended, not boxed) */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[460px] sm:min-h-[540px]">
              <div className="w-full h-full min-h-[460px] sm:min-h-[540px]">
                <PolarGlobe3D onSelectStation={(stId) => setLocation(`/stations`)} />
              </div>

              {/* Geographic Legend Overlay */}
              <div className="absolute bottom-2 left-2 right-2 bg-[#07151F]/80 backdrop-blur-md border border-[#B9DDE7]/15 rounded-lg p-3 text-[11px] font-mono text-[#8E9EA7] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#74B8CC]" />
                  <span className="text-white font-medium">Southern Axis & Orbital Telemetry</span>
                </div>
                <div className="text-[10px] text-[#61747E]">
                  Maitri · Bharati · Himadri · Himansh
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SECTION 1: "Four Regions. One Scientific Mission." (Large Imagery)    */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#B9DDE7]/10 pb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#74B8CC] mb-2 font-semibold">
              Geographic Scope
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
              Four regions. One scientific mission.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#8E9EA7] max-w-xl font-light">
            India conducts uninterrupted year-round field research across the planetary cold spots that regulate climate, oceanic circulation, and global sea-level rise.
          </p>
        </div>

        {/* 4 Large Photographic Visual Chapters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {REGIONS.map((region) => (
            <Link 
              key={region.id} 
              href={region.link}
              className="group relative block aspect-[16/10] rounded-2xl overflow-hidden border border-[#B9DDE7]/15 hover:border-[#74B8CC]/40 transition duration-500 shadow-2xl cursor-pointer"
            >
              {/* Background Photograph */}
              <img 
                src={region.image} 
                alt={region.title}
                className="w-full h-full object-cover polar-image-zoom brightness-[0.78] group-hover:brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07151F] via-[#07151F]/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

              {/* Coordinates Pill */}
              <div className="absolute top-5 left-5 bg-[#07151F]/80 backdrop-blur-md px-3 py-1 rounded text-[11px] font-mono text-[#B9DDE7] border border-[#B9DDE7]/15">
                {region.coordinates}
              </div>

              {/* Bottom Editorial Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-3">
                <div className="text-xs font-mono tracking-widest uppercase text-[#5BB7A5] font-semibold">
                  {region.name} · {region.stations}
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white group-hover:text-[#B9DDE7] transition-colors">
                  {region.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#DCEEF2]/85 line-clamp-2 font-light leading-relaxed">
                  {region.desc}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#74B8CC]">
                  <div className="flex flex-wrap gap-2">
                    {region.themes.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-[#07151F]/60 border border-[#B9DDE7]/10 text-[10px] text-[#DCEEF2]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="flex items-center gap-1 group-hover:translate-x-1.5 transition-transform font-bold">
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
      {/* 3. SECTION 2: "From Fieldwork to Knowledge" (Horizontal Journey)         */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#0A1B28] border-y border-[#B9DDE7]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-[#5BB7A5] font-semibold">
              The Scientific Method at 70° South
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              From fieldwork to planetary knowledge
            </h2>
            <p className="text-sm text-[#8E9EA7] font-light">
              How raw environmental observations in extreme polar environments transform into calibrated data, peer-reviewed discoveries, and verified public understanding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PIPELINE_STEPS.map((step) => (
              <div 
                key={step.num}
                className="bg-[#07151F] border border-[#B9DDE7]/10 p-5 rounded-xl space-y-3 hover:border-[#74B8CC]/30 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs text-[#61747E]">
                    <span className="text-[#74B8CC] font-bold">{step.num}</span>
                    <span className="uppercase text-[10px]">{step.subtitle}</span>
                  </div>
                  <h4 className="text-xs font-bold font-sans tracking-wide text-white uppercase">
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs text-[#8E9EA7] leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION 3: "Inside India's Polar Observatories" (Real Telemetry)       */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#B9DDE7]/10 pb-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#5BB7A5] mb-2 font-semibold">
              Live Station Environment
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
              Inside India's polar observatories
            </h2>
          </div>
          <div className="text-xs font-mono text-[#8E9EA7] space-y-1">
            <div className="flex items-center gap-1.5 text-[#5BB7A5]">
              <span className="w-2 h-2 rounded-full bg-[#5BB7A5] animate-pulse" />
              <span className="font-semibold uppercase">LIVE ENVIRONMENTAL CONTEXT</span>
            </div>
            <div>Source: Open-Meteo API (Station Latitude/Longitude)</div>
          </div>
        </div>

        {/* Station Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {weatherList.map((st) => (
            <button
              key={st.station_id}
              onClick={() => setSelectedStationWeatherId(st.station_id)}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-2 ${
                st.station_id === (activeWeather?.station_id || 'maitri')
                  ? 'bg-[#74B8CC] text-[#07151F] font-bold shadow-md'
                  : 'bg-[#0D2735] text-[#8E9EA7] hover:text-white border border-[#B9DDE7]/10'
              }`}
            >
              <span>{st.station_name}</span>
              <span className="text-[10px] opacity-75">({st.region})</span>
            </button>
          ))}
        </div>

        {/* Large Observatory Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Station Visual Context */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-[#B9DDE7]/15 min-h-[360px] flex flex-col justify-end p-6 sm:p-8 bg-[#0D2735]">
            <img 
              src={
                activeWeather?.station_id === 'bharati'
                  ? 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80'
                  : activeWeather?.station_id === 'himadri'
                  ? 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=800&q=80'
                  : activeWeather?.station_id === 'himansh'
                  ? 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
                  : 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
              }
              alt={activeWeather?.station_name || 'Station'}
              className="absolute inset-0 w-full h-full object-cover brightness-[0.7]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07151F] via-[#07151F]/40 to-transparent" />

            <div className="relative z-10 space-y-2">
              <span className="px-2.5 py-1 rounded bg-[#07151F]/80 backdrop-blur-md text-[11px] font-mono text-[#5BB7A5] border border-[#5BB7A5]/30">
                {activeWeather?.region} · {activeWeather?.latitude.toFixed(2)}°, {activeWeather?.longitude.toFixed(2)}°
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {activeWeather?.station_name}
              </h3>
              <p className="text-xs text-[#DCEEF2]/85 font-light leading-relaxed">
                {activeWeather?.condition_description}
              </p>
              <div className="pt-2">
                <Link
                  href="/observatory"
                  className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#74B8CC] hover:underline"
                >
                  <span>Open Full Observatory Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Enormous Live Instrument Readings */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="bg-[#0D2735] border border-[#B9DDE7]/15 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-[#8E9EA7]">
                <span>SURFACE TEMPERATURE</span>
                <Thermometer className="w-4 h-4 text-[#74B8CC]" />
              </div>
              <div className="py-4">
                <span className="text-4xl sm:text-6xl font-mono font-bold text-white tracking-tight">
                  {weatherLoading ? '...' : `${activeWeather?.temperature_c}°C`}
                </span>
                <span className="block text-xs font-mono text-[#8E9EA7] mt-1">
                  Ambient air sensor
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#5BB7A5]">
                {activeWeather?.temperature_c && activeWeather.temperature_c < 0 ? 'Sub-Zero Cryosphere Regime' : 'Temperate High-Altitude'}
              </div>
            </div>

            <div className="bg-[#0D2735] border border-[#B9DDE7]/15 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-[#8E9EA7]">
                <span>WIND VELOCITY</span>
                <Wind className="w-4 h-4 text-[#5BB7A5]" />
              </div>
              <div className="py-4">
                <span className="text-4xl sm:text-6xl font-mono font-bold text-white tracking-tight">
                  {weatherLoading ? '...' : `${activeWeather?.wind_speed_kmh}`}
                </span>
                <span className="text-lg text-[#8E9EA7] font-mono font-normal ml-1">km/h</span>
                <span className="block text-xs font-mono text-[#8E9EA7] mt-1">
                  Anemometer at 10m height
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#74B8CC]">
                {activeWeather?.wind_speed_kmh && activeWeather.wind_speed_kmh > 40 ? 'Gale/Blizzard Warning' : 'Moderate Katabatic Flow'}
              </div>
            </div>

            <div className="bg-[#0D2735] border border-[#B9DDE7]/15 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-[#8E9EA7]">
                <span>BAROMETRIC PRESSURE</span>
                <Gauge className="w-4 h-4 text-[#D7A75D]" />
              </div>
              <div className="py-4">
                <span className="text-3xl sm:text-5xl font-mono font-bold text-white tracking-tight">
                  {weatherLoading ? '...' : `${activeWeather?.surface_pressure_hpa}`}
                </span>
                <span className="text-sm text-[#8E9EA7] font-mono font-normal ml-1">hPa</span>
                <span className="block text-xs font-mono text-[#8E9EA7] mt-1">
                  Atmospheric barograph
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#8E9EA7]">
                Synoptic pressure trend
              </div>
            </div>

            <div className="bg-[#0D2735] border border-[#B9DDE7]/15 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-[#8E9EA7]">
                <span>RELATIVE HUMIDITY</span>
                <Droplets className="w-4 h-4 text-[#74B8CC]" />
              </div>
              <div className="py-4">
                <span className="text-3xl sm:text-5xl font-mono font-bold text-white tracking-tight">
                  {weatherLoading ? '...' : `${activeWeather?.relative_humidity_pct}%`}
                </span>
                <span className="block text-xs font-mono text-[#8E9EA7] mt-1">
                  Hygrometric sensor
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#8E9EA7]">
                Dewpoint coupled
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION 4: "Explore the Archive" (Unified Cross-Entity Discovery)      */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#0A1B28] border-y border-[#B9DDE7]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-[#74B8CC] font-semibold">
              Unified Knowledge Discovery
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
              What are you looking for?
            </h2>
            <p className="text-sm sm:text-base text-[#8E9EA7] font-light leading-relaxed">
              Query across expeditions, observational datasets, peer-reviewed publications, research facilities, and scientific photography in one cross-connected index.
            </p>
          </div>

          {/* Large Search Bar */}
          <div className="relative max-w-3xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#74B8CC]" />
            <input 
              type="text"
              value={homeSearchQuery}
              onChange={(e) => {
                setHomeSearchQuery(e.target.value);
                executeHomeSearch(e.target.value);
              }}
              placeholder="Search expeditions, datasets, publications (e.g. 'Maitri atmosphere')..."
              className="w-full pl-14 pr-32 py-5 rounded-2xl bg-[#07151F] border border-[#B9DDE7]/20 text-white placeholder-[#61747E] text-base sm:text-lg focus:outline-none focus:border-[#74B8CC] shadow-2xl transition"
            />
            <Link
              href={`/repository?q=${encodeURIComponent(homeSearchQuery)}`}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-[#74B8CC] hover:bg-[#B9DDE7] text-[#07151F] font-bold text-xs uppercase font-mono transition"
            >
              Search
            </Link>
          </div>

          {/* Quick Demo Search Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#8E9EA7]">
            <span>Try searching:</span>
            {['Maitri atmosphere', '45th ISEA', 'Kongsfjorden IndArc', 'Chhota Shigri', 'Southern Ocean CTD'].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setHomeSearchQuery(chip);
                  executeHomeSearch(chip);
                }}
                className="px-3 py-1 rounded-md bg-[#07151F] hover:bg-[#143547] border border-[#B9DDE7]/15 text-[#DCEEF2] transition"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Cross-Entity Connected Results Preview */}
          {homeSearchResults && (
            <div className="pt-6 border-t border-[#B9DDE7]/10 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#8E9EA7]">
                <span>
                  Found <strong className="text-white">{homeSearchResults.total_results}</strong> connected records for "{homeSearchQuery}"
                </span>
                <Link href={`/repository?q=${encodeURIComponent(homeSearchQuery)}`} className="text-[#74B8CC] hover:underline flex items-center gap-1">
                  <span>View all in repository</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Expeditions Match */}
                {homeSearchResults.results_by_type.expeditions?.slice(0, 1).map((item) => (
                  <div key={item.id} className="bg-[#07151F] border border-[#5BB7A5]/30 p-5 rounded-xl space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#5BB7A5] font-semibold block">
                      EXPEDITION
                    </span>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-[#8E9EA7] line-clamp-2">{item.snippet || item.subtitle}</p>
                    <Link href={`/expeditions/${item.id}`} className="text-xs text-[#74B8CC] hover:underline font-mono inline-block pt-1">
                      View Expedition Dossier →
                    </Link>
                  </div>
                ))}

                {/* Datasets Match */}
                {homeSearchResults.results_by_type.datasets?.slice(0, 1).map((item) => (
                  <div key={item.id} className="bg-[#07151F] border border-[#74B8CC]/30 p-5 rounded-xl space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#74B8CC] font-semibold block">
                      NPDC DATASET
                    </span>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-[#8E9EA7] line-clamp-2">{item.snippet || item.subtitle}</p>
                    <Link href={`/datasets/${item.id}`} className="text-xs text-[#74B8CC] hover:underline font-mono inline-block pt-1">
                      Inspect Telemetry & Download →
                    </Link>
                  </div>
                ))}

                {/* Publications Match */}
                {homeSearchResults.results_by_type.publications?.slice(0, 1).map((item) => (
                  <div key={item.id} className="bg-[#07151F] border border-[#D7A75D]/30 p-5 rounded-xl space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#D7A75D] font-semibold block">
                      PEER-REVIEWED PUBLICATION
                    </span>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-[#8E9EA7] line-clamp-2">{item.snippet || item.subtitle}</p>
                    <Link href="/publications" className="text-xs text-[#D7A75D] hover:underline font-mono inline-block pt-1">
                      Read Paper & Citation →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SECTION 5: Featured Expedition (Large Editorial Showcase)              */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-[#B9DDE7]/15 bg-[#0D2735] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[500px]">
              <img 
                src="https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=85" 
                alt="45th ISEA Expedition"
                className="absolute inset-0 w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0D2735]/40 to-[#0D2735] hidden lg:block" />
              <div className="absolute top-6 left-6 bg-[#07151F]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-mono text-[#5BB7A5] border border-[#5BB7A5]/30">
                ACTIVE FIELD CAMPAIGN · 2025–2026
              </div>
            </div>

            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-widest text-[#74B8CC] font-semibold">
                  Flagship Mission Showcase
                </div>
                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
                  45th Indian Scientific Expedition to Antarctica
                </h3>
                <p className="text-xs sm:text-sm text-[#8E9EA7] font-light leading-relaxed">
                  Deployed aboard ice-class research vessels to Schirmacher Oasis and Larsemann Hills, executing deep ice drilling, boundary-layer atmospheric physics, and green hydrogen pilot infrastructure.
                </p>
                <div className="space-y-2 pt-2 text-xs font-mono text-[#DCEEF2]">
                  <div><strong className="text-[#8E9EA7]">Voyage:</strong> Cape Town → Maitri → Bharati</div>
                  <div><strong className="text-[#8E9EA7]">Expedition Leader:</strong> Dr. Ananya Mukherjee (NCPOR)</div>
                  <div><strong className="text-[#8E9EA7]">Linked Data:</strong> NPDC-ATMO-2025-01, NPDC-CRYO-2025-02</div>
                </div>
              </div>

              <div>
                <Link
                  href="/expeditions/exp_45_isea"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-[#74B8CC] hover:bg-[#B9DDE7] text-[#07151F] font-bold text-xs uppercase font-mono tracking-wider transition"
                >
                  <span>EXPLORE EXPEDITION DOSSIER</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SECTION 6: Research & Publications (Editorial Layout)                  */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#0A1B28] border-t border-[#B9DDE7]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#B9DDE7]/10 pb-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#D7A75D] font-semibold mb-2">
                Peer-Reviewed Science
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
                Research from the polar frontier
              </h2>
            </div>
            <Link href="/publications" className="text-xs font-mono text-[#74B8CC] hover:underline flex items-center gap-1.5">
              <span>View full publications archive ({stats?.publications || 15} papers)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* One Large Featured Paper + Two Smaller Papers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {latestResearch[0] && (
              <div className="lg:col-span-7 bg-[#07151F] border border-[#B9DDE7]/15 rounded-2xl p-8 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded bg-[#D7A75D]/15 text-[#D7A75D] border border-[#D7A75D]/30 font-semibold">
                      FEATURED PAPER · {latestResearch[0].journal} ({latestResearch[0].year})
                    </span>
                    <span className="text-[#8E9EA7]">DOI: {latestResearch[0].doi}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-snug">
                    {latestResearch[0].title}
                  </h3>
                  <div className="text-xs text-[#8E9EA7] font-mono">
                    {Array.isArray(latestResearch[0].authors) ? latestResearch[0].authors.join(', ') : latestResearch[0].authors}
                  </div>
                  <p className="text-xs sm:text-sm text-[#DCEEF2]/80 leading-relaxed font-light line-clamp-4">
                    {latestResearch[0].abstract}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#B9DDE7]/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-[#8E9EA7]">Cited by {latestResearch[0].citation_count} international studies</span>
                  <Link href="/publications" className="text-xs font-mono text-[#74B8CC] hover:underline font-bold">
                    Read Abstract & Export Citation →
                  </Link>
                </div>
              </div>
            )}

            <div className="lg:col-span-5 space-y-6">
              {latestResearch.slice(1, 3).map((pub) => (
                <div key={pub.id} className="bg-[#07151F] border border-[#B9DDE7]/15 rounded-2xl p-6 space-y-3">
                  <div className="text-[11px] font-mono text-[#D7A75D]">
                    {pub.journal} ({pub.year})
                  </div>
                  <h4 className="text-base font-bold text-white hover:text-[#74B8CC] transition">
                    {pub.title}
                  </h4>
                  <p className="text-xs text-[#8E9EA7] line-clamp-2 font-light">
                    {pub.abstract}
                  </p>
                  <Link href="/publications" className="text-xs font-mono text-[#74B8CC] hover:underline inline-block pt-1">
                    Citation Tools & Full Record →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. SECTION 7 & 8: Smart Education Teaser ("Not only for scientists")      */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-[#0D2735] to-[#07151F] border border-[#74B8CC]/20 rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl space-y-6 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#74B8CC]/15 text-[#74B8CC] border border-[#74B8CC]/30 text-xs font-mono">
              <BookOpen className="w-3.5 h-3.5" />
              <span>SMART EDUCATION HUB</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              Polar science is not only for scientists.
            </h2>
            <p className="text-sm sm:text-base text-[#8E9EA7] font-light leading-relaxed">
              Explore interactive modules decoding planetary albedo, Antarctic bottom water formation, and Spiti glacier monitoring. Test your understanding with our curated science quiz.
            </p>
            <div className="pt-2">
              <Link
                href="/learn"
                className="px-6 py-3.5 rounded-lg bg-[#74B8CC] hover:bg-[#B9DDE7] text-[#07151F] font-bold text-xs uppercase font-mono tracking-wider transition inline-flex items-center space-x-2"
              >
                <span>ENTER STUDENT HUB & TAKE QUIZ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
