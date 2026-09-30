import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Filter, ExternalLink, Quote, Copy, 
  Check, Download, Bookmark, Globe, Tag, Calendar, User, 
  Sparkles, ShieldCheck, ChevronDown, ChevronUp, FileText
} from 'lucide-react';
import { fetchPublications, fetchTopics } from '../api';
import { Publication, ScienceTopic } from '../types';

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [topics, setTopics] = useState<ScienceTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(err.message || 'Failed to load scientific publications');
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
      return `${authText} (${pub.year}). ${pub.title}. ${pub.journal}. https://doi.org/${pub.doi || '10.5194/tc-demo-ncpor'}`;
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

  return (
    <div className="min-h-screen bg-[#071A2B] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Breadcrumb & Header */}
        <div className="border-b border-white/10 pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <span>Archive</span>
            <span>/</span>
            <span>Scientific Knowledge</span>
            <span>/</span>
            <span className="text-white">Publications</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Peer-Reviewed Publications
              </h1>
              <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-3xl">
                Comprehensive catalogue of peer-reviewed research papers, monographs, and scientific communications produced by Indian scientists across Antarctic, Arctic, Himalayan, and Southern Ocean expeditions.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto bg-[#0B2538] border border-cyan-500/20 px-3 py-1.5 rounded text-xs font-mono text-cyan-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>NCPOR Curated Repository</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#0B2538] border border-white/10 rounded-lg p-4 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search publications by title, author, journal, or DOI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#071A2B] border border-white/10 rounded pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* Region Filter */}
            <div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-[#071A2B] border border-white/10 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                {regions.map(r => (
                  <option key={r} value={r}>Region: {r}</option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-[#071A2B] border border-white/10 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                {years.map(y => (
                  <option key={y} value={y}>Year: {y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Topics Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs">
            <span className="text-slate-400 flex items-center gap-1 shrink-0 font-mono">
              <Tag className="w-3 h-3 text-cyan-400" /> Topic:
            </span>
            <button
              onClick={() => setSelectedTopic('All')}
              className={`px-2.5 py-1 rounded text-xs transition shrink-0 ${
                selectedTopic === 'All'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              All Topics
            </button>
            {topics.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className={`px-2.5 py-1 rounded text-xs transition shrink-0 ${
                  selectedTopic === t.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span>Found {filteredPublications.length} peer-reviewed publications</span>
          <span>Showing records from Indian Polar Research Archive</span>
        </div>

        {/* Publications List */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 text-sm font-mono">Accessing NCPOR publications archive...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-lg text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : filteredPublications.length === 0 ? (
          <div className="bg-[#0B2538] border border-white/10 rounded-lg p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-semibold text-slate-200">No matching publications found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try adjusting your search criteria, clearing region or topic filters, or searching for broader keywords like "ozone", "glacier", or "biogeochemistry".
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPublications.map(pub => {
              const isExpanded = expandedId === pub.id;
              return (
                <div 
                  key={pub.id}
                  className="bg-[#0B2538]/90 border border-white/10 hover:border-cyan-500/30 rounded-lg p-5 transition space-y-4 shadow-lg group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 font-mono">
                          {pub.region}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-mono">
                          {pub.year}
                        </span>
                        {((pub as any).peer_reviewed ?? true) && (
                          <span className="px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            Peer-Reviewed
                          </span>
                        )}
                        {pub.doi && (
                          <span className="text-[11px] font-mono text-slate-400">
                            DOI: {pub.doi}
                          </span>
                        )}
                      </div>
                      
                      <h2 className="text-lg sm:text-xl font-serif font-semibold text-white group-hover:text-cyan-200 transition">
                        {pub.title}
                      </h2>
                      
                      <p className="text-xs sm:text-sm text-cyan-400/90 font-medium">
                        {formatAuthors(pub.authors)}
                      </p>

                      <p className="text-xs text-slate-400 font-mono">
                        Published in <span className="text-slate-200 italic">{pub.journal}</span>
                        {pub.volume_issue && `, ${pub.volume_issue}`}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setCitationModalPub(pub);
                          setCopied(false);
                        }}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs text-slate-200 flex items-center gap-1.5 transition"
                        title="Generate formatted academic citation"
                      >
                        <Quote className="w-3.5 h-3.5 text-amber-400" />
                        <span>Cite</span>
                      </button>

                      {pub.doi && (
                        <a
                          href={(pub as any).source_url || `https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300 rounded text-xs flex items-center gap-1.5 transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Publisher</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Abstract Section */}
                  <div className="text-xs sm:text-sm text-slate-300 bg-[#071A2B]/60 p-3.5 rounded border border-white/5">
                    <p className={isExpanded ? '' : 'line-clamp-2'}>
                      {pub.abstract}
                    </p>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : pub.id)}
                      className="mt-2 text-cyan-400 hover:text-cyan-300 text-xs font-mono flex items-center gap-1 transition"
                    >
                      {isExpanded ? (
                        <>Show Less <ChevronUp className="w-3 h-3" /></>
                      ) : (
                        <>Read Full Abstract <ChevronDown className="w-3 h-3" /></>
                      )}
                    </button>
                  </div>

                  {/* Metadata and Citations count */}
                  <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-1 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      {pub.citation_count !== undefined && (
                        <span className="flex items-center gap-1 text-slate-300">
                          <Bookmark className="w-3 h-3 text-cyan-400" />
                          {pub.citation_count} Citations
                        </span>
                      )}
                      {pub.expedition_id && (
                        <a 
                          href={`/expeditions/${pub.expedition_id}`}
                          className="text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <Globe className="w-3 h-3" />
                          Linked Expedition
                        </a>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Provenance: {(pub as any).source_name || 'NCPOR Research Archive'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Citation Modal */}
      {citationModalPub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B2538] border border-cyan-500/30 rounded-lg max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Quote className="w-4 h-4 text-amber-400" />
                  Generate Citation
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {citationModalPub.title}
                </p>
              </div>
              <button
                onClick={() => setCitationModalPub(null)}
                className="text-slate-400 hover:text-white text-sm font-mono px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Format Selector */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Format:</span>
              {(['APA', 'BibTeX', 'RIS'] as const).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setCitationFormat(fmt)}
                  className={`px-3 py-1 rounded transition ${
                    citationFormat === fmt
                      ? 'bg-cyan-500 text-black font-semibold'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {/* Text Preview */}
            <div className="relative bg-[#071A2B] border border-white/10 rounded p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-48 whitespace-pre-wrap">
              {generateCitation(citationModalPub, citationFormat)}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 font-mono">
                Standard academic citation format
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyCitation(generateCitation(citationModalPub, citationFormat))}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-medium flex items-center gap-1.5 transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      Copied to Clipboard
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Citation
                    </>
                  )}
                </button>
                <button
                  onClick={() => setCitationModalPub(null)}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
