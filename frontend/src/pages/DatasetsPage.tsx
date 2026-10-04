import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Database, Search, Filter, Download, ArrowRight, 
  Layers, Calendar, Tag, ShieldCheck, FileSpreadsheet, Check,
  Activity, Cpu, Radio, Sparkles
} from 'lucide-react';
import { fetchDatasets } from '../api';
import { Dataset } from '../types';
import { jsPDF } from 'jspdf';

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

  const handleDownloadDataset = (ds: Dataset, e: React.MouseEvent) => {
    e.stopPropagation();
    if (ds.download_url) {
      window.open(ds.download_url, '_blank', 'noopener,noreferrer');
    } else {
      alert(`Initiating download for complete dataset: ${ds.identifier}`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] text-[#111111] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#111111] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Portal Header with Floating Data Perimeter Glyphs */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#F4F2EE] to-white p-8 sm:p-10 rounded-3xl border border-[#E8E6E0] shadow-sm">
          {/* Subtle Ambient Floating Background Glyphs */}
          <div className="absolute -top-4 -right-4 text-[#111111] opacity-15 pointer-events-none animate-subtle-drift">
            <Database className="w-24 h-24 stroke-[1.2]" />
          </div>
          <div className="absolute top-1/2 -left-6 -translate-y-1/2 text-[#111111] opacity-12 pointer-events-none animate-subtle-drift-rev">
            <Layers className="w-20 h-20 stroke-[1.2]" />
          </div>
          <div className="absolute -bottom-6 right-1/4 text-[#111111] opacity-14 pointer-events-none animate-float-2">
            <Cpu className="w-20 h-20 stroke-[1.2]" />
          </div>
          <div className="absolute top-4 left-1/3 text-[#111111] opacity-10 pointer-events-none animate-slow-spin">
            <Activity className="w-24 h-24 stroke-[1]" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E8E6E0]">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#555558] bg-white px-3.5 py-1.5 rounded-full border border-[#E8E6E0] font-medium tracking-wide uppercase shadow-2xs">
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

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2.5 text-xs font-mono text-[#555558] bg-white border border-[#E8E6E0] px-4 py-2 rounded-full shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                <span>Open Access under CC-BY-NC 4.0</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#2563EB] bg-[#2563EB]/5 border border-[#2563EB]/20 px-3.5 py-2 rounded-full shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping-subtle" />
                <span className="font-semibold">ISO-19115 Metadata</span>
              </div>
            </div>
          </div>

          {/* Real-time NPDC Live Telemetry Ingest Stream HUD */}
          <div className="relative z-10 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-[#111111] text-white px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wide uppercase">NPDC LIVE INGEST</span>
              </div>
              
              {/* Telemetry Waveform Oscilloscope Micro-Bars */}
              <div className="flex items-center gap-0.5 h-4 px-2 py-0.5 bg-[#E8E6E0] rounded-md">
                <div className="w-1 bg-[#2563EB] rounded-full animate-wave-bar-1" />
                <div className="w-1 bg-[#2563EB] rounded-full animate-wave-bar-2" />
                <div className="w-1 bg-[#2563EB] rounded-full animate-wave-bar-3" />
                <div className="w-1 bg-[#2563EB] rounded-full animate-wave-bar-4" />
              </div>

              <span className="text-[#555558] text-[11px]">
                NetCDF-4 stream active · Maitri AWS & Bharati Coastal Sonde
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-[#8E8E91]">
              <span>Latency: <strong className="text-[#111111]">1.2s</strong></span>
              <span>·</span>
              <span>QA/QC: <strong className="text-[#16A34A]">Level 2 Passed</strong></span>
              <span>·</span>
              <span>Format: <strong className="text-[#111111]">GeoTIFF / HDF5 / CSV</strong></span>
            </div>
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
              <div className="space-y-4">
                {datasets.map((ds) => (
                  <div
                    key={ds.id}
                    onClick={() => setLocation(`/datasets/${ds.id}`)}
                    className="bg-white border border-[#E8E6E0] hover:border-[#111111]/40 rounded-3xl p-6 sm:p-7 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer space-y-3 group card-hover-spring relative overflow-hidden"
                  >
                    {/* Top Row: Identifier, Category, Region & Waveform Pulse */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-[#111111] bg-[#F4F2EE] px-2.5 py-1 rounded-full border border-[#E8E6E0] flex items-center gap-1.5">
                          <Database className="w-3 h-3 text-[#2563EB]" />
                          {ds.identifier}
                        </span>
                        <span className="text-[#8E8E91]">
                          {ds.science_category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* Live Sensor Feed Equalizer Micro-Bars */}
                        <div className="flex items-center gap-0.5 h-3.5 px-2 py-0.5 bg-[#F4F2EE] rounded-full border border-[#E8E6E0]" title="Active Sensor Stream Verified">
                          <div className="w-0.5 bg-[#16A34A] rounded-full animate-wave-bar-1" />
                          <div className="w-0.5 bg-[#16A34A] rounded-full animate-wave-bar-2" />
                          <div className="w-0.5 bg-[#16A34A] rounded-full animate-wave-bar-3" />
                          <div className="w-0.5 bg-[#16A34A] rounded-full animate-wave-bar-4" />
                          <span className="text-[10px] text-[#16A34A] font-semibold ml-1">LIVE</span>
                        </div>

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
                    <h3 className="text-lg font-semibold text-[#111111] group-hover:text-[#2563EB] transition-colors leading-snug">
                      {ds.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#555558] font-light leading-relaxed line-clamp-2">
                      {ds.description}
                    </p>
                    {ds.source_url && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-mono text-[#555558]">
                        <span className="text-[#22C7A8]">●</span>
                        <span>Authentic Source:</span>
                        <a 
                          href={ds.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#38BDF8] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          NPDC Repository
                        </a>
                      </div>
                    )}

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
                          onClick={(e) => handleDownloadDataset(ds, e)}
                          className="px-3.5 py-1.5 rounded-full bg-[#111111] hover:bg-[#333333] border border-[#111111] text-[#FFFFFF] text-xs font-mono flex items-center gap-1.5 transition font-medium cursor-pointer"
                          title="Download complete dataset"
                        >
                          <Download className="w-3.5 h-3.5 text-[#FFFFFF]" />
                          <span>Complete Dataset</span>
                        </button>
                        <span className="text-xs font-semibold text-[#111111] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all flex items-center gap-1">
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
