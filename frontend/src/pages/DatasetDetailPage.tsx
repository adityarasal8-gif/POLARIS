import React, { useState, useEffect } from 'react';
import { Link, useRoute } from 'wouter';
import { 
  Database, Download, ShieldCheck, ArrowLeft, Calendar, 
  MapPin, CheckCircle, FileText, Compass, ExternalLink, ArrowRight,
  Layers, Info, FileSpreadsheet
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { fetchDatasetDetail } from '../api';
import { CTDProfileViewer } from '../components/CTDProfileViewer';
import { jsPDF } from 'jspdf';

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
      <div className="w-full min-h-screen bg-[#FAFAF8] text-[#111111] flex items-center justify-center font-mono text-xs text-[#8E8E91]">
        Retrieving scientific data record and telemetry streams...
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="w-full min-h-screen bg-[#FAFAF8] text-[#111111] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-medium font-serif">Dataset Record Not Found</h2>
        <Link href="/datasets" className="text-xs text-[#111111] underline font-mono">Back to NPDC Datasets Catalog</Link>
      </div>
    );
  }

  const sampleData = dataset.sample_data || [];
  const firstItem = sampleData[0] || {};
  const dataKeys = Object.keys(firstItem).filter((k) => !['date', 'month', 'year', 'decade', 'hour', 'depth_m', 'distance_km', 'latitude', 'elevation_m'].includes(k));
  const xKey = Object.keys(firstItem).find((k) => ['date', 'month', 'year', 'decade', 'hour', 'depth_m', 'distance_km', 'latitude', 'elevation_m'].includes(k)) || 'date';

  const handleDownload = () => {
    if (dataset.download_url) {
      window.open(dataset.download_url, '_blank', 'noopener,noreferrer');
    } else {
      alert(`Initiating download for complete dataset: ${dataset.identifier}`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] text-[#111111] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#111111] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link 
          href="/datasets" 
          className="inline-flex items-center space-x-2 text-xs font-mono text-[#555558] hover:text-[#111111] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to NPDC Datasets Catalog</span>
        </Link>

        {/* Dataset Header Card (Crisp White Card) */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E8E6E0] shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-[#F4F2EE] text-[#111111] font-semibold border border-[#E8E6E0]">
                {dataset.identifier}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#F4F2EE] text-[#111111] font-semibold border border-[#E8E6E0] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                {dataset.access_status}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#F4F2EE] text-[#555558] border border-[#E8E6E0]">
                {dataset.science_category}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#F4F2EE] text-[#555558] border border-[#E8E6E0]">
                {dataset.region}
              </span>
            </div>

            <button
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-full bg-[#111111] hover:bg-black text-white font-medium text-xs font-mono tracking-wider transition flex items-center space-x-2 shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Complete Dataset</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#111111] tracking-tight leading-tight">
            {dataset.title}
          </h1>

          <p className="text-sm sm:text-base text-[#555558] leading-relaxed font-light">
            {dataset.description}
          </p>

          {/* Key Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#E8E6E0] text-xs font-mono">
            <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E8E6E0]/60">
              <span className="text-[#8E8E91] block text-[10px] uppercase">Temporal Coverage</span>
              <span className="font-semibold text-[#111111]">{dataset.temporal_coverage}</span>
            </div>
            <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E8E6E0]/60">
              <span className="text-[#8E8E91] block text-[10px] uppercase">Spatial Coverage</span>
              <span className="font-semibold text-[#111111]">{dataset.spatial_coverage}</span>
            </div>
            <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E8E6E0]/60">
              <span className="text-[#8E8E91] block text-[10px] uppercase">Data Format</span>
              <span className="font-semibold text-[#111111]">{dataset.data_format}</span>
            </div>
            <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E8E6E0]/60">
              <span className="text-[#8E8E91] block text-[10px] uppercase">DOI Reference</span>
              <span className="font-semibold text-[#111111]">{dataset.doi || 'NPDC/MOES-2025-01'}</span>
            </div>
            <div className="p-3 bg-[#F4F2EE] rounded-xl border border-[#E8E6E0] md:col-span-2">
              <span className="text-[#8E8E91] block text-[10px] uppercase mb-0.5">Authentic Source</span>
              {dataset.source_url ? (
                <a 
                  href={dataset.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-medium text-[#111111] hover:text-[#38BDF8] underline break-all flex items-center gap-1"
                >
                  <span className="text-[#22C7A8] text-[10px]">●</span> NPDC Repository
                </a>
              ) : (
                <span className="font-medium text-[#111111]">N/A</span>
              )}
            </div>
          </div>
        </div>

        {/* NetCDF Binary Scientific Profile Inspector */}
        <CTDProfileViewer datasetId={dsId} />

        {/* Interactive Sensor Telemetry Preview Chart */}
        {sampleData.length > 0 && dataKeys.length > 0 && (
          <div className="bg-white p-8 rounded-3xl border border-[#E8E6E0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E6E0] pb-4">
              <div>
                <h3 className="text-lg font-serif font-medium text-[#111111]">
                  Calibrated Telemetry Stream Preview
                </h3>
                <p className="text-xs text-[#8E8E91] font-mono">
                  Visualizing parameters ({dataKeys.join(', ')}) over {xKey}
                </p>
              </div>
              <span className="text-xs font-mono text-[#555558] font-semibold bg-[#F4F2EE] px-3 py-1 rounded-full border border-[#E8E6E0]">
                {sampleData.length} Data Points Sampled
              </span>
            </div>

            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E0" />
                  <XAxis 
                    dataKey={xKey} 
                    stroke="#8E8E91" 
                    tick={{ fontSize: 11, fill: '#8E8E91' }} 
                  />
                  <YAxis 
                    stroke="#8E9EA7" 
                    tick={{ fontSize: 11, fill: '#8E8E91' }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E8E6E0', color: '#111111', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                  />
                  {dataKeys.slice(0, 3).map((key, i) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={i === 0 ? '#111111' : i === 1 ? '#8E8E91' : '#555558'}
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tabular Data Sample */}
        {sampleData.length > 0 && (
          <div className="bg-white p-8 rounded-3xl border border-[#E8E6E0] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-medium text-[#111111]">
                Sample Record Inspector
              </h3>
              <span className="text-xs font-mono text-[#8E8E91]">Previewing First 8 Calibrated Records</span>
            </div>

            <div className="overflow-x-auto border border-[#E8E6E0] rounded-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#FAFAF8] border-b border-[#E8E6E0] text-[#8E8E91]">
                  <tr>
                    {Object.keys(sampleData[0] || {}).map((col) => (
                      <th key={col} className="p-3.5 uppercase tracking-wider">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E6E0]">
                  {sampleData.slice(0, 8).map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-[#FAFAF8] transition">
                      {Object.values(row).map((val: any, cIdx: number) => (
                        <td key={cIdx} className="p-3.5 text-[#111111]">{String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Provenance & Connected Research */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E6E0] shadow-sm space-y-3">
            <h4 className="text-sm font-serif font-medium text-[#111111] uppercase tracking-wider">
              Data Custodianship & Standards
            </h4>
            <p className="text-xs text-[#555558] leading-relaxed font-light">
              {dataset.provenance || 'Calibrated under NCPOR observational protocols. Raw sensor telemetry processed, QA/QC validated, and ingested into the National Polar Data Center registry.'}
            </p>
            <div className="text-xs font-mono text-[#111111] pt-2">
              <strong>Provider:</strong> {dataset.provider}
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E6E0] shadow-sm space-y-3">
            <h4 className="text-sm font-serif font-medium text-[#111111] uppercase tracking-wider">
              Connected Polar Knowledge
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <Link href="/expeditions" className="flex items-center justify-between p-3 rounded-xl bg-[#FAFAF8] hover:bg-[#F4F2EE] border border-[#E8E6E0] text-[#111111] transition">
                <span>Originating Expedition: {dataset.expedition_id || '45th ISEA'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8E8E91]" />
              </Link>
              <Link href="/publications" className="flex items-center justify-between p-3 rounded-xl bg-[#FAFAF8] hover:bg-[#F4F2EE] border border-[#E8E6E0] text-[#111111] transition">
                <span>Associated Peer-Reviewed Paper</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8E8E91]" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
