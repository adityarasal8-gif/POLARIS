import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Filter, ExternalLink, Quote, Copy, 
  Check, Download, Bookmark, Globe, Tag, Calendar, User, 
  FileText, ArrowRight, ChevronDown, ChevronUp, ShieldCheck,
  Sparkles, Award
} from 'lucide-react';
import { fetchPublications, fetchTopics } from '../api';
import { Publication, ScienceTopic } from '../types';

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [topics, setTopics] = useState<ScienceTopic[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  // Expanded abstract
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Citation Modal
  const [citationModalPub, setCitationModalPub] = useState<Publication | null>(null);
  const [citationFormat, setCitationFormat] = useState<'APA' | 'BibTeX' | 'RIS'>('APA');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [pubsData, topicsData] = await Promise.all([
          fetchPublications(),
          fetchTopics()
        ]);
        setPublications(pubsData);
        setTopics(topicsData);
      } catch (err: any) {
        console.error('Failed to load publications:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const regions = ['All', 'Antarctica', 'Arctic', 'Himalaya', 'Southern Ocean'];
  const years = ['All', '2025', '2024', '2023', '2022', '2021', '2020'];

  const filteredPublications = publications.filter(pub => {
    const matchesRegion = selectedRegion === 'All' || pub.region === selectedRegion;
    const matchesTopic = selectedTopic === 'All' || 
      (pub.research_topic && pub.research_topic.toLowerCase().includes(selectedTopic.toLowerCase())) || 
      ((pub as any).topic_ids && (pub as any).topic_ids.includes(selectedTopic));
    const matchesYear = selectedYear === 'All' || pub.year.toString() === selectedYear;
    const authorsStr = Array.isArray(pub.authors) ? pub.authors.join(', ') : (pub.authors || '');
    const matchesSearch = searchQuery === '' || 
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      authorsStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.journal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pub.doi && pub.doi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pub.abstract.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRegion && matchesTopic && matchesYear && matchesSearch;
  });

  const formatAuthors = (authors: any) => {
    if (Array.isArray(authors)) return authors.join(', ');
    return authors || 'NCPOR Scientific Division';
  };

  const generateCitation = (pub: Publication, format: 'APA' | 'BibTeX' | 'RIS') => {
    const authText = formatAuthors(pub.authors);
    if (format === 'APA') {
      return `${authText} (${pub.year}). ${pub.title}. ${pub.journal}. https://doi.org/${pub.doi || '10.5194/tc-ncpor'}`;
    }
    if (format === 'BibTeX') {
      const citeKey = authText.split(',')[0].replace(/[^a-zA-Z]/g, '') + pub.year;
      return `@article{${citeKey},
  title = {${pub.title}},
  author = {${authText}},
  journal = {${pub.journal}},
  year = {${pub.year}},
  doi = {${pub.doi || ''}},
  url = {https://doi.org/${pub.doi || '10.5194/ncpor'}}
}`;
    }
    return `TY  - JOUR
TI  - ${pub.title}
AU  - ${authText}
JO  - ${pub.journal}
PY  - ${pub.year}
DO  - ${pub.doi || ''}
UR  - https://doi.org/${pub.doi || '10.5194/ncpor'}
ER  - `;
  };

  const copyCitation = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const featuredPaper = publications[0];

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111111] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#111111] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Academic Library Header with Floating Scientific Perimeter Glyphs */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#F4F2EE] to-white p-8 sm:p-10 rounded-3xl border border-[#E8E6E0] shadow-sm">
          {/* Subtle Ambient Floating Background Glyphs */}
          <div className="absolute -top-4 -right-4 text-[#111111] opacity-15 pointer-events-none animate-subtle-drift">
            <BookOpen className="w-24 h-24 stroke-[1.2]" />
          </div>
          <div className="absolute top-1/2 -left-6 -translate-y-1/2 text-[#111111] opacity-12 pointer-events-none animate-subtle-drift-rev">
            <Sparkles className="w-20 h-20 stroke-[1.2]" />
          </div>
          <div className="absolute -bottom-6 right-1/4 text-[#111111] opacity-15 pointer-events-none animate-float-2">
            <Award className="w-20 h-20 stroke-[1.2]" />
          </div>
          <div className="absolute top-4 left-1/3 text-[#111111] opacity-10 pointer-events-none animate-slow-spin">
            <Globe className="w-28 h-28 stroke-[1]" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E8E6E0]">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#555558] bg-white px-3.5 py-1.5 rounded-full border border-[#E8E6E0] font-medium tracking-wide uppercase shadow-2xs">
                <BookOpen className="w-3.5 h-3.5 text-[#111111]" />
                <span>PEER-REVIEWED SCIENTIFIC LITERATURE · NCPOR REPOSITORY</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-medium text-[#111111] tracking-tight">
                Research from the polar frontier
              </h1>
              <p className="text-sm sm:text-base text-[#555558] max-w-3xl font-light leading-relaxed">
                Index of high-impact peer-reviewed publications, technical expedition reports, and international monographs authored by Indian polar scientists across Antarctica, the Arctic, and the Western Himalaya.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#555558] bg-white border border-[#E8E6E0] px-4 py-2 rounded-full shadow-2xs">
                <FileText className="w-4 h-4 text-[#111111]" />
                <span>{publications.length} Indexed Journal Studies</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#16A34A] bg-[#16A34A]/5 border border-[#16A34A]/20 px-3.5 py-2 rounded-full shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping-subtle" />
                <span className="font-semibold">98.4% Open Access</span>
              </div>
            </div>
          </div>

          {/* Interactive Scientific Domain Distribution Ribbon */}
          <div className="relative z-10 pt-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[#555558]">
              <span className="font-semibold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                Scientific Domain Allocation & Research Breadth
              </span>
              <span className="text-[#8E8E91] text-[11px]">Click segment to filter publications</span>
            </div>

            {/* Segmented Visual Ribbon */}
            <div className="h-3 w-full bg-[#E8E6E0] rounded-full overflow-hidden flex shadow-inner">
              <div 
                onClick={() => setSelectedRegion(selectedRegion === 'Antarctica' ? 'All' : 'Antarctica')}
                title="Cryosphere & Antarctica: 38%"
                className="bg-[#111111] hover:bg-[#2563EB] h-full transition-all duration-300 cursor-pointer" 
                style={{ width: '38%' }}
              />
              <div 
                onClick={() => setSelectedRegion(selectedRegion === 'Southern Ocean' ? 'All' : 'Southern Ocean')}
                title="Southern Ocean & Oceanography: 27%"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] h-full transition-all duration-300 cursor-pointer" 
                style={{ width: '27%' }}
              />
              <div 
                onClick={() => setSelectedRegion(selectedRegion === 'Arctic' ? 'All' : 'Arctic')}
                title="Arctic & Atmosphere: 21%"
                className="bg-[#059669] hover:bg-[#047857] h-full transition-all duration-300 cursor-pointer" 
                style={{ width: '21%' }}
              />
              <div 
                onClick={() => setSelectedRegion(selectedRegion === 'Himalaya' ? 'All' : 'Himalaya')}
                title="Himalayan Paleoclimate: 14%"
                className="bg-[#D97706] hover:bg-[#B45309] h-full transition-all duration-300 cursor-pointer" 
                style={{ width: '14%' }}
              />
            </div>

            {/* Domain Legend Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
              <button 
                onClick={() => setSelectedRegion(selectedRegion === 'Antarctica' ? 'All' : 'Antarctica')}
                className={`p-2 rounded-xl border flex items-center justify-between transition text-left cursor-pointer ${
                  selectedRegion === 'Antarctica' ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white/80 hover:bg-white border-[#E8E6E0] text-[#111111]'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-[#111111] shrink-0" />
                  <span className="truncate">Antarctica / Cryo</span>
                </div>
                <span className="text-[11px] opacity-75 font-semibold">38%</span>
              </button>

              <button 
                onClick={() => setSelectedRegion(selectedRegion === 'Southern Ocean' ? 'All' : 'Southern Ocean')}
                className={`p-2 rounded-xl border flex items-center justify-between transition text-left cursor-pointer ${
                  selectedRegion === 'Southern Ocean' ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'bg-white/80 hover:bg-white border-[#E8E6E0] text-[#111111]'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0" />
                  <span className="truncate">Southern Ocean</span>
                </div>
                <span className="text-[11px] opacity-75 font-semibold">27%</span>
              </button>

              <button 
                onClick={() => setSelectedRegion(selectedRegion === 'Arctic' ? 'All' : 'Arctic')}
                className={`p-2 rounded-xl border flex items-center justify-between transition text-left cursor-pointer ${
                  selectedRegion === 'Arctic' ? 'bg-[#059669] text-white border-[#059669]' : 'bg-white/80 hover:bg-white border-[#E8E6E0] text-[#111111]'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-[#059669] shrink-0" />
                  <span className="truncate">Arctic / Atmosphere</span>
                </div>
                <span className="text-[11px] opacity-75 font-semibold">21%</span>
              </button>

              <button 
                onClick={() => setSelectedRegion(selectedRegion === 'Himalaya' ? 'All' : 'Himalaya')}
                className={`p-2 rounded-xl border flex items-center justify-between transition text-left cursor-pointer ${
                  selectedRegion === 'Himalaya' ? 'bg-[#D97706] text-white border-[#D97706]' : 'bg-white/80 hover:bg-white border-[#E8E6E0] text-[#111111]'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-[#D97706] shrink-0" />
                  <span className="truncate">Himalaya / Cores</span>
                </div>
                <span className="text-[11px] opacity-75 font-semibold">14%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Academic Telemetry & Impact Ticker */}
        <div className="bg-[#111111] text-white px-5 py-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span className="text-[#A1A1AA] uppercase tracking-wider text-[11px]">SCIENTIFIC CITATION TELEMETRY</span>
            <span className="hidden md:inline text-white/30">|</span>
            <span className="hidden md:inline text-white/90">H-Index: 42 · 18,940 Total Impact Citations across SCAR & IASC</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#A1A1AA]">
            <span>COPE Compliant</span>
            <span>·</span>
            <span>Crossref Indexed</span>
            <span>·</span>
            <span className="text-white font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
              DOIs Active
            </span>
          </div>
        </div>

        {/* Featured Paper Section with Spring Physics */}
        {featuredPaper && !searchQuery && selectedRegion === 'All' && (
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E8E6E0] shadow-sm space-y-4 card-hover-spring relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#2563EB]/10 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-[#F4F2EE] text-[#111111] border border-[#E8E6E0] font-semibold uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-ping-subtle" />
                FLAGSHIP STUDY · {featuredPaper.journal} ({featuredPaper.year})
              </span>
              <span className="text-[#8E8E91]">DOI: {featuredPaper.doi}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#111111] leading-snug">
              {featuredPaper.title}
            </h2>

            <div className="text-xs font-mono text-[#555558]">
              {formatAuthors(featuredPaper.authors)}
            </div>

            <p className="text-sm text-[#555558] font-light leading-relaxed">
              {featuredPaper.abstract}
            </p>

            <div className="pt-3 border-t border-[#E8E6E0] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#555558]">
                <span>Cited by <strong className="text-[#111111]">{featuredPaper.citation_count}</strong> studies</span>
                <span>·</span>
                <span className="text-[#16A34A] font-semibold">Open Access PDF Available</span>
              </div>

              <button
                onClick={() => setCitationModalPub(featuredPaper)}
                className="px-5 py-2.5 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-mono font-medium flex items-center gap-1.5 transition shadow-sm"
              >
                <Quote className="w-3.5 h-3.5 text-white" />
                <span>Export Formatted Citation</span>
              </button>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-[#F4F2EE] p-4 sm:p-5 rounded-2xl border border-[#E8E6E0] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E91]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, journal, or DOI..."
              className="w-full pl-10 pr-3 py-2 rounded-full bg-white border border-[#E8E6E0] text-xs text-[#111111] placeholder-[#8E8E91] focus:outline-none focus:border-[#111111] font-sans shadow-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#555558]">
            {/* Region Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-[#8E8E91]">Region:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-white border border-[#E8E6E0] text-[#111111] rounded-full px-3 py-1.5 focus:outline-none shadow-xs cursor-pointer"
              >
                {regions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Year Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-[#8E8E91]">Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white border border-[#E8E6E0] text-[#111111] rounded-full px-3 py-1.5 focus:outline-none shadow-xs cursor-pointer"
              >
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Publications Academic List */}
        {loading ? (
          <div className="py-24 text-center space-y-3 bg-white rounded-2xl border border-[#E8E6E0] shadow-sm">
            <div className="w-7 h-7 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-[#8E8E91]">Searching polar publication registries...</p>
          </div>
        ) : filteredPublications.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-[#E8E6E0] p-8 shadow-sm">
            <p className="text-sm text-[#555558]">No publications match your search query.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPublications.map((pub) => {
              const isExpanded = expandedId === pub.id;
              return (
                <div
                  key={pub.id}
                  className="bg-white border border-[#E8E6E0] hover:border-[#111111]/40 rounded-3xl p-6 sm:p-7 shadow-sm space-y-3 card-hover-spring transition-all duration-300 relative group overflow-hidden"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-[#111111] bg-[#F4F2EE] px-2.5 py-1 rounded-full border border-[#E8E6E0] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                        {pub.journal}
                      </span>
                      <span className="text-[#8E8E91]">({pub.year})</span>
                      <span className="hidden sm:inline text-[#8E8E91]">·</span>
                      <span className="hidden sm:inline text-[#2563EB] font-medium text-[11px] bg-[#2563EB]/5 px-2 py-0.5 rounded-full">
                        Q1 High-Impact
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#8E8E91]">~6 min read</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F4F2EE] text-[#555558] border border-[#E8E6E0] font-medium">
                        {pub.region}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-serif font-medium text-[#111111] group-hover:text-[#2563EB] transition-colors leading-snug">
                    {pub.title}
                  </h3>

                  <div className="text-xs font-mono text-[#555558] flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#8E8E91] shrink-0" />
                    <span>{formatAuthors(pub.authors)}</span>
                  </div>

                  {isExpanded && (
                    <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E8E6E0] text-xs sm:text-sm text-[#555558] leading-relaxed font-light mt-3 animate-fade-in-up">
                      <div className="flex items-center justify-between border-b border-[#E8E6E0] pb-2 mb-3">
                        <strong className="text-[11px] font-mono text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                          Official Scientific Abstract & Methodology
                        </strong>
                        <span className="text-[11px] font-mono text-[#16A34A] font-semibold">Peer-Reviewed & Archived</span>
                      </div>
                      <p>{pub.abstract}</p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#E8E6E0] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#555558]">
                    <div className="flex items-center space-x-4">
                      <span>DOI: <strong className="text-[#111111]">{pub.doi}</strong></span>
                      <span>Cited: <strong className="text-[#111111]">{pub.citation_count}</strong> times</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : pub.id)}
                        className="px-3.5 py-1.5 rounded-full bg-[#F4F2EE] hover:bg-[#E8E6E0] text-xs font-medium text-[#111111] flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide Abstract' : 'Read Abstract'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => setCitationModalPub(pub)}
                        className="px-4 py-1.5 rounded-full bg-[#111111] hover:bg-[#2563EB] text-white text-xs font-mono flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                      >
                        <Quote className="w-3.5 h-3.5 text-white" />
                        <span>Cite Study</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Citation Modal */}
        {citationModalPub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 space-y-5 border border-[#E8E6E0] shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E8E6E0] pb-3">
                <div className="flex items-center space-x-2 text-xs font-mono text-[#111111] font-semibold">
                  <Quote className="w-4 h-4" />
                  <span>CITATION GENERATOR</span>
                </div>
                <button
                  onClick={() => setCitationModalPub(null)}
                  className="p-1 rounded-full text-[#8E8E91] hover:text-[#111111] hover:bg-[#F4F2EE]"
                >
                  ✕
                </button>
              </div>

              <div>
                <h4 className="text-base font-serif font-medium text-[#111111]">
                  {citationModalPub.title}
                </h4>
                <span className="text-xs text-[#8E8E91] font-mono block mt-1">
                  {citationModalPub.journal} ({citationModalPub.year})
                </span>
              </div>

              {/* Format Switcher */}
              <div className="flex items-center space-x-2 bg-[#F4F2EE] p-1 rounded-full border border-[#E8E6E0]">
                {(['APA', 'BibTeX', 'RIS'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setCitationFormat(fmt)}
                    className={`flex-1 py-1.5 rounded-full text-xs font-mono transition ${
                      citationFormat === fmt ? 'bg-white text-[#111111] font-semibold shadow-xs' : 'text-[#555558]'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              {/* Citation Output Box */}
              <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E6E0] font-mono text-xs text-[#111111] whitespace-pre-wrap leading-relaxed select-all">
                {generateCitation(citationModalPub, citationFormat)}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => copyCitation(generateCitation(citationModalPub, citationFormat))}
                  className="px-5 py-2.5 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-mono font-medium flex items-center gap-1.5 transition shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Citation'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
