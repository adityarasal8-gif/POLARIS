import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Search, Database, Filter, Compass, FileText, 
  Globe, Image, Activity, ArrowRight, Loader2,
  CheckCircle2, Network, ExternalLink, BookOpen, Layers
} from 'lucide-react';
import { unifiedSearch } from '../api';
import { SearchResponse, SearchResultItem } from '../types';

export const RepositoryPage: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const initialQ = searchParams.get('q') || 'Maitri atmosphere';
  const initialRegion = searchParams.get('region') || 'All';

  const [query, setQuery] = useState(initialQ);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grouped' | 'stream'>('grouped');
  const [, setLocation] = useLocation();

  const CONTENT_TYPES = [
    { id: 'All', label: 'All Knowledge' },
    { id: 'expeditions', label: 'Expeditions', icon: Compass },
    { id: 'datasets', label: 'Datasets', icon: Database },
    { id: 'publications', label: 'Publications', icon: FileText },
    { id: 'stations', label: 'Stations', icon: Globe },
    { id: 'media', label: 'Field Media', icon: Image },
    { id: 'activities', label: 'Dispatches', icon: Activity },
  ];

  const REGIONS = ['All', 'Antarctica', 'Arctic', 'Himalaya', 'Southern Ocean'];

  const SAMPLE_QUERIES = [
    'Maitri atmosphere',
    '45th ISEA',
    'Chhota Shigri glacier',
    'Kongsfjorden IndArc',
    'Southern Ocean CTD',
    'Bharati GNSS drift',
    'Ice core isotopes'
  ];

  const executeSearch = async (searchTerm: string, typeFilter: string, regionFilter: string) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const data = await unifiedSearch(
        searchTerm.trim(),
        typeFilter === 'All' ? undefined : typeFilter,
        regionFilter === 'All' ? undefined : regionFilter
      );
      setResults(data);
    } catch (err) {
      console.error('Unified search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch(query, selectedType, selectedRegion);
  }, [selectedType, selectedRegion]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query, selectedType, selectedRegion);
  };

  const allResultItems: SearchResultItem[] = results
    ? Object.values(results.results_by_type).flat()
    : [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'expedition': return Compass;
      case 'dataset': return Database;
      case 'publication': return FileText;
      case 'station': return Globe;
      case 'media': case 'photo': case 'video': return Image;
      default: return Layers;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] text-[#111111] font-sans selection:bg-[#111111] selection:text-white">
      {/* Editorial Search Hero */}
      <section className="relative pt-16 pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#E8E6E0] bg-[#F4F2EE]">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E6E0] text-xs font-mono tracking-wide text-[#555558] uppercase font-medium shadow-sm">
            <Database className="w-3.5 h-3.5 text-[#111111]" />
            <span>National Polar Knowledge Repository</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#111111] font-medium leading-tight">
            Find the knowledge behind <br className="hidden sm:inline" />
            <span className="italic">India's polar research.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#555558] max-w-3xl leading-relaxed font-light">
            A unified discovery engine indexing expeditions, in-situ sensor datasets, peer-reviewed monographs, 
            research station telemetry, and curated field imagery across Antarctica, the Arctic, and the Himalayas.
          </p>

          {/* Large Search Input */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-white border border-[#E8E6E0] shadow-sm focus-within:border-[#111111] transition-all">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-[#8E8E91]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 'Maitri atmosphere', '45th ISEA', 'Kongsfjorden', 'Ozone'..."
                  className="w-full pl-12 pr-4 py-3.5 bg-transparent text-[#111111] placeholder-[#8E8E91] text-base focus:outline-none font-sans"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-3.5 py-3 rounded-full bg-[#F4F2EE] border border-[#E8E6E0] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r === 'All' ? 'All Regions' : r}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 rounded-full bg-[#111111] hover:bg-black text-white font-medium text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm active:scale-95"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>Search Archive</span>
                </button>
              </div>
            </div>
          </form>

          {/* Quick Research Topics */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-[#8E8E91] font-mono text-xs">Curated Queries:</span>
            {SAMPLE_QUERIES.map((sq) => (
              <button
                key={sq}
                onClick={() => {
                  setQuery(sq);
                  executeSearch(sq, selectedType, selectedRegion);
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  query === sq
                    ? 'bg-[#111111] text-white font-medium shadow-sm'
                    : 'bg-white border border-[#E8E6E0] text-[#555558] hover:text-[#111111] hover:border-[#111111]/30'
                }`}
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Results Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Navigation & View Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E6E0] pb-5">
          {/* Domain Type Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {CONTENT_TYPES.map((ct) => (
              <button
                key={ct.id}
                onClick={() => setSelectedType(ct.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedType === ct.id
                    ? 'bg-[#111111] text-white font-medium shadow-sm'
                    : 'bg-white text-[#555558] hover:text-[#111111] border border-[#E8E6E0]'
                }`}
              >
                {ct.label}
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#8E8E91]">
            <span>Layout:</span>
            <div className="flex items-center gap-1 p-0.5 rounded-full bg-[#F4F2EE] border border-[#E8E6E0]">
              <button
                onClick={() => setViewMode('grouped')}
                className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                  viewMode === 'grouped'
                    ? 'bg-white text-[#111111] font-semibold shadow-xs'
                    : 'text-[#555558] hover:text-[#111111]'
                }`}
              >
                Relational Clusters
              </button>
              <button
                onClick={() => setViewMode('stream')}
                className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                  viewMode === 'stream'
                    ? 'bg-white text-[#111111] font-semibold shadow-xs'
                    : 'text-[#555558] hover:text-[#111111]'
                }`}
              >
                Unified Stream
              </button>
            </div>
          </div>
        </div>

        {/* Results Metadata & Relational Links Banner */}
        {results && (
          <div className="p-4 rounded-2xl bg-white border border-[#E8E6E0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <span className="text-[#111111] font-semibold">
                Indexed {allResultItems.length} records matching "{results.query}"
              </span>
              <span className="text-[#8E8E91]">
                ({selectedType} in {selectedRegion})
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#111111]">
              <Network className="w-4 h-4 text-[#111111]" />
              <span className="font-semibold">{results.connected_entities_count} Cross-Entity Relationships</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-[#111111] animate-spin mx-auto" />
            <p className="font-mono text-sm text-[#8E8E91]">
              Traversing relational knowledge graph across expeditions, stations, and datasets...
            </p>
          </div>
        ) : allResultItems.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center border border-[#E8E6E0] rounded-2xl bg-white p-8 space-y-3 shadow-sm">
            <Database className="w-10 h-10 text-[#8E8E91] mx-auto" />
            <h3 className="font-serif text-2xl text-[#111111] font-medium">No Records Found</h3>
            <p className="text-sm text-[#555558] max-w-md mx-auto">
              We couldn't find matching records for "{query}". Try searching for broad scientific terms like "Maitri", "Atmosphere", "Ozone", or "Glacier".
            </p>
          </div>
        ) : viewMode === 'grouped' && results ? (
          /* Relational Clusters Layout */
          <div className="space-y-12">
            {Object.entries(results.results_by_type).map(([typeKey, items]) => {
              if (items.length === 0) return null;
              const Icon = getTypeIcon(typeKey);
              return (
                <div key={typeKey} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E8E6E0] pb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[#111111]" />
                      <h2 className="font-serif text-xl text-[#111111] font-medium capitalize">
                        {typeKey} ({items.length})
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-[#8E8E91]">
                      Connected Domain Records
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setLocation(item.url)}
                        className="group p-5 rounded-2xl bg-white hover:bg-[#FAFAF8] border border-[#E8E6E0] hover:border-[#111111]/30 transition-all cursor-pointer flex flex-col justify-between shadow-sm"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-[#E8E6E0] bg-[#F4F2EE] text-[#111111] uppercase tracking-wider font-semibold">
                              {item.badge}
                            </span>
                            <span className="text-[11px] font-mono text-[#8E8E91]">
                              {item.region}
                            </span>
                          </div>

                          <h3 className="text-base font-semibold text-[#111111] group-hover:text-black transition-colors leading-snug">
                            {item.title}
                          </h3>

                          <p className="text-xs text-[#555558] line-clamp-2 leading-relaxed">
                            {item.snippet}
                          </p>
                        </div>

                        <div className="pt-4 mt-3 border-t border-[#E8E6E0] flex items-center justify-between text-xs font-mono text-[#111111]">
                          <span className="text-[#8E8E91] text-[11px]">{item.subtitle}</span>
                          <span className="inline-flex items-center gap-1 group-hover:underline font-semibold">
                            Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Unified Stream Layout */
          <div className="space-y-3">
            {allResultItems.map((item) => {
              const Icon = getTypeIcon(item.type);
              return (
                <div
                  key={item.id}
                  onClick={() => setLocation(item.url)}
                  className="group p-5 rounded-2xl bg-white hover:bg-[#FAFAF8] border border-[#E8E6E0] hover:border-[#111111]/30 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#F4F2EE] border border-[#E8E6E0] flex items-center justify-center shrink-0 text-[#111111] mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-[#E8E6E0] bg-[#F4F2EE] text-[#111111] uppercase tracking-wider font-semibold">
                          {item.badge}
                        </span>
                        <span className="text-[11px] font-mono text-[#8E8E91]">
                          {item.region}
                        </span>
                        <span className="text-[11px] font-mono text-[#555558]">
                          {item.subtitle}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-[#111111] group-hover:text-black transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#555558] line-clamp-2 leading-relaxed">
                        {item.snippet}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 text-xs font-mono text-[#111111] self-end md:self-center font-semibold">
                    <span>Inspect Record</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
