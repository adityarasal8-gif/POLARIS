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
      <div className="w-full min-h-screen bg-[#07151F] text-white flex items-center justify-center font-mono text-xs text-[#8E9EA7]">
        Accessing expedition mission dossier...
      </div>
    );
  }

  if (!expedition) {
    return (
      <div className="w-full min-h-screen bg-[#07151F] text-white flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold font-serif">Expedition Record Not Found</h2>
        <Link href="/expeditions" className="text-xs text-[#74B8CC] underline font-mono">Back to Expeditions Archive</Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#07151F] text-[#F7F8F5] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#74B8CC]/30 selection:text-[#07151F]">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Breadcrumb Back Link */}
        <Link 
          href="/expeditions" 
          className="inline-flex items-center space-x-2 text-xs font-mono text-[#74B8CC] hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Expeditions Archive</span>
        </Link>

        {/* Hero Mission Dossier Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-[#B9DDE7]/15 bg-[#0D2735] shadow-2xl">
          <div className="relative h-80 sm:h-[420px]">
            <img
              src={expedition.hero_image}
              alt={expedition.name}
              className="w-full h-full object-cover brightness-[0.75]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07151F] via-[#07151F]/40 to-transparent" />
            
            <div className="absolute bottom-8 left-6 sm:left-10 right-6 sm:right-10 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-md bg-[#07151F]/90 text-[#74B8CC] font-bold border border-[#74B8CC]/30">
                  {expedition.code}
                </span>
                <span className="px-3 py-1 rounded-md bg-[#07151F]/80 text-white font-semibold">
                  {expedition.region}
                </span>
                <span className={`px-3 py-1 rounded-md uppercase font-bold text-[11px] ${
                  expedition.status === 'Active' 
                    ? 'bg-[#5BB7A5] text-[#07151F]' 
                    : 'bg-[#07151F]/80 text-[#8E9EA7] border border-[#B9DDE7]/10'
                }`}>
                  {expedition.status}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight max-w-4xl">
                {expedition.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-xs text-[#DCEEF2] font-mono pt-1">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[#5BB7A5]" />
                  <span>{expedition.dates}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-[#74B8CC]" />
                  <span>Leader: {expedition.leader_name}</span>
                </div>
                {expedition.vessel && (
                  <div className="flex items-center space-x-2">
                    <Ship className="w-4 h-4 text-[#D7A75D]" />
                    <span>Vessel: {expedition.vessel}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dossier Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#B9DDE7]/10 pb-4 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-[#74B8CC] text-[#07151F] font-bold shadow-md'
                : 'text-[#8E9EA7] hover:text-white hover:bg-[#0D2735]'
            }`}
          >
            Mission Overview
          </button>
          <button
            onClick={() => setActiveTab('objectives')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'objectives'
                ? 'bg-[#74B8CC] text-[#07151F] font-bold shadow-md'
                : 'text-[#8E9EA7] hover:text-white hover:bg-[#0D2735]'
            }`}
          >
            Science Objectives ({expedition.objectives?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'data'
                ? 'bg-[#74B8CC] text-[#07151F] font-bold shadow-md'
                : 'text-[#8E9EA7] hover:text-white hover:bg-[#0D2735]'
            }`}
          >
            Generated Datasets & Papers
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'team'
                ? 'bg-[#74B8CC] text-[#07151F] font-bold shadow-md'
                : 'text-[#8E9EA7] hover:text-white hover:bg-[#0D2735]'
            }`}
          >
            Scientific Team & Logistics
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-[#0D2735] p-8 rounded-3xl border border-[#B9DDE7]/15 space-y-6">
              <h2 className="text-2xl font-serif font-bold text-white">Operational Summary</h2>
              <p className="text-sm sm:text-base text-[#DCEEF2]/85 leading-relaxed font-light">
                {expedition.mission_overview || expedition.summary}
              </p>

              {/* Research Themes */}
              <div className="pt-4 border-t border-[#B9DDE7]/10 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8E9EA7] block">
                  Primary Research Themes
                </span>
                <div className="flex flex-wrap gap-2">
                  {expedition.research_themes?.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-lg bg-[#07151F] text-xs font-mono text-[#74B8CC] border border-[#B9DDE7]/10">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Key Facts */}
            <div className="lg:col-span-4 bg-[#0D2735] p-6 rounded-3xl border border-[#B9DDE7]/15 space-y-5 text-xs font-mono">
              <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider pb-3 border-b border-[#B9DDE7]/10">
                Logistical Specifications
              </h3>
              <div>
                <span className="text-[#8E9EA7] block">Field Region</span>
                <span className="text-white text-sm font-semibold">{expedition.region}</span>
              </div>
              <div>
                <span className="text-[#8E9EA7] block">Operating Season</span>
                <span className="text-white font-semibold">{expedition.dates}</span>
              </div>
              <div>
                <span className="text-[#8E9EA7] block">Research Vessel</span>
                <span className="text-white font-semibold">{expedition.vessel || 'Ice-Class Chartered Fleet'}</span>
              </div>
              <div>
                <span className="text-[#8E9EA7] block">Expedition Leader</span>
                <span className="text-white font-semibold">{expedition.leader_name}</span>
                <span className="text-[#8E9EA7] text-[11px] block">{expedition.leader_title}</span>
              </div>
              <div>
                <span className="text-[#8E9EA7] block">Field Stations Supported</span>
                <span className="text-[#74B8CC] font-semibold">Maitri · Bharati (Antarctic Sector)</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Objectives */}
        {activeTab === 'objectives' && (
          <div className="bg-[#0D2735] p-8 rounded-3xl border border-[#B9DDE7]/15 space-y-6">
            <h2 className="text-2xl font-serif font-bold text-white">Scientific Objectives & Work Packages</h2>
            <div className="space-y-4">
              {expedition.objectives?.map((obj, i) => (
                <div key={i} className="flex items-start space-x-3.5 p-4 rounded-xl bg-[#07151F] border border-[#B9DDE7]/10">
                  <span className="w-6 h-6 rounded-full bg-[#0D2735] border border-[#74B8CC]/40 text-[#74B8CC] text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[#DCEEF2]/90 leading-relaxed font-light">{obj}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Datasets & Papers */}
        {activeTab === 'data' && (
          <div className="space-y-8">
            <div className="bg-[#0D2735] p-8 rounded-3xl border border-[#B9DDE7]/15 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-white">Archived NPDC Datasets</h2>
                <Link href="/datasets" className="text-xs font-mono text-[#74B8CC] hover:underline">
                  Browse All Datasets →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expedition.datasets_detail && expedition.datasets_detail.length > 0 ? (
                  expedition.datasets_detail.map((ds: any) => (
                    <Link
                      key={ds.id}
                      href={`/datasets/${ds.id}`}
                      className="p-5 rounded-2xl bg-[#07151F] border border-[#B9DDE7]/10 hover:border-[#74B8CC]/40 transition space-y-2 block group"
                    >
                      <span className="text-[10px] font-mono text-[#74B8CC] block">{ds.identifier}</span>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#B9DDE7] transition">{ds.title}</h4>
                      <p className="text-xs text-[#8E9EA7] line-clamp-2">{ds.description}</p>
                      <span className="text-xs font-mono text-[#5BB7A5] inline-block pt-1">Inspect Telemetry & Download →</span>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 text-xs font-mono text-[#8E9EA7] p-4 bg-[#07151F] rounded-xl">
                    Datasets associated with {expedition.code} are cataloged under the NPDC cryosphere and atmospheric archives.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Team */}
        {activeTab === 'team' && (
          <div className="bg-[#0D2735] p-8 rounded-3xl border border-[#B9DDE7]/15 space-y-6">
            <h2 className="text-2xl font-serif font-bold text-white">Winter-Over Personnel & Scientists</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {expedition.researchers?.map((name, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#07151F] border border-[#B9DDE7]/10 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#0D2735] border border-[#74B8CC]/30 flex items-center justify-center text-[#74B8CC] font-mono text-sm font-bold">
                    {name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{name}</h4>
                    <span className="text-xs text-[#8E9EA7] font-mono">Scientific Expedition Member</span>
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
