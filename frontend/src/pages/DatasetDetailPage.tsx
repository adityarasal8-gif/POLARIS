import React, { useState, useEffect } from 'react';
import { Link, useRoute } from 'wouter';
import { 
  Database, Download, ShieldCheck, ArrowLeft, Calendar, 
  MapPin, CheckCircle, FileText, Compass, ExternalLink 
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { fetchDatasetDetail } from '../api';

export const DatasetDetailPage: React.FC = () => {
  const [, params] = useRoute('/datasets/:id');
  const dsId = params?.id || 'ds_maitri_atmo_2025';

  const [dataset, setDataset] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchDatasetDetail(dsId)
      .then((data) => {
        setDataset(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch dataset detail:', err);
        setLoading(false);
      });
  }, [dsId]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#071A2B] text-white flex items-center justify-center font-mono text-sm text-[#94A3B8]">
        Loading scientific dataset dossier & telemetry...
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="w-full min-h-screen bg-[#071A2B] text-white flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold">Dataset Record Not Found</h2>
        <Link href="/datasets" className="text-xs text-[#38BDF8] underline">Back to Datasets Catalog</Link>
      </div>
    );
  }

  const sampleData = dataset.sample_data || [];
  // Detect chart keys from first sample item
  const firstItem = sampleData[0] || {};
  const dataKeys = Object.keys(firstItem).filter((k) => k !== 'date' && k !== 'month' && k !== 'year' && k !== 'decade' && k !== 'hour' && k !== 'depth_m' && k !== 'distance_km' && k !== 'latitude' && k !== 'elevation_m');
  const xKey = Object.keys(firstItem).find((k) => ['date', 'month', 'year', 'decade', 'hour', 'depth_m', 'distance_km', 'latitude', 'elevation_m'].includes(k)) || 'date';

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sampleData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${dataset.identifier}_full_series.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full min-h-screen bg-[#071A2B] text-white py-10 px-4 sm:px-6 lg:px-8 polar-grid-bg text-left">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Link */}
        <Link href="/datasets" className="inline-flex items-center space-x-2 text-xs font-mono text-[#38BDF8] hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to NPDC Datasets Catalog</span>
        </Link>

        {/* Title & Metadata Card */}
        <div className="polar-panel p-6 sm:p-8 border border-[#6EC5E9]/20 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-3 py-1 rounded bg-[#071A2B] text-[#38BDF8] font-bold border border-[#38BDF8]/40">
                {dataset.identifier}
              </span>
              <span className="badge-live text-xs font-mono px-2.5 py-0.5 rounded font-semibold uppercase">
                {dataset.access_status}
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#071A2B] text-white">
                {dataset.science_category}
              </span>
            </div>

            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#22C7A8] text-[#071A2B] font-bold text-xs flex items-center space-x-2 shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#071A2B]" />
              <span>Download Open Dataset Sample</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {dataset.title}
          </h1>

          <p className="text-sm text-[#CBD5E1] leading-relaxed max-w-4xl">
            {dataset.description}
          </p>

          {/* Quick Spec Table */}
          <div className="pt-4 border-t border-[#6EC5E9]/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-[#94A3B8]">
            <div>
              <span className="text-[#647887]">Region: </span>
              <span className="text-white font-semibold">{dataset.region}</span>
            </div>
            <div>
              <span className="text-[#647887]">Coverage: </span>
              <span className="text-white font-semibold">{dataset.temporal_coverage}</span>
            </div>
            <div>
              <span className="text-[#647887]">Provider: </span>
              <span className="text-white font-semibold">{dataset.provider}</span>
            </div>
            <div>
              <span className="text-[#647887]">Format: </span>
              <span className="text-white font-semibold">{dataset.data_format}</span>
            </div>
          </div>
        </div>

        {/* DATA PREVIEW: Real Interactive Chart using Recharts */}
        <div className="polar-panel p-6 border border-[#6EC5E9]/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#6EC5E9]/15 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#22C7A8] font-bold">
                CALIBRATED SCIENTIFIC TIME-SERIES VISUALIZATION
              </span>
              <h3 className="text-lg font-bold text-white">Interactive Observation Preview</h3>
            </div>
            <div className="text-xs font-mono text-[#94A3B8] flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
              <span>Primary Parameter Trend</span>
            </div>
          </div>

          {sampleData.length > 0 ? (
            <div className="w-full h-72 sm:h-80 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(110, 197, 233, 0.1)" />
                  <XAxis 
                    dataKey={xKey} 
                    stroke="#94A3B8" 
                    tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }} 
                  />
                  <YAxis 
                    stroke="#94A3B8" 
                    tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#071A2B', 
                      borderColor: '#38BDF8', 
                      borderRadius: '8px', 
                      color: '#fff',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }} 
                  />
                  {dataKeys.map((key, i) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={i === 0 ? '#38BDF8' : i === 1 ? '#22C7A8' : '#E7A93B'}
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#071A2B', strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-12 text-center text-xs font-mono text-[#94A3B8]">
              No graphical visualization available for this tabular dataset format.
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#647887] pt-2 border-t border-[#6EC5E9]/10">
            <span>Coordinates: {dataset.spatial_coverage}</span>
            <span>•</span>
            <span>DOI: {dataset.doi || 'NPDC Catalogued Record'}</span>
            <span>•</span>
            <span>Last Verified: {dataset.last_updated}</span>
          </div>
        </div>

        {/* 2-Column: Data Provenance & Related Entities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Data Provenance & Methodology (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="polar-panel p-6 border border-[#6EC5E9]/15 space-y-4">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#38BDF8] uppercase font-bold">
                <ShieldCheck className="w-4 h-4 text-[#22C7A8]" />
                <span>Data Provenance & Scientific Quality Control</span>
              </div>
              <h3 className="text-base font-bold text-white">Chain of Custody & Calibration</h3>
              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                {dataset.provenance}
              </p>
              <div className="p-4 rounded-xl bg-[#051320] border border-[#6EC5E9]/10 text-xs font-mono space-y-2 text-[#94A3B8]">
                <div>• Acquired via automated telemetry and verified against WMO-GAW calibration standards.</div>
                <div>• Stored in compliance with the MoES Open Data Dissemination Framework.</div>
                <div>• Permanent Archival Record ID: <span className="text-[#38BDF8]">{dataset.identifier}</span>.</div>
              </div>
            </div>
          </div>

          {/* Related Links: Expedition & Publications (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {dataset.related_expedition && (
              <div className="polar-panel p-5 border border-[#6EC5E9]/15 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-mono text-[#22C7A8] uppercase font-bold">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Originating Field Campaign</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  {dataset.related_expedition.code} — {dataset.related_expedition.name}
                </h4>
                <p className="text-xs text-[#94A3B8]">
                  Led by {dataset.related_expedition.leader_name} ({dataset.related_expedition.dates})
                </p>
                <Link
                  href={`/expeditions/${dataset.related_expedition.id}`}
                  className="inline-flex items-center space-x-1 text-xs text-[#38BDF8] hover:underline font-mono"
                >
                  <span>Open Expedition Dossier →</span>
                </Link>
              </div>
            )}

            {dataset.related_station && (
              <div className="polar-panel p-5 border border-[#6EC5E9]/15 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-mono text-[#38BDF8] uppercase font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Observation Facility</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  {dataset.related_station.name}
                </h4>
                <p className="text-xs text-[#94A3B8]">
                  {dataset.related_station.location_description}
                </p>
                <Link
                  href={`/stations`}
                  className="inline-flex items-center space-x-1 text-xs text-[#38BDF8] hover:underline font-mono"
                >
                  <span>View Station Telemetry →</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
