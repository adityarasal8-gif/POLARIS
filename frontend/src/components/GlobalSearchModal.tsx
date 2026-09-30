import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Search, X, Compass, Database, FileText, Globe, Image, Activity, ArrowRight, Loader2 } from 'lucide-react';
import { unifiedSearch } from '../api';
import { SearchResponse } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  // Keyboard shortcut listener for Cmd+K and /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search call
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const data = await unifiedSearch(query.trim());
        setResults(data);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(timeout);
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (url: string) => {
    setLocation(url);
    onClose();
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'expedition': return <Compass className="w-4 h-4 text-[#22C7A8]" />;
      case 'dataset': return <Database className="w-4 h-4 text-[#38BDF8]" />;
      case 'publication': return <FileText className="w-4 h-4 text-[#E7A93B]" />;
      case 'station': return <Globe className="w-4 h-4 text-[#6EC5E9]" />;
      case 'media': return <Image className="w-4 h-4 text-[#38BDF8]" />;
      case 'activity': return <Activity className="w-4 h-4 text-[#22C7A8]" />;
      default: return <Search className="w-4 h-4 text-[#94A3B8]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#071A2B]/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-[#0B2538] border border-[#6EC5E9]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#6EC5E9]/15 bg-[#071A2B]/60">
          <Search className="w-5 h-5 text-[#38BDF8] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search expeditions, datasets, publications, stations, media (e.g. 'Maitri atmosphere')..."
            className="w-full bg-transparent text-white placeholder-[#647887] text-sm focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-[#38BDF8] animate-spin ml-2 shrink-0" />}
          {query && !loading && (
            <button onClick={() => setQuery('')} className="p-1 text-[#94A3B8] hover:text-white mr-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[10px] font-mono px-2 py-1 rounded bg-[#071A2B] border border-[#6EC5E9]/20 text-[#94A3B8] hover:text-white ml-2"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestions when empty */}
        {!query.trim() && (
          <div className="p-6 text-xs text-[#94A3B8] space-y-4">
            <div className="font-mono uppercase text-[10px] text-[#6EC5E9] tracking-wider font-semibold">
              Suggested Polar Searches
            </div>
            <div className="flex flex-wrap gap-2">
              {['Maitri atmosphere', '45th ISEA', 'Chhota Shigri', 'Kongsfjorden CTD', 'Bharati GNSS', 'Southern Ocean carbon'].map((pill) => (
                <button
                  key={pill}
                  onClick={() => setQuery(pill)}
                  className="px-3 py-1.5 rounded-lg bg-[#071A2B] hover:bg-[#123753] border border-[#6EC5E9]/15 text-white transition-colors flex items-center space-x-1.5"
                >
                  <Search className="w-3 h-3 text-[#38BDF8]" />
                  <span>{pill}</span>
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-[#6EC5E9]/10 text-[11px] text-[#647887] flex items-center justify-between">
              <span>Searches across all 6 linked repositories simultaneously.</span>
              <span className="font-mono text-[#38BDF8]">Faceted & Relational</span>
            </div>
          </div>
        )}

        {/* Results Container */}
        {results && (
          <div className="overflow-y-auto p-4 space-y-4 divide-y divide-[#6EC5E9]/10">
            {results.total_results === 0 ? (
              <div className="py-12 text-center text-[#94A3B8] text-xs">
                No matching records found for "{results.query}". Try searching for "Antarctica", "Maitri", or "Ozone".
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-[#94A3B8] pb-1 font-mono">
                  <span>Found {results.total_results} connected records for "{results.query}"</span>
                  <span className="text-[#22C7A8] font-semibold">{results.connected_entities_count} relationships active</span>
                </div>

                {/* Expeditions */}
                {results.results_by_type.expeditions.length > 0 && (
                  <div className="pt-3">
                    <div className="text-[10px] font-mono text-[#22C7A8] uppercase font-bold tracking-wider mb-2">
                      Expeditions ({results.results_by_type.expeditions.length})
                    </div>
                    <div className="space-y-1.5">
                      {results.results_by_type.expeditions.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => navigateTo(item.url)}
                          className="p-2.5 rounded-lg hover:bg-[#123753] transition-colors cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="mt-0.5">{getIconForType(item.type)}</div>
                            <div>
                              <div className="text-xs font-semibold text-white group-hover:text-[#38BDF8] transition-colors">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-[#94A3B8]">{item.subtitle}</div>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#647887] group-hover:text-[#38BDF8] shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Datasets */}
                {results.results_by_type.datasets.length > 0 && (
                  <div className="pt-3">
                    <div className="text-[10px] font-mono text-[#38BDF8] uppercase font-bold tracking-wider mb-2">
                      Datasets ({results.results_by_type.datasets.length})
                    </div>
                    <div className="space-y-1.5">
                      {results.results_by_type.datasets.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => navigateTo(item.url)}
                          className="p-2.5 rounded-lg hover:bg-[#123753] transition-colors cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="mt-0.5">{getIconForType(item.type)}</div>
                            <div>
                              <div className="text-xs font-semibold text-white group-hover:text-[#38BDF8] transition-colors">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-[#94A3B8]">{item.subtitle}</div>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#647887] group-hover:text-[#38BDF8] shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stations */}
                {results.results_by_type.stations.length > 0 && (
                  <div className="pt-3">
                    <div className="text-[10px] font-mono text-[#6EC5E9] uppercase font-bold tracking-wider mb-2">
                      Stations ({results.results_by_type.stations.length})
                    </div>
                    <div className="space-y-1.5">
                      {results.results_by_type.stations.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => navigateTo(item.url)}
                          className="p-2.5 rounded-lg hover:bg-[#123753] transition-colors cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="mt-0.5">{getIconForType(item.type)}</div>
                            <div>
                              <div className="text-xs font-semibold text-white group-hover:text-[#38BDF8] transition-colors">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-[#94A3B8]">{item.subtitle}</div>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#647887] group-hover:text-[#38BDF8] shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Publications */}
                {results.results_by_type.publications.length > 0 && (
                  <div className="pt-3">
                    <div className="text-[10px] font-mono text-[#E7A93B] uppercase font-bold tracking-wider mb-2">
                      Publications ({results.results_by_type.publications.length})
                    </div>
                    <div className="space-y-1.5">
                      {results.results_by_type.publications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => navigateTo(item.url)}
                          className="p-2.5 rounded-lg hover:bg-[#123753] transition-colors cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="mt-0.5">{getIconForType(item.type)}</div>
                            <div>
                              <div className="text-xs font-semibold text-white group-hover:text-[#38BDF8] transition-colors line-clamp-1">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-[#94A3B8]">{item.subtitle}</div>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#647887] group-hover:text-[#38BDF8] shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
