import React, { useState, useEffect, useCallback } from 'react';
import { 
  Camera, Image as ImageIcon, Film, Filter, 
  Download, Maximize2, ShieldCheck, X, ArrowUpRight,
  Sparkles, Globe, ChevronLeft, ChevronRight, Eye, Sliders, Info
} from 'lucide-react';
import { fetchMedia } from '../api';
import { MediaAsset } from '../types';

export default function MediaPage() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'photo' | 'video'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [filmstripIndex, setFilmstripIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchMedia({
      type: activeTab === 'all' ? undefined : activeTab,
      region: selectedRegion === 'All' ? undefined : selectedRegion
    })
      .then((data) => {
        setMedia(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Media fetch error:', err);
        setLoading(false);
      });
  }, [activeTab, selectedRegion]);

  const regions = ['All', 'Antarctica', 'Arctic', 'Himalaya', 'Southern Ocean'];

  const filteredMedia = media.filter((item) => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesRegion = selectedRegion === 'All' || item.region === selectedRegion;
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.credit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesTab && matchesRegion && matchesSearch;
  });

  const activeLightboxItem = lightboxIndex !== null && filteredMedia[lightboxIndex] 
    ? filteredMedia[lightboxIndex] 
    : null;

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (lightboxIndex === null) return;
    if (e.key === 'Escape') {
      setLightboxIndex(null);
    } else if (e.key === 'ArrowRight') {
      setLightboxIndex((prev) => (prev !== null && prev < filteredMedia.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowLeft') {
      setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredMedia.length - 1));
    }
  }, [lightboxIndex, filteredMedia.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Featured highlights for the animated filmstrip
  const filmstripItems = media.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111111] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#111111] selection:text-white relative overflow-hidden">
      
      {/* Ambient Floating Scientific & Photographic Perimeter Glyphs */}
      <div className="absolute top-12 left-8 text-[#111111]/8 pointer-events-none select-none animate-float-1 z-0 hidden lg:block">
        <Camera className="w-24 h-24 stroke-[1.2]" />
      </div>
      <div className="absolute top-20 right-12 text-[#111111]/8 pointer-events-none select-none animate-float-2 z-0 hidden lg:block">
        <Film className="w-20 h-20 stroke-[1.2]" />
      </div>
      <div className="absolute top-72 right-1/4 text-[#111111]/6 pointer-events-none select-none animate-subtle-drift z-0 hidden md:block">
        <Sparkles className="w-16 h-16 stroke-[1.2]" />
      </div>
      <div className="absolute top-96 left-16 text-[#111111]/6 pointer-events-none select-none animate-subtle-drift-rev z-0 hidden md:block">
        <Globe className="w-28 h-28 stroke-[1.1]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Gallery Header */}
        <div className="border-b border-[#E8E6E0] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#555558] bg-[#F4F2EE] px-3 py-1 rounded-full border border-[#E8E6E0] font-medium tracking-wide uppercase shadow-xs">
              <Camera className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>OFFICIAL SCIENTIFIC PHOTOGRAPHY & FOOTAGE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-medium text-[#111111] tracking-tight">
              The Polar Photographic Archive
            </h1>
            <p className="text-sm sm:text-base text-[#555558] max-w-3xl font-light leading-relaxed">
              High-resolution photographic documentation and field video from Indian scientific deployments across the cryosphere. Strictly authentic photography with verified institutional provenance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#111111] bg-white border border-[#E8E6E0] px-3.5 py-2 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping-subtle" />
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span className="font-semibold">Zero AI-Generated Media</span>
            </div>
            <div className="text-xs font-mono text-[#555558] bg-[#F4F2EE] border border-[#E8E6E0] px-3.5 py-2 rounded-full">
              <span>NCPOR Visual Registry</span>
            </div>
          </div>
        </div>

        {/* Live Field Optics & Telemetry Banner */}
        <div className="bg-white border border-[#E8E6E0] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-[#F4F2EE] border border-[#E8E6E0] flex items-center justify-center shrink-0">
              <div className="flex items-end gap-0.5 h-4">
                <span className="w-1 bg-[#2563EB] rounded-full animate-wave-bar-1" />
                <span className="w-1 bg-[#2563EB] rounded-full animate-wave-bar-2" />
                <span className="w-1 bg-[#2563EB] rounded-full animate-wave-bar-3" />
                <span className="w-1 bg-[#2563EB] rounded-full animate-wave-bar-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#111111] tracking-wide uppercase">
                  FIELD OPTICS TELEMETRY STREAM
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-[10px] font-mono font-bold">
                  ACTIVE FEED
                </span>
              </div>
              <p className="text-xs text-[#555558] font-mono">
                Maitri All-Sky Optical Aurora Imager online · Ny-Ålesund High-Latitude Daylight Tracker Synced · 100% Institutional Credits
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto text-xs font-mono text-[#555558]">
            <span className="px-2.5 py-1 rounded-full bg-[#F4F2EE] border border-[#E8E6E0]">
              Assets: <strong className="text-[#111111]">{media.length} items</strong>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#F4F2EE] border border-[#E8E6E0]">
              License: <strong className="text-[#111111]">CC-BY-NC 4.0</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Curated Polar Lens Filmstrip Reel */}
        {filmstripItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#8E8E91]">
              <span className="flex items-center gap-1.5 uppercase tracking-wider font-semibold text-[#111111]">
                <Film className="w-3.5 h-3.5 text-[#2563EB]" />
                Curated Field Lens Filmstrip
              </span>
              <span>Click any frame for high-resolution inspection</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {filmstripItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => {
                    const foundIndex = filteredMedia.findIndex(m => m.id === item.id);
                    if (foundIndex !== -1) setLightboxIndex(foundIndex);
                  }}
                  className="group relative rounded-xl overflow-hidden border border-[#E8E6E0] bg-[#111111] aspect-[16/10] cursor-pointer card-hover-spring shadow-2xs"
                >
                  <img
                    src={item.thumbnail_url || item.media_url}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-108 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-white/90">
                    <span className="truncate font-medium">{item.region}</span>
                    <span className="text-[#60A5FA] font-bold">0{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter & Media Type Bar */}
        <div className="bg-[#F4F2EE] p-4 sm:p-5 rounded-2xl border border-[#E8E6E0] flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          {/* Tabs */}
          <div className="flex items-center space-x-1.5 bg-white p-1 rounded-full border border-[#E8E6E0]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition cursor-pointer ${
                activeTab === 'all' ? 'bg-[#111111] text-white font-medium shadow-xs' : 'text-[#555558] hover:text-[#111111]'
              }`}
            >
              All Assets ({media.length})
            </button>
            <button
              onClick={() => setActiveTab('photo')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition cursor-pointer ${
                activeTab === 'photo' ? 'bg-[#111111] text-white font-medium shadow-xs' : 'text-[#555558] hover:text-[#111111]'
              }`}
            >
              Photographs
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition cursor-pointer ${
                activeTab === 'video' ? 'bg-[#111111] text-white font-medium shadow-xs' : 'text-[#555558] hover:text-[#111111]'
              }`}
            >
              Documentary Video
            </button>
          </div>

          {/* Region Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
                  selectedRegion === r
                    ? 'bg-[#111111] text-white font-medium shadow-xs'
                    : 'bg-white text-[#555558] hover:text-[#111111] border border-[#E8E6E0]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry / Photojournalistic Image Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-[#8E8E91]">Loading high-resolution photography...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-[#E8E6E0] p-8 shadow-sm">
            <p className="text-sm text-[#555558]">No media records match your selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map((item, index) => {
              const isPanoramic = index % 5 === 0;
              return (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(index)}
                  className={`group relative rounded-2xl overflow-hidden border border-[#E8E6E0] bg-[#F4F2EE] shadow-sm hover:shadow-md cursor-pointer card-hover-spring ${
                    isPanoramic ? 'sm:col-span-2 aspect-[21/9]' : 'aspect-[4/3]'
                  }`}
                >
                  <img
                    src={item.thumbnail_url || item.media_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-mono text-[#111111] font-semibold shadow-xs">
                      {item.region}
                    </span>
                    {item.type === 'video' && (
                      <span className="px-2 py-0.5 rounded-full bg-[#111111] text-white text-[10px] font-mono font-medium flex items-center gap-1 shadow-xs">
                        <Film className="w-3 h-3 text-white" />
                        <span>VIDEO</span>
                      </span>
                    )}
                  </div>

                  {/* Hover Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-base font-serif font-medium text-white group-hover:text-white transition leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/80 font-light line-clamp-2">
                      {item.caption}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-white/70 border-t border-white/20">
                      <span>Credit: {item.credit}</span>
                      <span className="text-white flex items-center gap-1 font-semibold">
                        <Maximize2 className="w-3 h-3" />
                        <span>Inspect Frame</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Enhanced Interactive Lightbox Modal with Keyboard Navigation & Optics HUD */}
        {activeLightboxItem && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setLightboxIndex(null)}
          >
            <div 
              className="max-w-5xl w-full bg-white border border-[#E8E6E0] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Stage with Previous / Next Arrows */}
              <div className="relative flex-1 bg-black flex items-center justify-center min-h-[360px] sm:min-h-[500px] select-none p-4">
                {activeLightboxItem.type === 'video' ? (
                  <video
                    src={activeLightboxItem.media_url}
                    poster={activeLightboxItem.thumbnail_url}
                    controls
                    autoPlay
                    className="max-h-[62vh] w-auto max-w-full rounded-xl shadow-lg"
                  />
                ) : (
                  <img
                    src={activeLightboxItem.media_url}
                    alt={activeLightboxItem.title}
                    className="max-h-[62vh] w-auto object-contain transition-all duration-300"
                  />
                )}

                {/* Left Arrow Button */}
                <button
                  onClick={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredMedia.length - 1))}
                  title="Previous (Left Arrow)"
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 transition cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Right Arrow Button */}
                <button
                  onClick={() => setLightboxIndex((prev) => (prev !== null && prev < filteredMedia.length - 1 ? prev + 1 : 0))}
                  title="Next (Right Arrow)"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 transition cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Top Close Button */}
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Counter Pill */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-mono border border-white/20">
                  {lightboxIndex !== null ? lightboxIndex + 1 : 1} / {filteredMedia.length}
                </div>
              </div>

              {/* Editorial & Provenance Dossier Footer */}
              <div className="p-6 sm:p-7 space-y-4 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F4F2EE] text-[#111111] border border-[#E8E6E0] font-semibold">
                      {activeLightboxItem.region}
                    </span>
                    <span className="text-[#8E8E91]">Date: {activeLightboxItem.date}</span>
                  </div>
                  <span className="text-[#555558]">Source / Attribution: <strong className="text-[#111111]">{activeLightboxItem.credit}</strong></span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#111111]">
                    {activeLightboxItem.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#555558] font-light leading-relaxed">
                    {activeLightboxItem.caption}
                  </p>
                </div>

                {/* Simulated Field Optics & Provenance HUD */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 px-3 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0] text-[11px] font-mono text-[#555558]">
                  <div>
                    <span className="text-[#8E8E91] block text-[9px] uppercase">Format</span>
                    <span className="text-[#111111] font-semibold">{activeLightboxItem.type === 'video' ? 'ProRes 4K' : 'RAW JPEG 24MP'}</span>
                  </div>
                  <div>
                    <span className="text-[#8E8E91] block text-[9px] uppercase">Registry</span>
                    <span className="text-[#111111] font-semibold">NCPOR-VIS-{activeLightboxItem.id}</span>
                  </div>
                  <div>
                    <span className="text-[#8E8E91] block text-[9px] uppercase">License</span>
                    <span className="text-[#111111] font-semibold">CC-BY-NC 4.0</span>
                  </div>
                  <div>
                    <span className="text-[#8E8E91] block text-[9px] uppercase">Provenance</span>
                    <span className="text-[#16A34A] font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#16A34A]" />
                      Verified
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8E6E0] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {activeLightboxItem.tags?.map((t) => (
                      <span key={t} className="px-2.5 py-0.5 rounded-full bg-[#F4F2EE] text-[10px] font-mono text-[#555558] border border-[#E8E6E0]">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <a
                    href={activeLightboxItem.media_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-mono font-medium flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Open High-Resolution Master</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
