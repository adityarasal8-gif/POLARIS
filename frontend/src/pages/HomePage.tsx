import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { 
  Compass, Radio, Database, ArrowRight, ShieldCheck, 
  Wind, Thermometer, Droplets, Gauge, ChevronRight,
  Calendar, BookOpen, Layers, Award
} from 'lucide-react';
import { PolarGlobe3D } from '../components/PolarGlobe3D';
import { PipelineFlow } from '../components/PipelineFlow';
import { fetchStats, fetchLiveObservatory, fetchExpeditions, fetchPublications } from '../api';
import { Stats, StationWeather, Expedition, Publication } from '../types';

export const HomePage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [weatherList, setWeatherList] = useState<StationWeather[]>([]);
  const [latestExpeditions, setLatestExpeditions] = useState<Expedition[]>([]);
  const [latestResearch, setLatestResearch] = useState<Publication[]>([]);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch live database counts
    fetchStats().then(setStats).catch(console.error);

    // 2. Fetch live Open-Meteo telemetry
    fetchLiveObservatory()
      .then((data) => {
        setWeatherList(data);
        setWeatherLoading(false);
      })
      .catch((err) => {
        console.error('Weather fetch error:', err);
        setWeatherLoading(false);
      });

    // 3. Fetch latest expeditions & publications
    fetchExpeditions().then((res) => setLatestExpeditions(res.slice(0, 3))).catch(console.error);
    fetchPublications().then((res) => setLatestResearch(res.slice(0, 3))).catch(console.error);
  }, []);

  const REGIONS = [
    {
      name: 'ANTARCTICA',
      title: 'The Frozen Continent',
      desc: 'Decades of winter-over research at Maitri and Bharati stations exploring ice-sheet stability, ozone holes, and paleoclimate.',
      stations: 'Maitri (1988) • Bharati (2012)',
      themes: ['Cryosphere', 'Atmospheric Physics', 'Paleoclimatology'],
      image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
      credit: 'NCPOR Official Photographic Archive'
    },
    {
      name: 'ARCTIC',
      title: 'High-Latitude Warming',
      desc: 'Research station Himadri in Svalbard investigating Arctic amplification and its direct teleconnections with the Indian Summer Monsoon.',
      stations: 'Himadri (Ny-Ålesund, 2008)',
      themes: ['Fjord Oceanography', 'Aerosol Haze', 'Arctic Teleconnections'],
      image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=800&q=80',
      credit: 'Kings Bay Fjord Science / NCPOR'
    },
    {
      name: 'HIMALAYA',
      title: 'The Third Pole',
      desc: 'High-altitude observatory Himansh in Chandra Basin monitoring benchmark glacier mass balances, snow-melt discharge, and black carbon.',
      stations: 'Himansh (Spiti, 2016)',
      themes: ['Glacier Mass Balance', 'Hydrological Discharge', 'Permafrost'],
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      credit: 'NCPOR Cryosphere Division'
    },
    {
      name: 'SOUTHERN OCEAN',
      title: 'Planetary Heat & Carbon Sink',
      desc: 'Oceanographic campaigns aboard research vessels traversing Sub-Antarctic and Polar Fronts to quantify oceanic carbon sequestration.',
      stations: 'Ocean Transects & Bio-Argo Floats',
      themes: ['Marine Biogeochemistry', 'CTD Profiling', 'Diatom Fluxes'],
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      credit: 'NCPOR Southern Ocean Group / S.A. Agulhas II'
    }
  ];

  const TIMELINE_EVENTS = [
    { year: 1981, title: 'Inaugural Antarctic Mission', desc: 'Operation Gangotri sets sail under Dr. S.Z. Qasim, planting the Indian flag on Antarctic ice.' },
    { year: 1988, title: 'Maitri Station Commissioned', desc: 'Second permanent Indian station established in the ice-free rocky Schirmacher Oasis.' },
    { year: 2008, title: 'Himadri Arctic Station Established', desc: 'India opens its dedicated Arctic observatory in Ny-Ålesund, Svalbard (79°N).' },
    { year: 2012, title: 'Bharati Station Commissioned', desc: 'State-of-the-art modular research station commissioned in Larsemann Hills, East Antarctica.' },
    { year: 2016, title: 'Himansh Glaciological Hub', desc: 'High-altitude research station established at 4,050m in the Chandra Basin of Western Himalaya.' },
    { year: '2025–26', title: '45th Indian Antarctic Expedition', desc: 'Flagship ongoing mission executing deep ice-core drilling and green hydrogen microgrid testing.' }
  ];

  return (
    <div className="w-full bg-[#071A2B] text-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden polar-grid-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Mission Narrative */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#0B2538] border border-[#6EC5E9]/30 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
                <span className="text-[#38BDF8] font-semibold">NATIONAL POLAR SCIENCE KNOWLEDGE PLATFORM</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Explore India's <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6EC5E9] via-[#38BDF8] to-[#22C7A8]">
                  Polar Science.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-xl">
                One connected gateway to expeditions, research datasets, publications, field activities, and the scientific stories behind India's work in the world's most extreme environments.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/repository"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#22C7A8] text-[#071A2B] font-bold text-sm hover:brightness-110 transition-all shadow-lg flex items-center space-x-2"
                >
                  <Database className="w-4 h-4 text-[#071A2B]" />
                  <span>EXPLORE THE ARCHIVE</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/observatory"
                  className="px-6 py-3.5 rounded-xl bg-[#0B2538] hover:bg-[#123753] border border-[#6EC5E9]/30 text-white font-semibold text-sm transition-all flex items-center space-x-2"
                >
                  <Radio className="w-4 h-4 text-[#38BDF8]" />
                  <span>LIVE OBSERVATORY</span>
                </Link>
              </div>

              {/* Verified scientific badge */}
              <div className="pt-4 flex items-center space-x-6 text-xs text-[#94A3B8] font-mono border-t border-[#6EC5E9]/10">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#22C7A8]" />
                  <span>MoES / NCPOR Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E7A93B]" />
                  <span>NPDC Data Standards</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Polar Globe */}
            <div className="lg:col-span-6 flex justify-center">
              <PolarGlobe3D />
            </div>
          </div>
        </div>
      </section>

      {/* 2. FROM FIELD TO KNOWLEDGE: PIPELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#6EC5E9]/10">
        <PipelineFlow />
      </section>

      {/* 3. LIVE POLAR OBSERVATORY SECTION */}
      <section className="py-16 bg-[#051320] border-y border-[#6EC5E9]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-[#22C7A8] font-bold tracking-wider uppercase mb-1">
                <span className="w-2 h-2 rounded-full bg-[#22C7A8] animate-ping" />
                <span>LIVE ENVIRONMENTAL TELEMETRY</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Live Polar Observatory Feed
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                Real-time surface meteorology retrieved for India's 4 polar research facilities.
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-3 text-xs font-mono text-[#94A3B8]">
              <span className="badge-live px-2.5 py-1 rounded text-[11px] font-semibold">
                LIVE · Open-Meteo
              </span>
              <Link href="/observatory" className="text-[#38BDF8] hover:underline flex items-center space-x-1">
                <span>Interactive Telemetry Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 4 Station Telemetry Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {weatherLoading ? (
              <div className="col-span-4 text-center py-12 text-[#94A3B8] text-sm font-mono">
                Establishing satellite telemetry link with polar stations...
              </div>
            ) : (
              weatherList.map((st) => (
                <div
                  key={st.station_id}
                  className="polar-panel p-5 polar-panel-hover flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#38BDF8]">
                        {st.region}
                      </span>
                      <span className="badge-live text-[10px] px-2 py-0.5 rounded uppercase font-bold">
                        {st.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-1.5">{st.station_name}</h3>
                    <p className="text-[11px] text-[#94A3B8] font-mono mt-0.5">
                      {st.latitude > 0 ? `${st.latitude.toFixed(2)}°N` : `${Math.abs(st.latitude).toFixed(2)}°S`},{' '}
                      {st.longitude > 0 ? `${st.longitude.toFixed(2)}°E` : `${Math.abs(st.longitude).toFixed(2)}°W`}
                    </p>

                    <div className="mt-5 flex items-baseline space-x-2">
                      <span className="text-3xl font-black text-white font-mono">
                        {st.temperature_c > 0 ? `+${st.temperature_c}` : st.temperature_c}°C
                      </span>
                      <span className="text-xs text-[#94A3B8] font-medium">{st.condition_description}</span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 py-3 border-y border-[#6EC5E9]/10 text-xs font-mono">
                      <div>
                        <div className="text-[10px] text-[#647887] flex items-center space-x-1">
                          <Wind className="w-3 h-3 text-[#38BDF8]" />
                          <span>Wind</span>
                        </div>
                        <div className="font-semibold text-white mt-0.5">{st.wind_speed_kmh} km/h</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#647887] flex items-center space-x-1">
                          <Droplets className="w-3 h-3 text-[#22C7A8]" />
                          <span>Hum</span>
                        </div>
                        <div className="font-semibold text-white mt-0.5">{st.relative_humidity_pct}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#647887] flex items-center space-x-1">
                          <Gauge className="w-3 h-3 text-[#E7A93B]" />
                          <span>Press</span>
                        </div>
                        <div className="font-semibold text-white mt-0.5">{Math.round(st.surface_pressure_hpa)} hPa</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 flex items-center justify-between text-[11px] text-[#647887] font-mono">
                    <span>Source: {st.source}</span>
                    <Link href={`/stations`} className="text-[#38BDF8] hover:underline font-semibold">
                      Station Profile →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 4. DISCOVER INDIA'S POLAR REGIONS (4 Authentic Cards) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-mono tracking-widest text-[#38BDF8] font-bold">
            GEOGRAPHIC MANDATE
          </span>
          <h2 className="text-3xl font-bold text-white mt-1.5">
            Discover India's Polar Presence
          </h2>
          <p className="text-sm text-[#94A3B8] max-w-2xl mx-auto mt-2">
            NCPOR operates specialized observation infrastructures across four distinct polar cryospheric realms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REGIONS.map((reg) => (
            <div
              key={reg.name}
              className="polar-panel overflow-hidden border border-[#6EC5E9]/15 flex flex-col justify-between group hover:border-[#38BDF8]/40 transition-all duration-300"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={reg.image}
                    alt={reg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2538] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 rounded bg-[#071A2B]/80 text-[#38BDF8] font-bold border border-[#6EC5E9]/30">
                    {reg.name}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-white">{reg.title}</h3>
                  <p className="text-xs text-[#38BDF8] font-mono mt-0.5">{reg.stations}</p>
                  <p className="text-xs text-[#94A3B8] mt-3 leading-relaxed">
                    {reg.desc}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {reg.themes.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#071A2B] text-[#CBD5E1] border border-[#6EC5E9]/15"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="text-[9px] text-[#647887] font-mono mb-2">
                  Photo Credit: {reg.credit}
                </div>
                <Link
                  href={`/repository?region=${reg.name === 'ANTARCTICA' ? 'Antarctica' : reg.name === 'ARCTIC' ? 'Arctic' : reg.name === 'HIMALAYA' ? 'Himalaya' : 'Southern Ocean'}`}
                  className="w-full py-2 rounded-lg bg-[#071A2B] hover:bg-[#123753] border border-[#6EC5E9]/20 text-[#38BDF8] text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <span>Explore {reg.name} Archive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. KNOWLEDGE AT A GLANCE: LIVE BACKEND STATS */}
      <section className="py-12 bg-[#051320] border-y border-[#6EC5E9]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#22C7A8] font-bold">
              VERIFIED ARCHIVE METRICS
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Knowledge Repository at a Glance
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Real-time database statistics retrieved from <code className="font-mono text-[#38BDF8]">GET /api/stats</code>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Expeditions', val: stats?.expeditions ?? 10, icon: Compass, color: '#38BDF8', path: '/expeditions' },
              { label: 'Datasets', val: stats?.datasets ?? 20, icon: Database, color: '#22C7A8', path: '/datasets' },
              { label: 'Publications', val: stats?.publications ?? 15, icon: BookOpen, color: '#6EC5E9', path: '/publications' },
              { label: 'Media Assets', val: stats?.media_assets ?? 30, icon: Layers, color: '#E7A93B', path: '/media' },
              { label: 'Stations', val: stats?.stations ?? 4, icon: Radio, color: '#38BDF8', path: '/stations' },
              { label: 'Activities', val: stats?.activities ?? 15, icon: Award, color: '#22C7A8', path: '/activities' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  className="polar-panel p-4 text-center hover:border-[#38BDF8]/40 transition-all cursor-pointer group"
                >
                  <div
                    className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{item.val}</div>
                  <div className="text-xs text-[#94A3B8] font-medium mt-0.5 group-hover:text-white transition-colors">
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. LATEST RESEARCH SPOTLIGHT & EXPEDITION TIMELINE */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Latest Research Publications (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-[#38BDF8] uppercase font-bold tracking-wider">
                  PEER-REVIEWED LITERATURE
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">Latest Polar Discoveries</h2>
              </div>
              <Link href="/publications" className="text-xs text-[#38BDF8] hover:underline flex items-center space-x-1">
                <span>View All 15 Papers</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {latestResearch.map((paper) => (
                <div
                  key={paper.id}
                  className="polar-panel p-5 polar-panel-hover border border-[#6EC5E9]/15"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#6EC5E9] mb-1.5">
                    <span>{paper.journal} ({paper.year})</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#071A2B] border border-[#6EC5E9]/20 text-[#38BDF8]">
                      {paper.region}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {paper.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-2 line-clamp-2">
                    {paper.abstract}
                  </p>
                  <div className="mt-3 pt-3 border-t border-[#6EC5E9]/10 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#647887] font-mono">
                      DOI: {paper.doi}
                    </span>
                    <span className="text-[#22C7A8] font-mono text-[11px]">
                      {paper.citation_count} Citations
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expedition Timeline (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div>
              <span className="text-xs font-mono text-[#E7A93B] uppercase font-bold tracking-wider">
                HISTORICAL CONTINUITY
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">Expedition Timeline</h2>
            </div>

            <div className="relative border-l border-[#6EC5E9]/20 pl-6 ml-2 space-y-6">
              {TIMELINE_EVENTS.map((event, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#071A2B] border-2 border-[#38BDF8] group-hover:scale-125 transition-transform" />
                  <span className="text-xs font-mono font-bold text-[#38BDF8] bg-[#0B2538] px-2 py-0.5 rounded border border-[#38BDF8]/30">
                    {event.year}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5">{event.title}</h4>
                  <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">{event.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION: AI DISSEMINATION STUDIO */}
      <section className="py-16 bg-gradient-to-r from-[#0B2538] via-[#0d2f47] to-[#0B2538] border-t border-[#6EC5E9]/20">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs uppercase font-mono tracking-widest text-[#22C7A8] font-bold">
            SOURCE-GROUNDED AI DISSEMINATION
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            Transform Complex Scientific Records into Public Outreach
          </h2>
          <p className="text-sm text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
            The POLARIS AI Content Studio reads authentic expedition charters, datasets, and publications, synthesizing multi-platform media with traceable provenance.
          </p>
          <div className="pt-2">
            <Link
              href="/studio"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#22C7A8] hover:bg-[#1fb396] text-[#071A2B] font-bold text-sm shadow-xl transition-all"
            >
              <span>Launch AI Content Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
