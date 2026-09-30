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
      <div className="w-full min-h-screen bg-[#F7F8F5] text-[#10212B] flex items-center justify-center font-mono text-xs text-[#61747E]">
        Retrieving scientific data record and telemetry streams...
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="w-full min-h-screen bg-[#F7F8F5] text-[#10212B] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold font-serif">Dataset Record Not Found</h2>
        <Link href="/datasets" className="text-xs text-[#133447] underline font-mono">Back to NPDC Datasets Catalog</Link>
      </div>
    );
  }

  const sampleData = dataset.sample_data || [];
  const firstItem = sampleData[0] || {};
  const dataKeys = Object.keys(firstItem).filter((k) => !['date', 'month', 'year', 'decade', 'hour', 'depth_m', 'distance_km', 'latitude', 'elevation_m'].includes(k));
  const xKey = Object.keys(firstItem).find((k) => ['date', 'month', 'year', 'decade', 'hour', 'depth_m', 'distance_km', 'latitude', 'elevation_m'].includes(k)) || 'date';

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sampleData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${dataset.identifier}_sample.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F8F5] text-[#10212B] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#74B8CC]/30 selection:text-[#07151F]">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Back Link */}
        <Link 
          href="/datasets" 
          className="inline-flex items-center space-x-2 text-xs font-mono text-[#61747E] hover:text-[#10212B] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to NPDC Datasets Catalog</span>
        </Link>

        {/* Dataset Header Card (White Paper Style) */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#0D2735]/10 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <span className="px-3 py-1 rounded-md bg-[#F7F8F5] text-[#10212B] font-bold border border-[#0D2735]/15">
                {dataset.identifier}
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 uppercase">
                {dataset.access_status}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#F7F8F5] text-[#61747E] border border-[#0D2735]/10">
                {dataset.science_category}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#F7F8F5] text-[#61747E] border border-[#0D2735]/10">
                {dataset.region}
              </span>
            </div>

            <button
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-xl bg-[#0D2735] hover:bg-[#143547] text-white font-bold text-xs uppercase font-mono tracking-wider transition flex items-center space-x-2 shadow-sm"
            >
              <Download className="w-4 h-4 text-[#74B8CC]" />
              <span>Download Sample JSON</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#10212B] tracking-tight leading-tight">
            {dataset.title}
          </h1>

          <p className="text-sm sm:text-base text-[#61747E] leading-relaxed font-light">
            {dataset.description}
          </p>

          {/* Key Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#0D2735]/10 text-xs font-mono">
            <div>
              <span className="text-[#8E9EA7] block">Temporal Coverage</span>
              <span className="font-semibold text-[#10212B]">{dataset.temporal_coverage}</span>
            </div>
            <div>
              <span className="text-[#8E9EA7] block">Spatial Coverage</span>
              <span className="font-semibold text-[#10212B]">{dataset.spatial_coverage}</span>
            </div>
            <div>
              <span className="text-[#8E9EA7] block">Data Format</span>
              <span className="font-semibold text-[#10212B]">{dataset.data_format}</span>
            </div>
            <div>
              <span className="text-[#8E9EA7] block">DOI Reference</span>
              <span className="font-semibold text-[#133447]">{dataset.doi || 'NPDC/MOES-2025-01'}</span>
            </div>
          </div>
        </div>

        {/* Interactive Sensor Telemetry Preview Chart */}
        {sampleData.length > 0 && dataKeys.length > 0 && (
          <div className="bg-white p-8 rounded-3xl border border-[#0D2735]/10 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#0D2735]/10 pb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#10212B]">
                  Calibrated Telemetry Stream Preview
                </h3>
                <p className="text-xs text-[#61747E] font-mono">
                  Visualizing parameters ({dataKeys.join(', ')}) over {xKey}
                </p>
              </div>
              <span className="text-xs font-mono text-[#5BB7A5] font-semibold">
                {sampleData.length} Data Points Sampled
              </span>
            </div>

            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis 
                    dataKey={xKey} 
                    stroke="#8E9EA7" 
                    tick={{ fontSize: 11, fill: '#61747E' }} 
                  />
                  <YAxis 
                    stroke="#8E9EA7" 
                    tick={{ fontSize: 11, fill: '#61747E' }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#07151F', borderColor: '#74B8CC', color: '#FFFFFF', borderRadius: '8px' }} 
                  />
                  {dataKeys.slice(0, 3).map((key, i) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={i === 0 ? '#133447' : i === 1 ? '#5BB7A5' : '#D7A75D'}
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
          <div className="bg-white p-8 rounded-3xl border border-[#0D2735]/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-[#10212B]">
                Sample Record Inspector
              </h3>
              <span className="text-xs font-mono text-[#61747E]">Previewing First 8 Calibrated Records</span>
            </div>

            <div className="overflow-x-auto border border-[#0D2735]/10 rounded-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#F7F8F5] border-b border-[#0D2735]/10 text-[#61747E]">
                  <tr>
                    {Object.keys(sampleData[0] || {}).map((col) => (
                      <th key={col} className="p-3.5 uppercase tracking-wider">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0D2735]/5">
                  {sampleData.slice(0, 8).map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-[#F7F8F5]/80 transition">
                      {Object.values(row).map((val: any, cIdx: number) => (
                        <td key={cIdx} className="p-3.5 text-[#10212B]">{String(val)}</td>
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
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0D2735]/10 shadow-sm space-y-3">
            <h4 className="text-sm font-serif font-bold text-[#10212B] uppercase tracking-wider">
              Data Custodianship & Standards
            </h4>
            <p className="text-xs text-[#61747E] leading-relaxed font-light">
              {dataset.provenance || 'Calibrated under NCPOR observational protocols. Raw sensor telemetry processed, QA/QC validated, and ingested into the National Polar Data Center registry.'}
            </p>
            <div className="text-xs font-mono text-[#133447] pt-2">
              <strong>Provider:</strong> {dataset.provider}
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0D2735]/10 shadow-sm space-y-3">
            <h4 className="text-sm font-serif font-bold text-[#10212B] uppercase tracking-wider">
              Connected Polar Knowledge
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <Link href="/expeditions" className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7F8F5] hover:bg-[#EAEAEA] text-[#10212B] transition">
                <span>Originating Expedition: {dataset.expedition_id || '45th ISEA'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/publications" className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7F8F5] hover:bg-[#EAEAEA] text-[#10212B] transition">
                <span>Associated Peer-Reviewed Paper</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
