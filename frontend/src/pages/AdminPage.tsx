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
    <div className="min-h-screen bg-[#FAFAF8] text-[#111111] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#111111] selection:text-white pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#E8E6E0] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#555558] bg-[#F4F2EE] px-3 py-1 rounded-full border border-[#E8E6E0] uppercase tracking-wide font-medium">
              <Lock className="w-3.5 h-3.5 text-[#111111]" />
              <span>National Repository Governance Console</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] font-medium">
              Administration & Role Management
            </h1>
            <p className="text-sm text-[#555558] max-w-3xl font-light">
              Internal operational console supporting authenticated scientists depositing observational datasets, content editors approving communication drafts, and system administrators monitoring repository health.
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-start md:self-auto bg-white border border-[#E8E6E0] px-3.5 py-2 rounded-full text-xs font-mono text-[#555558] shadow-sm">
            <Key className="w-3.5 h-3.5 text-[#111111]" />
            <span>AUTHENTICATED ACCESS · SECURE SESSION</span>
          </div>
        </div>

        {/* Role Persona Switcher */}
        <div className="border border-[#E8E6E0] rounded-2xl bg-white p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#8E8E91]">SWITCH DEMONSTRATION PERSONA:</span>
            <span className="text-[#111111] font-semibold">{role} View</span>
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
                    ? 'bg-[#111111] text-white font-medium shadow-sm'
                    : 'bg-[#FAFAF8] border-[#E8E6E0] text-[#555558] hover:text-[#111111] hover:border-[#111111]/30'
                }`}
              >
                <div className="text-xs font-mono font-bold flex items-center justify-between">
                  <span>{item.id}</span>
                  {role === item.id && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className={`text-[11px] mt-1 line-clamp-1 ${role === item.id ? 'text-white/80' : 'text-[#8E8E91]'}`}>
                  {item.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 1. SCIENTIST DASHBOARD */}
        {role === 'Scientist' && (
          <div className="space-y-6">
            <div className="border border-[#E8E6E0] rounded-3xl bg-white p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E6E0] pb-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#111111] font-medium flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#111111]" />
                    Principal Investigator Workspace
                  </h2>
                  <p className="text-xs text-[#8E8E91] mt-1 font-mono">
                    Logged in as: Dr. Thamban Meloth (Cryosphere & Atmospheric Dynamics, NCPOR)
                  </p>
                </div>
                <span className="px-3 py-1 bg-[#F4F2EE] border border-[#E8E6E0] text-[#16A34A] text-xs font-mono rounded-full font-semibold">
                  Verified NCPOR Investigator
                </span>
              </div>

              {/* Scientist Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
                <div className="bg-[#FAFAF8] p-4 rounded-2xl border border-[#E8E6E0] space-y-1">
                  <span className="text-[10px] text-[#8E8E91] uppercase">MY DATASETS</span>
                  <p className="text-2xl font-bold text-[#111111]">6</p>
                  <span className="text-[11px] text-[#555558]">4 verified, 2 in review</span>
                </div>
                <div className="bg-[#FAFAF8] p-4 rounded-2xl border border-[#E8E6E0] space-y-1">
                  <span className="text-[10px] text-[#8E8E91] uppercase">PUBLICATIONS</span>
                  <p className="text-2xl font-bold text-[#111111]">12</p>
                  <span className="text-[11px] text-[#555558]">Indexed in POLARIS</span>
                </div>
                <div className="bg-[#FAFAF8] p-4 rounded-2xl border border-[#E8E6E0] space-y-1">
                  <span className="text-[10px] text-[#8E8E91] uppercase">EXPEDITIONS</span>
                  <p className="text-2xl font-bold text-[#111111]">4</p>
                  <span className="text-[11px] text-[#555558]">ISEA 43, 44, 45, Arctic</span>
                </div>
                <div className="bg-[#FAFAF8] p-4 rounded-2xl border border-[#E8E6E0] space-y-1">
                  <span className="text-[10px] text-[#8E8E91] uppercase">TOTAL CITATIONS</span>
                  <p className="text-2xl font-bold text-[#111111]">384</p>
                  <span className="text-[11px] text-[#555558]">Cryosphere records</span>
                </div>
              </div>

              {/* Dataset Submission Form */}
              <div className="pt-4 border-t border-[#E8E6E0] space-y-4">
                <h3 className="font-serif text-xl text-[#111111] font-medium flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-[#111111]" />
                  Deposit Scientific Dataset to NPDC Repository
                </h3>

                {submissionSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1 font-mono">
                    <p className="text-emerald-800 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Dataset Successfully Deposited (Record Ingestion Queued)
                    </p>
                    <p className="text-emerald-700">
                      Generated Identifier: NPDC-DS-2026-{Math.floor(Math.random() * 8999 + 1000)} · Queued for QA/QC Review.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleDatasetSubmit} className="space-y-4 bg-[#FAFAF8] p-5 sm:p-6 rounded-2xl border border-[#E8E6E0]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[#8E8E91]">DATASET TITLE</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., High-Resolution Surface Energy Flux Measurements at Bharati (2025-2026)"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full bg-white border border-[#E8E6E0] rounded-xl px-3 py-2 text-[#111111] placeholder-[#8E8E91] focus:outline-none focus:border-[#111111] font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[#8E8E91]">NPDC SCIENCE DOMAIN</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-white border border-[#E8E6E0] rounded-xl px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
                        >
                          {['Cryosphere', 'Atmosphere', 'Oceans', 'Biosphere', 'Solid Earth', 'Sun-Earth Interaction'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[#8E8E91]">OBSERVATION REGION</label>
                        <select
                          value={formData.region}
                          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                          className="w-full bg-white border border-[#E8E6E0] rounded-xl px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
                        >
                          {['Antarctica', 'Arctic', 'Himalaya', 'Southern Ocean'].map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <span className="text-[11px] font-mono text-[#8E8E91]">
                        Deposited files adhere to FAIR principles (Findable, Accessible, Interoperable, Reusable).
                      </span>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#111111] hover:bg-black text-white rounded-full text-xs font-medium font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
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
            <div className="border border-[#E8E6E0] rounded-3xl bg-white p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E6E0] pb-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#111111] font-medium flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#111111]" />
                    Public Science Dissemination Desk
                  </h2>
                  <p className="text-xs text-[#8E8E91] mt-1 font-mono">
                    Editorial board governing source-grounded communication packages generated from scientific records.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="/studio"
                    className="px-4 py-2 bg-[#111111] hover:bg-black text-white rounded-full text-xs font-mono font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Launch Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="/studio/calendar"
                    className="px-4 py-2 bg-[#F4F2EE] hover:bg-[#E8E6E0] border border-[#E8E6E0] text-[#111111] rounded-full text-xs font-mono flex items-center gap-1.5 transition-colors font-medium"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Calendar</span>
                  </a>
                </div>
              </div>

              {/* Review Queue Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase text-[#8E8E91] tracking-wider">
                  Editorial Drafts & Approvals ({drafts.length})
                </h3>

                <div className="overflow-x-auto border border-[#E8E6E0] rounded-2xl">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#FAFAF8] text-[#8E8E91] uppercase text-[11px] border-b border-[#E8E6E0]">
                      <tr>
                        <th className="p-3.5">Source Title</th>
                        <th className="p-3.5">Type</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Target Channels</th>
                        <th className="p-3.5">Created</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E6E0]">
                      {drafts.map(draft => (
                        <tr key={draft.id} className="hover:bg-[#FAFAF8] transition-colors">
                          <td className="p-3.5 font-sans font-medium text-[#111111] max-w-xs truncate">
                            {draft.source_title}
                          </td>
                          <td className="p-3.5 text-[#555558] uppercase text-[11px]">
                            {draft.source_type}
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                              draft.status === 'Approved'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : draft.status === 'Scheduled'
                                ? 'bg-sky-50 border-sky-200 text-sky-800'
                                : 'bg-amber-50 border-amber-200 text-amber-800'
                            }`}>
                              {draft.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-[#555558] text-[11px]">
                            Website, X, Instagram, LinkedIn
                          </td>
                          <td className="p-3.5 text-[#8E8E91] text-[11px]">
                            {draft.created_at?.split('T')[0] || 'Today'}
                          </td>
                          <td className="p-3.5 text-right">
                            <a
                              href="/studio"
                              className="text-[#111111] font-semibold hover:underline text-xs"
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
            <div className="border border-[#E8E6E0] rounded-3xl bg-white p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E6E0] pb-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#111111] font-medium flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#111111]" />
                    National Polar Science Data Infrastructure
                  </h2>
                  <p className="text-xs text-[#8E8E91] mt-1 font-mono">
                    System topology, relational schema integrity, live observatory proxies, and archive counters.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#16A34A] bg-[#F4F2EE] px-3.5 py-1.5 rounded-full border border-[#E8E6E0] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>All Micro-Endpoints Operational</span>
                </div>
              </div>

              {/* Counters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
                <div className="bg-[#FAFAF8] p-4 rounded-2xl border border-[#E8E6E0] space-y-1">
                  <span className="text-[10px] text-[#8E8E91]">EXPEDITIONS</span>
                  <p className="text-2xl font-bold text-[#111111]">{stats?.expeditions || 10}</p>
                </div>
                <div className="bg-[#FAFAF8] p-4 rounded-2xl border border-[#E8E6E0] space-y-1">
                  <span className="text-[10px] text-[#8E8E91]">DATASETS</span>
                  <p className="text-2xl font-bold text-[#111111]">{stats?.datasets || 20}</p>
                </div>
                <div className="bg-[#FAFAF8] p-4 rounded-2xl border border-[#E8E6E0] space-y-1">
                  <span className="text-[10px] text-[#8E8E91]">PUBLICATIONS</span>
                  <p className="text-2xl font-bold text-[#111111]">{stats?.publications || 15}</p>
                </div>
                <div className="bg-[#FAFAF8] p-4 rounded-2xl border border-[#E8E6E0] space-y-1">
                  <span className="text-[10px] text-[#8E8E91]">MEDIA ASSETS</span>
                  <p className="text-2xl font-bold text-[#111111]">{stats?.media_assets || 30}</p>
                </div>
                <div className="bg-[#FAFAF8] p-4 rounded-2xl border border-[#E8E6E0] space-y-1">
                  <span className="text-[10px] text-[#8E8E91]">STATIONS</span>
                  <p className="text-2xl font-bold text-[#111111]">{stats?.stations || 4}</p>
                </div>
                <div className="bg-[#FAFAF8] p-4 rounded-2xl border border-[#E8E6E0] space-y-1">
                  <span className="text-[10px] text-[#8E8E91]">DISPATCHES</span>
                  <p className="text-2xl font-bold text-[#111111]">{stats?.activities || 15}</p>
                </div>
              </div>

              {/* System Architecture Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-xs">
                <div className="bg-[#FAFAF8] p-5 rounded-2xl border border-[#E8E6E0] space-y-3">
                  <h4 className="text-[#111111] font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#111111]" />
                    Live Services & Gateway Proxies
                  </h4>
                  <div className="space-y-2 text-[#555558]">
                    <div className="flex items-center justify-between border-b border-[#E8E6E0] pb-1">
                      <span>Observatory Proxy</span>
                      <span className="text-[#16A34A] font-semibold">Active (Open-Meteo REST)</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[#E8E6E0] pb-1">
                      <span>Cross-Entity Search Engine</span>
                      <span className="text-[#16A34A] font-semibold">SQLite Relational Engine</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[#E8E6E0] pb-1">
                      <span>Knowledge Graph Engine</span>
                      <span className="text-[#16A34A] font-semibold">Multi-Node Directed Graph</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Content Synthesis Pipeline</span>
                      <span className="text-[#16A34A] font-semibold">Deterministic Source Grounding</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAFAF8] p-5 rounded-2xl border border-[#E8E6E0] space-y-3 font-mono text-xs">
                  <h4 className="text-[#111111] font-semibold flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#111111]" />
                    Geographical Observation Coverage
                  </h4>
                  <div className="space-y-2 text-[#555558]">
                    <div className="flex items-center justify-between border-b border-[#E8E6E0] pb-1">
                      <span>Antarctica (Maitri, Bharati)</span>
                      <span className="text-[#111111] font-medium">52% of Datasets</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[#E8E6E0] pb-1">
                      <span>Arctic (Himadri, Svalbard)</span>
                      <span className="text-[#111111] font-medium">22% of Datasets</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[#E8E6E0] pb-1">
                      <span>Himalaya (Himansh, Spiti)</span>
                      <span className="text-[#111111] font-medium">16% of Datasets</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Southern Ocean (ORV Sagar Kanya)</span>
                      <span className="text-[#111111] font-medium">10% of Datasets</span>
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
