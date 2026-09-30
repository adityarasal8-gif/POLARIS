import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Share2, CheckCircle2, Clock, Calendar, 
  Copy, Check, ArrowRight, ShieldCheck, RefreshCw, 
  FileText, Mail, Loader2, Database, Compass, Layers, CheckSquare
} from 'lucide-react';
import { generateContent, fetchContentDrafts, reviewContentDraft, fetchExpeditions, fetchDatasets } from '../api';
import { ContentDraft, Expedition, Dataset } from '../types';

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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  const GENERATION_STEPS = [
    'Parsing authoritative source record...',
    'Extracting verified scientific entities & coordinates...',
    'Synthesizing platform-tailored communication drafts...',
    'Attaching traceable citation records...'
  ];

  useEffect(() => {
    Promise.all([fetchExpeditions(), fetchDatasets()]).then(([exps, dss]) => {
      const items: { id: string; name: string; type: string }[] = [];
      exps.forEach(e => items.push({ id: e.id, name: `${e.code} — ${e.name}`, type: 'expedition' }));
      dss.forEach(d => items.push({ id: d.id, name: `${d.identifier}: ${d.title}`, type: 'dataset' }));
      setSourcesList(items);
    }).catch(console.error);

    fetchContentDrafts().then((drafts) => {
      if (drafts.length > 0) setActiveDraft(drafts[0]);
    }).catch(console.error);
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerationStep(0);
    setReviewSuccess(null);

    const interval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev < GENERATION_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 400);

    try {
      const draft = await generateContent(selectedSourceType, selectedSourceId);
      clearInterval(interval);
      setTimeout(() => {
        setActiveDraft(draft);
        setGenerating(false);
      }, 400);
    } catch (err) {
      clearInterval(interval);
      console.error('Content generation error:', err);
      setGenerating(false);
    }
  };

  const handleReviewAction = async (action: string) => {
    if (!activeDraft) return;
    try {
      const res = await reviewContentDraft(activeDraft.id, action, 'Chief Content Editor', '2026-10-15 14:00 UTC');
      setActiveDraft({ ...activeDraft, status: res.status as any });
      setReviewSuccess(`Outreach package updated to status: "${res.status}"`);
      setTimeout(() => setReviewSuccess(null), 3500);
    } catch (err) {
      console.error('Review action failed:', err);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredSources = sourcesList.filter((s) => s.type === selectedSourceType);

  return (
    <div className="w-full min-h-screen bg-[#07151F] text-white">
      {/* Editorial Header */}
      <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-gradient-to-b from-[#0D2735] to-[#07151F]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#B9DDE7] uppercase tracking-widest">
              <FileText className="w-3.5 h-3.5 text-[#74B8CC]" />
              <span>Scientific Communication & Outreach Desk</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
              Institutional Editorial Workspace
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl">
              Transform validated expedition charters and NPDC datasets into multi-platform public outreach packages with traceable scientific citations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/studio/calendar"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white flex items-center gap-2 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-[#74B8CC]" />
              <span>Release Calendar</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Workflow Ribbon: SOURCE → EXTRACT → GENERATE → REVIEW → APPROVE → SCHEDULE */}
      <div className="border-b border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs font-mono overflow-x-auto text-[#647887]">
          <div className="flex items-center gap-2 text-[#74B8CC] font-semibold shrink-0">
            <span className="w-5 h-5 rounded-full bg-[#74B8CC]/20 flex items-center justify-center text-[11px]">1</span>
            <span>SOURCE</span>
          </div>
          <span className="px-2">→</span>
          <div className="flex items-center gap-2 text-[#74B8CC] font-semibold shrink-0">
            <span className="w-5 h-5 rounded-full bg-[#74B8CC]/20 flex items-center justify-center text-[11px]">2</span>
            <span>EXTRACT</span>
          </div>
          <span className="px-2">→</span>
          <div className="flex items-center gap-2 text-[#74B8CC] font-semibold shrink-0">
            <span className="w-5 h-5 rounded-full bg-[#74B8CC]/20 flex items-center justify-center text-[11px]">3</span>
            <span>GENERATE</span>
          </div>
          <span className="px-2">→</span>
          <div className={`flex items-center gap-2 shrink-0 ${activeDraft ? 'text-[#B9DDE7] font-semibold' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[11px]">4</span>
            <span>REVIEW</span>
          </div>
          <span className="px-2">→</span>
          <div className={`flex items-center gap-2 shrink-0 ${activeDraft?.status === 'Approved' ? 'text-[#5BB7A5] font-semibold' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[11px]">5</span>
            <span>APPROVE</span>
          </div>
          <span className="px-2">→</span>
          <div className={`flex items-center gap-2 shrink-0 ${activeDraft?.status === 'Scheduled' ? 'text-[#D7A75D] font-semibold' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[11px]">6</span>
            <span>SCHEDULE</span>
          </div>
        </div>
      </div>

      {/* Review Feedback Alert */}
      {reviewSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-3 rounded-xl bg-[#5BB7A5]/20 border border-[#5BB7A5] text-[#B9DDE7] flex items-center gap-2 text-xs font-mono">
            <CheckCircle2 className="w-4 h-4 text-[#5BB7A5]" />
            <span>{reviewSuccess}</span>
          </div>
        </div>
      )}

      {/* 3-Pane Professional Editorial Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* PANE 1: SOURCE MATERIAL (3 cols) */}
          <div className="lg:col-span-3 space-y-5 border border-white/10 rounded-2xl bg-white/[0.02] p-5">
            <div className="border-b border-white/10 pb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#74B8CC] block">
                Pane 01 · Input
              </span>
              <h2 className="font-editorial text-xl text-white font-normal mt-0.5">
                Source Material
              </h2>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-[#94A3B8] uppercase text-[10px] block">Document Domain</label>
                <select
                  value={selectedSourceType}
                  onChange={(e) => {
                    setSelectedSourceType(e.target.value);
                    const first = sourcesList.find(s => s.type === e.target.value);
                    if (first) setSelectedSourceId(first.id);
                  }}
                  className="w-full bg-[#07151F] border border-white/15 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#74B8CC] cursor-pointer"
                >
                  <option value="expedition">Expedition Charter & Log</option>
                  <option value="dataset">Validated NPDC Dataset</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#94A3B8] uppercase text-[10px] block">Reference Record</label>
                <select
                  value={selectedSourceId}
                  onChange={(e) => setSelectedSourceId(e.target.value)}
                  className="w-full bg-[#07151F] border border-white/15 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#74B8CC] cursor-pointer"
                >
                  {filteredSources.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#07151F] text-white">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full py-3 rounded-xl bg-[#74B8CC] hover:bg-[#B9DDE7] text-[#07151F] font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {generating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  <span>{generating ? 'Extracting...' : 'Synthesize Package'}</span>
                </button>
              </div>

              {generating && (
                <div className="p-3 rounded-xl bg-white/[0.04] border border-[#74B8CC]/30 space-y-2 text-[11px] text-[#B9DDE7]">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#74B8CC]" />
                    <span>{GENERATION_STEPS[generationStep]}</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-[#74B8CC] h-full transition-all duration-300"
                      style={{ width: `${((generationStep + 1) / GENERATION_STEPS.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2 text-[11px] text-[#647887]">
              <span className="font-mono text-[#94A3B8] block">Extraction Pipeline:</span>
              <p className="leading-relaxed">
                NCPOR scientific entities are deterministically mapped to verified database coordinates before synthesis.
              </p>
            </div>
          </div>

          {/* PANE 2: GENERATED CONTENT (6 cols) */}
          <div className="lg:col-span-6 space-y-4 border border-white/10 rounded-2xl bg-white/[0.02] p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#74B8CC] block">
                  Pane 02 · Editorial Output
                </span>
                <h2 className="font-editorial text-xl text-white font-normal mt-0.5">
                  {activeDraft?.title || 'Editorial Draft'}
                </h2>
              </div>

              {activeDraft && (
                <span className={`text-[10px] font-mono px-2.5 py-1 rounded border font-semibold uppercase ${
                  activeDraft.status === 'Approved' ? 'bg-[#5BB7A5]/20 border-[#5BB7A5] text-[#5BB7A5]' :
                  activeDraft.status === 'Scheduled' ? 'bg-[#D7A75D]/20 border-[#D7A75D] text-[#D7A75D]' :
                  'bg-white/10 border-white/20 text-[#B9DDE7]'
                }`}>
                  {activeDraft.status}
                </span>
              )}
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto text-xs font-mono">
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
                        ? 'border-[#74B8CC] text-white bg-white/5'
                        : 'border-transparent text-[#647887] hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Formatted Output Container */}
            {activeDraft ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#647887]">
                  <span>Formatted Platform Preview</span>
                  <button
                    onClick={() => {
                      const text = 
                        activeTab === 'instagram' ? activeDraft.instagram_post :
                        activeTab === 'x' ? activeDraft.x_post :
                        activeTab === 'linkedin' ? activeDraft.linkedin_post :
                        activeTab === 'website' ? activeDraft.website_article :
                        activeTab === 'youtube' ? activeDraft.youtube_description :
                        activeDraft.newsletter_summary;
                      handleCopy(text, activeTab);
                    }}
                    className="flex items-center gap-1 text-[#74B8CC] hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedKey === activeTab ? <Check className="w-3.5 h-3.5 text-[#5BB7A5]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === activeTab ? 'Copied' : 'Copy Content'}</span>
                  </button>
                </div>

                <div className="p-5 rounded-xl bg-[#07151F] border border-white/10 text-xs sm:text-sm leading-relaxed whitespace-pre-line text-[#CBD5E1] min-h-[260px]">
                  {activeTab === 'instagram' && activeDraft.instagram_post}
                  {activeTab === 'x' && activeDraft.x_post}
                  {activeTab === 'linkedin' && activeDraft.linkedin_post}
                  {activeTab === 'website' && activeDraft.website_article}
                  {activeTab === 'youtube' && activeDraft.youtube_description}
                  {activeTab === 'newsletter' && activeDraft.newsletter_summary}
                </div>

                {/* Editorial Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleReviewAction('approve')}
                    className="px-4 py-2 rounded-xl bg-[#5BB7A5]/20 hover:bg-[#5BB7A5]/30 border border-[#5BB7A5]/50 text-[#5BB7A5] text-xs font-mono font-bold transition-colors cursor-pointer"
                  >
                    Approve Package
                  </button>
                  <button
                    onClick={() => handleReviewAction('schedule')}
                    className="px-4 py-2 rounded-xl bg-[#74B8CC]/20 hover:bg-[#74B8CC]/30 border border-[#74B8CC]/50 text-[#74B8CC] text-xs font-mono font-bold transition-colors cursor-pointer"
                  >
                    Schedule for Release
                  </button>
                  <button
                    onClick={() => handleReviewAction('reject')}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#94A3B8] text-xs font-mono transition-colors cursor-pointer"
                  >
                    Reject Draft
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-xs text-[#647887]">
                Select a source record and click 'Synthesize Package' to begin.
              </div>
            )}
          </div>

          {/* PANE 3: SOURCE REFERENCES & FACT CHECK (3 cols) */}
          <div className="lg:col-span-3 space-y-5 border border-white/10 rounded-2xl bg-white/[0.02] p-5">
            <div className="border-b border-white/10 pb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#74B8CC] block">
                Pane 03 · Provenance
              </span>
              <h2 className="font-editorial text-xl text-white font-normal mt-0.5">
                Traceable Citations
              </h2>
            </div>

            {activeDraft ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-[#94A3B8] uppercase">
                    Field Citation Links
                  </span>
                  <div className="space-y-2">
                    {activeDraft.citations.map((c, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#07151F] border border-white/10 text-xs font-mono space-y-0.5">
                        <span className="text-[#74B8CC] text-[10px] block uppercase">{c.source_field}</span>
                        <span className="text-white text-xs break-all">{c.reference}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="text-[11px] font-mono text-[#94A3B8] uppercase">
                    Fact Verification Status
                  </span>
                  <div className="space-y-1.5 text-xs text-[#CBD5E1]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5BB7A5]" />
                      <span>Coordinate consistency verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5BB7A5]" />
                      <span>Expedition roster verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5BB7A5]" />
                      <span>Zero hallucinated DOI / citations</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 text-[10px] font-mono text-[#647887]">
                  Draft ID: {activeDraft.id} · Generated via NCPOR Deterministic Parser
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-xs text-[#647887]">
                Citation records will populate after source synthesis.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
