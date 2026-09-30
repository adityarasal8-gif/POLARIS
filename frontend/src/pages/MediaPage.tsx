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

  // Tabs: all, photo, video
  const [activeTab, setActiveTab] = useState<'all' | 'photo' | 'video'>('all');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

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
      } catch (err) {
        console.error('Failed to load media assets:', err);
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
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.credit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesTab && matchesRegion && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#07151F] text-[#F7F8F5] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#74B8CC]/30 selection:text-[#07151F]">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Gallery Header */}
        <div className="border-b border-[#B9DDE7]/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#D7A75D] font-bold tracking-wider uppercase">
              <Camera className="w-4 h-4 text-[#D7A75D]" />
              <span>OFFICIAL SCIENTIFIC PHOTOGRAPHY & FOOTAGE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
              The Polar Photographic Archive
            </h1>
            <p className="text-sm sm:text-base text-[#8E9EA7] max-w-3xl font-light">
              High-resolution photographic documentation and field video from Indian scientific deployments across the cryosphere. Strictly authentic photography with verified institutional provenance.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#5BB7A5] bg-[#0D2735] border border-[#5BB7A5]/30 px-3.5 py-2 rounded-xl">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero AI-Generated Media</span>
          </div>
        </div>

        {/* Filter & Media Type Bar */}
        <div className="bg-[#0D2735] p-5 rounded-2xl border border-[#B9DDE7]/15 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
          {/* Tabs */}
          <div className="flex items-center space-x-2 bg-[#07151F] p-1.5 rounded-xl border border-[#B9DDE7]/10">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition ${
                activeTab === 'all' ? 'bg-[#74B8CC] text-[#07151F] font-bold' : 'text-[#8E9EA7] hover:text-white'
              }`}
            >
              All Assets ({media.length})
            </button>
            <button
              onClick={() => setActiveTab('photo')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition ${
                activeTab === 'photo' ? 'bg-[#74B8CC] text-[#07151F] font-bold' : 'text-[#8E9EA7] hover:text-white'
              }`}
            >
              Photographs
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition ${
                activeTab === 'video' ? 'bg-[#74B8CC] text-[#07151F] font-bold' : 'text-[#8E9EA7] hover:text-white'
              }`}
            >
              Documentary Video
            </button>
          </div>

          {/* Region Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  selectedRegion === r
                    ? 'bg-[#5BB7A5] text-[#07151F] font-bold'
                    : 'bg-[#07151F] text-[#8E9EA7] hover:text-white border border-[#B9DDE7]/10'
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
            <div className="w-8 h-8 border-2 border-[#74B8CC] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-[#8E9EA7]">Loading high-resolution photography...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-[#0D2735] rounded-2xl border border-[#B9DDE7]/10 p-8">
            <p className="text-sm text-[#8E9EA7]">No media records match your selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map((item, index) => {
              // Add slight aspect variation for photojournalistic rhythm
              const isPanoramic = index % 5 === 0;
              return (
                <div
                  key={item.id}
                  onClick={() => setLightboxAsset(item)}
                  className={`group relative rounded-2xl overflow-hidden border border-[#B9DDE7]/15 bg-[#0D2735] shadow-xl cursor-pointer ${
                    isPanoramic ? 'sm:col-span-2 aspect-[21/9]' : 'aspect-[4/3]'
                  }`}
                >
                  <img
                    src={item.media_url}
                    alt={item.title}
                    className="w-full h-full object-cover polar-image-zoom brightness-[0.8] group-hover:brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07151F] via-[#07151F]/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-[#07151F]/80 backdrop-blur-md text-[10px] font-mono text-white font-semibold border border-[#B9DDE7]/20">
                      {item.region}
                    </span>
                    {item.type === 'video' && (
                      <span className="px-2 py-0.5 rounded bg-[#D7A75D] text-[#07151F] text-[10px] font-mono font-bold flex items-center gap-1">
                        <Film className="w-3 h-3" />
                        <span>VIDEO</span>
                      </span>
                    )}
                  </div>

                  {/* Hover Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-base font-serif font-bold text-white group-hover:text-[#B9DDE7] transition leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#DCEEF2]/80 font-light line-clamp-2">
                      {item.caption}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#8E9EA7] border-t border-[#B9DDE7]/10">
                      <span>Credit: {item.credit}</span>
                      <span className="text-[#74B8CC] flex items-center gap-1">
                        <Maximize2 className="w-3 h-3" />
                        <span>Expand</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full-Screen Lightbox Modal */}
        {lightboxAsset && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setLightboxAsset(null)}
          >
            <div 
              className="max-w-5xl w-full bg-[#07151F] border border-[#B9DDE7]/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative flex-1 bg-black flex items-center justify-center min-h-[360px] sm:min-h-[480px]">
                <img
                  src={lightboxAsset.media_url}
                  alt={lightboxAsset.title}
                  className="max-h-[60vh] w-auto object-contain"
                />
                <button
                  onClick={() => setLightboxAsset(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-4 bg-[#0D2735]">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded bg-[#07151F] text-[#74B8CC] border border-[#B9DDE7]/20">
                      {lightboxAsset.region}
                    </span>
                    <span className="text-[#8E9EA7]">Date: {lightboxAsset.date}</span>
                  </div>
                  <span className="text-[#8E9EA7]">Source / Attribution: <strong>{lightboxAsset.credit}</strong></span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-white">
                  {lightboxAsset.title}
                </h3>
                <p className="text-sm text-[#DCEEF2]/85 font-light leading-relaxed">
                  {lightboxAsset.caption}
                </p>

                <div className="pt-3 border-t border-[#B9DDE7]/10 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {lightboxAsset.tags?.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-[#07151F] text-[10px] font-mono text-[#5BB7A5]">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <a
                    href={lightboxAsset.media_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-lg bg-[#74B8CC] hover:bg-[#B9DDE7] text-[#07151F] text-xs font-mono font-bold flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Open High-Resolution</span>
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
