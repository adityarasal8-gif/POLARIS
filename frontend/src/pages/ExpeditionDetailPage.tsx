import React, { useState, useEffect } from 'react';
import { Link, useRoute } from 'wouter';
import { 
  Compass, Calendar, User, Ship, MapPin, CheckCircle, 
  Database, FileText, Image, ArrowLeft, ArrowRight, Share2, 
  Layers, ExternalLink, ShieldCheck
} from 'lucide-react';
import { fetchExpeditionDetail } from '../api';
import { Expedition } from '../types';

export const ExpeditionDetailPage: React.FC = () => {
  const [, params] = useRoute('/expeditions/:id');
  const expId = params?.id || 'exp_45_isea';

  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'objectives' | 'data' | 'team'>('overview');

  useEffect(() => {
    setLoading(true);
    fetchExpeditionDetail(expId)
      .then((data) => {
        setExpedition(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch expedition detail:', err);
        setLoading(false);
      });
  }, [expId]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#FAFAF8] text-[#111111] flex items-center justify-center font-mono text-xs text-[#8E8E91]">
        Accessing expedition mission dossier...
      </div>
    );
  }

  if (!expedition) {
    return (
      <div className="w-full min-h-screen bg-[#FAFAF8] text-[#111111] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-medium font-serif">Expedition Record Not Found</h2>
        <Link href="/expeditions" className="text-xs text-[#111111] underline font-mono">Back to Expeditions Archive</Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] text-[#111111] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#111111] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Breadcrumb Back Link */}
        <Link 
          href="/expeditions" 
          className="inline-flex items-center space-x-2 text-xs font-mono text-[#555558] hover:text-[#111111] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Expeditions Archive</span>
        </Link>

        {/* Hero Mission Dossier Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-[#E8E6E0] bg-white shadow-sm">
          <div className="relative h-80 sm:h-[420px]">
            <img
              src={expedition.hero_image}
              alt={expedition.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            <div className="absolute bottom-8 left-6 sm:left-10 right-6 sm:right-10 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-white/95 text-[#111111] font-bold shadow-sm">
                  {expedition.code}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur-sm">
                  {expedition.region}
                </span>
                <span className={`px-3 py-1 rounded-full uppercase font-medium text-[11px] flex items-center gap-1.5 shadow-sm ${
                  expedition.status === 'Active' 
                    ? 'bg-[#111111] text-white' 
                    : 'bg-white/80 text-[#555558]'
                }`}>
                  {expedition.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />}
                  <span>{expedition.status}</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif font-medium text-white tracking-tight leading-tight max-w-4xl">
                {expedition.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-xs text-white/90 font-mono pt-1">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-white/70" />
                  <span>{expedition.dates}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-white/70" />
                  <span>Leader: {expedition.leader_name}</span>
                </div>
                {expedition.vessel && (
                  <div className="flex items-center space-x-2">
                    <Ship className="w-4 h-4 text-white/70" />
                    <span>Vessel: {expedition.vessel}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dossier Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#E8E6E0] pb-4 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'overview'
                ? 'bg-[#111111] text-white font-medium shadow-sm'
                : 'bg-[#F4F2EE] text-[#555558] hover:text-[#111111] border border-[#E8E6E0]'
            }`}
          >
            Mission Overview
          </button>
          <button
            onClick={() => setActiveTab('objectives')}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'objectives'
                ? 'bg-[#111111] text-white font-medium shadow-sm'
                : 'bg-[#F4F2EE] text-[#555558] hover:text-[#111111] border border-[#E8E6E0]'
            }`}
          >
            Science Objectives ({expedition.objectives?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'data'
                ? 'bg-[#111111] text-white font-medium shadow-sm'
                : 'bg-[#F4F2EE] text-[#555558] hover:text-[#111111] border border-[#E8E6E0]'
            }`}
          >
            Generated Datasets & Papers
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'team'
                ? 'bg-[#111111] text-white font-medium shadow-sm'
                : 'bg-[#F4F2EE] text-[#555558] hover:text-[#111111] border border-[#E8E6E0]'
            }`}
          >
            Scientific Team & Logistics
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-[#E8E6E0] space-y-6 shadow-sm">
              <h2 className="text-2xl font-serif font-medium text-[#111111]">Operational Summary</h2>
              <p className="text-sm sm:text-base text-[#555558] leading-relaxed font-light">
                {expedition.mission_overview || expedition.summary}
              </p>

              {/* Research Themes */}
              <div className="pt-4 border-t border-[#E8E6E0] space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8E8E91] block">
                  Primary Research Themes
                </span>
                <div className="flex flex-wrap gap-2">
                  {expedition.research_themes?.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full bg-[#F4F2EE] text-xs font-mono text-[#111111] border border-[#E8E6E0]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Mission Milestones */}
              {expedition.milestones && expedition.milestones.length > 0 && (
                <div className="pt-6 border-t border-[#E8E6E0] space-y-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#8E8E91] block mb-4">
                    Expedition Milestones
                  </span>
                  <div className="space-y-4">
                    {expedition.milestones.map((m, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="w-24 shrink-0 text-xs font-mono text-[#8E8E91] pt-0.5 group-hover:text-[#2563EB] transition-colors">{m.date}</div>
                        <div className="flex-1 text-sm text-[#111111] pb-4 border-b border-[#E8E6E0] last:border-0 group-hover:text-black transition-colors">{m.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Side Key Facts */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E8E6E0] space-y-5 text-xs font-mono shadow-sm">
              <h3 className="text-sm font-serif font-medium text-[#111111] uppercase tracking-wider pb-3 border-b border-[#E8E6E0]">
                Logistical Specifications
              </h3>
              <div>
                <span className="text-[#8E8E91] block text-[10px] uppercase">Field Region</span>
                <span className="text-[#111111] text-sm font-semibold">{expedition.region}</span>
              </div>
              <div>
                <span className="text-[#8E8E91] block text-[10px] uppercase">Operating Season</span>
                <span className="text-[#111111] text-sm font-semibold">{expedition.dates}</span>
              </div>
              <div>
                <span className="text-[#8E8E91] block text-[10px] uppercase">Research Vessel</span>
                <span className="text-[#111111] text-sm font-semibold">{expedition.vessel || 'Ice-Class Chartered Fleet'}</span>
              </div>
              <div>
                <span className="text-[#8E8E91] block text-[10px] uppercase">Expedition Leader</span>
                <span className="text-[#111111] text-sm font-semibold">{expedition.leader_name}</span>
                <span className="text-[#8E8E91] text-[11px] block">{expedition.leader_title}</span>
              </div>
              <div>
                <span className="text-[#8E8E91] block text-[10px] uppercase">Field Stations Supported</span>
                <span className="text-[#111111] font-semibold">Maitri · Bharati (Antarctic Sector)</span>
              </div>
              {expedition.source_urls && expedition.source_urls.length > 0 && (
                <div className="pt-4 mt-4 border-t border-[#E8E6E0]">
                  <span className="text-[#8E8E91] block text-[10px] uppercase mb-2">Verified Sources</span>
                  <div className="space-y-2">
                    {expedition.source_urls.map((source, i) => (
                      <a key={i} href={source.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#2563EB] hover:underline">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="truncate">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Objectives */}
        {activeTab === 'objectives' && (
          <div className="bg-white p-8 rounded-3xl border border-[#E8E6E0] space-y-6 shadow-sm">
            <h2 className="text-2xl font-serif font-medium text-[#111111]">Scientific Objectives & Work Packages</h2>
            <div className="space-y-4">
              {expedition.objectives?.map((obj, i) => (
                <div key={i} className="flex items-start space-x-3.5 p-4 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0]">
                  <span className="w-6 h-6 rounded-full bg-white border border-[#E8E6E0] text-[#111111] text-xs font-mono flex items-center justify-center shrink-0 mt-0.5 font-semibold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[#555558] leading-relaxed font-light">{obj}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Datasets & Papers */}
        {activeTab === 'data' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-[#E8E6E0] space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif font-medium text-[#111111]">Archived NPDC Datasets</h2>
                <Link href="/datasets" className="text-xs font-mono text-[#111111] hover:underline font-semibold">
                  Browse All Datasets →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expedition.datasets_detail && expedition.datasets_detail.length > 0 ? (
                  expedition.datasets_detail.map((ds: any) => (
                    <Link
                      key={ds.id}
                      href={`/datasets/${ds.id}`}
                      className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E8E6E0] hover:border-[#111111]/30 transition space-y-2 block group shadow-sm"
                    >
                      <span className="text-[10px] font-mono text-[#8E8E91] block">{ds.identifier}</span>
                      <h4 className="text-sm font-semibold text-[#111111] group-hover:text-black transition">{ds.title}</h4>
                      <p className="text-xs text-[#555558] line-clamp-2">{ds.description}</p>
                      <span className="text-xs font-mono text-[#111111] font-semibold inline-block pt-1">Inspect Telemetry & Download →</span>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 text-xs font-mono text-[#8E8E91] p-4 bg-[#FAFAF8] rounded-xl border border-[#E8E6E0]">
                    Datasets associated with {expedition.code} are cataloged under the NPDC cryosphere and atmospheric archives.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Team */}
        {activeTab === 'team' && (
          <div className="bg-white p-8 rounded-3xl border border-[#E8E6E0] space-y-6 shadow-sm">
            <h2 className="text-2xl font-serif font-medium text-[#111111]">Winter-Over Personnel & Scientists</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {expedition.researchers?.map((name, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0] flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#F4F2EE] border border-[#E8E6E0] flex items-center justify-center text-[#111111] font-mono text-sm font-bold">
                    {name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#111111]">{name}</h4>
                    <span className="text-xs text-[#8E8E91] font-mono">Scientific Expedition Member</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
