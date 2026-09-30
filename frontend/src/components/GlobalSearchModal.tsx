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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
    }, 200);

    return () => clearTimeout(timeout);
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (url: string) => {
    setLocation(url);
    onClose();
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'expedition': return <Compass className="w-4 h-4 text-[#111111]" />;
      case 'dataset': return <Database className="w-4 h-4 text-[#111111]" />;
      case 'publication': return <FileText className="w-4 h-4 text-[#111111]" />;
      case 'station': return <Globe className="w-4 h-4 text-[#111111]" />;
      case 'media': return <Image className="w-4 h-4 text-[#111111]" />;
      case 'activity': return <Activity className="w-4 h-4 text-[#111111]" />;
      default: return <Search className="w-4 h-4 text-[#8E8E91]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-white border border-[#E8E6E0] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E8E6E0] bg-[#FAFAF8]">
          <Search className="w-4 h-4 text-[#8E8E91] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search expeditions, stations, datasets, publications..."
            className="w-full bg-transparent text-[#111111] placeholder-[#8E8E91] text-sm focus:outline-none font-sans"
          />
          {loading && <Loader2 className="w-4 h-4 text-[#111111] animate-spin ml-2 shrink-0" />}
          {query && !loading && (
            <button onClick={() => setQuery('')} className="p-1 text-[#8E8E91] hover:text-[#111111] mr-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F4F2EE] border border-[#E8E6E0] text-[#555558] hover:text-[#111111] ml-2"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestions when empty */}
        {!query.trim() && (
          <div className="p-6 text-xs text-[#555558] space-y-4">
            <div className="font-mono uppercase text-[10px] text-[#8E8E91] tracking-wider font-semibold">
              Suggested Polar Searches
            </div>
            <div className="flex flex-wrap gap-2">
              {['Maitri atmosphere', '45th ISEA', 'Chhota Shigri', 'Kongsfjorden CTD', 'Bharati GNSS', 'Southern Ocean carbon'].map((pill) => (
                <button
                  key={pill}
                  onClick={() => setQuery(pill)}
                  className="px-3 py-1.5 rounded-full bg-[#F4F2EE] hover:bg-[#E8E6E0] border border-[#E8E6E0] text-[#111111] transition-colors flex items-center space-x-1.5 text-xs font-mono"
                >
                  <Search className="w-3 h-3 text-[#8E8E91]" />
                  <span>{pill}</span>
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-[#E8E6E0] text-[11px] text-[#8E8E91] flex items-center justify-between">
              <span>Searches across all 6 linked repositories simultaneously.</span>
              <span className="font-mono text-[#111111] font-medium">Unified Polar Graph</span>
            </div>
          </div>
        )}

        {/* Results Container */}
        {results && (
          <div className="overflow-y-auto p-4 space-y-4 divide-y divide-[#E8E6E0]">
            {results.total_results === 0 ? (
              <div className="py-12 text-center text-[#8E8E91] text-xs">
                No matching records found for "{results.query}". Try searching for "Antarctica", "Maitri", or "Ozone".
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-[#8E8E91] pb-1 font-mono">
                  <span>Found {results.total_results} connected records for "{results.query}"</span>
                  <span className="text-[#16A34A] font-semibold">{results.connected_entities_count} relationships active</span>
                </div>

                {/* Expeditions */}
                {results.results_by_type.expeditions.length > 0 && (
                  <div className="pt-3">
                    <div className="text-[10px] font-mono text-[#8E8E91] uppercase font-bold tracking-wider mb-2">
                      Expeditions ({results.results_by_type.expeditions.length})
                    </div>
                    <div className="space-y-1.5">
                      {results.results_by_type.expeditions.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => navigateTo(item.url)}
                          className="p-2.5 rounded-xl hover:bg-[#F4F2EE] transition-colors cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="mt-0.5 p-1 rounded-md bg-[#F4F2EE] border border-[#E8E6E0]">{getIconForType(item.type)}</div>
                            <div>
                              <div className="text-xs font-semibold text-[#111111] group-hover:text-black transition-colors">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-[#8E8E91]">{item.subtitle}</div>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#8E8E91] group-hover:text-[#111111] shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Datasets */}
                {results.results_by_type.datasets.length > 0 && (
                  <div className="pt-3">
                    <div className="text-[10px] font-mono text-[#8E8E91] uppercase font-bold tracking-wider mb-2">
                      Datasets ({results.results_by_type.datasets.length})
                    </div>
                    <div className="space-y-1.5">
                      {results.results_by_type.datasets.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => navigateTo(item.url)}
                          className="p-2.5 rounded-xl hover:bg-[#F4F2EE] transition-colors cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="mt-0.5 p-1 rounded-md bg-[#F4F2EE] border border-[#E8E6E0]">{getIconForType(item.type)}</div>
                            <div>
                              <div className="text-xs font-semibold text-[#111111] group-hover:text-black transition-colors">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-[#8E8E91]">{item.subtitle}</div>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#8E8E91] group-hover:text-[#111111] shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stations */}
                {results.results_by_type.stations.length > 0 && (
                  <div className="pt-3">
                    <div className="text-[10px] font-mono text-[#8E8E91] uppercase font-bold tracking-wider mb-2">
                      Stations ({results.results_by_type.stations.length})
                    </div>
                    <div className="space-y-1.5">
                      {results.results_by_type.stations.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => navigateTo(item.url)}
                          className="p-2.5 rounded-xl hover:bg-[#F4F2EE] transition-colors cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="mt-0.5 p-1 rounded-md bg-[#F4F2EE] border border-[#E8E6E0]">{getIconForType(item.type)}</div>
                            <div>
                              <div className="text-xs font-semibold text-[#111111] group-hover:text-black transition-colors">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-[#8E8E91]">{item.subtitle}</div>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#8E8E91] group-hover:text-[#111111] shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Publications */}
                {results.results_by_type.publications.length > 0 && (
                  <div className="pt-3">
                    <div className="text-[10px] font-mono text-[#8E8E91] uppercase font-bold tracking-wider mb-2">
                      Publications ({results.results_by_type.publications.length})
                    </div>
                    <div className="space-y-1.5">
                      {results.results_by_type.publications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => navigateTo(item.url)}
                          className="p-2.5 rounded-xl hover:bg-[#F4F2EE] transition-colors cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="mt-0.5 p-1 rounded-md bg-[#F4F2EE] border border-[#E8E6E0]">{getIconForType(item.type)}</div>
                            <div>
                              <div className="text-xs font-semibold text-[#111111] group-hover:text-black transition-colors line-clamp-1">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-[#8E8E91]">{item.subtitle}</div>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#8E8E91] group-hover:text-[#111111] shrink-0" />
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
