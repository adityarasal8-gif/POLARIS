import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Compass, Calendar, User, Search, Filter, 
  ArrowRight, Ship, MapPin, Database, FileText, CheckCircle2,
  Globe, Radio, Sparkles, Navigation, Layers
} from 'lucide-react';
import { fetchExpeditions } from '../api';
import { Expedition } from '../types';
import { ExpeditionLogSubmitter } from '../components/ExpeditionLogSubmitter';

const CHRONOLOGY_MILESTONES = [
  { year: '1981', code: 'EXP-01', title: 'Operation Gangotri', region: 'Antarctica', label: '1st Landing' },
  { year: '1983', code: 'DG-01', title: 'Dakshin Gangotri Base', region: 'Antarctica', label: '1st Station' },
  { year: '1988', code: 'EXP-08', title: 'Maitri Commissioned', region: 'Antarctica', label: 'Permanent Base' },
  { year: '2004', code: 'SO-01', title: '1st Southern Ocean Cruise', region: 'Southern Ocean', label: 'Ocean Transect' },
  { year: '2008', code: 'ARC-01', title: 'Himadri Inaugurated', region: 'Arctic', label: '79°N Base' },
  { year: '2012', code: 'EXP-31', title: 'Bharati Station', region: 'Antarctica', label: 'Larsemann Hills' },
  { year: '2016', code: 'HIM-01', title: 'Himansh High-Altitude', region: 'Himalaya', label: '4,050m Cryosphere' },
  { year: '2025', code: 'EXP-45', title: '45th ISEA Flagship', region: 'Antarctica', label: 'Active Deployment' }
];

