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

  // Flatten results for stream view
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'expedition': return 'text-[#D7A75D] bg-[#D7A75D]/10 border-[#D7A75D]/30';
      case 'dataset': return 'text-[#74B8CC] bg-[#74B8CC]/10 border-[#74B8CC]/30';
      case 'publication': return 'text-[#5BB7A5] bg-[#5BB7A5]/10 border-[#5BB7A5]/30';
      case 'station': return 'text-[#B9DDE7] bg-[#B9DDE7]/10 border-[#B9DDE7]/30';
      case 'media': return 'text-[#DCEEF2] bg-[#DCEEF2]/10 border-[#DCEEF2]/30';
      default: return 'text-[#CBD5E1] bg-white/10 border-white/20';
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#07151F] text-white">
      {/* Editorial Search Hero */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-gradient-to-b from-[#0D2735] to-[#07151F]">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-[#B9DDE7] uppercase">
            <Database className="w-3.5 h-3.5 text-[#74B8CC]" />
            <span>National Polar Knowledge Repository</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-white font-normal leading-tight">
            Find the knowledge behind <br className="hidden sm:inline" />
            <span className="italic text-[#B9DDE7]">India's polar research.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] max-w-3xl leading-relaxed">
            A unified discovery engine indexing expeditions, in-situ sensor datasets, peer-reviewed monographs, 
            research station telemetry, and curated field imagery across Antarctica, the Arctic, and the Himalayas.
          </p>

          {/* Large Search Input */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-white/[0.04] border border-white/15 backdrop-blur-md shadow-2xl focus-within:border-[#74B8CC]/60 transition-all">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-[#74B8CC]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 'Maitri atmosphere', '45th ISEA', 'Kongsfjorden', 'Ozone'..."
                  className="w-full pl-12 pr-4 py-3.5 bg-transparent text-white placeholder-[#647887] text-base focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-3 py-3 rounded-xl bg-white/10 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#74B8CC] cursor-pointer"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r} className="bg-[#07151F] text-white">
                      {r === 'All' ? 'All Regions' : r}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 rounded-xl bg-[#74B8CC] hover:bg-[#B9DDE7] text-[#07151F] font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-lg active:scale-95"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>Search Archive</span>
                </button>
              </div>
            </div>
          </form>

          {/* Quick Research Topics */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-[#647887] font-mono text-xs">Curated Queries:</span>
            {SAMPLE_QUERIES.map((sq) => (
              <button
                key={sq}
                onClick={() => {
                  setQuery(sq);
                  executeSearch(sq, selectedType, selectedRegion);
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  query === sq
                    ? 'bg-[#74B8CC]/20 border border-[#74B8CC] text-[#B9DDE7]'
                    : 'bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white hover:bg-white/10'
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          {/* Domain Type Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {CONTENT_TYPES.map((ct) => (
              <button
                key={ct.id}
                onClick={() => setSelectedType(ct.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedType === ct.id
                    ? 'bg-white text-[#07151F] font-bold shadow-md'
                    : 'bg-white/5 text-[#94A3B8] hover:text-white border border-white/10'
                }`}
              >
                {ct.label}
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
            <span>Layout:</span>
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                viewMode === 'grouped'
                  ? 'bg-[#74B8CC]/20 border-[#74B8CC] text-[#B9DDE7]'
                  : 'bg-white/5 border-white/10 hover:text-white'
              }`}
            >
              Relational Clusters
            </button>
            <button
              onClick={() => setViewMode('stream')}
              className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                viewMode === 'stream'
                  ? 'bg-[#74B8CC]/20 border-[#74B8CC] text-[#B9DDE7]'
                  : 'bg-white/5 border-white/10 hover:text-white'
              }`}
            >
              Unified Stream
            </button>
          </div>
        </div>

        {/* Results Metadata & Relational Links Banner */}
        {results && (
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5BB7A5]" />
              <span className="text-white font-medium">
                Indexed {allResultItems.length} records matching "{results.query}"
              </span>
              <span className="text-[#647887]">
                ({selectedType} in {selectedRegion})
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#74B8CC]">
              <Network className="w-4 h-4 text-[#74B8CC]" />
              <span className="font-bold">{results.connected_entities_count} Cross-Entity Relationships</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-[#74B8CC] animate-spin mx-auto" />
            <p className="font-mono text-sm text-[#94A3B8]">
              Traversing relational knowledge graph across expeditions, stations, and datasets...
            </p>
          </div>
        ) : allResultItems.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center border border-white/10 rounded-2xl bg-white/[0.02] p-8 space-y-3">
            <Database className="w-10 h-10 text-[#647887] mx-auto" />
            <h3 className="font-editorial text-2xl text-white font-normal">No Records Found</h3>
            <p className="text-sm text-[#94A3B8] max-w-md mx-auto">
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
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[#74B8CC]" />
                      <h2 className="font-editorial text-xl text-white font-normal capitalize">
                        {typeKey} ({items.length})
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-[#647887]">
                      Connected Domain Records
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setLocation(item.url)}
                        className="group p-5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-[#74B8CC]/40 transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${getTypeColor(item.type)}`}>
                              {item.badge}
                            </span>
                            <span className="text-[11px] font-mono text-[#647887]">
                              {item.region}
                            </span>
                          </div>

                          <h3 className="text-base font-semibold text-white group-hover:text-[#B9DDE7] transition-colors leading-snug">
                            {item.title}
                          </h3>

                          <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                            {item.snippet}
                          </p>
                        </div>

                        <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#74B8CC]">
                          <span className="text-[#647887] text-[11px]">{item.subtitle}</span>
                          <span className="inline-flex items-center gap-1 group-hover:underline">
                            Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
                  className="group p-5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-[#74B8CC]/40 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#74B8CC] mt-1">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${getTypeColor(item.type)}`}>
                          {item.badge}
                        </span>
                        <span className="text-[11px] font-mono text-[#647887]">
                          {item.region}
                        </span>
                        <span className="text-[11px] font-mono text-[#74B8CC]/80">
                          {item.subtitle}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-white group-hover:text-[#B9DDE7] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                        {item.snippet}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 text-xs font-mono text-[#74B8CC] self-end md:self-center">
                    <span>Inspect Record</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
