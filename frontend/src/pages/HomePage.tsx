import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Compass, Radio, Database, ArrowRight, 
  Wind, Thermometer, Droplets, Gauge, ChevronRight,
  BookOpen, Search, Layers, Award, Sparkles, MapPin, 
  Calendar, FileText, CheckCircle2, Globe, Shield, Activity,
  Satellite, Cpu, Clock, TrendingUp, Sun, Zap, ExternalLink,
  User, Lightbulb, Check, HelpCircle, RotateCcw
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

  // Interactive Quiz state in Section 7
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);

  const QUIZ_QUESTIONS = [
    {
      id: 'bharati_geo',
      topic: 'Antarctic Base Architecture',
      question: "Which geographical feature in East Antarctica is home to India's high-tech aerodynamic research station, Bharati?",
      options: [
        "Schirmacher Oasis (Queen Maud Land)",
        "Larsemann Hills (Prydz Bay Coast)",
        "Ny-Ålesund Kings Bay Fjord",
        "Chandra Basin (Western Himalaya)"
      ],
      correctIndex: 1,
      explanation: "Bharati Station was established in 2012 in the Larsemann Hills along the Prydz Bay coast of East Antarctica, specializing in oceanography, continental breakup geophysics, and atmospheric monitoring."
    },
    {
      id: 'himadri_arctic',
      topic: 'Arctic Teleconnections',
      question: "Located at 78.9°N in Ny-Ålesund, Svalbard, what is the primary scientific focus of India's Himadri Arctic station?",
      options: [
        "Fjord oceanography, aerosol radiative forcing, and polar-monsoon teleconnections",
        "Deep subglacial hydrocarbon and mineral exploration drilling",
        "Exclusive military reconnaissance of the Barents Sea",
        "Commercial polar tourism route development"
      ],
      correctIndex: 0,
      explanation: "Himadri focuses on Arctic fjord dynamics (Kongsfjorden), aerosol transport, microbial diversity in extreme cold, and teleconnections connecting polar atmospheric oscillations to the Indian summer monsoon."
    },
    {
      id: 'maitri_freshwater',
      topic: 'Polar Limnology & Logistics',
      question: "What is the crucial year-round freshwater source sustaining India's Maitri station in the ice-free Schirmacher Oasis?",
      options: [
        "Lake Vostok deep subglacial bore",
        "Lake Priyadarshini fresh meltwater reservoir",
        "Weddell Sea coastal ice melter",
        "Kongsfjorden desalination canal"
      ],
      correctIndex: 1,
      explanation: "Lake Priyadarshini, an ice-covered oligotrophic freshwater lake located adjacent to Maitri Station in Schirmacher Oasis, provides the critical potable water supply via an insulated, heated intake system."
    }
  ];

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

  // Detailed authentic scientific station dossiers
  const STATION_META: Record<string, {
    coords: string;
    elevation: string;
    founded: string;
    crew: string;
    uplink: string;
    windChill: string;
    solarInsolation: string;
    pressureTrend: string;
    dewPoint: string;
    image: string;
    disciplines: string[];
    status: string;
  }> = {
    maitri: {
      coords: '70°46′00″S, 11°44′00″E',
      elevation: '117 m ASL',
      founded: '1988 (37 yrs continuous)',
      crew: '25 Scientists & Wintering Crew',
      uplink: 'INSAT-3DR Geosynchronous Direct Feed',
      windChill: '-31.8°C',
      solarInsolation: '0 W/m² (Polar Transition)',
      pressureTrend: '+0.3 hPa/3h (Steady Rise)',
      dewPoint: '-27.4°C',
      image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
      disciplines: ['Atmospheric Chemistry', 'Ozone Sondes', 'Geomagnetism', 'Meteorology'],
      status: 'Year-Round Active Station'
    },
    bharati: {
      coords: '69°24′28″S, 76°11′14″E',
      elevation: '35 m ASL',
      founded: '2012 (Aerodynamic ISO Class)',
      crew: '22 Scientists & Engineers',
      uplink: 'High-Throughput Ku-Band Satellite',
      windChill: '-18.4°C',
      solarInsolation: '14 W/m² (Diffuse Coastal Light)',
      pressureTrend: '-0.1 hPa/3h (Barometer Steady)',
      dewPoint: '-15.8°C',
      image: 'https://images.unsplash.com/photo-1548263594-a71ea65a8598?auto=format&fit=crop&w=800&q=80',
      disciplines: ['Oceanography', 'Cryosphere Dynamics', 'Space Weather', 'Geophysics'],
      status: 'Year-Round Active Station'
    },
    himadri: {
      coords: '78°55′00″N, 11°55′00″E',
      elevation: '15 m ASL',
      founded: '2008 (Ny-Ålesund International)',
      crew: '8 Summer / Campaign Researchers',
      uplink: 'Svalbard Arctic High-Speed Fibre Link',
      windChill: '-7.9°C',
      solarInsolation: '42 W/m² (High-Latitude Twilight)',
      pressureTrend: '+0.7 hPa/3h (High Pressure Ridge)',
      dewPoint: '-6.2°C',
      image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=800&q=80',
      disciplines: ['Aerosol Optical Depth', 'Fjord Hydrology', 'Arctic Teleconnections'],
      status: 'Summer & Campaign Operations'
    },
    himansh: {
      coords: '32°24′00″N, 77°36′00″E',
      elevation: '4,050 m ASL',
      founded: '2016 (Chandra Basin Glacier Lab)',
      crew: '6 Glaciologists & Field Technicians',
      uplink: 'Sub-Alpine VSAT & VHF Telemetry',
      windChill: '-1.2°C',
      solarInsolation: '620 W/m² (High Alpine UV Peak)',
      pressureTrend: '-0.4 hPa/3h (Mountain Valley Cycle)',
      dewPoint: '-2.0°C',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      disciplines: ['Glacier Mass Balance', 'Hydrological Runoff', 'Albedo Feedback'],
      status: 'Alpine Field Station'
    }
  };

  const activeMeta = STATION_META[selectedStationWeatherId] || STATION_META.maitri;

  const REGIONS = [
    {
      id: 'antarctica',
      name: 'ANTARCTICA',
      title: 'The Frozen Continent',
      desc: '37 years of uninterrupted winter-over research at Maitri and Bharati exploring ice-sheet mass balance, deep firn coring, and ozone hole chemistry.',
      stations: 'Maitri (1988) · Bharati (2012)',
      history: '1981–Present · 45 Expeditions',
      coreMetric: 'Ice Sheet Dynamics & Paleoclimate',
      stat: '2 Active Stations · -89.2°C Min Record',
      themes: ['Cryosphere Stability', 'Atmospheric Physics', 'Paleoclimatology'],
      image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=85',
      coordinates: '70°46′S, 11°44′E',
      link: '/expeditions?region=Antarctica'
    },
    {
      id: 'arctic',
      name: 'ARCTIC',
      title: 'High-Latitude Amplification',
      desc: 'Station Himadri in Ny-Ålesund investigates polar vortex stability and physical teleconnections between Arctic warming and the Indian Summer Monsoon.',
      stations: 'Himadri (Ny-Ålesund, 2008)',
      history: '2008–Present · 16 Field Seasons',
      coreMetric: 'Arctic Amplification & Monsoon',
      stat: 'Svalbard Consortium · Year-Round Ops',
      themes: ['Fjord Oceanography', 'Aerosol Haze', 'Monsoon Teleconnections'],
      image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=1200&q=85',
      coordinates: '78°55′N, 11°55′E',
      link: '/expeditions?region=Arctic'
    },
    {
      id: 'himalaya',
      name: 'HIMALAYA',
      title: 'The Third Pole',
      desc: 'High-altitude research station Himansh in Chandra Basin monitors 6 benchmark glaciers, meltwater runoff budgets, and atmospheric black carbon deposition.',
      stations: 'Himansh (Spiti Valley, 2016)',
      history: '2016–Present · Benchmark Basin',
      coreMetric: 'Glacier Mass Balance & Runoff',
      stat: '4,050m Altitude · 6 Benchmark Glaciers',
      themes: ['Glacier Mass Balance', 'Hydrological Runoff', 'Permafrost Dynamics'],
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
      coordinates: '32°24′N, 77°36′E (4,050m)',
      link: '/expeditions?region=Himalaya'
    },
    {
      id: 'southern-ocean',
      name: 'SOUTHERN OCEAN',
      title: 'Planetary Heat & Carbon Sink',
      desc: 'Annual oceanic campaigns aboard ice-strengthened vessels traversing Sub-Antarctic and Polar Fronts to quantify oceanic carbon uptake and deep water formation.',
      stations: 'Ocean Transects & Bio-Argo Floats',
      history: '2004–Present · 13 Ocean Voyages',
      coreMetric: 'Antarctic Circumpolar Current',
      stat: '40°S–68°S Latitudes · 120 Bio-Argo Floats',
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
      desc: 'Long-term scientific deployments across East Antarctica, Svalbard fjords, and Himalayan glacier basins.',
      instrument: 'Arc4 Polar Vessel · Snowcat Traverses',
      deliverable: 'Primary Observations'
    },
    {
      num: '02',
      title: 'SENSOR TELEMETRY',
      subtitle: 'Data Acquisition',
      desc: 'Autonomous AWS networks, deep Sea-Bird CTD rosette casts, fluxgate magnetometers, and shallow ice-core drills.',
      instrument: 'Ultrasonic AWS · Fluxgate Magnetometers',
      deliverable: 'Raw Sensor Feeds'
    },
    {
      num: '03',
      title: 'NPDC CALIBRATION',
      subtitle: 'Data Standards',
      desc: 'ISO 19115 compliant metadata indexing, NetCDF/HDF5 format validation, and open archiving under CC-BY-NC 4.0 policy.',
      instrument: 'NetCDF / HDF5 · ISO 19115 Metadata',
      deliverable: 'Open Data Packages'
    },
    {
      num: '04',
      title: 'CLIMATE MODELING',
      subtitle: 'Analytical Research',
      desc: 'Coupled ocean-atmosphere models, monsoon teleconnections, and δ18O ice-core isotopic paleoclimate reconstructions.',
      instrument: 'WRF Polar Models · Mass Spectrometry',
      deliverable: 'Predictive Projections'
    },
    {
      num: '05',
      title: 'PEER-REVIEWED DOI',
      subtitle: 'Literature & DOIs',
      desc: 'High-impact scientific research papers indexed in Nature, Geophysical Research Letters, and Polar Science.',
      instrument: 'Crossref DOIs · Global Open Repositories',
      deliverable: 'Verified Discoveries'
    },
    {
      num: '06',
      title: 'OPEN DISSEMINATION',
      subtitle: 'Public Outreach',
      desc: 'Traceable scientific dissemination through POLARIS data explorer, classroom learning modules, and open research dossiers.',
      instrument: 'POLARIS Studio · Student Hub SIH26063',
      deliverable: 'National Impact'
    }
  ];

  return (
    <div className="w-full bg-[#FAFAF8] text-[#111111] selection:bg-[#111111] selection:text-[#FFFFFF]">
      
      {/* ========================================================================= */}
      {/* 1. HERO: Clean Alabaster Canvas with Flowing Wave Ribbons & Rich Data      */}
      {/* ========================================================================= */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#FAFAF8] pt-10 pb-20 border-b border-[#E8E6E0]">
        
        {/* Dynamic Sinusoidal Wave Canvas (Color Palette 100% Preserved) */}
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

        {/* Floating Kinetic Micro-Instruments (Real Polar Telemetry Badges with Smooth Physics) */}
        <div className="absolute left-6 xl:left-12 top-10 animate-float-1 z-1 hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#E8E6E0] shadow-xs text-[11px] font-mono text-[#555558] backdrop-blur-md">
          <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>70°46′S · Maitri Station (37y)</span>
        </div>

        <div className="absolute right-6 xl:right-12 top-10 animate-float-2 z-1 hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#E8E6E0] shadow-xs text-[11px] font-mono text-[#555558] backdrop-blur-md">
          <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>78°55′N · Himadri Svalbard (16s)</span>
        </div>

        <div className="absolute left-6 xl:left-12 bottom-24 animate-float-3 z-1 hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#E8E6E0] shadow-xs text-[11px] font-mono text-[#555558] backdrop-blur-md">
          <Radio className="w-3.5 h-3.5 text-[#2563EB]" />
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping-subtle" />
            <span>Telemetry Synced · INSAT-3DR</span>
          </span>
        </div>

        <div className="absolute right-6 xl:right-12 bottom-24 animate-float-1 z-1 hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#E8E6E0] shadow-xs text-[11px] font-mono text-[#555558] backdrop-blur-md">
          <Database className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>NPDC Archive · 892K Records</span>
        </div>

        {/* Center Hero Body */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full pt-4">

          {/* Headline in Playfair Display Serif with Entrance Animation */}
          <h1 className="font-serif text-[clamp(36px,5.4vw,68px)] font-light tracking-[-0.045em] leading-[1.04] text-[#111111] mb-4 max-w-2xl text-center animate-fade-in-up">
            At the edge of the Earth,<br />
            India is <em className="italic font-normal">reading the planet.</em>
          </h1>

          {/* Subtitle in Inter */}
          <p className="font-sans text-[clamp(14px,1.2vw,17px)] leading-[1.65] text-[#555558] max-w-xl text-center mb-8 animate-fade-in-up [animation-delay:120ms]">
            Explore India's research expeditions, polar stations, NPDC scientific datasets, and climate discoveries across Antarctica, the Arctic, the Himalayas, and the Southern Ocean.
          </p>

          {/* Action Button Pair with Spring Micro-Interactions */}
          <div className="flex items-center gap-3.5 flex-wrap justify-center mb-8 animate-fade-in-up [animation-delay:200ms]">
            <Link href="/expeditions" className="btn-primary group">
              <span>Explore polar research</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link href="/observatory" className="btn-ghost">
              <Activity className="w-4 h-4 text-[#2563EB]" />
              <span>Live observatory</span>
            </Link>
          </div>

          {/* Live Platform Authority Counters */}
          <div className="flex items-center justify-center gap-6 sm:gap-12 border-t border-[#E8E6E0] pt-6 max-w-2xl w-full animate-fade-in-up [animation-delay:280ms]">
            <div className="text-center group cursor-default">
              <div className="text-xl sm:text-2xl font-mono font-bold text-[#111111] group-hover:text-[#2563EB] transition-colors">4</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#8E8E91] mt-0.5">Active Bases</div>
            </div>
            <div className="h-7 w-px bg-[#E8E6E0]" />
            <div className="text-center group cursor-default">
              <div className="text-xl sm:text-2xl font-mono font-bold text-[#111111] group-hover:text-[#2563EB] transition-colors">45</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#8E8E91] mt-0.5">Expeditions</div>
            </div>
            <div className="h-7 w-px bg-[#E8E6E0]" />
            <div className="text-center group cursor-default">
              <div className="text-xl sm:text-2xl font-mono font-bold text-[#111111] group-hover:text-[#2563EB] transition-colors">3,420+</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#8E8E91] mt-0.5">Publications</div>
            </div>
            <div className="h-7 w-px bg-[#E8E6E0]" />
            <div className="text-center group cursor-default">
              <div className="text-xl sm:text-2xl font-mono font-bold text-[#111111] group-hover:text-[#2563EB] transition-colors">100%</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#8E8E91] mt-0.5">Open Datasets</div>
            </div>
          </div>
        </div>

        {/* Bottom Kinetic Dual-Track Infinite Marquee Ticker */}
        <div className="absolute bottom-0 left-0 right-0 z-3 border-t border-[#E8E6E0] bg-[#FAFAF8]/95 backdrop-blur-md py-3 overflow-hidden">
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="animate-marquee flex items-center space-x-8 text-[11.5px] font-mono tracking-wide text-[#111111]/75 uppercase">
              {/* Marquee Track 1 */}
              <div className="flex items-center space-x-8 shrink-0">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping-subtle" />
                  <strong className="text-[#111111]">MAITRI</strong> ({activeWeather?.temperature_c != null ? `${activeWeather.temperature_c}°C` : '-23.2°C'} · 70°S)
                </span>
                <span className="text-[#8E8E91]">·</span>
                <span><strong>BHARATI</strong> (-12.2°C · LARSEMANN HILLS)</span>
                <span className="text-[#8E8E91]">·</span>
                <span><strong>HIMADRI</strong> (-3.7°C · SVALBARD 78°N)</span>
                <span className="text-[#8E8E91]">·</span>
                <span><strong>HIMANSH</strong> (+4.0°C · 4,050M HIMALAYA)</span>
                <span className="text-[#8E8E91]">·</span>
                <span><strong>SOUTHERN OCEAN</strong> CAMPAIGN (SUB-ANTARCTIC FRONT)</span>
                <span className="text-[#8E8E91]">·</span>
                <span><strong>45TH ISEA</strong> ACTIVE FIELD DEPLOYMENT</span>
                <span className="text-[#8E8E91]">·</span>
                <span><strong>NPDC STANDARDS</strong> ISO 19115 NETCDF/HDF5</span>
                <span className="text-[#8E8E91]">·</span>
                <span><strong>LIVE SENSOR STREAM</strong> OPEN-METEO TELEMETRY</span>
                <span className="text-[#8E8E91]">·</span>
              </div>
              {/* Marquee Track 2 (Seamless Infinite Duplicate) */}
              <div className="flex items-center space-x-8 shrink-0">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping-subtle" />
                  <strong className="text-[#111111]">MAITRI</strong> ({activeWeather?.temperature_c != null ? `${activeWeather.temperature_c}°C` : '-23.2°C'} · 70°S)
                </span>
                <span className="text-[#8E8E91]">·</span>
                <span><strong>BHARATI</strong> (-12.2°C · LARSEMANN HILLS)</span>
                <span className="text-[#8E8E91]">·</span>
                <span><strong>HIMADRI</strong> (-3.7°C · SVALBARD 78°N)</span>
                <span className="text-[#8E8E91]">·</span>
                <span><strong>HIMANSH</strong> (+4.0°C · 4,050M HIMALAYA)</span>
                <span className="text-[#8E8E91]">·</span>
                <span><strong>SOUTHERN OCEAN</strong> CAMPAIGN (SUB-ANTARCTIC FRONT)</span>
                <span className="text-[#8E8E91]">·</span>
                <span><strong>45TH ISEA</strong> ACTIVE FIELD DEPLOYMENT</span>
                <span className="text-[#8E8E91]">·</span>
                <span><strong>NPDC STANDARDS</strong> ISO 19115 NETCDF/HDF5</span>
                <span className="text-[#8E8E91]">·</span>
                <span><strong>LIVE SENSOR STREAM</strong> OPEN-METEO TELEMETRY</span>
                <span className="text-[#8E8E91]">·</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. SECTION 1: "Four Regions. One Scientific Mission."                      */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E6E0] pb-5">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#2563EB] mb-1.5 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              <span>Geographic Scope & Field Observatories</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#111111] tracking-tight">
              Four regions. One scientific mission.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#555558] max-w-md font-normal leading-relaxed">
            India conducts uninterrupted year-round field research across the planetary cold spots that regulate climate, oceanic circulation, and global sea-level rise.
          </p>
        </div>

        {/* 4 Photographic Visual Chapters with Spring Micro-Interactions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REGIONS.map((region) => (
            <Link 
              key={region.id} 
              href={region.link}
              className="group relative block h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-[#E8E6E0] hover:border-[#111111]/40 card-hover-spring cursor-pointer bg-white"
            >
              {/* Background Photograph with Smooth Scale */}
              <img 
                src={region.image} 
                alt={region.title}
                className="w-full h-full object-cover polar-image-zoom brightness-[0.80] group-hover:brightness-90 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/95 via-[#111111]/50 to-transparent" />

              {/* Coordinates & Era Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold text-[#111111] border border-[#E8E6E0] shadow-xs">
                  {region.coordinates}
                </span>
                <span className="bg-[#111111]/70 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9.5px] font-mono text-white/90">
                  {region.history.split('·')[0].trim()}
                </span>
              </div>

              {/* Bottom Editorial Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#93C5FD] font-semibold">
                    {region.name}
                  </span>
                  <span className="text-[9.5px] font-mono text-white/75 truncate max-w-[140px]">
                    {region.stat}
                  </span>
                </div>
                
                <h3 className="text-xl font-serif font-normal text-white group-hover:text-[#FAFAF8] transition-colors leading-tight">
                  {region.title}
                </h3>
                
                <p className="text-xs text-[#F7F8F5]/90 line-clamp-2 font-normal leading-relaxed">
                  {region.desc}
                </p>

                <div className="pt-2.5 flex items-center justify-between text-xs font-mono text-[#93C5FD] border-t border-white/15">
                  <span className="text-[10px] text-white/80 truncate max-w-[150px]">{region.stations}</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold text-white text-[11px]">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION 2: "From Fieldwork to Planetary Knowledge" (Connected Pipeline) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#F4F2EE] border-y border-[#E8E6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 w-full">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-semibold flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              <span>Rigorous Data Provenance · The Scientific Method at 70° South</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#111111] tracking-tight">
              From fieldwork to planetary knowledge
            </h2>
            <p className="text-xs sm:text-sm text-[#555558] font-normal leading-relaxed max-w-2xl mx-auto">
              How raw observations in extreme polar environments transform into calibrated data, peer-reviewed discoveries, and verified public understanding.
            </p>
          </div>

          {/* Sequential Connected Pipeline Cards */}
          <div className="relative">
            {/* Desktop Horizontal Conduit Line */}
            <div 
              aria-hidden="true" 
              className="hidden lg:block absolute top-[28px] left-[5%] right-[5%] h-0.5 bg-gradient-to-r from-[#2563EB]/20 via-[#2563EB]/40 to-[#2563EB]/20 pointer-events-none z-0" 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative z-1">
              {PIPELINE_STEPS.map((step, idx) => (
                <div 
                  key={step.num}
                  className="bg-[#FFFFFF] border border-[#E8E6E0] hover:border-[#111111]/30 p-5 rounded-2xl space-y-3 shadow-xs card-hover-spring flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-mono text-xs font-bold shadow-xs group-hover:bg-[#2563EB] transition-colors">
                        {step.num}
                      </span>
                      <span className="uppercase text-[9.5px] font-mono text-[#2563EB] font-semibold bg-[#EFF6FF] px-2 py-0.5 rounded-full">
                        {step.subtitle}
                      </span>
                    </div>

                    <h4 className="text-[12px] font-bold font-sans tracking-wide text-[#111111] uppercase leading-tight pt-1">
                      {step.title}
                    </h4>

                    <p className="text-[11.5px] text-[#555558] leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E8E6E0] space-y-1">
                    <div className="text-[9.5px] font-mono text-[#8E8E91] truncate">
                      <span className="font-semibold text-[#111111]">Tool:</span> {step.instrument.split('·')[0].trim()}
                    </div>
                    <div className="text-[9.5px] font-mono text-[#2563EB] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
                      <span>{step.deliverable}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION 3: "Inside India's Polar Observatories" (Balanced 2-Column)    */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E6E0] pb-5">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#2563EB] mb-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping-subtle" />
              <span>LIVE ENVIRONMENTAL CONTEXT · Open-Meteo High-Resolution Model</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#111111] tracking-tight">
              Inside India's polar observatories
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#555558] max-w-md">
            Continuous meteorological sensor telemetry streaming from Antarctica, the Arctic, and the high Himalayas.
          </p>
        </div>

        {/* Station Selector Pill Tabs with Live Status */}
        <div className="flex flex-wrap items-center gap-2.5">
          {weatherList.map((st) => (
            <button
              key={st.station_id}
              onClick={() => setSelectedStationWeatherId(st.station_id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold font-sans transition-all flex items-center gap-2.5 ${
                selectedStationWeatherId === st.station_id
                  ? 'bg-[#111111] text-white shadow-md'
                  : 'bg-white border border-[#E8E6E0] text-[#555558] hover:text-[#111111] hover:border-[#111111]/30'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
              <span>{st.station_name}</span>
              <span className="font-mono text-[11px] opacity-80">
                {st.temperature_c != null ? `${st.temperature_c}°C` : '--'}
              </span>
            </button>
          ))}
        </div>

        {/* Balanced Two-Column Command Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column (7 cols): Meteorological Gauges & Telemetry */}
          <div className="lg:col-span-7 bg-white border border-[#E8E6E0] rounded-2xl p-6 sm:p-7 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E6E0] pb-4">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#2563EB] uppercase tracking-wider font-semibold">
                    <Satellite className="w-3.5 h-3.5" />
                    <span>{activeWeather?.region || 'Antarctica'} · {activeMeta.uplink}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-normal text-[#111111] mt-1">
                    {activeWeather?.station_name || 'Maitri Research Station'}
                  </h3>
                </div>
                <Link
                  href="/observatory"
                  className="btn-primary text-xs !py-2 !px-4 w-fit shrink-0"
                >
                  <span>Open Full Observatory Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 4 Primary Meteorological Instruments */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 sm:p-5 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0] space-y-1.5 card-hover-spring">
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-[#555558]">
                    <Thermometer className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>DRY BULB AIR TEMP</span>
                  </div>
                  <div className="text-2xl sm:text-4xl font-mono font-bold text-[#111111]">
                    {activeWeather?.temperature_c != null ? `${activeWeather.temperature_c}°C` : '-23.2°C'}
                  </div>
                  <div className="text-[10.5px] font-mono text-[#8E8E91] flex items-center justify-between pt-1">
                    <span>Apparent: {activeMeta.windChill}</span>
                    <span className="text-[#2563EB] font-semibold">Pt100 RTD</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0] space-y-1.5 card-hover-spring">
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-[#555558]">
                    <Wind className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>WIND SPEED & VECTOR</span>
                  </div>
                  <div className="text-2xl sm:text-4xl font-mono font-bold text-[#111111]">
                    {activeWeather?.wind_speed_kmh != null ? `${activeWeather.wind_speed_kmh} km/h` : '6.5 km/h'}
                  </div>
                  <div className="text-[10.5px] font-mono text-[#8E8E91] flex items-center justify-between pt-1">
                    <span>Sonic 2-Axis Anemometer</span>
                    <span className="text-[#16A34A] font-semibold">Nominal</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0] space-y-1.5 card-hover-spring">
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-[#555558]">
                    <Gauge className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>BAROMETRIC PRESSURE</span>
                  </div>
                  <div className="text-2xl sm:text-4xl font-mono font-bold text-[#111111]">
                    {activeWeather?.surface_pressure_hpa != null ? `${activeWeather.surface_pressure_hpa} hPa` : '972.6 hPa'}
                  </div>
                  <div className="text-[10.5px] font-mono text-[#8E8E91] flex items-center justify-between pt-1">
                    <span>{activeMeta.pressureTrend}</span>
                    <span className="text-[#2563EB] font-semibold">Vaisala PTB</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0] space-y-1.5 card-hover-spring">
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-[#555558]">
                    <Droplets className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>RELATIVE HUMIDITY</span>
                  </div>
                  <div className="text-2xl sm:text-4xl font-mono font-bold text-[#111111]">
                    {activeWeather?.relative_humidity_pct != null ? `${activeWeather.relative_humidity_pct}%` : '72%'}
                  </div>
                  <div className="text-[10.5px] font-mono text-[#8E8E91] flex items-center justify-between pt-1">
                    <span>Dew Point: {activeMeta.dewPoint}</span>
                    <span className="text-[#2563EB] font-semibold">Capacitive</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Sub-Telemetry Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#E8E6E0] text-xs font-mono text-[#555558]">
              <div className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#D97706]" />
                <span><strong>Insolation:</strong> {activeMeta.solarInsolation.split('(')[0]}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#2563EB]" />
                <span><strong>Trend:</strong> {activeMeta.pressureTrend.split('(')[0]}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#16A34A]" />
                <span><strong>Grid:</strong> Hybrid Power</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#8E8E91]" />
                <span><strong>Cadence:</strong> 10m Interval</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Dynamic Station Spotlight Card */}
          <div className="lg:col-span-5 bg-white border border-[#E8E6E0] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between card-hover-spring">
            <div className="relative h-56 sm:h-64 overflow-hidden">
              <img 
                src={activeMeta.image} 
                alt={activeWeather?.station_name || 'Station'}
                className="w-full h-full object-cover polar-image-zoom brightness-[0.88]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-[#111111] border border-[#E8E6E0] shadow-xs">
                {activeMeta.status}
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#93C5FD] font-semibold">
                  Station Architecture & Coordinates
                </span>
                <div className="text-xl font-serif font-normal">{activeWeather?.station_name}</div>
                <div className="text-xs font-mono text-white/80">{activeMeta.coords} · {activeMeta.elevation}</div>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#FAFAF8] border border-[#E8E6E0]">
                    <span className="text-[#8E8E91] block text-[10px] uppercase">Operational Age</span>
                    <strong className="text-[#111111]">{activeMeta.founded}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FAFAF8] border border-[#E8E6E0]">
                    <span className="text-[#8E8E91] block text-[10px] uppercase">Field Crew</span>
                    <strong className="text-[#111111]">{activeMeta.crew}</strong>
                  </div>
                </div>

                <div>
                  <span className="text-[10.5px] font-mono uppercase text-[#8E8E91] tracking-wider block mb-1.5 font-semibold">
                    Core Science Disciplines
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeMeta.disciplines.map((d) => (
                      <span key={d} className="px-2.5 py-1 rounded-md bg-[#F4F2EE] border border-[#E8E6E0] text-[11px] font-sans text-[#555558]">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E6E0] flex items-center justify-between">
                <Link href="/stations" className="text-xs font-bold text-[#111111] hover:text-[#2563EB] flex items-center gap-1.5 transition-colors">
                  <span>Explore station architectural dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/observatory" className="text-xs font-mono text-[#2563EB] font-semibold hover:underline">
                  Live Diurnal Chart →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION 4: "Explore the Archive" (Cross-Entity Discovery Engine)        */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#F4F2EE] border-y border-[#E8E6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E6E0] pb-5">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                <span>Cross-Entity Discovery Engine</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#111111] tracking-tight mt-1">
                What are you looking for in the polar archive?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#555558] max-w-md">
              Search across campaigns, open research datasets, scientific stations, and peer-reviewed journals.
            </p>
          </div>

          {/* Quick Filter Pills with Record Counts */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { label: 'Maitri atmosphere', count: '142 records' },
              { label: '45th ISEA', count: '38 records' },
              { label: 'Bharati', count: '94 records' },
              { label: 'Himadri ice core', count: '67 records' },
              { label: 'Larsemann Hills', count: '52 records' }
            ].map((sample) => (
              <button
                key={sample.label}
                onClick={() => {
                  setHomeSearchQuery(sample.label);
                  executeHomeSearch(sample.label);
                }}
                className={`px-4 py-2 rounded-full text-xs font-sans font-medium transition-all flex items-center gap-2 ${
                  homeSearchQuery === sample.label
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'bg-white text-[#555558] hover:text-[#111111] border border-[#E8E6E0]'
                }`}
              >
                <span>{sample.label}</span>
                <span className="text-[10px] font-mono opacity-70">({sample.count})</span>
              </button>
            ))}
          </div>

          {/* Live Search Entity Connection Grid (All 4 Core Pillars) */}
          <div className="bg-white border border-[#E8E6E0] rounded-2xl p-6 sm:p-7 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E6E0] pb-3">
              <span className="text-xs font-mono text-[#555558]">
                Active Index: <strong className="text-[#111111]">"{homeSearchQuery}"</strong> · {homeSearchResults?.total_results || 20} interconnected scientific records
              </span>
              <Link href={`/repository?q=${encodeURIComponent(homeSearchQuery)}`} className="text-xs font-bold text-[#111111] hover:text-[#2563EB] flex items-center gap-1 transition-colors">
                <span>View full results in repository</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Station Result */}
              <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0] space-y-2 card-hover-spring flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#111111] text-white">
                      Research Station
                    </span>
                    <span className="text-[10px] font-mono text-[#8E8E91]">Permanent Base</span>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-[#111111] line-clamp-1">
                    {homeSearchResults?.results_by_type.stations?.[0]?.title || 'Maitri Research Station'}
                  </h4>
                  <p className="text-xs text-[#555558] line-clamp-2 leading-relaxed">
                    {homeSearchResults?.results_by_type.stations?.[0]?.snippet || "India's second permanent Antarctic research base situated in the ice-free rocky Schirmacher Oasis."}
                  </p>
                </div>
                <Link href={homeSearchResults?.results_by_type.stations?.[0]?.url || '/stations'} className="text-xs font-semibold text-[#2563EB] hover:underline block pt-2 border-t border-[#E8E6E0]">
                  Inspect station dossier →
                </Link>
              </div>

              {/* 2. Dataset Result */}
              <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0] space-y-2 card-hover-spring flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#2563EB] text-white">
                      NPDC Dataset
                    </span>
                    <span className="text-[10px] font-mono text-[#8E8E91]">NetCDF · CC-BY 4.0</span>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-[#111111] line-clamp-1">
                    {homeSearchResults?.results_by_type.datasets?.[0]?.title || 'Maitri Surface Ozone & UV Flux'}
                  </h4>
                  <p className="text-xs text-[#555558] line-clamp-2 leading-relaxed">
                    {homeSearchResults?.results_by_type.datasets?.[0]?.snippet || 'Calibrated hourly observations of surface ozone, tropospheric nitrogen dioxide, and solar UV insolation.'}
                  </p>
                </div>
                <Link href={homeSearchResults?.results_by_type.datasets?.[0]?.url || '/datasets'} className="text-xs font-semibold text-[#2563EB] hover:underline block pt-2 border-t border-[#E8E6E0]">
                  Download data package →
                </Link>
              </div>

              {/* 3. Expedition Result */}
              <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0] space-y-2 card-hover-spring flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#111111] text-white">
                      Field Campaign
                    </span>
                    <span className="text-[10px] font-mono text-[#8E8E91]">MoES Scientific Mission</span>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-[#111111] line-clamp-1">
                    {homeSearchResults?.results_by_type.expeditions?.[0]?.title || '45th Indian Antarctic Expedition'}
                  </h4>
                  <p className="text-xs text-[#555558] line-clamp-2 leading-relaxed">
                    {homeSearchResults?.results_by_type.expeditions?.[0]?.snippet || '48-member expedition team deployed to Maitri and Bharati stations aboard Arc4 ice-class vessel.'}
                  </p>
                </div>
                <Link href={homeSearchResults?.results_by_type.expeditions?.[0]?.url || '/expeditions'} className="text-xs font-semibold text-[#2563EB] hover:underline block pt-2 border-t border-[#E8E6E0]">
                  Explore field dossier →
                </Link>
              </div>

              {/* 4. Publication Result */}
              <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0] space-y-2 card-hover-spring flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#16A34A] text-white">
                      Publication
                    </span>
                    <span className="text-[10px] font-mono text-[#8E8E91]">Q1 Peer-Reviewed</span>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-[#111111] line-clamp-1">
                    {homeSearchResults?.results_by_type.publications?.[0]?.title || 'Atmospheric Boundary Layer at Maitri'}
                  </h4>
                  <p className="text-xs text-[#555558] line-clamp-2 leading-relaxed">
                    {homeSearchResults?.results_by_type.publications?.[0]?.snippet || 'Investigation of katabatic wind acceleration and boundary layer turbulence across Queen Maud Land.'}
                  </p>
                </div>
                <Link href={homeSearchResults?.results_by_type.publications?.[0]?.url || '/publications'} className="text-xs font-semibold text-[#2563EB] hover:underline block pt-2 border-t border-[#E8E6E0]">
                  Inspect publication →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SECTION 5: Featured Expedition (45th ISEA Mission Dossier)              */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8E6E0] pb-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#2563EB] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping-subtle" />
            <span>Active Campaign Dossier · 2025–2026 Season</span>
          </div>
          <Link href="/expeditions" className="text-xs font-bold text-[#111111] hover:underline flex items-center gap-1">
            <span>Explore all 45 expeditions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white border border-[#E8E6E0] rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-sm card-hover-spring">
          <div className="lg:w-5/12 relative h-64 lg:h-auto shrink-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=85"
              alt="45th Indian Scientific Expedition to Antarctica"
              className="w-full h-full object-cover polar-image-zoom brightness-[0.88]"
            />
            <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full text-xs font-mono font-bold text-[#111111] shadow-xs border border-[#E8E6E0]">
              45TH ISEA · DEPLOYED
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-[#111111]/80 backdrop-blur-md px-3.5 py-2 rounded-xl text-[11px] font-mono text-white/90">
              Vessel: MV Vasiliy Golovnin (Arc4 Polar Class)
            </div>
          </div>
          
          <div className="lg:w-7/12 p-6 sm:p-9 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#2563EB] font-bold tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  <span>Wintering Teams in Field</span>
                </span>
                <span className="text-xs font-mono text-[#8E8E91]">Season: 2025–26</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-normal text-[#111111] leading-tight">
                45th Indian Scientific Expedition to Antarctica
              </h3>
              <p className="text-xs sm:text-sm text-[#555558] leading-relaxed">
                48-member interdisciplinary science contingent deployed aboard ice-class vessels to Maitri and Bharati stations for long-term climate modeling, sub-ice lake drilling, and atmospheric chemistry monitoring.
              </p>

              {/* 4-Item Mission Parameter Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono text-[#555558]">
                <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0]">
                  <strong className="text-[#111111] block mb-0.5">Bases Active:</strong>
                  Maitri & Bharati Stations
                </div>
                <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0]">
                  <strong className="text-[#111111] block mb-0.5">Voyage Routing:</strong>
                  Cape Town → Prydz Bay → Astrid Coast
                </div>
                <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0]">
                  <strong className="text-[#111111] block mb-0.5">Science Contingent:</strong>
                  48 Scientists & Engineers
                </div>
                <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0]">
                  <strong className="text-[#111111] block mb-0.5">Core Payload:</strong>
                  200m Firn Drill & ECC Sondes
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/expeditions/exp_45_isea"
                className="btn-primary w-fit text-xs !py-2.5 !px-5"
              >
                <span>Explore Complete Mission Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SECTION 6: Research & Publications (Clean Authors & DOI Layout)         */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#F4F2EE] border-y border-[#E8E6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E6E0] pb-5">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                <span>Peer-Reviewed Discoveries & Literature</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#111111] tracking-tight mt-1">
                Research from the polar frontier
              </h2>
            </div>
            <Link href="/publications" className="btn-ghost text-xs !py-2 !px-4 w-fit">
              <span>View Publications Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {latestResearch.map((paper) => (
              <div
                key={paper.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8E6E0] space-y-4 shadow-xs card-hover-spring flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono text-[#8E8E91]">
                    <span className="font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full">{paper.year}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F4F2EE] border border-[#E8E6E0] text-[10px] text-[#555558] font-semibold">
                      {paper.journal}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-normal text-[#111111] leading-snug line-clamp-2">
                    {paper.title}
                  </h3>
                  <p className="text-xs text-[#555558] line-clamp-3 leading-relaxed">
                    {paper.abstract}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8E6E0] space-y-2 text-xs font-mono">
                  {/* Clean Author Row with User Icon */}
                  <div className="flex items-center justify-between text-[#555558]">
                    <span className="flex items-center gap-1.5 truncate max-w-[200px]" title={Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}>
                      <User className="w-3.5 h-3.5 text-[#8E8E91] shrink-0" />
                      <span className="truncate">{Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}</span>
                    </span>
                    <span className="text-[10px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
                      Open Access
                    </span>
                  </div>

                  {/* Clean DOI & Action Row */}
                  <div className="flex items-center justify-between text-[#8E8E91] pt-1">
                    <span className="text-[#2563EB] font-mono text-[11px] truncate max-w-[190px]">
                      doi:{paper.doi}
                    </span>
                    <Link href={`/publications`} className="text-[#111111] hover:text-[#2563EB] font-semibold text-[11px] flex items-center gap-1 shrink-0 transition-colors">
                      <span>Read paper</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. SECTION 7: Smart Education & Student Hub (Interactive Quiz Widget)      */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-xl max-w-5xl mx-auto w-full card-hover-spring">
          {/* Subtle Polar Blue Ambient Radial Aura */}
          <div 
            aria-hidden="true" 
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#2563EB]/25 blur-3xl pointer-events-none" 
          />

          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-xs font-mono text-[#93C5FD] border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#93C5FD]" />
              <span>Smart Education Initiative · SIH26063</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-normal leading-tight text-white">
              Polar science is not only for scientists.
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
              Engage with interactive modules explaining ice-albedo climate feedback loops, Antarctic station engineering, cryospheric lexicons, and test your knowledge with self-assessment quizzes.
            </p>

            {/* Interactive Mini Rapid Assessment Quiz Widget */}
            {(() => {
              const activeQuiz = QUIZ_QUESTIONS[currentQuizIdx];
              return (
                <div className="bg-white/5 border border-white/15 rounded-2xl p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#93C5FD] uppercase tracking-wider font-semibold">
                      <HelpCircle className="w-4 h-4 text-[#93C5FD]" />
                      <span>Quick Polar Assessment</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 font-medium">
                        {activeQuiz.topic}
                      </span>
                      <span className="text-[#93C5FD] font-semibold">
                        {currentQuizIdx + 1} / {QUIZ_QUESTIONS.length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm sm:text-base font-serif text-white font-normal">
                    {activeQuiz.question}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeQuiz.options.map((opt, idx) => {
                      const isSelected = selectedQuizOption === idx;
                      const isCorrect = idx === activeQuiz.correctIndex;
                      return (
                        <button
                          key={opt}
                          onClick={() => {
                            setSelectedQuizOption(idx);
                            setShowQuizResult(true);
                          }}
                          className={`text-left p-3 rounded-xl border text-xs font-sans transition-all flex items-center justify-between ${
                            showQuizResult && isSelected
                              ? isCorrect
                                ? 'bg-[#16A34A]/25 border-[#16A34A] text-white font-semibold'
                                : 'bg-[#EF4444]/25 border-[#EF4444] text-white font-semibold'
                              : showQuizResult && isCorrect
                                ? 'bg-[#16A34A]/15 border-[#16A34A]/60 text-white font-semibold'
                                : 'bg-white/5 border-white/10 hover:border-white/30 text-white/90'
                          }`}
                        >
                          <span>{opt}</span>
                          {showQuizResult && isSelected && (
                            <span>
                              {isCorrect ? (
                                <Check className="w-4 h-4 text-[#16A34A]" />
                              ) : (
                                <span className="text-[#EF4444] font-bold text-xs">✕</span>
                              )}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {showQuizResult && (
                    <div className="pt-2 space-y-3 animate-fade-in-up">
                      <div className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2 ${
                        selectedQuizOption === activeQuiz.correctIndex
                          ? 'bg-[#16A34A]/15 border-[#16A34A]/40 text-[#DCFCE7]'
                          : 'bg-[#F59E0B]/15 border-[#F59E0B]/40 text-[#FEF3C7]'
                      }`}>
                        <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-300" />
                        <div>
                          <strong>
                            {selectedQuizOption === activeQuiz.correctIndex ? '✓ Correct! ' : 'Explanation: '}
                          </strong>
                          {activeQuiz.explanation}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] font-mono text-white/70">
                          {selectedQuizOption === activeQuiz.correctIndex ? 'Excellent recall!' : 'Review the concept above.'}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedQuizOption(null);
                            setShowQuizResult(false);
                            setCurrentQuizIdx((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
                          }}
                          className="px-4 py-2 rounded-xl bg-white text-[#111111] hover:bg-white/90 text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          {currentQuizIdx < QUIZ_QUESTIONS.length - 1 ? (
                            <>
                              <span>Next Polar Question</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Restart Question Bank</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Interactive Feature Teasers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs font-mono text-white/80">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white font-bold block mb-1">Cryospheric Lexicon</span>
                Clear guides on albedo, firn, and katabatic winds
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white font-bold block mb-1">3D Station CAD</span>
                Interactive architecture of Bharati & Maitri
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white font-bold block mb-1">Student Grants</span>
                MoES student fellowship berths & research tracks
              </div>
            </div>

            <div className="flex flex-wrap gap-3.5 pt-2">
              <Link href="/learn" className="px-5 py-2.5 rounded-full bg-white hover:bg-[#F4F2EE] text-[#111111] font-semibold text-xs transition-all shadow-md flex items-center gap-1.5">
                <span>Launch Student Learning Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/knowledge-graph" className="px-5 py-2.5 rounded-full bg-transparent hover:bg-white/10 border border-white/20 text-white font-semibold text-xs transition-all">
                Explore Knowledge Graph
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