export const ExpeditionsPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMilestoneYear, setActiveMilestoneYear] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchExpeditions({
      region: selectedRegion === 'All' ? undefined : selectedRegion,
      status: selectedStatus === 'All' ? undefined : selectedStatus,
      q: searchQuery.trim() || undefined,
      year: activeMilestoneYear ? parseInt(activeMilestoneYear) : undefined
    })
      .then((data) => {
        setExpeditions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Expeditions fetch error:', err);
        setLoading(false);
      });
  }, [selectedRegion, selectedStatus, searchQuery, activeMilestoneYear]);

  const REGIONS = ['All', 'Antarctica', 'Arctic', 'Himalaya', 'Southern Ocean'];
  const STATUSES = ['All', 'Active', 'Completed'];

  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] text-[#111111] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#111111] selection:text-white relative overflow-hidden">
      
      {/* Ambient Low-Opacity Floating Polar Accents */}
      <div className="absolute right-12 top-20 text-[#2563EB]/15 z-0 pointer-events-none hidden md:block animate-subtle-drift">
        <Ship className="w-16 h-16 stroke-[1.2]" />
      </div>
      <div className="absolute right-56 top-48 text-[#D97706]/15 z-0 pointer-events-none hidden md:block animate-float-1">
        <Compass className="w-10 h-10 stroke-[1.2]" />
      </div>
      <div className="absolute left-8 top-72 text-[#16A34A]/15 z-0 pointer-events-none hidden md:block animate-float-2">
        <Globe className="w-12 h-12 stroke-[1.2]" />
      </div>
      <div className="absolute right-24 bottom-96 text-[#7C3AED]/12 z-0 pointer-events-none hidden md:block animate-float-3">
        <Radio className="w-14 h-14 stroke-[1.2]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Editorial Journal Header with Ambient Drift */}
        <div className="space-y-4 max-w-4xl border-b border-[#E8E6E0] pb-8 relative">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#555558] bg-[#F4F2EE] px-3.5 py-1 rounded-full border border-[#E8E6E0] font-medium tracking-wide uppercase shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-[#2563EB] animate-spin-slow" />
            <span>INDIAN POLAR EXPEDITION ARCHIVE · 1981–PRESENT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-medium text-[#111111] tracking-tight leading-tight">
            Into the field: Four decades of polar exploration.
          </h1>
          <p className="text-sm sm:text-base text-[#555558] font-light leading-relaxed">
            From the pioneering Operation Gangotri in 1981 to the flagship 45th Indian Scientific Expedition to Antarctica, explore the field campaigns, scientific objectives, and winter-over deployments shaping India's presence across the cryosphere.
          </p>
        </div>

        {/* 1. Live Active Maritime Fleet Passage Telemetry HUD */}
        <div className="bg-[#111111] text-white p-4 sm:p-5 rounded-2xl border border-black/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#16A34A]"></span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold tracking-wider uppercase text-[11px]">ACTIVE EXPEDITION MARITIME TRANSIT:</span>
                <span className="px-2 py-0.5 rounded-full bg-[#2563EB]/40 text-[#93C5FD] text-[10px] font-semibold">45th ISEA</span>
              </div>
              <p className="text-[#A1A1AA] text-[11px] mt-0.5">M/V Vasiliy Golovnin (Arc4 Polar Vessel) · En Route Princess Astrid Coast</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[11px] text-[#A1A1AA] border-t md:border-t-0 md:border-l border-white/15 pt-2 md:pt-0 md:pl-5">
            <div>POS: <strong className="text-white">64°22′S, 54°10′E</strong></div>
            <div>SOG: <strong className="text-white">11.8 kn</strong></div>
            <div>HDG: <strong className="text-white">162° SE</strong></div>
            <div className="px-2.5 py-0.5 rounded-full bg-[#16A34A]/20 text-[#4ADE80] font-semibold border border-[#16A34A]/30">
              PACK ICE READY
            </div>
          </div>
        </div>

        {/* 2. Interactive Polar Chronology Milestones Rail */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E6E0] space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-[#555558] uppercase font-semibold">
              <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Interactive Expedition Milestones (1981–2025)</span>
            </div>
            <span className="text-[11px] font-mono text-[#8E8E91]">Click milestone to filter</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1">
            {CHRONOLOGY_MILESTONES.map((m) => {
              const isSelected = activeMilestoneYear === m.year;
              const isLatest = m.year === '2025';
              return (
                <button
                  key={m.year}
                  onClick={() => {
                    if (isSelected) {
                      setActiveMilestoneYear(null);
                      setSelectedRegion('All');
                    } else {
                      setActiveMilestoneYear(m.year);
                      setSelectedRegion(m.region);
                    }
                  }}
                  className={`text-left p-2.5 rounded-xl border text-xs font-mono transition-all relative overflow-hidden group card-hover-spring ${
                    isSelected
                      ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                      : 'bg-[#FAFAF8] text-[#555558] hover:text-[#111111] hover:border-[#111111]/30 border-[#E8E6E0]'
                  }`}
                >
                  {isLatest && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping" />
                  )}
                  <div className="font-bold text-[13px]">{m.year}</div>
                  <div className="text-[10px] opacity-75 truncate">{m.code}</div>
                  <div className="text-[10px] font-sans font-medium text-[#2563EB] group-hover:underline truncate mt-1">
                    {m.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scientist Workflow: Expedition Log Submitter */}
        <ExpeditionLogSubmitter />

        {/* 3. Filter & Search Bar with Micro-Interactions */}
        <div className="bg-[#F4F2EE] p-4 sm:p-5 rounded-2xl border border-[#E8E6E0] flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xs">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E91]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expeditions by code, objective, or leader..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#E8E6E0] text-[#111111] text-xs placeholder-[#8E8E91] focus:outline-none focus:border-[#111111] transition shadow-2xs font-sans"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs font-mono">
            {/* Region Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-[#8E8E91]">Region:</span>
              <div className="flex flex-wrap gap-1">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => { setSelectedRegion(r); setActiveMilestoneYear(null); }}
                    className={`px-3 py-1.5 rounded-full transition-all text-xs ${
                      selectedRegion === r 
                        ? 'bg-[#111111] text-white font-medium shadow-xs' 
                        : 'bg-white text-[#555558] hover:text-[#111111] border border-[#E8E6E0]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Selector */}
            <div className="flex items-center space-x-2 pl-2 border-l border-[#E8E6E0]">
              <span className="text-[#8E8E91]">Status:</span>
              <div className="flex gap-1">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s)}
                    className={`px-3 py-1.5 rounded-full transition-all text-xs ${
                      selectedStatus === s 
                        ? 'bg-[#111111] text-white font-medium shadow-xs' 
                        : 'bg-white text-[#555558] hover:text-[#111111] border border-[#E8E6E0]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Expeditions List: Elevated Editorial Cards with Spring Physics */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-[#8E8E91]">Accessing expedition field dossiers...</p>
          </div>
        ) : expeditions.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-[#E8E6E0] p-8 shadow-2xs">
            <p className="text-sm text-[#555558]">No expeditions match the specified criteria.</p>
            <button
              onClick={() => { setSelectedRegion('All'); setSelectedStatus('All'); setSearchQuery(''); setActiveMilestoneYear(null); }}
              className="text-xs font-mono text-[#111111] font-semibold underline underline-offset-4"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {expeditions.map((exp) => (
              <div
                key={exp.id}
                className="bg-white border border-[#E8E6E0] rounded-3xl overflow-hidden hover:border-[#111111]/30 transition duration-300 shadow-2xs flex flex-col lg:flex-row group card-hover-spring"
              >
                {/* Authentic Photography (Left) */}
                <div className="lg:w-5/12 relative min-h-[280px] lg:min-h-full overflow-hidden bg-[#F4F2EE]">
                  <img
                    src={exp.hero_image}
                    alt={exp.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-5 left-5 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-mono text-[#111111] border border-white/60 font-semibold shadow-2xs">
                      {exp.region}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium flex items-center gap-1.5 shadow-2xs ${
                      exp.status === 'Active'
                        ? 'bg-[#111111] text-white font-semibold'
                        : 'bg-white/90 text-[#555558] border border-white/60'
                    }`}>
                      {exp.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping" />}
                      <span>{exp.status}</span>
                    </span>
                  </div>

                  {/* Photo Provenance */}
                  <div className="absolute bottom-3 left-4 text-[10px] font-mono text-white/90 bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                    Photo: {exp.hero_image_credit}
                  </div>
                </div>

                {/* Mission Details (Right) */}
                <div className="lg:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#8E8E91]">
                      <span className="text-[#111111] font-bold px-2 py-0.5 rounded bg-[#F4F2EE] border border-[#E8E6E0]">{exp.code}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#555558]" />
                        <span>{exp.dates}</span>
                      </span>
                      {exp.vessel && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Ship className="w-3.5 h-3.5 text-[#2563EB]" />
                            <span className="text-[#111111] font-medium">{exp.vessel}</span>
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-medium text-[#111111] group-hover:text-black transition-colors leading-snug">
                      {exp.name}
                    </h3>

                    <p className="text-sm text-[#555558] font-light leading-relaxed">
                      {exp.summary}
                    </p>

                    {/* Leader Line */}
                    <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#555558]">
                      <User className="w-3.5 h-3.5 text-[#111111]" />
                      <span>Expedition Leader:</span>
                      <span className="text-[#111111] font-semibold">{exp.leader_name}</span>
                      <span className="text-[#8E8E91]">({exp.leader_title})</span>
                    </div>

                    {/* Research Themes */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {exp.research_themes?.map((t) => (
                        <span key={t} className="px-3 py-1 rounded-full bg-[#F4F2EE] text-[11px] font-mono text-[#111111] border border-[#E8E6E0]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Connected Knowledge & Action Button */}
                  <div className="pt-4 border-t border-[#E8E6E0] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-4 text-xs font-mono text-[#555558]">
                      <span className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>{exp.connected_datasets?.length || 2} Datasets</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>{exp.connected_publications?.length || 2} Papers</span>
                      </span>
                    </div>

                    <Link
                      href={`/expeditions/${exp.id}`}
                      className="px-5 py-2.5 rounded-full bg-[#111111] hover:bg-black text-white font-medium text-xs font-mono transition flex items-center space-x-2 group-hover:translate-x-0.5 shadow-xs"
                    >
                      <span>INSPECT MISSION DOSSIER</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
