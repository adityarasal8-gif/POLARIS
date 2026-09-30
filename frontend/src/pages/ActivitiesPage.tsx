import React, { useState, useEffect } from 'react';
import { 
  Radio, Calendar, MapPin, ExternalLink, Globe, Tag, 
  Search, ShieldCheck, Newspaper, Award, Users, ChevronRight,
  Sparkles, Megaphone
} from 'lucide-react';
import { fetchActivities } from '../api';
import { Activity } from '../types';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedType, setSelectedType] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchActivities();
        setActivities(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch institutional activities');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const types = [
    'All',
    'Expedition Update',
    'Institutional News',
    'Conference',
    'Outreach',
    'Announcement'
  ];

  const regions = ['All', 'Antarctica', 'Arctic', 'Himalaya', 'Southern Ocean'];

  const filteredActivities = activities.filter(item => {
    const matchesType = selectedType === 'All' || item.type.toLowerCase().includes(selectedType.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || item.region === selectedRegion;
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesRegion && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'expedition update':
        return <Radio className="w-4 h-4 text-cyan-400" />;
      case 'conference':
        return <Users className="w-4 h-4 text-amber-400" />;
      case 'outreach':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-rose-400" />;
      default:
        return <Newspaper className="w-4 h-4 text-cyan-300" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#071A2B] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <span>Archive</span>
            <span>/</span>
            <span>Institutional Dissemination</span>
            <span>/</span>
            <span className="text-white">Activities & Updates</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Institutional Activities & Dispatches
              </h1>
              <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-3xl">
                Official announcements, field expedition telemetry reports, international scientific conferences, and public polar science engagement from the National Centre for Polar and Ocean Research (MoES).
              </p>
            </div>
            
            <div className="flex items-center gap-2 self-start md:self-auto bg-[#0B2538] border border-cyan-500/20 px-3 py-1.5 rounded text-xs font-mono text-cyan-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>MoES Official Communications</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#0B2538] border border-white/10 rounded-lg p-4 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search updates, announcements, dispatches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#071A2B] border border-white/10 rounded pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Type */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-[#071A2B] border border-white/10 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                {types.map(t => (
                  <option key={t} value={t}>Category: {t}</option>
                ))}
              </select>
            </div>

            {/* Region */}
            <div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-[#071A2B] border border-white/10 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                {regions.map(r => (
                  <option key={r} value={r}>Region: {r}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Activities Timeline / Cards */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 text-sm font-mono">Loading institutional activities feed...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-lg text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="bg-[#0B2538] border border-white/10 rounded-lg p-12 text-center space-y-3">
            <Newspaper className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-semibold text-slate-200">No activities match your filters</h3>
            <p className="text-xs text-slate-400">
              Clear your search or select a different category to view more dispatches.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredActivities.map((act, index) => (
              <div 
                key={act.id || index}
                className="bg-[#0B2538]/90 border border-white/10 hover:border-cyan-500/30 rounded-lg p-5 sm:p-6 transition shadow-lg space-y-4 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded bg-white/5 border border-white/10">
                      {getTypeIcon(act.type)}
                    </span>
                    <span className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wider">
                      {act.type}
                    </span>
                    {act.region && (
                      <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
                        {act.region}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {act.date}
                    </span>
                    <span>Source: {act.source || 'NCPOR Media Bureau'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-white group-hover:text-cyan-200 transition">
                    {act.title}
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {act.summary}
                  </p>
                  {act.content && act.content !== act.summary && (
                    <p className="text-xs sm:text-sm text-slate-400 pt-2 leading-relaxed border-t border-white/5">
                      {act.content}
                    </p>
                  )}
                </div>

                {/* Footer linking */}
                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-white/5 text-xs">
                  <div className="flex items-center gap-3">
                    {act.expedition_id && (
                      <a 
                        href={`/expeditions/${act.expedition_id}`}
                        className="text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 transition"
                      >
                        <Globe className="w-3 h-3" />
                        View Linked Expedition ({act.expedition_id})
                        <ChevronRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    Smart India Hackathon 2026 — Official Dissemination Stream
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
