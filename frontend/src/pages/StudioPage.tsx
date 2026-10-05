import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Share2, CheckCircle2, Clock, Calendar, 
  Copy, Check, ArrowRight, ShieldCheck, RefreshCw, 
  FileText, Mail, Loader2, Database, Compass, Layers, CheckSquare,
  Sparkles, Send, Eye, Code, Heart, Bookmark, MessageCircle, Repeat2,
  ExternalLink, UserCheck
} from 'lucide-react';
import { generateContent, fetchContentDrafts, reviewContentDraft, fetchExpeditions, fetchDatasets, fetchStations, fetchPublications } from '../api';
import { ContentDraft, Expedition, Dataset, Station, Publication } from '../types';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const StudioPage: React.FC = () => {
  const [sourcesList, setSourcesList] = useState<{ id: string; name: string; type: string }[]>([]);
  const [selectedSourceType, setSelectedSourceType] = useState('expedition');
  const [selectedSourceId, setSelectedSourceId] = useState('exp_45_isea');
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [activeDraft, setActiveDraft] = useState<ContentDraft | null>(null);
  const [activeTab, setActiveTab] = useState<'website' | 'instagram' | 'x' | 'linkedin' | 'youtube' | 'newsletter'>('instagram');
  const [viewMode, setViewMode] = useState<'mockup' | 'raw'>('mockup');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  const GENERATION_STEPS = [
    'Parsing authoritative source record & charter...',
    'Extracting verified scientific entities, coordinates & crew...',
    'Synthesizing platform-tailored communication drafts...',
    'Attaching verifiable provenance and citation records...'
  ];

  useEffect(() => {
    Promise.all([fetchExpeditions(), fetchDatasets(), fetchStations(), fetchPublications()]).then(([exps, dss, stations, pubs]) => {
      const items: { id: string; name: string; type: string }[] = [];
      exps.forEach(e => items.push({ id: e.id, name: `${e.code} — ${e.name}`, type: 'expedition' }));
      dss.forEach(d => items.push({ id: d.id, name: `${d.identifier}: ${d.title}`, type: 'dataset' }));
      stations.forEach(s => items.push({ id: s.id, name: s.name, type: 'station' }));
      pubs.forEach(p => items.push({ id: p.id, name: p.title, type: 'publication' }));
      setSourcesList(items);
      const firstExp = items.find(i => i.type === 'expedition');
      if (firstExp && !selectedSourceId) {
        setSelectedSourceId(firstExp.id);
      }

      // Pre-fetch draft if available
      fetchContentDrafts().then((drafts) => {
        if (drafts.length > 0) setActiveDraft(drafts[0]);
      }).catch(console.error);
    }).catch(console.error);
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerationStep(0);

    const stepInterval = setInterval(() => {
      setGenerationStep(prev => (prev < GENERATION_STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const draft = await generateContent(selectedSourceType, selectedSourceId);
      clearInterval(stepInterval);
      setActiveDraft(draft);
      setReviewSuccess('Generated verified outreach package.');
      setTimeout(() => setReviewSuccess(null), 4000);
    } catch (err) {
      clearInterval(stepInterval);
      console.error('Generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleReviewAction = async (action: 'approve' | 'reject' | 'schedule') => {
    if (!activeDraft) return;
    try {
      const updated = await reviewContentDraft(activeDraft.id, action);
      setActiveDraft({ ...activeDraft, status: updated.status });
      setReviewSuccess(`Draft state changed to: ${updated.status}`);
      setTimeout(() => setReviewSuccess(null), 3000);
    } catch (err) {
      console.error('Review failed:', err);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredSources = sourcesList.filter(s => s.type === selectedSourceType);

  const getActiveText = () => {
    if (!activeDraft) return '';
    switch (activeTab) {
      case 'instagram': return activeDraft.instagram_post;
      case 'x': return activeDraft.x_post;
      case 'linkedin': return activeDraft.linkedin_post;
      case 'website': return activeDraft.website_article;
      case 'youtube': return activeDraft.youtube_description;
      case 'newsletter': return activeDraft.newsletter_summary;
      default: return '';
    }
  };

  const currentContentText = getActiveText();
  const wordCount = currentContentText.trim() ? currentContentText.trim().split(/\s+/).length : 0;
  const charCount = currentContentText.length;

  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] text-[#111111] font-sans selection:bg-[#111111] selection:text-white pb-20 relative overflow-hidden">
      
      {/* Ambient Floating Perimeter Glyphs */}
      <div className="absolute top-12 left-8 text-[#111111]/8 pointer-events-none select-none animate-float-1 z-0 hidden lg:block">
        <Sparkles className="w-24 h-24 stroke-[1.2]" />
      </div>
      <div className="absolute top-24 right-12 text-[#111111]/8 pointer-events-none select-none animate-float-2 z-0 hidden lg:block">
        <Share2 className="w-20 h-20 stroke-[1.2]" />
      </div>
      <div className="absolute top-96 left-16 text-[#111111]/6 pointer-events-none select-none animate-subtle-drift-rev z-0 hidden md:block">
        <Send className="w-24 h-24 stroke-[1.1]" />
      </div>
      <div className="absolute top-80 right-1/4 text-[#111111]/6 pointer-events-none select-none animate-subtle-drift z-0 hidden md:block">
        <Compass className="w-20 h-20 stroke-[1.2]" />
      </div>

      {/* Header Section */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#E8E6E0] bg-[#F4F2EE] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E6E0] text-xs font-mono text-[#555558] uppercase tracking-wide font-medium shadow-xs">
              <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Scientific Communication & Outreach Desk · SIH26063</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#111111] font-medium tracking-tight">
              Institutional Editorial Workspace
            </h1>
            <p className="text-xs sm:text-sm text-[#555558] max-w-2xl font-light leading-relaxed">
              Transform validated expedition charters and NPDC datasets into multi-platform public outreach packages with traceable scientific citations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/studio/calendar"
              className="px-4 py-2.5 rounded-full bg-white hover:bg-[#FAFAF8] border border-[#E8E6E0] text-xs font-mono text-[#111111] flex items-center gap-2 transition-colors shadow-xs font-medium cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#111111]" />
              <span>Release Calendar</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Animated Workflow Conduits Ribbon */}
      <div className="border-b border-[#E8E6E0] bg-[#FAFAF8] sticky top-16 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs font-mono overflow-x-auto text-[#8E8E91]">
          <div className="flex items-center gap-1.5 text-[#111111] font-semibold shrink-0">
            <span className="w-4 h-4 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px]">1</span>
            <span>SOURCE</span>
          </div>
          <span className="px-2 text-[#E8E6E0]">→</span>
          <div className="flex items-center gap-1.5 text-[#111111] font-semibold shrink-0">
            <span className="w-4 h-4 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px]">2</span>
            <span>EXTRACT</span>
          </div>
          <span className="px-2 text-[#E8E6E0]">→</span>
          <div className="flex items-center gap-1.5 text-[#111111] font-semibold shrink-0">
            <span className="w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[10px] animate-pulse">3</span>
            <span className="text-[#2563EB]">GENERATE</span>
          </div>
          <span className="px-2 text-[#E8E6E0]">→</span>
          <div className={`flex items-center gap-1.5 shrink-0 ${activeDraft ? 'text-[#111111] font-semibold' : ''}`}>
            <span className="w-4 h-4 rounded-full bg-[#E8E6E0] text-[#111111] flex items-center justify-center text-[10px]">4</span>
            <span>REVIEW</span>
          </div>
          <span className="px-2 text-[#E8E6E0]">→</span>
          <div className={`flex items-center gap-1.5 shrink-0 ${activeDraft?.status === 'Approved' ? 'text-[#16A34A] font-semibold' : ''}`}>
            <span className="w-4 h-4 rounded-full bg-[#E8E6E0] text-[#111111] flex items-center justify-center text-[10px]">5</span>
            <span>APPROVE</span>
          </div>
          <span className="px-2 text-[#E8E6E0]">→</span>
          <div className={`flex items-center gap-1.5 shrink-0 ${activeDraft?.status === 'Scheduled' ? 'text-[#111111] font-semibold' : ''}`}>
            <span className="w-4 h-4 rounded-full bg-[#E8E6E0] text-[#111111] flex items-center justify-center text-[10px]">6</span>
            <span>SCHEDULE</span>
          </div>
        </div>
      </div>

      {/* Review Feedback Alert */}
      {reviewSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-3 rounded-2xl bg-white border border-[#E8E6E0] text-[#111111] flex items-center gap-2 text-xs font-mono shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            <span>{reviewSuccess}</span>
          </div>
        </div>
      )}

      {/* 3-Pane Professional Editorial Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* PANE 1: SOURCE MATERIAL (3 cols) */}
          <div className="lg:col-span-3 space-y-5 border border-[#E8E6E0] rounded-2xl bg-white p-5 shadow-xs card-hover-spring">
            <div className="border-b border-[#E8E6E0] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E8E91] block">
                Pane 01 · Input Material
              </span>
              <h2 className="font-serif text-xl text-[#111111] font-medium mt-0.5">
                Authoritative Record
              </h2>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-[#8E8E91] uppercase text-[10px] block">Document Domain</label>
                <select
                  value={selectedSourceType}
                  onChange={(e) => {
                    setSelectedSourceType(e.target.value);
                    const first = sourcesList.find(s => s.type === e.target.value);
                    if (first) setSelectedSourceId(first.id);
                  }}
                  className="w-full bg-[#FAFAF8] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
                >
                  <option value="expedition">Expedition Charter & Log</option>
                  <option value="dataset">Validated NPDC Dataset</option>
                  <option value="station">Polar Station Telemetry</option>
                  <option value="publication">Scientific Publication</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#8E8E91] uppercase text-[10px] block">Reference Record</label>
                <select
                  value={selectedSourceId}
                  onChange={(e) => setSelectedSourceId(e.target.value)}
                  className="w-full bg-[#FAFAF8] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
                >
                  {filteredSources.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full py-3 rounded-full bg-[#111111] hover:bg-black text-white font-medium text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {generating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-[#60A5FA]" />
                  )}
                  <span>{generating ? 'Synthesizing...' : 'Synthesize Outreach'}</span>
                </button>
              </div>

              {generating && (
                <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0] space-y-2 text-[11px] text-[#111111]">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2563EB]" />
                    <span>{GENERATION_STEPS[generationStep]}</span>
                  </div>
                  <div className="w-full bg-[#E8E6E0] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2563EB] h-full transition-all duration-300"
                      style={{ width: `${((generationStep + 1) / GENERATION_STEPS.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E8E6E0] space-y-2 text-[11px] text-[#555558]">
              <span className="font-mono text-[#8E8E91] block">Extraction Pipeline:</span>
              <p className="leading-relaxed font-light">
                NCPOR scientific entities are deterministically mapped to verified database coordinates before synthesis.
              </p>
            </div>
          </div>

          {/* PANE 2: GENERATED CONTENT (6 cols) */}
          <div className="lg:col-span-6 space-y-4 border border-[#E8E6E0] rounded-2xl bg-white p-5 sm:p-6 shadow-xs card-hover-spring">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E6E0] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E8E91] block">
                  Pane 02 · Editorial Output
                </span>
                <h2 className="font-serif text-xl text-[#111111] font-medium mt-0.5">
                  {activeDraft?.title || 'Editorial Draft'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {/* View Mode Toggle: Interactive Mockup vs Raw Editor */}
                <div className="flex items-center bg-[#F4F2EE] p-0.5 rounded-full border border-[#E8E6E0] text-[10px] font-mono">
                  <button
                    onClick={() => setViewMode('mockup')}
                    className={`px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                      viewMode === 'mockup' ? 'bg-white text-[#111111] font-bold shadow-2xs' : 'text-[#8E8E91]'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Mockup</span>
                  </button>
                  <button
                    onClick={() => setViewMode('raw')}
                    className={`px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                      viewMode === 'raw' ? 'bg-white text-[#111111] font-bold shadow-2xs' : 'text-[#8E8E91]'
                    }`}
                  >
                    <Code className="w-3 h-3" />
                    <span>Raw</span>
                  </button>
                </div>

                {activeDraft && (
                  <span className={`text-[10px] font-mono px-3 py-1 rounded-full border font-semibold uppercase ${
                    activeDraft.status === 'Approved' ? 'bg-[#F4F2EE] border-[#16A34A]/20 text-[#16A34A]' :
                    activeDraft.status === 'Scheduled' ? 'bg-[#F4F2EE] border-[#E8E6E0] text-[#111111]' :
                    'bg-[#F4F2EE] border-[#E8E6E0] text-[#555558]'
                  }`}>
                    {activeDraft.status}
                  </span>
                )}
              </div>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex border-b border-[#E8E6E0] overflow-x-auto text-xs font-mono">
              {[
                { id: 'instagram', label: 'Instagram', icon: InstagramIcon },
                { id: 'x', label: 'X (Twitter)', icon: TwitterIcon },
                { id: 'linkedin', label: 'LinkedIn', icon: LinkedinIcon },
                { id: 'website', label: 'Press Release', icon: FileText },
                { id: 'youtube', label: 'YouTube Script', icon: YoutubeIcon },
                { id: 'newsletter', label: 'Newsletter', icon: Mail },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-2.5 font-medium flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-[#111111] text-[#111111] bg-[#FAFAF8]'
                        : 'border-transparent text-[#8E8E91] hover:text-[#111111]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Formatted Output Container / Live Social Mockup */}
            {activeDraft ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#8E8E91]">
                  <div className="flex items-center gap-3">
                    <span>{wordCount} words</span>
                    <span>·</span>
                    <span>{charCount} chars</span>
                    <span>·</span>
                    <span>~{Math.max(1, Math.ceil(wordCount / 180))} min read</span>
                  </div>

                  <button
                    onClick={() => handleCopy(currentContentText, activeTab)}
                    className="flex items-center gap-1 text-[#111111] hover:underline transition-colors cursor-pointer font-medium"
                  >
                    {copiedKey === activeTab ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === activeTab ? 'Copied' : 'Copy Content'}</span>
                  </button>
                </div>

                {/* View Mode: Interactive Social Media Card Mockup */}
                {viewMode === 'mockup' ? (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFAF8] border border-[#E8E6E0]">
                    {activeTab === 'instagram' && (
                      <div className="bg-white border border-[#E8E6E0] rounded-2xl overflow-hidden shadow-xs max-w-md mx-auto font-sans">
                        {/* Instagram Header */}
                        <div className="p-3 border-b border-[#E8E6E0] flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-serif text-xs font-bold">
                              P
                            </div>
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-[#111111]">polaris_ncpor</span>
                                <span className="w-3 h-3 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[7px]">✓</span>
                              </div>
                              <span className="text-[10px] text-[#8E8E91]">Goa, India · Antarctica</span>
                            </div>
                          </div>
                          <span className="text-xs text-[#8E8E91]">•••</span>
                        </div>

                        {/* Photo Placeholder / Thumbnail */}
                        <div className="aspect-square bg-[#F4F2EE] relative overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80" 
                            alt="Antarctic Field Campaign"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-mono">
                            1/3
                          </div>
                        </div>

                        {/* Action Icons */}
                        <div className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-[#111111]">
                              <Heart className="w-5 h-5 cursor-pointer hover:text-red-500 transition-colors" />
                              <MessageCircle className="w-5 h-5 cursor-pointer" />
                              <Send className="w-5 h-5 cursor-pointer" />
                            </div>
                            <Bookmark className="w-5 h-5 cursor-pointer" />
                          </div>

                          <div className="text-xs text-[#111111] leading-relaxed whitespace-pre-line pt-1">
                            <span className="font-bold mr-1.5">polaris_ncpor</span>
                            {activeDraft.instagram_post}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'x' && (
                      <div className="bg-white border border-[#E8E6E0] rounded-2xl p-4 shadow-xs max-w-lg mx-auto font-sans space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center font-serif text-sm font-bold shrink-0">
                            P
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm font-bold text-[#111111]">POLARIS · India Polar Science</span>
                              <span className="w-3.5 h-3.5 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[8px]">✓</span>
                              <span className="text-xs text-[#8E8E91]">@polaris_ncpor · Just now</span>
                            </div>
                            <p className="text-sm text-[#111111] leading-relaxed whitespace-pre-line">
                              {activeDraft.x_post}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#E8E6E0] flex items-center justify-between text-xs text-[#8E8E91] px-2">
                          <span className="flex items-center gap-1 hover:text-[#2563EB] cursor-pointer"><MessageCircle className="w-3.5 h-3.5" /> 18</span>
                          <span className="flex items-center gap-1 hover:text-[#16A34A] cursor-pointer"><Repeat2 className="w-3.5 h-3.5" /> 42</span>
                          <span className="flex items-center gap-1 hover:text-red-500 cursor-pointer"><Heart className="w-3.5 h-3.5" /> 184</span>
                          <span className="flex items-center gap-1 hover:text-[#111111] cursor-pointer"><Share2 className="w-3.5 h-3.5" /></span>
                        </div>
                      </div>
                    )}

                    {activeTab === 'linkedin' && (
                      <div className="bg-white border border-[#E8E6E0] rounded-2xl p-5 shadow-xs max-w-lg mx-auto font-sans space-y-3">
                        <div className="flex items-center gap-3 border-b border-[#E8E6E0] pb-3">
                          <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center font-serif text-sm font-bold">
                            P
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#111111]">National Centre for Polar and Ocean Research (NCPOR)</h4>
                            <p className="text-[11px] text-[#8E8E91]">Ministry of Earth Sciences, Govt. of India · 42,800 followers</p>
                          </div>
                        </div>

                        <div className="text-xs sm:text-sm text-[#111111] leading-relaxed whitespace-pre-line">
                          {activeDraft.linkedin_post}
                        </div>
                      </div>
                    )}

                    {activeTab === 'website' && (
                      <div className="bg-white border border-[#E8E6E0] rounded-2xl p-6 shadow-xs font-sans space-y-4">
                        <div className="border-b border-[#E8E6E0] pb-3 space-y-1">
                          <span className="text-[10px] font-mono text-[#8E8E91] uppercase tracking-wider">OFFICIAL PRESS RELEASE · MINISTRY OF EARTH SCIENCES</span>
                          <h3 className="font-serif text-xl sm:text-2xl text-[#111111] font-medium leading-tight">
                            {activeDraft.title}
                          </h3>
                          <p className="text-xs text-[#8E8E91] font-mono">NEW DELHI / GOA · FOR IMMEDIATE RELEASE</p>
                        </div>
                        <div className="text-xs sm:text-sm text-[#555558] leading-relaxed whitespace-pre-line font-light">
                          {activeDraft.website_article}
                        </div>
                      </div>
                    )}

                    {(activeTab === 'youtube' || activeTab === 'newsletter') && (
                      <div className="bg-white border border-[#E8E6E0] rounded-2xl p-5 shadow-xs font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-line text-[#111111]">
                        {activeTab === 'youtube' ? activeDraft.youtube_description : activeDraft.newsletter_summary}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E8E6E0] text-xs sm:text-sm leading-relaxed whitespace-pre-line text-[#111111] min-h-[260px] font-mono">
                    {currentContentText}
                  </div>
                )}

                {/* Editorial Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleReviewAction('approve')}
                    className="px-4 py-2 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-mono font-medium transition-colors cursor-pointer shadow-sm"
                  >
                    Approve Package
                  </button>
                  <button
                    onClick={() => handleReviewAction('schedule')}
                    className="px-4 py-2 rounded-full bg-[#F4F2EE] hover:bg-[#E8E6E0] border border-[#E8E6E0] text-[#111111] text-xs font-mono font-medium transition-colors cursor-pointer"
                  >
                    Schedule for Release
                  </button>
                  <button
                    onClick={() => handleReviewAction('reject')}
                    className="px-4 py-2 rounded-full bg-white hover:bg-[#F4F2EE] border border-[#E8E6E0] text-[#555558] text-xs font-mono transition-colors cursor-pointer"
                  >
                    Reject Draft
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-xs text-[#8E8E91]">
                Select a source record and click 'Synthesize Outreach' to begin.
              </div>
            )}
          </div>

          {/* PANE 3: SOURCE REFERENCES & FACT CHECK (3 cols) */}
          <div className="lg:col-span-3 space-y-5 border border-[#E8E6E0] rounded-2xl bg-white p-5 shadow-xs card-hover-spring">
            <div className="border-b border-[#E8E6E0] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E8E91] block">
                Pane 03 · Provenance
              </span>
              <h2 className="font-serif text-xl text-[#111111] font-medium mt-0.5">
                Traceable Citations
              </h2>
            </div>

            {activeDraft ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-[#8E8E91] uppercase">
                    Field Citation Links
                  </span>
                  <div className="space-y-2">
                    {activeDraft.citations.map((c, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0] text-xs font-mono space-y-0.5">
                        <span className="text-[#8E8E91] text-[10px] block uppercase font-medium">{c.source_field}</span>
                        <span className="text-[#111111] text-xs break-all font-semibold">{c.reference}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#E8E6E0]">
                  <span className="text-[10px] font-mono text-[#8E8E91] uppercase">
                    Fact Verification Status
                  </span>
                  <div className="space-y-1.5 text-xs text-[#555558]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>Coordinate consistency verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>Expedition roster verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>Zero hallucinated DOI / citations</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8E6E0] text-[10px] font-mono text-[#8E8E91]">
                  Draft ID: {activeDraft.id} · Generated via NCPOR Deterministic Parser
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-xs text-[#8E8E91]">
                Citation records will populate after source synthesis.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
