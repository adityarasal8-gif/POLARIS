import React, { useState, useEffect } from 'react';
import { 
  Building2, MapPin, Compass, Thermometer, Radio, 
  Calendar, Layers, Globe, ExternalLink, ShieldCheck, 
  Activity, ArrowUpRight, CheckCircle2
} from 'lucide-react';
import { fetchStations } from '../api';
import { Station } from '../types';

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchStations();
        setStations(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch station registry');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#071A2B] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <span>Research Infrastructure</span>
            <span>/</span>
            <span>Field Bases</span>
            <span>/</span>
            <span className="text-white">Indian Polar Stations</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                India's Polar & High-Altitude Research Stations
              </h1>
              <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-3xl">
                Permanent scientific outposts operated by the National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, supporting year-round multidisciplinary observation across Antarctica, the Arctic, and the Himalayas.
              </p>
            </div>
            
            <div className="flex items-center gap-2 self-start md:self-auto bg-[#0B2538] border border-cyan-500/20 px-3 py-1.5 rounded text-xs font-mono text-cyan-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official NCPOR Field Facilities</span>
            </div>
          </div>
        </div>

        {/* Stations Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 text-sm font-mono">Accessing station registries...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-lg text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {stations.map(station => (
              <div 
                key={station.id}
                className="bg-[#0B2538] border border-white/10 hover:border-cyan-500/40 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between transition group"
              >
                <div>
                  {/* Photo Banner */}
                  <div className="relative aspect-[16/9] bg-[#071A2B] overflow-hidden">
                    <img 
                      src={station.image_url} 
                      alt={station.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B2538] via-transparent to-black/40"></div>

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-white font-mono text-xs font-semibold">
                        {station.region}
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {station.status || 'Active Year-Round'}
                      </span>
                    </div>

                    {/* Coordinates Overlay */}
                    <div className="absolute bottom-3 left-4 font-mono text-xs text-cyan-300 bg-[#071A2B]/80 backdrop-blur-sm px-2.5 py-1 rounded border border-cyan-500/20 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{station.latitude > 0 ? `${station.latitude}°N` : `${Math.abs(station.latitude)}°S`}, {station.longitude > 0 ? `${station.longitude}°E` : `${Math.abs(station.longitude)}°W`}</span>
                      {station.elevation_m && <span>• {station.elevation_m}m a.s.l</span>}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-5">
                    <div>
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-serif font-bold text-white group-hover:text-cyan-200 transition">
                          {station.name}
                        </h2>
                        <span className="text-xs font-mono text-slate-400">
                          Est. {station.commissioned_year}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-cyan-400 mt-0.5">
                        {station.location_description}
                      </p>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {station.purpose}
                    </p>

                    {/* Key Technical Specs */}
                    <div className="grid grid-cols-2 gap-3 p-3 bg-[#071A2B] rounded-lg border border-white/5 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px]">ELEVATION</span>
                        <span className="text-slate-200">{station.elevation_m || 0}m a.s.l.</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">COMMISSIONED</span>
                        <span className="text-slate-200">{station.commissioned_year}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">PRIMARY REGION</span>
                        <span className="text-slate-200">{station.region}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">OPERATIONAL STATUS</span>
                        <span className="text-emerald-400">{station.status || 'Active'}</span>
                      </div>
                    </div>

                    {/* Scientific Disciplines */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                        Primary Research Disciplines
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {(station.research_themes || ['Atmospheric Science', 'Cryospheric Dynamics', 'Geomagnetism', 'Meteorology', 'Polar Biology']).map((theme: string, idx: number) => (
                          <span 
                            key={idx}
                            className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-300 text-xs font-mono"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-6 py-4 bg-[#071A2B]/60 border-t border-white/10 flex items-center justify-between">
                  <a 
                    href={`/datasets?station=${station.id}`}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Station Datasets
                  </a>

                  <a 
                    href={`/observatory?station=${station.id}`}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-cyan-950"
                  >
                    <Thermometer className="w-3.5 h-3.5" />
                    <span>Live Telemetry</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
