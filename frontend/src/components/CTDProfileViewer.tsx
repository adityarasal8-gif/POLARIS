import React, { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart, Legend
} from 'recharts';
import {
  Database, Waves, Thermometer, Droplets, Wind, Info,
  ChevronDown, ChevronUp, FileText, MapPin, Calendar, Anchor, Cpu
} from 'lucide-react';
import { fetchNetCDFPreview } from '../api';
import type { NetCDFPreviewResponse, NetCDFVariableInfo } from '../types';

interface CTDProfileViewerProps {
  datasetId: string;
}

type ProfileVariable = 'temperature' | 'salinity' | 'dissolved_oxygen' | 'sigma_theta';

const VARIABLE_CONFIG: Record<ProfileVariable, {
  label: string;
  shortLabel: string;
  unit: string;
  color: string;
  colorFaded: string;
  icon: React.ReactNode;
  description: string;
}> = {
  temperature: {
    label: 'Sea Water Temperature',
    shortLabel: 'Temperature',
    unit: '°C',
    color: '#DC2626',
    colorFaded: 'rgba(220, 38, 38, 0.15)',
    icon: <Thermometer className="w-3.5 h-3.5" />,
    description: 'In-situ temperature measured by SBE 3plus sensor'
  },
  salinity: {
    label: 'Practical Salinity',
    shortLabel: 'Salinity',
    unit: 'PSU',
    color: '#2563EB',
    colorFaded: 'rgba(37, 99, 235, 0.15)',
    icon: <Droplets className="w-3.5 h-3.5" />,
    description: 'Conductivity-derived practical salinity (SBE 4C)'
  },
  dissolved_oxygen: {
    label: 'Dissolved Oxygen',
    shortLabel: 'DO₂',
    unit: 'μmol/kg',
    color: '#059669',
    colorFaded: 'rgba(5, 150, 105, 0.15)',
    icon: <Wind className="w-3.5 h-3.5" />,
    description: 'Dissolved molecular oxygen concentration (SBE 43)'
  },
  sigma_theta: {
    label: 'Potential Density Anomaly (σθ)',
    shortLabel: 'σθ',
    unit: 'kg/m³',
    color: '#7C3AED',
    colorFaded: 'rgba(124, 58, 237, 0.15)',
    icon: <Waves className="w-3.5 h-3.5" />,
    description: 'Potential density referenced to sea surface (UNESCO EoS)'
  }
};

// Antarctic water mass depth boundaries for reference lines
const WATER_MASSES = [
  { depth: 150, label: 'AASW / WW Boundary', color: '#94A3B8' },
  { depth: 500, label: 'WW / CDW Transition', color: '#94A3B8' },
  { depth: 1500, label: 'CDW / AABW Transition', color: '#94A3B8' },
];

