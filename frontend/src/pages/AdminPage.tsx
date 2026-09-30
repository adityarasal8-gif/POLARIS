import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, UserCheck, Database, FileText, Sparkles, 
  Calendar, CheckCircle2, Clock, AlertCircle, PlusCircle, 
  Upload, Layers, Radio, Globe, BarChart2, Activity,
  Lock, ArrowRight, RefreshCw, Key
} from 'lucide-react';
import { fetchStats, fetchContentDrafts } from '../api';
import { Stats, ContentDraft } from '../types';

interface AdminPageProps {
  currentRole?: string;
  onRoleChange?: (role: string) => void;
}

export default function AdminPage({ currentRole = 'Administrator', onRoleChange }: AdminPageProps) {
  const [role, setRole] = useState(currentRole);
  const [stats, setStats] = useState<Stats | null>(null);
  const [drafts, setDrafts] = useState<ContentDraft[]>([]);
  const [loading, setLoading] = useState(true);

  // New dataset submission simulation state
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Cryosphere',
    region: 'Antarctica',
    station: 'Bharati',
    provider: 'National Centre for Polar and Ocean Research'
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsData, draftsData] = await Promise.all([
          fetchStats().catch(() => null),
          fetchContentDrafts().catch(() => [])
        ]);
        if (statsData) setStats(statsData);
        setDrafts(draftsData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleRoleSelect = (newRole: string) => {
    setRole(newRole);
    if (onRoleChange) onRoleChange(newRole);
  };

  const handleDatasetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionSuccess(true);
    setTimeout(() => {
      setSubmissionSuccess(false);
      setFormData({
        title: '',
        category: 'Cryosphere',
        region: 'Antarctica',
        station: 'Bharati',
        provider: 'National Centre for Polar and Ocean Research'
      });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#07151F] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#74B8CC] uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-[#5BB7A5]" />
              <span>National Repository Governance Console</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
              Administration & Role Management
            </h1>
            <p className="text-sm text-[#94A3B8] max-w-3xl">
              Internal operational console supporting authenticated scientists depositing observational datasets, content editors approving communication drafts, and system administrators monitoring repository health.
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-start md:self-auto bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl text-xs font-mono text-[#B9DDE7]">
            <Key className="w-3.5 h-3.5 text-[#D7A75D]" />
            <span>AUTHENTICATED ACCESS · SECURE SESSION</span>
          </div>
        </div>

        {/* Role Persona Switcher */}
        <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#647887]">SWITCH DEMONSTRATION PERSONA:</span>
            <span className="text-[#74B8CC] font-semibold">{role} View</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'Student', desc: 'Read-only educational view' },
              { id: 'Scientist', desc: 'Dataset submission & records' },
              { id: 'Content Editor', desc: 'Draft approvals & calendar' },
              { id: 'Administrator', desc: 'Full repository infrastructure' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => handleRoleSelect(item.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  role === item.id
                    ? 'bg-white text-[#07151F] font-bold shadow-lg'
                    : 'bg-white/5 border-white/10 text-[#94A3B8] hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="text-xs font-mono font-bold flex items-center justify-between">
                  <span>{item.id}</span>
                  {role === item.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#07151F]" />}
                </div>
                <div className={`text-[11px] mt-1 line-clamp-1 ${role === item.id ? 'text-[#07151F]/70' : 'text-[#647887]'}`}>
                  {item.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 1. SCIENTIST DASHBOARD */}
        {role === 'Scientist' && (
          <div className="space-y-6">
            <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-editorial text-2xl text-white font-normal flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#74B8CC]" />
                    Principal Investigator Workspace
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-1 font-mono">
                    Logged in as: Dr. Thamban Meloth (Cryosphere & Atmospheric Dynamics, NCPOR)
                  </p>
                </div>
                <span className="px-3 py-1 bg-[#5BB7A5]/20 border border-[#5BB7A5] text-[#5BB7A5] text-xs font-mono rounded-lg">
                  Verified NCPOR Investigator
                </span>
              </div>

              {/* Scientist Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
                <div className="bg-[#07151F] p-4 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#647887] uppercase">MY DATASETS</span>
                  <p className="text-2xl font-bold text-[#74B8CC]">6</p>
                  <span className="text-[11px] text-[#94A3B8]">4 verified, 2 in review</span>
                </div>
                <div className="bg-[#07151F] p-4 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#647887] uppercase">PUBLICATIONS</span>
                  <p className="text-2xl font-bold text-white">12</p>
                  <span className="text-[11px] text-[#94A3B8]">Indexed in POLARIS</span>
                </div>
                <div className="bg-[#07151F] p-4 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#647887] uppercase">EXPEDITIONS</span>
                  <p className="text-2xl font-bold text-[#D7A75D]">4</p>
                  <span className="text-[11px] text-[#94A3B8]">ISEA 43, 44, 45, Arctic</span>
                </div>
                <div className="bg-[#07151F] p-4 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#647887] uppercase">TOTAL CITATIONS</span>
                  <p className="text-2xl font-bold text-[#5BB7A5]">384</p>
                  <span className="text-[11px] text-[#94A3B8]">Cryosphere records</span>
                </div>
              </div>

              {/* Dataset Submission Form */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <h3 className="font-editorial text-xl text-white font-normal flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-[#74B8CC]" />
                  Deposit Scientific Dataset to NPDC Repository
                </h3>

                {submissionSuccess ? (
                  <div className="p-4 bg-[#5BB7A5]/20 border border-[#5BB7A5] rounded-xl text-xs space-y-1 font-mono">
                    <p className="text-[#5BB7A5] font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Dataset Successfully Deposited (Record Ingestion Queued)
                    </p>
                    <p className="text-[#94A3B8]">
                      Generated Identifier: NPDC-DS-2026-{Math.floor(Math.random() * 8999 + 1000)} · Queued for QA/QC Review.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleDatasetSubmit} className="space-y-4 bg-[#07151F] p-5 sm:p-6 rounded-xl border border-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[#94A3B8]">DATASET TITLE</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., High-Resolution Surface Energy Flux Measurements at Bharati (2025-2026)"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white placeholder-[#647887] focus:outline-none focus:border-[#74B8CC]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[#94A3B8]">NPDC SCIENCE DOMAIN</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-[#07151F] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#74B8CC]"
                        >
                          {['Cryosphere', 'Atmosphere', 'Oceans', 'Biosphere', 'Solid Earth', 'Sun-Earth Interaction'].map(c => (
                            <option key={c} value={c} className="bg-[#07151F] text-white">{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[#94A3B8]">OBSERVATION REGION</label>
                        <select
                          value={formData.region}
                          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                          className="w-full bg-[#07151F] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#74B8CC]"
                        >
                          {['Antarctica', 'Arctic', 'Himalaya', 'Southern Ocean'].map(r => (
                            <option key={r} value={r} className="bg-[#07151F] text-white">{r}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <span className="text-[11px] font-mono text-[#647887]">
                        Deposited files adhere to FAIR principles (Findable, Accessible, Interoperable, Reusable).
                      </span>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#74B8CC] hover:bg-[#B9DDE7] text-[#07151F] rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Deposit Record</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. CONTENT EDITOR DASHBOARD */}
        {role === 'Content Editor' && (
          <div className="space-y-6">
            <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-editorial text-2xl text-white font-normal flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#D7A75D]" />
                    Public Science Dissemination Desk
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-1 font-mono">
                    Editorial board governing source-grounded communication packages generated from scientific records.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="/studio"
                    className="px-3.5 py-2 bg-[#74B8CC] hover:bg-[#B9DDE7] text-[#07151F] rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Launch Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="/studio/calendar"
                    className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Calendar</span>
                  </a>
                </div>
              </div>

              {/* Review Queue Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase text-[#94A3B8] tracking-wider">
                  Editorial Drafts & Approvals ({drafts.length})
                </h3>

                <div className="overflow-x-auto border border-white/10 rounded-xl">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-white/5 text-[#94A3B8] uppercase text-[11px] border-b border-white/10">
                      <tr>
                        <th className="p-3.5">Source Title</th>
                        <th className="p-3.5">Type</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Target Channels</th>
                        <th className="p-3.5">Created</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {drafts.map(draft => (
                        <tr key={draft.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3.5 font-sans font-medium text-white max-w-xs truncate">
                            {draft.source_title}
                          </td>
                          <td className="p-3.5 text-[#74B8CC] uppercase text-[11px]">
                            {draft.source_type}
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              draft.status === 'Approved'
                                ? 'bg-[#5BB7A5]/20 border border-[#5BB7A5] text-[#5BB7A5]'
                                : draft.status === 'Scheduled'
                                ? 'bg-[#74B8CC]/20 border border-[#74B8CC] text-[#74B8CC]'
                                : 'bg-[#D7A75D]/20 border border-[#D7A75D] text-[#D7A75D]'
                            }`}>
                              {draft.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-[#94A3B8] text-[11px]">
                            Website, X, Instagram, LinkedIn
                          </td>
                          <td className="p-3.5 text-[#647887] text-[11px]">
                            {draft.created_at?.split('T')[0] || 'Today'}
                          </td>
                          <td className="p-3.5 text-right">
                            <a
                              href="/studio"
                              className="text-[#74B8CC] hover:underline text-xs"
                            >
                              Review & Schedule
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. ADMINISTRATOR & REPOSITORY HEALTH DASHBOARD */}
        {(role === 'Administrator' || role === 'Student') && (
          <div className="space-y-6">
            <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-editorial text-2xl text-white font-normal flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#74B8CC]" />
                    National Polar Science Data Infrastructure
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-1 font-mono">
                    System topology, relational schema integrity, live observatory proxies, and archive counters.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#5BB7A5] bg-[#5BB7A5]/20 px-3.5 py-1.5 rounded-lg border border-[#5BB7A5]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>All Micro-Endpoints Operational</span>
                </div>
              </div>

              {/* Counters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
                <div className="bg-[#07151F] p-4 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#647887]">EXPEDITIONS</span>
                  <p className="text-2xl font-bold text-white">{stats?.expeditions || 10}</p>
                </div>
                <div className="bg-[#07151F] p-4 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#647887]">DATASETS</span>
                  <p className="text-2xl font-bold text-[#74B8CC]">{stats?.datasets || 20}</p>
                </div>
                <div className="bg-[#07151F] p-4 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#647887]">PUBLICATIONS</span>
                  <p className="text-2xl font-bold text-white">{stats?.publications || 15}</p>
                </div>
                <div className="bg-[#07151F] p-4 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#647887]">MEDIA ASSETS</span>
                  <p className="text-2xl font-bold text-[#D7A75D]">{stats?.media_assets || 30}</p>
                </div>
                <div className="bg-[#07151F] p-4 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#647887]">STATIONS</span>
                  <p className="text-2xl font-bold text-[#5BB7A5]">{stats?.stations || 4}</p>
                </div>
                <div className="bg-[#07151F] p-4 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#647887]">DISPATCHES</span>
                  <p className="text-2xl font-bold text-white">{stats?.activities || 15}</p>
                </div>
              </div>

              {/* System Architecture Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-xs">
                <div className="bg-[#07151F] p-5 rounded-xl border border-white/10 space-y-3">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#74B8CC]" />
                    Live Services & Gateway Proxies
                  </h4>
                  <div className="space-y-2 text-[#94A3B8]">
                    <div className="flex items-center justify-between border-b border-white/5 pb-1">
                      <span>Observatory Proxy</span>
                      <span className="text-[#5BB7A5]">Active (Open-Meteo REST)</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-1">
                      <span>Cross-Entity Search Engine</span>
                      <span className="text-[#5BB7A5]">SQLite Relational Engine</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-1">
                      <span>Knowledge Graph Engine</span>
                      <span className="text-[#5BB7A5]">Multi-Node Directed Graph</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Content Synthesis Pipeline</span>
                      <span className="text-[#5BB7A5]">Deterministic Source Grounding</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#07151F] p-5 rounded-xl border border-white/10 space-y-3 font-mono text-xs">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#5BB7A5]" />
                    Geographical Observation Coverage
                  </h4>
                  <div className="space-y-2 text-[#94A3B8]">
                    <div className="flex items-center justify-between border-b border-white/5 pb-1">
                      <span>Antarctica (Maitri, Bharati)</span>
                      <span className="text-white">52% of Datasets</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-1">
                      <span>Arctic (Himadri, Svalbard)</span>
                      <span className="text-white">22% of Datasets</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-1">
                      <span>Himalaya (Himansh, Spiti)</span>
                      <span className="text-white">16% of Datasets</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Southern Ocean (ORV Sagar Kanya)</span>
                      <span className="text-white">10% of Datasets</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
