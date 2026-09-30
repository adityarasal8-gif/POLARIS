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
    <div className="min-h-screen bg-[#071A2B] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <span>Governance</span>
            <span>/</span>
            <span>Editorial Workflow</span>
            <span>/</span>
            <span className="text-white">Scientist & Administration Portal</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Role Console & Repository Management
              </h1>
              <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-3xl">
                Multi-tier portal supporting field scientists depositing observational data, content editors reviewing public outreach drafts, and repository administrators overseeing system health.
              </p>
            </div>
            
            <div className="flex items-center gap-2 self-start md:self-auto bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded text-xs font-mono text-amber-300">
              <Key className="w-4 h-4 text-amber-400" />
              <span>DEMO ACCESS • SIMULATED CREDENTIALS</span>
            </div>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="bg-[#0B2538] border border-white/10 rounded-xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">ACTIVE DEMO PERSONA:</span>
            <span className="text-cyan-400 font-semibold">{role} View</span>
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
                className={`p-3 rounded-lg border text-left transition ${
                  role === item.id
                    ? 'bg-cyan-950 border-cyan-400 text-white shadow-md shadow-cyan-950/50'
                    : 'bg-[#071A2B] border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="text-xs font-mono font-bold flex items-center justify-between">
                  <span>{item.id}</span>
                  {role === item.id && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {item.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 1. SCIENTIST DASHBOARD */}
        {role === 'Scientist' && (
          <div className="space-y-6">
            <div className="bg-[#0B2538] border border-white/10 rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-cyan-400" />
                    Principal Investigator Workspace
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Logged in as: Dr. Thamban Meloth (Cryosphere & Atmospheric Dynamics, NCPOR)
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono rounded">
                  Verified NCPOR Scientist
                </span>
              </div>

              {/* Scientist Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#071A2B] p-4 rounded-lg border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">MY DATASETS</span>
                  <p className="text-2xl font-bold font-mono text-cyan-300">6</p>
                  <span className="text-[11px] text-slate-500 font-mono">4 verified, 2 in review</span>
                </div>
                <div className="bg-[#071A2B] p-4 rounded-lg border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">PUBLICATIONS</span>
                  <p className="text-2xl font-bold font-mono text-white">12</p>
                  <span className="text-[11px] text-slate-500 font-mono">Indexed in POLARIS</span>
                </div>
                <div className="bg-[#071A2B] p-4 rounded-lg border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">EXPEDITIONS</span>
                  <p className="text-2xl font-bold font-mono text-amber-300">4</p>
                  <span className="text-[11px] text-slate-500 font-mono">ISEA 43, 44, 45, Arctic</span>
                </div>
                <div className="bg-[#071A2B] p-4 rounded-lg border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">TOTAL CITATIONS</span>
                  <p className="text-2xl font-bold font-mono text-emerald-300">384</p>
                  <span className="text-[11px] text-slate-500 font-mono">Cryosphere publications</span>
                </div>
              </div>

              {/* Dataset Submission Form */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-cyan-400" />
                  Deposit Scientific Dataset to NPDC Repository
                </h3>

                {submissionSuccess ? (
                  <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-xs space-y-1">
                    <p className="text-emerald-300 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Dataset Successfully Deposited (Prototype Record Created)
                    </p>
                    <p className="text-slate-300 font-mono">
                      Generated Identifier: NPDC-DS-2026-{Math.floor(Math.random() * 8999 + 1000)} • Queued for QA/QC Review.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleDatasetSubmit} className="space-y-4 bg-[#071A2B] p-5 rounded-lg border border-white/5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-slate-400">DATASET TITLE</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., High-Resolution Surface Energy Flux Measurements at Bharati (2025-2026)"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full bg-[#0B2538] border border-white/10 rounded px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400">NPDC SCIENCE DOMAIN</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-[#0B2538] border border-white/10 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                        >
                          {['Cryosphere', 'Atmosphere', 'Oceans', 'Biosphere', 'Solid Earth', 'Sun-Earth Interaction'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400">OBSERVATION REGION</label>
                        <select
                          value={formData.region}
                          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                          className="w-full bg-[#0B2538] border border-white/10 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                        >
                          {['Antarctica', 'Arctic', 'Himalaya', 'Southern Ocean'].map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] font-mono text-slate-500">
                        Deposited files comply with FAIR data principles (Findable, Accessible, Interoperable, Reusable).
                      </span>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold font-mono flex items-center gap-1.5 transition"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Deposit Record
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
            <div className="bg-[#0B2538] border border-white/10 rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Public Science Dissemination Desk
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Editorial board governing source-grounded communication packages generated from scientific reports.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="/studio"
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-mono font-medium flex items-center gap-1 transition"
                  >
                    <span>Launch Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="/studio/calendar"
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 rounded text-xs font-mono flex items-center gap-1 transition"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Calendar</span>
                  </a>
                </div>
              </div>

              {/* Review Queue Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Editorial Drafts & Approvals ({drafts.length})
                </h3>

                <div className="overflow-x-auto border border-white/10 rounded-lg">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#071A2B] text-slate-400 uppercase text-[11px] border-b border-white/10">
                      <tr>
                        <th className="p-3">Source Title</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Target Channels</th>
                        <th className="p-3">Created</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {drafts.map(draft => (
                        <tr key={draft.id} className="hover:bg-white/5 transition">
                          <td className="p-3 font-sans font-medium text-white max-w-xs truncate">
                            {draft.source_title}
                          </td>
                          <td className="p-3 text-cyan-400 uppercase text-[11px]">
                            {draft.source_type}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              draft.status === 'Approved'
                                ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                                : draft.status === 'Scheduled'
                                ? 'bg-blue-950 border border-blue-500/40 text-blue-300'
                                : 'bg-amber-950 border border-amber-500/40 text-amber-300'
                            }`}>
                              {draft.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400 text-[11px]">
                            Website, X, Instagram, LinkedIn
                          </td>
                          <td className="p-3 text-slate-500 text-[11px]">
                            {draft.created_at?.split('T')[0] || 'Today'}
                          </td>
                          <td className="p-3 text-right">
                            <a
                              href="/studio"
                              className="text-cyan-400 hover:underline text-xs"
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
            <div className="bg-[#0B2538] border border-white/10 rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-cyan-400" />
                    National Polar Science Data Infrastructure
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    System topology, relational schema integrity, live observatory proxies, and archive counters.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>All Endpoints Operational</span>
                </div>
              </div>

              {/* Counters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-[#071A2B] p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400">EXPEDITIONS</span>
                  <p className="text-xl font-bold font-mono text-white">{stats?.expeditions || 10}</p>
                </div>
                <div className="bg-[#071A2B] p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400">DATASETS</span>
                  <p className="text-xl font-bold font-mono text-cyan-300">{stats?.datasets || 20}</p>
                </div>
                <div className="bg-[#071A2B] p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400">PUBLICATIONS</span>
                  <p className="text-xl font-bold font-mono text-white">{stats?.publications || 15}</p>
                </div>
                <div className="bg-[#071A2B] p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400">MEDIA ASSETS</span>
                  <p className="text-xl font-bold font-mono text-amber-300">{stats?.media_assets || 30}</p>
                </div>
                <div className="bg-[#071A2B] p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400">STATIONS</span>
                  <p className="text-xl font-bold font-mono text-emerald-300">{stats?.stations || 4}</p>
                </div>
                <div className="bg-[#071A2B] p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400">ACTIVITIES</span>
                  <p className="text-xl font-bold font-mono text-white">{stats?.activities || 15}</p>
                </div>
              </div>

              {/* System Architecture Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#071A2B] p-4 rounded-lg border border-white/5 space-y-3 font-mono text-xs">
                  <h4 className="text-slate-300 font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Live Services & Gateway Proxies
                  </h4>
                  <div className="space-y-2 text-slate-400">
                    <div className="flex items-center justify-between border-b border-white/5 pb-1">
                      <span>Observatory Proxy</span>
                      <span className="text-emerald-400">Active (Open-Meteo REST)</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-1">
                      <span>Cross-Entity Search Engine</span>
                      <span className="text-emerald-400">SQLite FTS / Relational</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-1">
                      <span>Knowledge Graph Engine</span>
                      <span className="text-emerald-400">Multi-Node Directed Graph</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Content Synthesis Pipeline</span>
                      <span className="text-emerald-400">Deterministic Source Grounding</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#071A2B] p-4 rounded-lg border border-white/5 space-y-3 font-mono text-xs">
                  <h4 className="text-slate-300 font-semibold flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    Geographical Observation Coverage
                  </h4>
                  <div className="space-y-2 text-slate-400">
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