export const CTDProfileViewer: React.FC<CTDProfileViewerProps> = ({ datasetId }) => {
  const [data, setData] = useState<NetCDFPreviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVars, setActiveVars] = useState<ProfileVariable[]>(['temperature', 'salinity']);
  const [showMetadata, setShowMetadata] = useState(false);
  const [showWaterMasses, setShowWaterMasses] = useState(true);
  const [hoveredDepth, setHoveredDepth] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchNetCDFPreview(datasetId)
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [datasetId]);

  const toggleVariable = useCallback((variable: ProfileVariable) => {
    setActiveVars(prev => {
      if (prev.includes(variable)) {
        return prev.length > 1 ? prev.filter(v => v !== variable) : prev;
      }
      return [...prev, variable];
    });
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-[#E8E6E0] shadow-sm">
        <div className="flex items-center space-x-3 text-[#8E8E91]">
          <div className="w-5 h-5 border-2 border-[#E8E6E0] border-t-[#111111] rounded-full animate-spin" />
          <span className="text-xs font-mono">Parsing binary NetCDF scientific dataset...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return null; // Silently hide if no NetCDF support
  }

  const isVerticalProfile = data.type === 'vertical_profile';

  // Custom tooltip for the depth profile chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div className="bg-white/95 backdrop-blur-md border border-[#E8E6E0] rounded-xl p-4 shadow-xl max-w-[280px]">
        <div className="text-xs font-mono text-[#8E8E91] mb-2 border-b border-[#E8E6E0] pb-2">
          {isVerticalProfile ? `Depth: ${label} m` : `Day: ${label}`}
        </div>
        <div className="space-y-1.5">
          {payload.map((entry: any, idx: number) => {
            const varKey = entry.dataKey as ProfileVariable;
            const config = VARIABLE_CONFIG[varKey];
            if (!config) return null;
            return (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.color }} />
                  <span className="text-[#555558] font-medium">{config.shortLabel}</span>
                </div>
                <span className="font-mono font-semibold text-[#111111]">
                  {typeof entry.value === 'number' ? entry.value.toFixed(3) : entry.value} {config.unit}
                </span>
              </div>
            );
          })}
        </div>
        {isVerticalProfile && label !== undefined && (
          <div className="mt-2 pt-2 border-t border-[#E8E6E0] text-[10px] font-mono text-[#8E8E91]">
            {Number(label) < 150 ? 'Antarctic Surface Water (AASW)' :
             Number(label) < 500 ? 'Winter Water (WW)' :
             Number(label) < 1500 ? 'Circumpolar Deep Water (CDW)' :
             'Antarctic Bottom Water (AABW)'}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E6E0] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-[#E8E6E0] bg-gradient-to-r from-[#FAFAF8] to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-[#2563EB]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#2563EB] font-semibold">
                NetCDF Binary Inspector
              </span>
            </div>
            <h3 className="text-lg font-serif font-medium text-[#111111]">
              {isVerticalProfile ? 'CTD Water Column Profile' : 'Mooring Time Series'}
            </h3>
            <p className="text-xs text-[#8E8E91] font-mono">
              {data.metadata.source} &middot; {data.metadata.conventions} compliant
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-full bg-[#F4F2EE] text-[10px] font-mono text-[#555558] border border-[#E8E6E0] flex items-center gap-1.5">
              <Cpu className="w-3 h-3" />
              {data.profile.length} data points
            </span>
            <span className="px-3 py-1.5 rounded-full bg-[#F4F2EE] text-[10px] font-mono text-[#555558] border border-[#E8E6E0]">
              {data.variables.length} variables
            </span>
          </div>
        </div>
      </div>

      {/* Variable Selector Chips */}
      <div className="px-6 sm:px-8 py-4 border-b border-[#E8E6E0] bg-[#FAFAF8]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E8E91] mr-2">
            Active Variables
          </span>
          {(Object.keys(VARIABLE_CONFIG) as ProfileVariable[]).map(varKey => {
            // Only show variables that exist in the data
            const exists = data.variables.some(v =>
              v.name === varKey ||
              v.name === 'sea_water_temperature' && varKey === 'temperature' ||
              v.name === 'practical_salinity' && varKey === 'salinity'
            );
            if (!exists) return null;

            const config = VARIABLE_CONFIG[varKey];
            const isActive = activeVars.includes(varKey);

            return (
              <button
                key={varKey}
                onClick={() => toggleVariable(varKey)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-mono font-medium
                  transition-all duration-200 flex items-center space-x-1.5
                  ${isActive
                    ? 'text-white shadow-sm'
                    : 'bg-white text-[#555558] border border-[#E8E6E0] hover:border-[#111111]/20'
                  }
                `}
                style={isActive ? { backgroundColor: config.color } : undefined}
              >
                {config.icon}
                <span>{config.shortLabel}</span>
                <span className="text-[10px] opacity-70">({config.unit})</span>
              </button>
            );
          })}

          {isVerticalProfile && (
            <button
              onClick={() => setShowWaterMasses(prev => !prev)}
              className={`
                ml-auto px-3 py-1.5 rounded-full text-xs font-mono
                transition-all duration-200 flex items-center space-x-1.5
                ${showWaterMasses
                  ? 'bg-[#111111] text-white'
                  : 'bg-white text-[#555558] border border-[#E8E6E0] hover:border-[#111111]/20'
                }
              `}
            >
              <Waves className="w-3 h-3" />
              <span>Water Masses</span>
            </button>
          )}
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-6 sm:p-8">
        <div className="h-[480px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {isVerticalProfile ? (
              <LineChart
                data={data.profile}
                layout="vertical"
                margin={{ top: 10, right: 40, left: 60, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="2 4"
                  stroke="#E8E6E0"
                  horizontal={true}
                  vertical={true}
                />
                <YAxis
                  type="number"
                  dataKey="depth"
                  reversed={true}
                  domain={[0, 'dataMax']}
                  tick={{ fontSize: 11, fill: '#8E8E91', fontFamily: 'JetBrains Mono, monospace' }}
                  label={{
                    value: 'Depth (m)',
                    angle: -90,
                    position: 'insideLeft',
                    offset: -45,
                    style: { fontSize: 11, fill: '#555558', fontFamily: 'JetBrains Mono, monospace' }
                  }}
                  stroke="#E8E6E0"
                />
                {activeVars.map((varKey, i) => {
                  const config = VARIABLE_CONFIG[varKey];
                  return (
                    <XAxis
                      key={varKey}
                      xAxisId={varKey}
                      type="number"
                      orientation={i === 0 ? 'bottom' : 'top'}
                      tick={{ fontSize: 10, fill: config.color, fontFamily: 'JetBrains Mono, monospace' }}
                      label={i === 0 ? {
                        value: `${config.shortLabel} (${config.unit})`,
                        position: 'insideBottom',
                        offset: -10,
                        style: { fontSize: 10, fill: config.color, fontFamily: 'JetBrains Mono, monospace' }
                      } : undefined}
                      stroke={config.color}
                      strokeOpacity={0.3}
                      allowDecimals={true}
                    />
                  );
                })}
                <Tooltip content={<CustomTooltip />} />
                {/* Water mass reference lines */}
                {showWaterMasses && WATER_MASSES.map(wm => (
                  <ReferenceLine
                    key={wm.depth}
                    y={wm.depth}
                    stroke={wm.color}
                    strokeDasharray="6 3"
                    strokeWidth={1}
                    label={{
                      value: wm.label,
                      position: 'right',
                      style: { fontSize: 9, fill: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }
                    }}
                  />
                ))}
                {activeVars.map(varKey => {
                  const config = VARIABLE_CONFIG[varKey];
                  return (
                    <Line
                      key={varKey}
                      xAxisId={varKey}
                      type="monotone"
                      dataKey={varKey}
                      stroke={config.color}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 2, fill: '#fff', stroke: config.color }}
                    />
                  );
                })}
              </LineChart>
            ) : (
              <AreaChart
                data={data.profile}
                margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="2 4" stroke="#E8E6E0" />
                <XAxis
                  dataKey="day_of_year"
                  tick={{ fontSize: 10, fill: '#8E8E91', fontFamily: 'JetBrains Mono, monospace' }}
                  label={{
                    value: 'Day of Year (2024)',
                    position: 'insideBottom',
                    offset: -10,
                    style: { fontSize: 10, fill: '#555558', fontFamily: 'JetBrains Mono, monospace' }
                  }}
                  stroke="#E8E6E0"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#8E8E91', fontFamily: 'JetBrains Mono, monospace' }}
                  stroke="#E8E6E0"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  wrapperStyle={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                />
                {activeVars.map(varKey => {
                  const config = VARIABLE_CONFIG[varKey];
                  return (
                    <Area
                      key={varKey}
                      type="monotone"
                      dataKey={varKey}
                      stroke={config.color}
                      fill={config.colorFaded}
                      strokeWidth={2}
                      dot={false}
                      name={`${config.shortLabel} (${config.unit})`}
                    />
                  );
                })}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metadata Accordion */}
      <div className="border-t border-[#E8E6E0]">
        <button
          onClick={() => setShowMetadata(prev => !prev)}
          className="w-full px-6 sm:px-8 py-4 flex items-center justify-between text-xs font-mono text-[#555558] hover:text-[#111111] hover:bg-[#FAFAF8] transition"
        >
          <div className="flex items-center space-x-2">
            <Info className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest font-semibold">
              CF-1.8 Metadata & Variable Registry
            </span>
          </div>
          {showMetadata ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showMetadata && (
          <div className="px-6 sm:px-8 pb-6 space-y-6">
            {/* Global Attributes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: 'Title', value: data.metadata.title, icon: <FileText className="w-3 h-3" /> },
                { label: 'Institution', value: data.metadata.institution, icon: <Database className="w-3 h-3" /> },
                { label: 'Source Instrument', value: data.metadata.source, icon: <Anchor className="w-3 h-3" /> },
                { label: 'Conventions', value: data.metadata.conventions, icon: <Cpu className="w-3 h-3" /> },
                { label: 'Cast Position', value: `${data.metadata.latitude}°, ${data.metadata.longitude}°`, icon: <MapPin className="w-3 h-3" /> },
                { label: 'Cast Date', value: data.metadata.cast_date, icon: <Calendar className="w-3 h-3" /> },
                { label: 'Reference', value: data.metadata.references },
                { label: 'Feature Type', value: data.metadata.feature_type },
                { label: 'Max Depth', value: `${data.metadata.max_depth_m} m` },
              ].map(attr => (
                <div
                  key={attr.label}
                  className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E8E6E0]/60"
                >
                  <div className="flex items-center space-x-1.5 text-[#8E8E91] mb-1">
                    {attr.icon}
                    <span className="text-[10px] uppercase tracking-wider">{attr.label}</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#111111] break-words">
                    {attr.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Variable Registry Table */}
            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#8E8E91] mb-3">
                NetCDF Variable Registry
              </h4>
              <div className="overflow-x-auto border border-[#E8E6E0] rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#FAFAF8] border-b border-[#E8E6E0] text-[#8E8E91]">
                    <tr>
                      <th className="p-3 uppercase tracking-wider">Variable</th>
                      <th className="p-3 uppercase tracking-wider">Standard Name</th>
                      <th className="p-3 uppercase tracking-wider">Units</th>
                      <th className="p-3 uppercase tracking-wider">Shape</th>
                      <th className="p-3 uppercase tracking-wider">Instrument</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E6E0]">
                    {data.variables.map((v: NetCDFVariableInfo) => (
                      <tr key={v.name} className="hover:bg-[#FAFAF8] transition">
                        <td className="p-3 font-semibold text-[#111111]">{v.name}</td>
                        <td className="p-3 text-[#555558]">{v.standard_name || '—'}</td>
                        <td className="p-3 text-[#555558]">{v.units || '—'}</td>
                        <td className="p-3 text-[#555558]">[{v.shape.join(', ')}]</td>
                        <td className="p-3 text-[#555558]">{v.instrument || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
