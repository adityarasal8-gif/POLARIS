import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Share2, Sparkles, CheckCircle2, Clock, Calendar, 
  Copy, Check, ArrowRight, ShieldCheck, RefreshCw, 
  FileText, Mail, Loader2
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

  // Generation animation steps
  const GENERATION_STEPS = [
    'Reading source scientific metadata...',
    'Extracting verified scientific entities & coordinates...',
    'Cross-referencing NPDC datasets & station logs...',
    'Synthesizing platform-tailored communication drafts...',
    'Assembling traceable source citations...'
  ];

  useEffect(() => {
    // Populate sources from backend
    Promise.all([fetchExpeditions(), fetchDatasets()]).then(([exps, dss]) => {
      const items: { id: string; name: string; type: string }[] = [];
      exps.forEach(e => items.push({ id: e.id, name: `${e.code} — ${e.name}`, type: 'expedition' }));
      dss.forEach(d => items.push({ id: d.id, name: `${d.identifier}: ${d.title}`, type: 'dataset' }));
      setSourcesList(items);
    }).catch(console.error);

    // Fetch initial draft
    fetchContentDrafts().then((drafts) => {
      if (drafts.length > 0) setActiveDraft(drafts[0]);
    }).catch(console.error);
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerationStep(0);
    setReviewSuccess(null);

    // Step-by-step progress simulation
    const interval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev < GENERATION_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 450);

    try {
      const draft = await generateContent(selectedSourceType, selectedSourceId);
      clearInterval(interval);
      setTimeout(() => {
        setActiveDraft(draft);
        setGenerating(false);
      }, 500);
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
      setReviewSuccess(`Outreach package successfully updated to status: "${res.status}"`);
      setTimeout(() => setReviewSuccess(null), 4000);
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
    <div className="w-full min-h-screen bg-[#071A2B] text-white py-10 px-4 sm:px-6 lg:px-8 polar-grid-bg text-left">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#6EC5E9]/15 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#22C7A8] font-bold tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4 text-[#22C7A8]" />
              <span>SOURCE-GROUNDED AI CONTENT STUDIO</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              From Research to Public Understanding
            </h1>
            <p className="text-sm text-[#94A3B8] max-w-2xl mt-1">
              Extract scientific entities from validated NCPOR records and generate multi-platform outreach packages with complete traceable citations.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <Link
              href="/studio/calendar"
              className="px-4 py-2 rounded-xl bg-[#0B2538] hover:bg-[#123753] border border-[#6EC5E9]/20 text-[#38BDF8] flex items-center space-x-1.5 transition-colors"
            >
              <Calendar className="w-4 h-4 text-[#38BDF8]" />
              <span>Open Content Calendar</span>
            </Link>
          </div>
        </div>

        {/* Workflow Pipeline Indicator */}
        <div className="polar-panel p-4 border border-[#6EC5E9]/15 flex items-center justify-between text-xs font-mono overflow-x-auto">
          <div className="flex items-center space-x-2 text-[#38BDF8]">
            <span className="w-5 h-5 rounded-full bg-[#38BDF8]/20 flex items-center justify-center font-bold">1</span>
            <span className="font-semibold">Select Source</span>
          </div>
          <span className="text-[#647887]">→</span>
          <div className="flex items-center space-x-2 text-[#22C7A8]">
            <span className="w-5 h-5 rounded-full bg-[#22C7A8]/20 flex items-center justify-center font-bold">2</span>
            <span className="font-semibold">Entity Extraction</span>
          </div>
          <span className="text-[#647887]">→</span>
          <div className="flex items-center space-x-2 text-[#6EC5E9]">
            <span className="w-5 h-5 rounded-full bg-[#6EC5E9]/20 flex items-center justify-center font-bold">3</span>
            <span className="font-semibold">Multi-Platform Synthesis</span>
          </div>
          <span className="text-[#647887]">→</span>
          <div className="flex items-center space-x-2 text-[#E7A93B]">
            <span className="w-5 h-5 rounded-full bg-[#E7A93B]/20 flex items-center justify-center font-bold">4</span>
            <span className="font-semibold">Source Citations</span>
          </div>
          <span className="text-[#647887]">→</span>
          <div className="flex items-center space-x-2 text-white">
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold">5</span>
            <span className="font-semibold">Editorial Review</span>
          </div>
        </div>

        {/* Source Selector Controls */}
        <div className="polar-panel p-6 border border-[#6EC5E9]/20 shadow-2xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Source Type Selector */}
            <div className="md:col-span-4 space-y-1">
              <label className="text-xs font-mono text-[#94A3B8] uppercase">1. Select Source Material Type</label>
              <select
                value={selectedSourceType}
                onChange={(e) => {
                  setSelectedSourceType(e.target.value);
                  const first = sourcesList.find(s => s.type === e.target.value);
                  if (first) setSelectedSourceId(first.id);
                }}
                className="w-full bg-[#071A2B] border border-[#6EC5E9]/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="expedition">Expedition Charter & Log</option>
                <option value="dataset">Validated NPDC Dataset</option>
              </select>
            </div>

            {/* Source Item Selector */}
            <div className="md:col-span-5 space-y-1">
              <label className="text-xs font-mono text-[#94A3B8] uppercase">2. Select Reference Record</label>
              <select
                value={selectedSourceId}
                onChange={(e) => setSelectedSourceId(e.target.value)}
                className="w-full bg-[#071A2B] border border-[#6EC5E9]/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
              >
                {filteredSources.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Generate Action Button */}
            <div className="md:col-span-3 pt-5">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#22C7A8] to-[#38BDF8] text-[#071A2B] font-bold text-xs flex items-center justify-center space-x-2 hover:brightness-110 transition-all cursor-pointer shadow-lg"
              >
                {generating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#071A2B]" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#071A2B]" />
                )}
                <span>{generating ? 'Synthesizing...' : 'Generate Outreach Package'}</span>
              </button>
            </div>
          </div>

          {/* Phased Generation Animation */}
          {generating && (
            <div className="pt-4 border-t border-[#6EC5E9]/15 space-y-2 font-mono text-xs text-[#38BDF8] animate-pulse">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="font-semibold">{GENERATION_STEPS[generationStep]}</span>
              </div>
              <div className="w-full bg-[#071A2B] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#22C7A8] h-full transition-all duration-300"
                  style={{ width: `${((generationStep + 1) / GENERATION_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Review Notification Alert */}
        {reviewSuccess && (
          <div className="p-4 rounded-xl bg-[#22C7A8]/20 border border-[#22C7A8] text-white flex items-center space-x-2 text-xs font-mono animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#22C7A8]" />
            <span>{reviewSuccess}</span>
          </div>
        )}

        {/* Active Draft Viewer */}
        {activeDraft && (
          <div className="space-y-6">
            {/* Draft Metadata & Review Header */}
            <div className="polar-panel p-5 border border-[#6EC5E9]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    activeDraft.status === 'Approved' ? 'badge-verified' : activeDraft.status === 'Scheduled' ? 'badge-live' : 'badge-preview'
                  }`}>
                    Status: {activeDraft.status}
                  </span>
                  <span className="text-[10px] font-mono text-[#94A3B8]">
                    Generated {activeDraft.created_at}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{activeDraft.title}</h3>
                <p className="text-xs text-[#38BDF8] font-mono mt-0.5">
                  Grounded Source: {activeDraft.source_title}
                </p>
              </div>

              {/* Editorial Review Actions */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => handleReviewAction('approve')}
                  className="px-3.5 py-2 rounded-lg bg-[#22C7A8]/20 hover:bg-[#22C7A8]/30 border border-[#22C7A8] text-[#22C7A8] text-xs font-bold transition-colors cursor-pointer"
                >
                  Approve Package
                </button>
                <button
                  onClick={() => handleReviewAction('schedule')}
                  className="px-3.5 py-2 rounded-lg bg-[#38BDF8]/20 hover:bg-[#38BDF8]/30 border border-[#38BDF8] text-[#38BDF8] text-xs font-bold transition-colors cursor-pointer"
                >
                  Schedule for Release
                </button>
                <button
                  onClick={() => handleReviewAction('reject')}
                  className="px-3 py-2 rounded-lg bg-[#071A2B] hover:bg-[#123753] border border-[#6EC5E9]/20 text-xs text-[#94A3B8] transition-colors cursor-pointer"
                >
                  Reject Draft
                </button>
              </div>
            </div>

            {/* Multi-Platform Output Previews */}
            <div className="polar-panel border border-[#6EC5E9]/20 overflow-hidden shadow-2xl">
              {/* Tab Selector */}
              <div className="flex border-b border-[#6EC5E9]/15 overflow-x-auto bg-[#071A2B]/60 text-xs font-mono">
                {[
                  { id: 'instagram', label: 'Instagram Carousel', icon: InstagramIcon },
                  { id: 'x', label: 'X (Twitter) Brief', icon: TwitterIcon },
                  { id: 'linkedin', label: 'LinkedIn Article', icon: LinkedinIcon },
                  { id: 'website', label: 'Website Article', icon: FileText },
                  { id: 'youtube', label: 'YouTube Description', icon: YoutubeIcon },
                  { id: 'newsletter', label: 'Newsletter Explainer', icon: Mail },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-3 font-semibold flex items-center space-x-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-[#38BDF8] text-[#38BDF8] bg-[#0B2538]'
                          : 'border-transparent text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Box */}
              <div className="p-6">
                {activeTab === 'instagram' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono">
                      <span>Instagram Mobile Feed Preview (Card + Caption)</span>
                      <button
                        onClick={() => handleCopy(activeDraft.instagram_post, 'insta')}
                        className="flex items-center space-x-1 text-[#38BDF8] hover:underline"
                      >
                        {copiedKey === 'insta' ? <Check className="w-3.5 h-3.5 text-[#22C7A8]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'insta' ? 'Copied' : 'Copy Caption'}</span>
                      </button>
                    </div>

                    <div className="max-w-md mx-auto p-4 rounded-xl bg-[#051320] border border-[#6EC5E9]/20 font-sans text-xs space-y-3 shadow-xl">
                      <div className="flex items-center space-x-2 border-b border-[#6EC5E9]/10 pb-2">
                        <div className="w-7 h-7 rounded-full bg-[#38BDF8] flex items-center justify-center font-bold text-[#071A2B] text-[10px]">
                          NC
                        </div>
                        <div>
                          <div className="font-bold text-white text-[11px]">ncpor_india • Follow</div>
                          <div className="text-[10px] text-[#94A3B8]">Antarctica & Polar Sciences</div>
                        </div>
                      </div>

                      <div className="whitespace-pre-line text-[#CBD5E1] text-[11px] leading-relaxed">
                        {activeDraft.instagram_post}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'x' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono">
                      <span>X (Twitter) 280-Character Dispatch</span>
                      <button
                        onClick={() => handleCopy(activeDraft.x_post, 'x')}
                        className="flex items-center space-x-1 text-[#38BDF8] hover:underline"
                      >
                        {copiedKey === 'x' ? <Check className="w-3.5 h-3.5 text-[#22C7A8]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'x' ? 'Copied' : 'Copy Post'}</span>
                      </button>
                    </div>

                    <div className="max-w-lg mx-auto p-4 rounded-xl bg-[#051320] border border-[#6EC5E9]/20 text-xs space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-[#22C7A8] flex items-center justify-center font-bold text-[#071A2B] text-xs">
                          IN
                        </div>
                        <div>
                          <span className="font-bold text-white">NCPOR India</span>
                          <span className="text-[#94A3B8] ml-1.5">@NCPOR_GoI</span>
                        </div>
                      </div>
                      <p className="text-white text-xs leading-relaxed whitespace-pre-line">
                        {activeDraft.x_post}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'linkedin' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono">
                      <span>LinkedIn Institutional Post</span>
                      <button
                        onClick={() => handleCopy(activeDraft.linkedin_post, 'li')}
                        className="flex items-center space-x-1 text-[#38BDF8] hover:underline"
                      >
                        {copiedKey === 'li' ? <Check className="w-3.5 h-3.5 text-[#22C7A8]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'li' ? 'Copied' : 'Copy Post'}</span>
                      </button>
                    </div>

                    <div className="max-w-2xl mx-auto p-5 rounded-xl bg-[#051320] border border-[#6EC5E9]/20 text-xs space-y-3">
                      <div className="flex items-center space-x-2 border-b border-[#6EC5E9]/10 pb-2">
                        <div className="font-bold text-white text-xs">National Centre for Polar and Ocean Research (NCPOR)</div>
                      </div>
                      <div className="whitespace-pre-line text-[#CBD5E1] leading-relaxed">
                        {activeDraft.linkedin_post}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'website' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono">
                      <span>Website Markdown Article (Press Release)</span>
                      <button
                        onClick={() => handleCopy(activeDraft.website_article, 'web')}
                        className="flex items-center space-x-1 text-[#38BDF8] hover:underline"
                      >
                        {copiedKey === 'web' ? <Check className="w-3.5 h-3.5 text-[#22C7A8]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'web' ? 'Copied' : 'Copy Markdown'}</span>
                      </button>
                    </div>

                    <div className="max-w-3xl mx-auto p-6 rounded-xl bg-[#051320] border border-[#6EC5E9]/20 font-mono text-xs leading-relaxed whitespace-pre-line text-[#CBD5E1]">
                      {activeDraft.website_article}
                    </div>
                  </div>
                )}

                {activeTab === 'youtube' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono">
                      <span>YouTube Video Brief & Timestamps</span>
                      <button
                        onClick={() => handleCopy(activeDraft.youtube_description, 'yt')}
                        className="flex items-center space-x-1 text-[#38BDF8] hover:underline"
                      >
                        {copiedKey === 'yt' ? <Check className="w-3.5 h-3.5 text-[#22C7A8]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'yt' ? 'Copied' : 'Copy Description'}</span>
                      </button>
                    </div>

                    <div className="max-w-2xl mx-auto p-5 rounded-xl bg-[#051320] border border-[#6EC5E9]/20 font-mono text-xs whitespace-pre-line text-[#CBD5E1]">
                      {activeDraft.youtube_description}
                    </div>
                  </div>
                )}

                {activeTab === 'newsletter' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono">
                      <span>Student Hub & Newsletter Explainer</span>
                      <button
                        onClick={() => handleCopy(activeDraft.newsletter_summary, 'news')}
                        className="flex items-center space-x-1 text-[#38BDF8] hover:underline"
                      >
                        {copiedKey === 'news' ? <Check className="w-3.5 h-3.5 text-[#22C7A8]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'news' ? 'Copied' : 'Copy Text'}</span>
                      </button>
                    </div>

                    <div className="max-w-xl mx-auto p-5 rounded-xl bg-[#051320] border border-[#6EC5E9]/20 text-xs text-[#CBD5E1] whitespace-pre-line">
                      {activeDraft.newsletter_summary}
                    </div>
                  </div>
                )}
              </div>

              {/* Source Citations & Provenance Footnote */}
              <div className="p-4 bg-[#071A2B] border-t border-[#6EC5E9]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#94A3B8]">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#22C7A8]" />
                  <span className="font-semibold text-white">Source Material Citations:</span>
                  <span>{activeDraft.citations.map(c => `${c.source_field}: ${c.reference}`).join(' • ')}</span>
                </div>
                <span className="text-[10px] text-[#647887]">Deterministic Provenance Verified</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
