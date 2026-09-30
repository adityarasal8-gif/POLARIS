import React, { useState, useEffect } from 'react';
import { Link, useRoute } from 'wouter';
import { 
  Compass, Calendar, User, Ship, MapPin, CheckCircle, 
  Database, FileText, Image, ArrowLeft, ArrowRight, Share2 
} from 'lucide-react';
import { fetchExpeditionDetail } from '../api';
import { Expedition } from '../types';

export const ExpeditionDetailPage: React.FC = () => {
  const [, params] = useRoute('/expeditions/:id');
  const expId = params?.id || 'exp_45_isea';

  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="w-full min-h-screen bg-[#071A2B] text-white flex items-center justify-center font-mono text-sm text-[#94A3B8]">
        Retrieving expedition dossier from NCPOR repository...
      </div>
    );
  }

  if (!expedition) {
    return (
      <div className="w-full min-h-screen bg-[#071A2B] text-white flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold">Expedition Record Not Found</h2>
        <Link href="/expeditions" className="text-xs text-[#38BDF8] underline">Back to Expeditions</Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#071A2B] text-white py-10 px-4 sm:px-6 lg:px-8 polar-grid-bg text-left">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Back link */}
        <Link href="/expeditions" className="inline-flex items-center space-x-2 text-xs font-mono text-[#38BDF8] hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Expeditions</span>
        </Link>

        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden polar-panel border border-[#6EC5E9]/20 shadow-2xl">
          <div className="relative h-72 sm:h-96">
            <img
              src={expedition.hero_image}
              alt={expedition.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B] via-[#071A2B]/60 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono px-3 py-1 rounded bg-[#071A2B]/90 text-[#38BDF8] font-bold border border-[#38BDF8]/40">
                  {expedition.code}
                </span>
                <span className="text-xs font-mono px-3 py-1 rounded bg-[#071A2B]/90 text-white font-semibold">
                  {expedition.region}
                </span>
                <span className={`text-xs font-mono px-3 py-1 rounded uppercase font-bold ${expedition.status === 'Active' ? 'badge-live' : 'badge-preview'}`}>
                  {expedition.status}
                </span>
                <span className="text-xs font-mono px-3 py-1 rounded bg-[#0B2538] text-[#E7A93B] border border-[#E7A93B]/30">
                  VERIFIED NCPOR RECORD
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {expedition.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-xs text-[#CBD5E1] font-mono pt-1">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-[#38BDF8]" />
                  <span>{expedition.dates}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <User className="w-4 h-4 text-[#22C7A8]" />
                  <span>Leader: {expedition.leader_name}</span>
                </div>
                {expedition.vessel && (
                  <div className="flex items-center space-x-1.5">
                    <Ship className="w-4 h-4 text-[#6EC5E9]" />
                    <span>Vessel: {expedition.vessel}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="px-6 py-2 bg-[#051320] text-[10px] text-[#647887] font-mono border-t border-[#6EC5E9]/10">
            Image Credit: {expedition.hero_image_credit}
          </div>
        </div>

        {/* Knowledge Relationship Chain / Breadcrumb */}
        <div className="polar-panel p-4 border border-[#38BDF8]/20 bg-[#0B2538]/50 flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="text-[#38BDF8] font-bold uppercase text-[10px] tracking-wider">
            Connected Knowledge Chain:
          </span>
          <span className="px-2 py-0.5 rounded bg-[#071A2B] text-white border border-[#6EC5E9]/20">
            {expedition.code}
          </span>
          <span className="text-[#6EC5E9]">→</span>
          <span className="px-2 py-0.5 rounded bg-[#071A2B] text-[#22C7A8] border border-[#22C7A8]/20">
            {expedition.researchers?.length || 4} Researchers
          </span>
          <span className="text-[#6EC5E9]">→</span>
          <span className="px-2 py-0.5 rounded bg-[#071A2B] text-[#38BDF8] border border-[#38BDF8]/20">
            {expedition.datasets_detail?.length || expedition.connected_datasets.length} Datasets
          </span>
          <span className="text-[#6EC5E9]">→</span>
          <span className="px-2 py-0.5 rounded bg-[#071A2B] text-[#E7A93B] border border-[#E7A93B]/20">
            {expedition.publications_detail?.length || expedition.connected_publications.length} Publications
          </span>
          <span className="text-[#6EC5E9]">→</span>
          <Link href="/studio" className="ml-auto text-[#22C7A8] hover:underline flex items-center space-x-1 text-xs font-bold">
            <Share2 className="w-3.5 h-3.5" />
            <span>Generate Outreach Package →</span>
          </Link>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Dossier (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Mission Overview */}
            <div className="polar-panel p-6 border border-[#6EC5E9]/15 space-y-4">
              <h2 className="text-lg font-bold text-white uppercase font-mono tracking-wider text-[#38BDF8]">
                Mission Overview
              </h2>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                {expedition.mission_overview}
              </p>
            </div>

            {/* Scientific Objectives */}
            <div className="polar-panel p-6 border border-[#6EC5E9]/15 space-y-4">
              <h2 className="text-lg font-bold text-white uppercase font-mono tracking-wider text-[#22C7A8]">
                Core Scientific Objectives
              </h2>
              <div className="space-y-2.5">
                {expedition.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start space-x-3 text-sm text-[#CBD5E1]">
                    <CheckCircle className="w-4 h-4 text-[#22C7A8] mt-0.5 shrink-0" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Datasets */}
            <div className="polar-panel p-6 border border-[#6EC5E9]/15 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white uppercase font-mono tracking-wider text-[#38BDF8]">
                  Datasets Generated ({expedition.datasets_detail?.length || 0})
                </h2>
                <Link href="/datasets" className="text-xs text-[#38BDF8] hover:underline">
                  NPDC Catalog →
                </Link>
              </div>

              {expedition.datasets_detail && expedition.datasets_detail.length > 0 ? (
                <div className="space-y-3">
                  {expedition.datasets_detail.map((ds: any) => (
                    <div
                      key={ds.id}
                      className="p-3.5 rounded-xl bg-[#071A2B] border border-[#6EC5E9]/15 flex items-center justify-between hover:border-[#38BDF8]/40 transition-colors"
                    >
                      <div>
                        <div className="flex items-center space-x-2 text-[10px] font-mono text-[#38BDF8] mb-1">
                          <span className="font-bold">{ds.identifier}</span>
                          <span>•</span>
                          <span>{ds.science_category}</span>
                          <span className="badge-live px-1.5 py-0.2 rounded text-[9px]">{ds.access_status}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white">{ds.title}</h4>
                      </div>
                      <Link
                        href={`/datasets/${ds.id}`}
                        className="px-3 py-1.5 rounded bg-[#0B2538] hover:bg-[#123753] border border-[#6EC5E9]/20 text-xs text-[#38BDF8] font-mono shrink-0 ml-3"
                      >
                        Explore Data →
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#94A3B8]">Observational telemetry currently undergoing calibration.</p>
              )}
            </div>

            {/* Produced Publications */}
            <div className="polar-panel p-6 border border-[#6EC5E9]/15 space-y-4">
              <h2 className="text-lg font-bold text-white uppercase font-mono tracking-wider text-[#E7A93B]">
                Publications Produced ({expedition.publications_detail?.length || 0})
              </h2>

              {expedition.publications_detail && expedition.publications_detail.length > 0 ? (
                <div className="space-y-3">
                  {expedition.publications_detail.map((pub: any) => (
                    <div key={pub.id} className="p-4 rounded-xl bg-[#071A2B] border border-[#6EC5E9]/15 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#6EC5E9]">
                        <span>{pub.journal} ({pub.year})</span>
                        <span className="text-[#38BDF8]">DOI: {pub.doi}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{pub.title}</h4>
                      <p className="text-[11px] text-[#94A3B8] line-clamp-2">{pub.abstract}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#94A3B8]">Peer-reviewed synthesis papers currently in submission.</p>
              )}
            </div>
          </div>

          {/* Sidebar Metadata (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Field Locations */}
            <div className="polar-panel p-5 border border-[#6EC5E9]/15 space-y-3">
              <h3 className="text-xs font-mono uppercase font-bold text-white flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Field Deployment Locations</span>
              </h3>
              <div className="space-y-1.5 text-xs text-[#CBD5E1]">
                {expedition.field_locations.map((loc) => (
                  <div key={loc} className="p-2 rounded bg-[#071A2B] border border-[#6EC5E9]/10 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                    <span>{loc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Research Themes */}
            <div className="polar-panel p-5 border border-[#6EC5E9]/15 space-y-3">
              <h3 className="text-xs font-mono uppercase font-bold text-white">
                Research Domains
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {expedition.research_themes.map((th) => (
                  <span key={th} className="text-xs font-mono px-2.5 py-1 rounded bg-[#071A2B] text-[#38BDF8] border border-[#38BDF8]/20">
                    {th}
                  </span>
                ))}
              </div>
            </div>

            {/* Participating Scientists */}
            <div className="polar-panel p-5 border border-[#6EC5E9]/15 space-y-3">
              <h3 className="text-xs font-mono uppercase font-bold text-white flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-[#22C7A8]" />
                <span>Key Participating Scientists</span>
              </h3>
              <div className="space-y-2 text-xs">
                {expedition.researchers.map((res) => (
                  <div key={res} className="p-2 rounded bg-[#071A2B] border border-[#6EC5E9]/10 text-white font-medium">
                    {res}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action: Dissemination Studio */}
            <div className="polar-panel p-5 border border-[#22C7A8]/30 bg-gradient-to-b from-[#0B2538] to-[#071A2B] space-y-3 text-center">
              <h3 className="text-sm font-bold text-white">Media Outreach Ready</h3>
              <p className="text-xs text-[#94A3B8]">
                Generate an authenticated social media & news press kit grounded in this mission's record.
              </p>
              <Link
                href={`/studio?source_type=expedition&source_id=${expedition.id}`}
                className="w-full py-2.5 rounded-lg bg-[#22C7A8] hover:bg-[#1fb396] text-[#071A2B] font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Open in AI Content Studio</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
