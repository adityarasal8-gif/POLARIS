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
    <div className="min-h-screen bg-[#FAFAF8] text-[#111111] font-sans selection:bg-[#111111] selection:text-white">
      {/* Editorial Header */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#E8E6E0] bg-[#F4F2EE]">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E6E0] text-xs font-mono text-[#555558] uppercase tracking-wide font-medium shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Field Dispatches & Institutional News</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#111111] font-medium leading-tight">
            Voices from the Polar Frontier.
          </h1>

          <p className="text-base sm:text-lg text-[#555558] max-w-3xl leading-relaxed font-light">
            Official dispatches from Antarctic ice runways, Arctic fjord moorings, Himalayan high-altitude observatories, 
            and national research policy forums.
          </p>
        </div>
      </section>

      {/* Filter Ribbon */}
      <div className="border-b border-[#E8E6E0] bg-[#FAFAF8]/95 sticky top-16 z-20 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all cursor-pointer ${
                  selectedType === t
                    ? 'bg-[#111111] text-white font-medium shadow-xs'
                    : 'bg-white text-[#555558] hover:text-[#111111] border border-[#E8E6E0]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E91]" />
              <input
                type="text"
                placeholder="Search dispatches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E8E6E0] rounded-full pl-9 pr-3 py-1.5 text-xs text-[#111111] placeholder-[#8E8E91] focus:outline-none focus:border-[#111111] font-sans shadow-xs"
              />
            </div>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-white border border-[#E8E6E0] rounded-full px-3 py-1.5 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer shadow-xs"
            >
              {regions.map(r => (
                <option key={r} value={r}>
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
            <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[#8E8E91] text-sm font-mono">Retrieving latest field communications...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-12 text-center border border-[#E8E6E0] rounded-2xl bg-white space-y-3 shadow-sm">
            <Newspaper className="w-10 h-10 text-[#8E8E91] mx-auto" />
            <h3 className="font-serif text-2xl text-[#111111] font-medium">No Dispatches Match Filters</h3>
            <p className="text-xs text-[#555558]">
              Try clearing search terms or selecting 'All' categories.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Lead Story (Institutional Journalism) */}
            {featuredActivity && (
              <article className="border border-[#E8E6E0] rounded-3xl overflow-hidden bg-white shadow-sm hover:border-[#111111]/30 transition-all">
                <div className="p-6 sm:p-10 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E6E0] pb-4 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#F4F2EE] border border-[#E8E6E0] text-[#111111] font-semibold uppercase tracking-wider">
                        {featuredActivity.type}
                      </span>
                      {featuredActivity.region && (
                        <span className="px-3 py-1 rounded-full bg-[#FAFAF8] border border-[#E8E6E0] text-[#555558]">
                          {featuredActivity.region}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[#8E8E91]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {featuredActivity.date}
                      </span>
                      <span>{featuredActivity.source || 'NCPOR Field Dispatch'}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#111111] font-medium leading-tight">
                      {featuredActivity.title}
                    </h2>
                    <p className="text-base sm:text-lg text-[#555558] leading-relaxed font-light">
                      {featuredActivity.summary}
                    </p>
                    {featuredActivity.content && featuredActivity.content !== featuredActivity.summary && (
                      <p className="text-sm text-[#555558] leading-relaxed pt-3 border-t border-[#E8E6E0]">
                        {featuredActivity.content}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E8E6E0]">
                    <div className="flex flex-wrap gap-1.5">
                      {featuredActivity.tags?.map(tag => (
                        <span key={tag} className="text-xs font-mono text-[#555558] bg-[#F4F2EE] border border-[#E8E6E0] px-2.5 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {featuredActivity.url && (
                      <a
                        href={featuredActivity.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-mono font-medium transition shadow-sm"
                      >
                        <span>Official Bulletin</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            )}

            {/* Grid of Secondary Dispatches */}
            {remainingActivities.length > 0 && (
              <div className="space-y-6">
                <div className="border-b border-[#E8E6E0] pb-2">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#8E8E91] font-semibold">
                    Field Archive & Announcements ({remainingActivities.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {remainingActivities.map(item => (
                    <article
                      key={item.id}
                      className="border border-[#E8E6E0] rounded-2xl p-6 bg-white hover:bg-[#FAFAF8] transition-all space-y-4 flex flex-col justify-between shadow-sm"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono text-[#8E8E91]">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#F4F2EE] border border-[#E8E6E0] text-[#111111] uppercase tracking-wider font-semibold">
                            {item.type}
                          </span>
                          <span>{item.date}</span>
                        </div>

                        <h4 className="text-lg font-serif font-medium text-[#111111] leading-snug">
                          {item.title}
                        </h4>

                        <p className="text-xs sm:text-sm text-[#555558] font-light leading-relaxed line-clamp-3">
                          {item.summary}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#E8E6E0] flex items-center justify-between text-xs font-mono text-[#8E8E91]">
                        <span>{item.region || 'All Basins'}</span>
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#111111] font-medium hover:underline inline-flex items-center gap-1"
                          >
                            <span>Read Dispatch</span>
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[#8E8E91]">Internal Dispatch</span>
                        )}
                      </div>
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
