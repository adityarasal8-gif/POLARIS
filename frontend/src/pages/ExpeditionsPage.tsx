import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Compass, Calendar, User, Search, Filter, ArrowRight, ShieldCheck, Ship } from 'lucide-react';
import { fetchExpeditions } from '../api';
import { Expedition } from '../types';

export const ExpeditionsPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchExpeditions({
      region: selectedRegion === 'All' ? undefined : selectedRegion,
      status: selectedStatus === 'All' ? undefined : selectedStatus,
      q: searchQuery.trim() || undefined
    })
      .then((data) => {
        setExpeditions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Expeditions fetch error:', err);
        setLoading(false);
      });
  }, [selectedRegion, selectedStatus, searchQuery]);

  const REGIONS = ['All', 'Antarctica', 'Arctic', 'Himalaya', 'Southern Ocean'];
  const STATUSES = ['All', 'Active', 'Completed'];

  return (
    <div className="w-full min-h-screen bg-[#071A2B] text-white py-10 px-4 sm:px-6 lg:px-8 polar-grid-bg">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-left space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#22C7A8] font-bold tracking-wider uppercase">
            <Compass className="w-4 h-4 text-[#22C7A8]" />
            <span>INDIAN POLAR EXPEDITIONS ARCHIVE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Field Missions Across Extreme Earth Realms
          </h1>
          <p className="text-sm text-[#94A3B8] max-w-2xl">
            Explore four decades of scientific campaigns, winter-over deployments, and oceanic voyages from 1981 to the flagship 45th ISEA.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="polar-panel p-4 border border-[#6EC5E9]/15 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#38BDF8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expeditions or leaders..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#071A2B] border border-[#6EC5E9]/20 text-white text-xs placeholder-[#647887] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs font-mono">
            {/* Region Selector */}
            <div className="flex items-center space-x-1.5">
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

            {/* Status Selector */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[#94A3B8]">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#071A2B] border border-[#6EC5E9]/20 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#38BDF8]"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Expeditions Grid */}
        {loading ? (
          <div className="py-20 text-center text-sm font-mono text-[#94A3B8]">
            Loading expedition records from NCPOR archive...
          </div>
        ) : expeditions.length === 0 ? (
          <div className="py-20 text-center polar-panel p-8 text-sm text-[#94A3B8]">
            No expeditions match the specified criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expeditions.map((exp) => (
              <div
                key={exp.id}
                onClick={() => setLocation(`/expeditions/${exp.id}`)}
                className="polar-panel overflow-hidden border border-[#6EC5E9]/15 polar-panel-hover flex flex-col justify-between cursor-pointer group text-left"
              >
                <div>
                  {/* Hero Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={exp.hero_image}
                      alt={exp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B2538] via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#071A2B]/85 text-[#38BDF8] font-bold border border-[#6EC5E9]/30">
                        {exp.code}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#071A2B]/85 text-white font-semibold">
                        {exp.region}
                      </span>
                    </div>

                    <span className={`absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${exp.status === 'Active' ? 'badge-live' : 'badge-preview'}`}>
                      {exp.status}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center space-x-2 text-xs text-[#94A3B8] font-mono">
                      <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>{exp.dates}</span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-[#38BDF8] transition-colors leading-snug">
                      {exp.name}
                    </h3>

                    <div className="flex items-center space-x-2 text-xs text-[#CBD5E1]">
                      <User className="w-3.5 h-3.5 text-[#22C7A8]" />
                      <span className="font-semibold">{exp.leader_name}</span>
                    </div>

                    {exp.vessel && (
                      <div className="flex items-center space-x-2 text-[11px] text-[#94A3B8] font-mono">
                        <Ship className="w-3 h-3 text-[#6EC5E9]" />
                        <span>{exp.vessel}</span>
                      </div>
                    )}

                    <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                      {exp.summary}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {exp.research_themes.slice(0, 3).map((th) => (
                        <span
                          key={th}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#071A2B] text-[#94A3B8] border border-[#6EC5E9]/10"
                        >
                          {th}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#6EC5E9]/10 mt-3 flex items-center justify-between text-xs text-[#38BDF8] font-semibold">
                  <span className="font-mono text-[10px] text-[#647887]">
                    {exp.connected_datasets.length} Datasets • {exp.connected_publications.length} Papers
                  </span>
                  <div className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>Mission Dossier</span>
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
