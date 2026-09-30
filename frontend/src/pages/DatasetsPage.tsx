import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Database, Search, Filter, Download, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
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
    <div className="w-full min-h-screen bg-[#071A2B] text-white py-10 px-4 sm:px-6 lg:px-8 polar-grid-bg text-left">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#38BDF8] font-bold tracking-wider uppercase">
            <Database className="w-4 h-4 text-[#38BDF8]" />
            <span>NATIONAL POLAR DATA CENTER (NPDC) CATALOG</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Validated Polar Science Observational Datasets
          </h1>
          <p className="text-sm text-[#94A3B8] max-w-2xl">
            Open-access calibrated telemetry, ice core records, oceanographic profiles, and atmospheric time series from India's polar research observatories.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="polar-panel p-5 border border-[#6EC5E9]/15 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#38BDF8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by parameter, title, identifier (e.g. NPDC-ATMO)..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#071A2B] border border-[#6EC5E9]/20 text-white text-xs placeholder-[#647887] focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-[#94A3B8]">Region:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-[#071A2B] border border-[#6EC5E9]/20 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#38BDF8]"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* NPDC Category Pills */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#6EC5E9]/10 text-xs font-mono">
            {NPDC_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#38BDF8] text-[#071A2B] font-bold border-[#38BDF8]'
                    : 'bg-[#071A2B] text-[#94A3B8] hover:text-white border-[#6EC5E9]/15'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Datasets Grid */}
        {loading ? (
          <div className="py-20 text-center text-sm font-mono text-[#94A3B8]">
            Querying NPDC repository database...
          </div>
        ) : datasets.length === 0 ? (
          <div className="py-20 text-center polar-panel p-8 text-sm text-[#94A3B8]">
            No datasets found matching the selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {datasets.map((ds) => (
              <div
                key={ds.id}
                onClick={() => setLocation(`/datasets/${ds.id}`)}
                className="polar-panel p-5 border border-[#6EC5E9]/15 polar-panel-hover flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#071A2B] text-[#38BDF8] font-bold border border-[#38BDF8]/30">
                      {ds.identifier}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <span className="badge-live text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase">
                        {ds.access_status}
                      </span>
                      <span className="text-[10px] font-mono text-[#94A3B8] bg-[#071A2B] px-2 py-0.5 rounded">
                        {ds.region}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#38BDF8] transition-colors leading-snug">
                    {ds.title}
                  </h3>

                  <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {ds.description}
                  </p>

                  <div className="pt-2 border-t border-[#6EC5E9]/10 grid grid-cols-2 gap-2 text-[11px] font-mono text-[#CBD5E1]">
                    <div>
                      <span className="text-[#647887]">Coverage: </span>
                      <span>{ds.temporal_coverage}</span>
                    </div>
                    <div>
                      <span className="text-[#647887]">Format: </span>
                      <span>{ds.data_format}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {ds.parameters.map((p) => (
                      <span key={p} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#071A2B] text-[#38BDF8] border border-[#6EC5E9]/10">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#6EC5E9]/10 flex items-center justify-between">
                  <button
                    onClick={(e) => handleDownloadSample(ds, e)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded bg-[#071A2B] hover:bg-[#123753] border border-[#6EC5E9]/20 text-xs text-white font-mono transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#22C7A8]" />
                    <span>Sample JSON</span>
                  </button>

                  <div className="flex items-center space-x-1 text-xs text-[#38BDF8] font-semibold group-hover:underline">
                    <span>Inspect Data & Provenance</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
