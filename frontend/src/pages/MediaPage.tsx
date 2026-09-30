import React, { useState, useEffect } from 'react';
import { 
  Camera, Video, Search, Filter, ShieldCheck, Download, 
  ExternalLink, Calendar, MapPin, Tag, Compass, Maximize2, 
  X, Info, Layers, Film
} from 'lucide-react';
import { fetchMedia, fetchStations, fetchExpeditions } from '../api';
import { MediaAsset, Station, Expedition } from '../types';

export default function MediaPage() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tabs: all, photo, video
  const [activeTab, setActiveTab] = useState<'all' | 'photo' | 'video'>('all');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedStation, setSelectedStation] = useState('All');
  const [selectedExpedition, setSelectedExpedition] = useState('All');

  // Lightbox Modal
  const [lightboxAsset, setLightboxAsset] = useState<MediaAsset | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [mediaData, stationsData, expeditionsData] = await Promise.all([
          fetchMedia(),
          fetchStations(),
          fetchExpeditions()
        ]);
        setMedia(mediaData);
        setStations(stationsData);
        setExpeditions(expeditionsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load polar media assets');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const regions = ['All', 'Antarctica', 'Arctic', 'Himalaya', 'Southern Ocean'];

  const filteredMedia = media.filter(item => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesRegion = selectedRegion === 'All' || item.region === selectedRegion;
    const matchesStation = selectedStation === 'All' || item.station_id === selectedStation;
    const matchesExpedition = selectedExpedition === 'All' || item.expedition_id === selectedExpedition;
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.credit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesTab && matchesRegion && matchesStation && matchesExpedition && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#071A2B] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Breadcrumb */}
        <div className="border-b border-white/10 pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <span>Archive</span>
            <span>/</span>
            <span>Digital Repository</span>
            <span>/</span>
            <span className="text-white">Media Dissemination</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Polar Scientific Media Gallery
              </h1>
              <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-3xl">
                High-resolution photographic records, field imagery, and documentary videos of India's expeditions across the cryosphere. All assets curated with verified scientific provenance and attribution.
              </p>
            </div>
            
            <div className="flex items-center gap-2 self-start md:self-auto bg-[#0B2538] border border-cyan-500/20 px-3 py-1.5 rounded text-xs font-mono text-cyan-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Authentic Scientific Photography</span>
            </div>
          </div>
        </div>

        {/* Media Policy / Attribution Notice */}
        <div className="bg-[#0B2538]/60 border border-cyan-500/20 rounded-lg p-3 sm:p-4 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Authenticity Assurance:</strong> All media records are sourced from verified scientific repositories (NASA Earth Observatory, NCPOR Media Archives, and Wikimedia Commons open licences). No AI-generated photography is permitted.
            </span>
          </div>
          <span className="hidden sm:inline-block font-mono text-[11px] text-cyan-400/80 shrink-0">
            Open Access / Attribution
          </span>
        </div>

        {/* Tab & Filter Bar */}
        <div className="bg-[#0B2538] border border-white/10 rounded-lg p-4 space-y-4 shadow-xl">
          {/* Media Type Tabs */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-3">
            <div className="flex items-center gap-1.5 bg-[#071A2B] p-1 rounded-md border border-white/5">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition ${
                  activeTab === 'all'
                    ? 'bg-cyan-500 text-black font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                All Assets ({media.length})
              </button>
              <button
                onClick={() => setActiveTab('photo')}
                className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition ${
                  activeTab === 'photo'
                    ? 'bg-cyan-500 text-black font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                Photographs ({media.filter(m => m.type === 'photo').length})
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition ${
                  activeTab === 'video'
                    ? 'bg-cyan-500 text-black font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                Videos ({media.filter(m => m.type === 'video').length})
              </button>
            </div>

            <div className="text-xs font-mono text-slate-400">
              Showing {filteredMedia.length} of {media.length} items
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search captions, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#071A2B] border border-white/10 rounded pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Region */}
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

            {/* Station */}
            <div>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="w-full bg-[#071A2B] border border-white/10 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="All">All Stations</option>
                {stations.map(s => (
                  <option key={s.id} value={s.id}>Station: {s.name}</option>
                ))}
              </select>
            </div>

            {/* Expedition */}
            <div>
              <select
                value={selectedExpedition}
                onChange={(e) => setSelectedExpedition(e.target.value)}
                className="w-full bg-[#071A2B] border border-white/10 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="All">All Expeditions</option>
                {expeditions.map(exp => (
                  <option key={exp.id} value={exp.id}>{exp.code} - {exp.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 text-sm font-mono">Loading polar media collection...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-lg text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="bg-[#0B2538] border border-white/10 rounded-lg p-12 text-center space-y-3">
            <Camera className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-semibold text-slate-200">No media matches this filter</h3>
            <p className="text-xs text-slate-400">
              Clear your search or select a different region/station.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map(item => (
              <div 
                key={item.id}
                onClick={() => setLightboxAsset(item)}
                className="group bg-[#0B2538] border border-white/10 hover:border-cyan-500/40 rounded-lg overflow-hidden flex flex-col transition cursor-pointer shadow-lg hover:shadow-2xl"
              >
                {/* Media Image / Thumbnail */}
                <div className="relative aspect-[16/10] bg-[#071A2B] overflow-hidden">
                  <img 
                    src={item.thumbnail_url || item.media_url} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2538] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition"></div>

                  {/* Type Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono flex items-center gap-1">
                      {item.type === 'video' ? (
                        <>
                          <Film className="w-3 h-3 text-cyan-400" /> Video
                        </>
                      ) : (
                        <>
                          <Camera className="w-3 h-3 text-amber-400" /> Photo
                        </>
                      )}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono">
                      {item.region}
                    </span>
                  </div>

                  {/* Expand icon on hover */}
                  <div className="absolute bottom-2.5 right-2.5 p-1.5 rounded-full bg-black/60 text-white/80 group-hover:text-cyan-400 group-hover:scale-110 transition">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {item.caption}
                    </p>
                  </div>

                  {/* Attribution & Provenance Footer */}
                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span className="truncate max-w-[180px]">
                        Credit: {item.credit}
                      </span>
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Source: {item.source}</span>
                      <span className="text-cyan-400/80">{item.license}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox / Video Modal */}
      {lightboxAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0B2538] border border-cyan-500/40 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase">
                  {lightboxAsset.region}
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-white">
                  {lightboxAsset.title}
                </h3>
              </div>
              <button
                onClick={() => setLightboxAsset(null)}
                className="p-1 rounded text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Display Area */}
            <div className="bg-black/90 flex items-center justify-center min-h-[300px] max-h-[500px] overflow-hidden">
              {lightboxAsset.type === 'video' ? (
                lightboxAsset.media_url.includes('youtube.com') || lightboxAsset.media_url.includes('youtu.be') ? (
                  <iframe
                    src={lightboxAsset.media_url}
                    title={lightboxAsset.title}
                    className="w-full aspect-video max-h-[480px]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video 
                    controls 
                    className="max-h-[480px] w-full"
                    src={lightboxAsset.media_url}
                  >
                    Your browser does not support the video tag.
                  </video>
                )
              ) : (
                <img
                  src={lightboxAsset.media_url}
                  alt={lightboxAsset.title}
                  className="max-h-[480px] w-auto max-w-full object-contain"
                />
              )}
            </div>

            {/* Metadata and Provenance */}
            <div className="p-5 space-y-4 bg-[#0B2538]">
              <div className="space-y-1">
                <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400">Scientific Description</h4>
                <p className="text-sm text-slate-200">{lightboxAsset.caption}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#071A2B] p-3 rounded border border-white/5 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">RECORDED DATE</span>
                  <span className="text-slate-200">{lightboxAsset.date || 'Expedition Archive'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CREDIT / CREATOR</span>
                  <span className="text-slate-200">{lightboxAsset.credit}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ORGANISATION</span>
                  <span className="text-slate-200">{lightboxAsset.source}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">LICENCE</span>
                  <span className="text-cyan-400">{lightboxAsset.license}</span>
                </div>
              </div>

              {/* Tags */}
              {lightboxAsset.tags && lightboxAsset.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  {lightboxAsset.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-mono text-[11px]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-[11px] text-slate-400 font-mono">
                  Verified NCPOR / Polar Science Repository Asset
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={lightboxAsset.media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-medium flex items-center gap-1.5 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Original
                  </a>
                  <button
                    onClick={() => setLightboxAsset(null)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded text-xs transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
