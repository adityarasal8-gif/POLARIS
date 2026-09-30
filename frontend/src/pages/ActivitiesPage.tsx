import React, { useState, useEffect } from 'react';
import { 
  Radio, Calendar, MapPin, ExternalLink, Globe, Tag, 
  Search, ShieldCheck, Newspaper, Award, Users, ChevronRight,
  ArrowRight, Compass
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

  const featuredActivity = filteredActivities[0];
  const remainingActivities = filteredActivities.slice(1);

  return (
    <div className="min-h-screen bg-[#07151F] text-white">
      {/* Editorial Header */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-gradient-to-b from-[#0D2735] to-[#07151F]">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#B9DDE7] uppercase tracking-widest">
            <Radio className="w-3.5 h-3.5 text-[#5BB7A5]" />
            <span>Field Dispatches & Institutional News</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-white font-normal leading-tight">
            Voices from the Polar Frontier.
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] max-w-3xl leading-relaxed">
            Official dispatches from Antarctic ice runways, Arctic fjord moorings, Himalayan high-altitude observatories, 
            and national research policy forums.
          </p>
        </div>
      </section>

      {/* Filter Ribbon */}
      <div className="border-b border-white/10 bg-white/[0.02] sticky top-16 z-20 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wide transition-all cursor-pointer ${
                  selectedType === t
                    ? 'bg-white text-[#07151F] font-bold'
                    : 'bg-white/5 text-[#94A3B8] hover:text-white border border-white/10'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#647887]" />
              <input
                type="text"
                placeholder="Search dispatches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#647887] focus:outline-none focus:border-[#74B8CC]"
              />
            </div>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#74B8CC] cursor-pointer"
            >
              {regions.map(r => (
                <option key={r} value={r} className="bg-[#07151F] text-white">
                  {r === 'All' ? 'All Regions' : r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#74B8CC] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[#94A3B8] text-sm font-mono">Retrieving latest field communications...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-12 text-center border border-white/10 rounded-2xl bg-white/[0.02] space-y-3">
            <Newspaper className="w-10 h-10 text-[#647887] mx-auto" />
            <h3 className="font-editorial text-2xl text-white font-normal">No Dispatches Match Filters</h3>
            <p className="text-xs text-[#94A3B8]">
              Try clearing search terms or selecting 'All' categories.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Lead Story (Institutional Journalism) */}
            {featuredActivity && (
              <article className="border border-white/10 rounded-2xl overflow-hidden bg-gradient-to-br from-white/[0.04] to-white/[0.01] hover:border-[#74B8CC]/40 transition-all">
                <div className="p-6 sm:p-10 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded bg-[#D7A75D]/10 border border-[#D7A75D]/30 text-[#D7A75D] font-bold uppercase tracking-wider">
                        {featuredActivity.type}
                      </span>
                      {featuredActivity.region && (
                        <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[#B9DDE7]">
                          {featuredActivity.region}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[#647887]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {featuredActivity.date}
                      </span>
                      <span>{featuredActivity.source || 'NCPOR Field Dispatch'}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-white font-normal leading-tight">
                      {featuredActivity.title}
                    </h2>
                    <p className="text-base sm:text-lg text-[#CBD5E1] leading-relaxed font-light">
                      {featuredActivity.summary}
                    </p>
                    {featuredActivity.content && featuredActivity.content !== featuredActivity.summary && (
                      <p className="text-sm text-[#94A3B8] leading-relaxed pt-3 border-t border-white/5">
                        {featuredActivity.content}
                      </p>
                    )}
                  </div>

                  {featuredActivity.expedition_id && (
                    <div className="pt-2">
                      <a
                        href={`/expeditions/${featuredActivity.expedition_id}`}
                        className="inline-flex items-center gap-2 text-xs font-mono text-[#74B8CC] hover:text-[#B9DDE7] transition-colors"
                      >
                        <Compass className="w-4 h-4" />
                        <span>Inspect Linked Expedition: {featuredActivity.expedition_id}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </article>
            )}

            {/* Editorial Article Rows */}
            {remainingActivities.length > 0 && (
              <div className="space-y-4 pt-6">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="font-editorial text-2xl text-white font-normal">
                    Chronological Dispatches
                  </h3>
                </div>

                <div className="divide-y divide-white/10">
                  {remainingActivities.map((act) => (
                    <article
                      key={act.id}
                      className="py-6 group transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#74B8CC] uppercase text-[10px]">
                            {act.type}
                          </span>
                          {act.region && (
                            <span className="text-[#647887]">
                              {act.region}
                            </span>
                          )}
                        </div>
                        <span className="text-[#647887] text-[11px]">
                          {act.date} · {act.source || 'NCPOR Dispatches'}
                        </span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-semibold text-white group-hover:text-[#B9DDE7] transition-colors">
                        {act.title}
                      </h4>

                      <p className="text-sm text-[#94A3B8] leading-relaxed line-clamp-2">
                        {act.summary}
                      </p>

                      {act.expedition_id && (
                        <div className="pt-1">
                          <a
                            href={`/expeditions/${act.expedition_id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#74B8CC] hover:underline"
                          >
                            <span>Linked Expedition ({act.expedition_id})</span>
                            <ChevronRight className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
