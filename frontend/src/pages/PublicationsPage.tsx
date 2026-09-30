import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Filter, ExternalLink, Quote, Copy, 
  Check, Download, Bookmark, Globe, Tag, Calendar, User, 
  FileText, ArrowRight, ChevronDown, ChevronUp, ShieldCheck
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
    <div className="min-h-screen bg-[#F7F8F5] text-[#10212B] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#74B8CC]/30 selection:text-[#07151F]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Academic Library Header */}
        <div className="border-b border-[#0D2735]/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#D7A75D] font-bold tracking-wider uppercase">
              <BookOpen className="w-4 h-4 text-[#D7A75D]" />
              <span>PEER-REVIEWED SCIENTIFIC LITERATURE · NCPOR REPOSITORY</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#10212B] tracking-tight">
              Research from the polar frontier
            </h1>
            <p className="text-sm sm:text-base text-[#61747E] max-w-3xl font-light">
              Index of high-impact peer-reviewed publications, technical expedition reports, and international monographs authored by Indian polar scientists.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-[#61747E] bg-white border border-[#0D2735]/10 px-4 py-2.5 rounded-xl shadow-sm">
            <FileText className="w-4 h-4 text-[#74B8CC]" />
            <span>{publications.length} Indexed Journal Studies</span>
          </div>
        </div>

        {/* Featured Paper Section */}
        {featuredPaper && !searchQuery && selectedRegion === 'All' && (
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#0D2735]/10 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="px-3 py-1 rounded bg-[#D7A75D]/15 text-[#D7A75D] border border-[#D7A75D]/30 font-semibold uppercase">
                FLAGSHIP STUDY · {featuredPaper.journal} ({featuredPaper.year})
              </span>
              <span className="text-[#61747E]">DOI: {featuredPaper.doi}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#10212B] leading-snug">
              {featuredPaper.title}
            </h2>

            <div className="text-xs font-mono text-[#61747E]">
              {formatAuthors(featuredPaper.authors)}
            </div>

            <p className="text-sm text-[#61747E] font-light leading-relaxed">
              {featuredPaper.abstract}
            </p>

            <div className="pt-3 border-t border-[#0D2735]/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#61747E]">
                <span>Cited by <strong className="text-[#10212B]">{featuredPaper.citation_count}</strong> studies</span>
                <span>·</span>
                <span className="text-[#5BB7A5] font-semibold">Open Access PDF Available</span>
              </div>

              <button
                onClick={() => setCitationModalPub(featuredPaper)}
                className="px-4 py-2 rounded-lg bg-[#0D2735] hover:bg-[#143547] text-white text-xs font-mono flex items-center gap-1.5 transition"
              >
                <Quote className="w-3.5 h-3.5 text-[#74B8CC]" />
                <span>Export Formatted Citation</span>
              </button>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-[#0D2735]/10 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#61747E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, journal, or DOI..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F7F8F5] border border-[#0D2735]/15 text-xs text-[#10212B] placeholder-[#8E9EA7] focus:outline-none focus:border-[#133447]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#61747E]">
            {/* Region Filter */}
            <div className="flex items-center space-x-2">
              <span>Region:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-[#F7F8F5] border border-[#0D2735]/15 text-[#10212B] rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                {regions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Year Filter */}
            <div className="flex items-center space-x-2">
              <span>Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-[#F7F8F5] border border-[#0D2735]/15 text-[#10212B] rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Publications Academic List */}
        {loading ? (
          <div className="py-24 text-center space-y-3 bg-white rounded-2xl border border-[#0D2735]/10">
            <div className="w-7 h-7 border-2 border-[#0D2735] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-[#61747E]">Searching polar publication registries...</p>
          </div>
        ) : filteredPublications.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-[#0D2735]/10 p-8">
            <p className="text-sm text-[#61747E]">No publications match your search query.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPublications.map((pub) => {
              const isExpanded = expandedId === pub.id;
              return (
                <div
                  key={pub.id}
                  className="bg-white border border-[#0D2735]/10 rounded-2xl p-6 sm:p-7 shadow-sm space-y-3 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[#133447]">{pub.journal}</span>
                      <span className="text-[#8E9EA7]">({pub.year})</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-[#F7F8F5] text-[#61747E] border border-[#0D2735]/10">
                      {pub.region}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#10212B] leading-snug">
                    {pub.title}
                  </h3>

                  <div className="text-xs font-mono text-[#61747E]">
                    {formatAuthors(pub.authors)}
                  </div>

                  {isExpanded && (
                    <div className="p-4 rounded-xl bg-[#F7F8F5] border border-[#0D2735]/10 text-xs sm:text-sm text-[#10212B] leading-relaxed font-light mt-3">
                      <strong className="block text-[11px] font-mono text-[#61747E] uppercase mb-1">Abstract:</strong>
                      {pub.abstract}
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#0D2735]/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#61747E]">
                    <div className="flex items-center space-x-4">
                      <span>DOI: <strong className="text-[#10212B]">{pub.doi}</strong></span>
                      <span>Cited: <strong className="text-[#10212B]">{pub.citation_count}</strong></span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : pub.id)}
                        className="text-xs font-bold text-[#133447] hover:underline flex items-center gap-1"
                      >
                        <span>{isExpanded ? 'Hide Abstract' : 'Read Abstract'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => setCitationModalPub(pub)}
                        className="px-3 py-1.5 rounded-lg bg-[#F7F8F5] hover:bg-[#EAEAEA] border border-[#0D2735]/15 text-[#10212B] text-xs font-mono flex items-center gap-1.5 transition"
                      >
                        <Quote className="w-3.5 h-3.5 text-[#D7A75D]" />
                        <span>Cite</span>
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
            <div className="w-full max-w-xl bg-white rounded-2xl p-6 sm:p-8 space-y-5 border border-[#0D2735]/20 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#0D2735]/10 pb-3">
                <div className="flex items-center space-x-2 text-xs font-mono text-[#D7A75D] font-bold">
                  <Quote className="w-4 h-4" />
                  <span>CITATION GENERATOR</span>
                </div>
                <button
                  onClick={() => setCitationModalPub(null)}
                  className="text-[#61747E] hover:text-[#10212B] text-sm"
                >
                  ✕
                </button>
              </div>

              <div>
                <h4 className="text-sm font-serif font-bold text-[#10212B]">
                  {citationModalPub.title}
                </h4>
                <span className="text-xs text-[#61747E] font-mono block mt-1">
                  {citationModalPub.journal} ({citationModalPub.year})
                </span>
              </div>

              {/* Format Switcher */}
              <div className="flex items-center space-x-2 bg-[#F7F8F5] p-1.5 rounded-lg border border-[#0D2735]/10">
                {(['APA', 'BibTeX', 'RIS'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setCitationFormat(fmt)}
                    className={`flex-1 py-1.5 rounded text-xs font-mono transition ${
                      citationFormat === fmt ? 'bg-[#0D2735] text-white font-bold' : 'text-[#61747E]'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              {/* Citation Output Box */}
              <div className="p-4 rounded-xl bg-[#F7F8F5] border border-[#0D2735]/10 font-mono text-xs text-[#10212B] whitespace-pre-wrap leading-relaxed select-all">
                {generateCitation(citationModalPub, citationFormat)}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => copyCitation(generateCitation(citationModalPub, citationFormat))}
                  className="px-4 py-2 rounded-lg bg-[#0D2735] hover:bg-[#143547] text-white text-xs font-mono flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
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
