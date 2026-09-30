import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Search, Database, Filter, Compass, FileText, 
  Globe, Image, Activity, ArrowRight, Loader2,
  RefreshCw, CheckCircle2
} from 'lucide-react';
import { unifiedSearch } from '../api';
import { SearchResponse, SearchResultItem } from '../types';

export const RepositoryPage: React.FC = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialQ = searchParams.get('q') || 'Maitri atmosphere';
  const initialRegion = searchParams.get('region') || 'All';

  const [query, setQuery] = useState(initialQ);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const CONTENT_TYPES = [
    { id: 'All', label: 'All Content' },
    { id: 'expeditions', label: 'Expeditions', icon: Compass },
    { id: 'datasets', label: 'Datasets', icon: Database },
    { id: 'publications', label: 'Publications', icon: FileText },
    { id: 'stations', label: 'Stations', icon: Globe },
    { id: 'media', label: 'Media Assets', icon: Image },
    { id: 'activities', label: 'Activities', icon: Activity },
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

  // Flatten results for easy multi-type rendering
  const allResultItems: SearchResultItem[] = results
    ? Object.values(results.results_by_type).flat()
    : [];

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'expedition': return 'badge-verified';
      case 'dataset': return 'badge-live';
      case 'publication': return 'badge-curated';
      case 'station': return 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30';
      case 'media': case 'photo': case 'video': return 'bg-[#22C7A8]/20 text-[#22C7A8] border border-[#22C7A8]/30';
      default: return 'badge-preview';
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#071A2B] text-white py-10 px-4 sm:px-6 lg:px-8 polar-grid-bg">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-left space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#38BDF8] font-bold tracking-wider uppercase">
            <Database className="w-4 h-4 text-[#38BDF8]" />
            <span>UNIFIED POLAR KNOWLEDGE REPOSITORY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            One Search Across India's Polar Knowledge
          </h1>
          <p className="text-sm text-[#94A3B8] max-w-2xl">
            Simultaneously search through scientific expeditions, validated datasets, peer-reviewed literature, field media, station telemetry, and institutional archives.
          </p>
        </div>

        {/* Search Bar & Sample Queries */}
        <div className="polar-panel p-6 border border-[#6EC5E9]/20 shadow-2xl space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#38BDF8]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search expeditions, datasets, papers, reports, stations, researchers..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#071A2B] border border-[#6EC5E9]/30 text-white placeholder-[#647887] text-sm focus:outline-none focus:border-[#38BDF8]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#22C7A8] text-[#071A2B] font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer shadow-lg"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Search Repository</span>
            </button>
          </form>

          {/* Preset Demo Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-[#94A3B8] font-mono text-[11px] mr-1">Judge Demonstration Searches:</span>
            {SAMPLE_QUERIES.map((sq) => (
              <button
                key={sq}
                onClick={() => {
                  setQuery(sq);
                  executeSearch(sq, selectedType, selectedRegion);
                }}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-colors cursor-pointer ${
                  query === sq
                    ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8]'
                    : 'bg-[#071A2B] border-[#6EC5E9]/15 text-[#CBD5E1] hover:bg-[#123753]'
                }`}
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#6EC5E9]/15 pb-4 text-xs font-mono">
          {/* Content Type Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {CONTENT_TYPES.map((ct) => (
              <button
                key={ct.id}
                onClick={() => setSelectedType(ct.id)}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  selectedType === ct.id
                    ? 'bg-[#38BDF8] text-[#071A2B] font-bold border-[#38BDF8]'
                    : 'bg-[#0B2538] text-[#94A3B8] hover:text-white border-[#6EC5E9]/15'
                }`}
              >
                {ct.label}
              </button>
            ))}
          </div>

          {/* Region Filter Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-[#94A3B8] uppercase text-[10px]">Filter Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-[#0B2538] border border-[#6EC5E9]/20 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#38BDF8]"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Header with Relationship Counter */}
        {results && (
          <div className="flex items-center justify-between bg-[#0B2538]/60 p-4 rounded-xl border border-[#6EC5E9]/15 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#22C7A8]" />
              <span className="text-white font-semibold">
                Found {allResultItems.length} records matching "{results.query}"
              </span>
              <span className="text-[#94A3B8] hidden sm:inline">
                ({selectedType} in {selectedRegion})
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[#22C7A8]">
              <span className="w-2 h-2 rounded-full bg-[#22C7A8] animate-ping" />
              <span className="font-bold">{results.connected_entities_count} Cross-Entity Links</span>
            </div>
          </div>
        )}

        {/* Results Grid / List */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#38BDF8] animate-spin mx-auto" />
            <p className="text-sm font-mono text-[#94A3B8]">
              Cross-indexing expeditions, datasets, papers, and media...
            </p>
          </div>
        ) : allResultItems.length === 0 ? (
          <div className="py-20 text-center polar-panel p-8 space-y-3">
            <Database className="w-10 h-10 text-[#647887] mx-auto" />
            <h3 className="text-base font-bold text-white">No Connected Records Found</h3>
            <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
              Try searching for "Maitri", "Ozone", "45th ISEA", or click one of the suggested search queries above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {allResultItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setLocation(item.url)}
                className="polar-panel p-5 polar-panel-hover border border-[#6EC5E9]/15 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group text-left"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${getBadgeStyle(item.type)}`}>
                      {item.badge}
                    </span>
                    <span className="text-[10px] font-mono text-[#94A3B8] bg-[#071A2B] px-2 py-0.5 rounded border border-[#6EC5E9]/10">
                      {item.region}
                    </span>
                    <span className="text-[11px] font-mono text-[#6EC5E9]">
                      {item.subtitle}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">
                    {item.snippet}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end md:self-center">
                  <span className="text-xs text-[#38BDF8] font-semibold group-hover:underline">
                    View Connected Dossier
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#071A2B] border border-[#6EC5E9]/20 flex items-center justify-center text-[#38BDF8] group-hover:bg-[#38BDF8] group-hover:text-[#071A2B] transition-colors">
                    <ArrowRight className="w-4 h-4" />
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
