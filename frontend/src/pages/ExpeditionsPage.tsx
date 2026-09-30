import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Compass, Calendar, User, Search, Filter, 
  ArrowRight, Ship, MapPin, Database, FileText, CheckCircle2
} from 'lucide-react';
import { fetchExpeditions } from '../api';
import { Expedition } from '../types';

export const ExpeditionsPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchExpeditions({
      region: selectedRegion === 'All' ? undefined : selectedRegion,
      status: selectedStatus === 'All' ? undefined : selectedStatus,
      q: searchQuery.trim() || undefined
    })
      .then((data) => {
        setExpeditions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Expeditions fetch error:', err);
        setLoading(false);
      });
  }, [selectedRegion, selectedStatus, searchQuery]);

  const REGIONS = ['All', 'Antarctica', 'Arctic', 'Himalaya', 'Southern Ocean'];
  const STATUSES = ['All', 'Active', 'Completed'];

  return (
    <div className="w-full min-h-screen bg-[#07151F] text-[#F7F8F5] py-14 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#74B8CC]/30 selection:text-[#07151F]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Editorial Journal Header */}
        <div className="space-y-4 max-w-4xl border-b border-[#B9DDE7]/10 pb-10">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#5BB7A5] font-semibold tracking-widest uppercase">
            <Compass className="w-4 h-4 text-[#5BB7A5]" />
            <span>INDIAN POLAR EXPEDITION ARCHIVE · 1981–PRESENT</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
            Into the field: Four decades of polar exploration.
          </h1>
          <p className="text-base sm:text-lg text-[#8E9EA7] font-light leading-relaxed">
            From the pioneering Operation Gangotri in 1981 to the flagship 45th Indian Scientific Expedition to Antarctica, explore the field campaigns, scientific objectives, and winter-over deployments shaping India's presence across the cryosphere.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#0D2735] p-4 sm:p-5 rounded-2xl border border-[#B9DDE7]/15 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74B8CC]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expeditions by code, objective, or leader..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07151F] border border-[#B9DDE7]/20 text-white text-xs placeholder-[#61747E] focus:outline-none focus:border-[#74B8CC] transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs font-mono">
            {/* Region Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-[#8E9EA7]">Region:</span>
              <div className="flex gap-1">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRegion(r)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedRegion === r 
                        ? 'bg-[#74B8CC] text-[#07151F] font-bold shadow-sm' 
                        : 'bg-[#07151F] text-[#8E9EA7] hover:text-white border border-[#B9DDE7]/10'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Selector */}
            <div className="flex items-center space-x-2 pl-2 border-l border-[#B9DDE7]/15">
              <span className="text-[#8E9EA7]">Status:</span>
              <div className="flex gap-1">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedStatus === s 
                        ? 'bg-[#5BB7A5] text-[#07151F] font-bold shadow-sm' 
                        : 'bg-[#07151F] text-[#8E9EA7] hover:text-white border border-[#B9DDE7]/10'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Expeditions List: Large Editorial Rows */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-8 h-8 border-2 border-[#74B8CC] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-[#8E9EA7]">Accessing expedition field dossiers...</p>
          </div>
        ) : expeditions.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-[#0D2735] rounded-2xl border border-[#B9DDE7]/10 p-8">
            <p className="text-sm text-[#8E9EA7]">No expeditions match the specified criteria.</p>
            <button
              onClick={() => { setSelectedRegion('All'); setSelectedStatus('All'); setSearchQuery(''); }}
              className="text-xs font-mono text-[#74B8CC] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {expeditions.map((exp) => (
              <div
                key={exp.id}
                className="bg-[#0D2735] border border-[#B9DDE7]/15 rounded-3xl overflow-hidden hover:border-[#74B8CC]/40 transition duration-300 shadow-2xl flex flex-col lg:flex-row group"
              >
                {/* Large Authentic Photography (Left) */}
                <div className="lg:w-5/12 relative min-h-[280px] lg:min-h-full overflow-hidden bg-[#07151F]">
                  <img
                    src={exp.hero_image}
                    alt={exp.name}
                    className="w-full h-full object-cover polar-image-zoom brightness-[0.8] group-hover:brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D2735] via-transparent to-transparent lg:hidden" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-5 left-5 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#07151F]/80 backdrop-blur-md text-[11px] font-mono text-white border border-[#B9DDE7]/20 font-semibold">
                      {exp.region}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 ${
                      exp.status === 'Active'
                        ? 'bg-[#5BB7A5] text-[#07151F]'
                        : 'bg-[#07151F]/80 text-[#8E9EA7] border border-[#B9DDE7]/10'
                    }`}>
                      {exp.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-[#07151F] animate-pulse" />}
                      <span>{exp.status}</span>
                    </span>
                  </div>

                  {/* Photo Provenance */}
                  <div className="absolute bottom-3 left-4 text-[10px] font-mono text-[#8E9EA7] bg-[#07151F]/80 px-2 py-0.5 rounded">
                    Photo: {exp.hero_image_credit}
                  </div>
                </div>

                {/* Mission Details (Right) */}
                <div className="lg:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#8E9EA7]">
                      <span className="text-[#74B8CC] font-bold">{exp.code}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#5BB7A5]" />
                        <span>{exp.dates}</span>
                      </span>
                      {exp.vessel && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Ship className="w-3.5 h-3.5 text-[#D7A75D]" />
                            <span>{exp.vessel}</span>
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white group-hover:text-[#B9DDE7] transition-colors leading-snug">
                      {exp.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#DCEEF2]/85 font-light leading-relaxed">
                      {exp.summary}
                    </p>

                    {/* Leader Line */}
                    <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#8E9EA7]">
                      <User className="w-3.5 h-3.5 text-[#74B8CC]" />
                      <span>Expedition Leader:</span>
                      <span className="text-white font-semibold">{exp.leader_name}</span>
                      <span className="text-[#61747E]">({exp.leader_title})</span>
                    </div>

                    {/* Research Themes */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {exp.research_themes?.map((t) => (
                        <span key={t} className="px-2.5 py-1 rounded-md bg-[#07151F] text-[11px] font-mono text-[#74B8CC] border border-[#B9DDE7]/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Connected Knowledge & Action Button */}
                  <div className="pt-4 border-t border-[#B9DDE7]/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-4 text-xs font-mono text-[#8E9EA7]">
                      <span className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-[#74B8CC]" />
                        <span>{exp.connected_datasets?.length || 2} Datasets</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#D7A75D]" />
                        <span>{exp.connected_publications?.length || 2} Papers</span>
                      </span>
                    </div>

                    <Link
                      href={`/expeditions/${exp.id}`}
                      className="px-5 py-2.5 rounded-lg bg-[#74B8CC] hover:bg-[#B9DDE7] text-[#07151F] font-bold text-xs uppercase font-mono tracking-wider transition flex items-center space-x-2 group-hover:translate-x-1"
                    >
                      <span>INSPECT MISSION DOSSIER</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
