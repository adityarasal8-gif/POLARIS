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
    <div className="w-full min-h-screen bg-[#FAFAF8] text-[#111111] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#111111] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Portal Header */}
        <div className="border-b border-[#E8E6E0] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#555558] bg-[#F4F2EE] px-3 py-1 rounded-full border border-[#E8E6E0] font-medium tracking-wide uppercase">
              <Database className="w-3.5 h-3.5 text-[#111111]" />
              <span>NATIONAL POLAR DATA CENTER (NPDC) · SCIENTIFIC REPOSITORY</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-medium text-[#111111] tracking-tight">
              Polar Observational Datasets
            </h1>
            <p className="text-sm sm:text-base text-[#555558] max-w-3xl font-light leading-relaxed">
              Calibrated sensor telemetry, deep ice-core chemical profiles, oceanographic CTD casts, and long-term atmospheric time series curated under National Data Governance standards.
            </p>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-mono text-[#555558] bg-white border border-[#E8E6E0] px-4 py-2 rounded-full shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>Open Access under CC-BY-NC 4.0</span>
          </div>
        </div>

        {/* 2-Column Data Explorer: Left Filters + Right Rows */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Rail: Facet Filters */}
          <div className="lg:col-span-3 space-y-6 bg-white p-6 rounded-2xl border border-[#E8E6E0] shadow-sm sticky top-24">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#8E8E91] font-semibold mb-3">
                Search Datasets
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E91]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter parameters..."
                  className="w-full pl-9 pr-3 py-2 rounded-full bg-[#FAFAF8] border border-[#E8E6E0] text-xs text-[#111111] placeholder-[#8E8E91] focus:outline-none focus:border-[#111111] font-sans"
                />
              </div>
            </div>

            {/* Region Facet */}
            <div className="space-y-2 pt-4 border-t border-[#E8E6E0]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#8E8E91] font-semibold block">
                Region
              </span>
              <div className="space-y-1">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRegion(r)}
                    className={`w-full text-left px-3 py-1.5 rounded-full text-xs font-mono flex items-center justify-between transition ${
                      selectedRegion === r
                        ? 'bg-[#111111] text-white font-medium shadow-xs'
                        : 'text-[#555558] hover:bg-[#F4F2EE] hover:text-[#111111]'
                    }`}
                  >
                    <span>{r}</span>
                    {selectedRegion === r && <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Science Category Facet */}
            <div className="space-y-2 pt-4 border-t border-[#E8E6E0]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#8E8E91] font-semibold block">
                Science Category
              </span>
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                {NPDC_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-full text-xs font-mono flex items-center justify-between transition ${
                      selectedCategory === cat
                        ? 'bg-[#111111] text-white font-medium shadow-xs'
                        : 'text-[#555558] hover:bg-[#F4F2EE] hover:text-[#111111]'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Rail: Tabular Dataset Rows */}
          <div className="lg:col-span-9 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#8E8E91] px-1">
              <span>Showing <strong className="text-[#111111]">{datasets.length}</strong> scientific data products</span>
              {(selectedCategory !== 'All' || selectedRegion !== 'All' || searchQuery) && (
                <button
                  onClick={() => { setSelectedCategory('All'); setSelectedRegion('All'); setSearchQuery(''); }}
                  className="text-[#111111] underline hover:text-black font-medium"
                >
                  Reset all filters
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-24 text-center space-y-3 bg-white rounded-2xl border border-[#E8E6E0] shadow-sm">
                <div className="w-7 h-7 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-mono text-[#8E8E91]">Querying NPDC catalogs...</p>
              </div>
            ) : datasets.length === 0 ? (
              <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-[#E8E6E0] p-8 shadow-sm">
                <p className="text-sm text-[#555558]">No dataset matches the specified filters.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {datasets.map((ds) => (
                  <div
                    key={ds.id}
                    onClick={() => setLocation(`/datasets/${ds.id}`)}
                    className="bg-white border border-[#E8E6E0] hover:border-[#111111]/30 rounded-2xl p-6 transition duration-200 shadow-sm hover:shadow-md cursor-pointer space-y-3 group"
                  >
                    {/* Top Row: Identifier, Category, Region */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-[#111111] bg-[#F4F2EE] px-2.5 py-1 rounded-full border border-[#E8E6E0]">
                          {ds.identifier}
                        </span>
                        <span className="text-[#8E8E91]">
                          {ds.science_category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F4F2EE] text-[#111111] font-semibold border border-[#E8E6E0] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                          {ds.access_status}
                        </span>
                        <span className="text-[#8E8E91]">
                          {ds.region}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-semibold text-[#111111] group-hover:text-black transition leading-snug">
                      {ds.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#555558] font-light leading-relaxed line-clamp-2">
                      {ds.description}
                    </p>

                    {/* Metadata & Actions Bottom Bar */}
                    <div className="pt-3 border-t border-[#E8E6E0] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#555558]">
                      <div className="flex flex-wrap items-center gap-4 text-[11px]">
                        <span>Coverage: <strong className="text-[#111111]">{ds.temporal_coverage}</strong></span>
                        <span>Format: <strong className="text-[#111111]">{ds.data_format}</strong></span>
                        {ds.parameters && ds.parameters.length > 0 && (
                          <span className="hidden sm:inline">
                            Param: <strong className="text-[#111111]">{ds.parameters.slice(0, 2).join(', ')}</strong>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => handleDownloadSample(ds, e)}
                          className="px-3 py-1.5 rounded-full bg-[#F4F2EE] hover:bg-[#E8E6E0] border border-[#E8E6E0] text-[#111111] text-xs font-mono flex items-center gap-1.5 transition font-medium"
                          title="Download sample records in JSON format"
                        >
                          <Download className="w-3.5 h-3.5 text-[#111111]" />
                          <span>Sample JSON</span>
                        </button>
                        <span className="text-xs font-semibold text-[#111111] group-hover:underline flex items-center gap-1">
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
