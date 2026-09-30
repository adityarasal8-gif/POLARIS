import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Database, Search, Filter, Download, ArrowRight, 
  Layers, Calendar, Tag, ShieldCheck, FileSpreadsheet, Check
} from 'lucide-react';
import { fetchDatasets } from '../api';
import { Dataset } from '../types';

export const DatasetsPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const NPDC_CATEGORIES = [
    'All',
    'Atmosphere',
    'Cryosphere',
    'Oceans',
    'Biosphere',
    'Climate Indicators',
    'Land Surface',
    'Paleoclimate',
    'Solid Earth',
    'Sun-Earth Interaction'
  ];

  const REGIONS = ['All', 'Antarctica', 'Arctic', 'Himalaya', 'Southern Ocean'];

  useEffect(() => {
    setLoading(true);
    fetchDatasets({
      category: selectedCategory === 'All' ? undefined : selectedCategory,
      region: selectedRegion === 'All' ? undefined : selectedRegion,
      q: searchQuery.trim() || undefined
    })
      .then((data) => {
        setDatasets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Datasets fetch error:', err);
        setLoading(false);
      });
  }, [selectedCategory, selectedRegion, searchQuery]);

  const handleDownloadSample = (ds: Dataset, e: React.MouseEvent) => {
    e.stopPropagation();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ds.sample_data || [], null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${ds.identifier}_sample.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F8F5] text-[#10212B] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#74B8CC]/30 selection:text-[#07151F]">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Portal Header */}
        <div className="border-b border-[#0D2735]/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#133447] font-bold tracking-wider uppercase">
              <Database className="w-4 h-4 text-[#133447]" />
              <span>NATIONAL POLAR DATA CENTER (NPDC) · SCIENTIFIC REPOSITORY</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#10212B] tracking-tight">
              Polar Observational Datasets
            </h1>
            <p className="text-sm sm:text-base text-[#61747E] max-w-3xl font-light">
              Calibrated sensor telemetry, deep ice-core chemical profiles, oceanographic CTD casts, and long-term atmospheric time series curated under National Data Governance standards.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-[#61747E] bg-white border border-[#0D2735]/10 px-4 py-2.5 rounded-xl shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#5BB7A5]" />
            <span>Open Access under CC-BY-NC 4.0</span>
          </div>
        </div>

        {/* 2-Column Data Explorer: Left Filters + Right Rows */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Rail: Facet Filters */}
          <div className="lg:col-span-3 space-y-6 bg-white p-6 rounded-2xl border border-[#0D2735]/10 shadow-sm sticky top-24">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#61747E] font-semibold mb-3">
                Search Datasets
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#61747E]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter parameters..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F7F8F5] border border-[#0D2735]/15 text-xs text-[#10212B] placeholder-[#8E9EA7] focus:outline-none focus:border-[#133447]"
                />
              </div>
            </div>

            {/* Region Facet */}
            <div className="space-y-2 pt-4 border-t border-[#0D2735]/10">
              <span className="text-xs font-mono uppercase tracking-wider text-[#61747E] font-semibold block">
                Region
              </span>
              <div className="space-y-1">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRegion(r)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition ${
                      selectedRegion === r
                        ? 'bg-[#0D2735] text-white font-bold'
                        : 'text-[#61747E] hover:bg-[#F7F8F5] hover:text-[#10212B]'
                    }`}
                  >
                    <span>{r}</span>
                    {selectedRegion === r && <span className="w-1.5 h-1.5 rounded-full bg-[#5BB7A5]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Science Category Facet */}
            <div className="space-y-2 pt-4 border-t border-[#0D2735]/10">
              <span className="text-xs font-mono uppercase tracking-wider text-[#61747E] font-semibold block">
                Science Category
              </span>
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                {NPDC_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition ${
                      selectedCategory === cat
                        ? 'bg-[#0D2735] text-white font-bold'
                        : 'text-[#61747E] hover:bg-[#F7F8F5] hover:text-[#10212B]'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-[#5BB7A5]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Rail: Tabular Dataset Rows */}
          <div className="lg:col-span-9 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#61747E] px-1">
              <span>Showing <strong>{datasets.length}</strong> scientific data products</span>
              {(selectedCategory !== 'All' || selectedRegion !== 'All' || searchQuery) && (
                <button
                  onClick={() => { setSelectedCategory('All'); setSelectedRegion('All'); setSearchQuery(''); }}
                  className="text-[#133447] underline hover:text-[#0D2735]"
                >
                  Reset all filters
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-24 text-center space-y-3 bg-white rounded-2xl border border-[#0D2735]/10">
                <div className="w-7 h-7 border-2 border-[#0D2735] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-mono text-[#61747E]">Querying NPDC catalogs...</p>
              </div>
            ) : datasets.length === 0 ? (
              <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-[#0D2735]/10 p-8">
                <p className="text-sm text-[#61747E]">No dataset matches the specified filters.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {datasets.map((ds) => (
                  <div
                    key={ds.id}
                    onClick={() => setLocation(`/datasets/${ds.id}`)}
                    className="bg-white border border-[#0D2735]/10 hover:border-[#0D2735]/30 rounded-2xl p-6 transition duration-200 shadow-sm hover:shadow-md cursor-pointer space-y-3 group"
                  >
                    {/* Top Row: Identifier, Category, Region */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#10212B] bg-[#F7F8F5] px-2.5 py-1 rounded border border-[#0D2735]/10">
                          {ds.identifier}
                        </span>
                        <span className="text-[#61747E] font-medium">
                          {ds.science_category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                          {ds.access_status}
                        </span>
                        <span className="text-[#61747E]">
                          {ds.region}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-bold text-[#10212B] group-hover:text-[#133447] transition leading-snug">
                      {ds.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#61747E] font-light leading-relaxed line-clamp-2">
                      {ds.description}
                    </p>

                    {/* Metadata & Actions Bottom Bar */}
                    <div className="pt-3 border-t border-[#0D2735]/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#61747E]">
                      <div className="flex flex-wrap items-center gap-4">
                        <span>Coverage: <strong className="text-[#10212B]">{ds.temporal_coverage}</strong></span>
                        <span>Format: <strong className="text-[#10212B]">{ds.data_format}</strong></span>
                        {ds.parameters && ds.parameters.length > 0 && (
                          <span className="hidden sm:inline">
                            Param: <strong className="text-[#10212B]">{ds.parameters.slice(0, 2).join(', ')}</strong>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => handleDownloadSample(ds, e)}
                          className="px-3 py-1.5 rounded-lg bg-[#F7F8F5] hover:bg-[#EAEAEA] border border-[#0D2735]/15 text-[#10212B] text-xs font-mono flex items-center gap-1.5 transition"
                          title="Download sample records in JSON format"
                        >
                          <Download className="w-3.5 h-3.5 text-[#5BB7A5]" />
                          <span>Sample JSON</span>
                        </button>
                        <span className="text-xs font-bold text-[#133447] group-hover:underline flex items-center gap-1">
                          <span>Inspect Data Record</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
