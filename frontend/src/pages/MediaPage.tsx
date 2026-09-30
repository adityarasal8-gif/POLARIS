import React, { useState, useEffect } from 'react';
import { 
  Camera, Image as ImageIcon, Film, Filter, 
  Download, Maximize2, ShieldCheck, X, ArrowUpRight
} from 'lucide-react';
import { fetchMedia } from '../api';
import { MediaAsset } from '../types';

export default function MediaPage() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'photo' | 'video'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxAsset, setLightboxAsset] = useState<MediaAsset | null>(null);

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

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111111] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#111111] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Gallery Header */}
        <div className="border-b border-[#E8E6E0] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#555558] bg-[#F4F2EE] px-3 py-1 rounded-full border border-[#E8E6E0] font-medium tracking-wide uppercase">
              <Camera className="w-3.5 h-3.5 text-[#111111]" />
              <span>OFFICIAL SCIENTIFIC PHOTOGRAPHY & FOOTAGE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-medium text-[#111111] tracking-tight">
              The Polar Photographic Archive
            </h1>
            <p className="text-sm sm:text-base text-[#555558] max-w-3xl font-light leading-relaxed">
              High-resolution photographic documentation and field video from Indian scientific deployments across the cryosphere. Strictly authentic photography with verified institutional provenance.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#555558] bg-white border border-[#E8E6E0] px-3.5 py-2 rounded-full shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>Zero AI-Generated Media</span>
          </div>
        </div>

        {/* Filter & Media Type Bar */}
        <div className="bg-[#F4F2EE] p-4 sm:p-5 rounded-2xl border border-[#E8E6E0] flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          {/* Tabs */}
          <div className="flex items-center space-x-1.5 bg-white p-1 rounded-full border border-[#E8E6E0]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition ${
                activeTab === 'all' ? 'bg-[#111111] text-white font-medium shadow-xs' : 'text-[#555558] hover:text-[#111111]'
              }`}
            >
              All Assets ({media.length})
            </button>
            <button
              onClick={() => setActiveTab('photo')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition ${
                activeTab === 'photo' ? 'bg-[#111111] text-white font-medium shadow-xs' : 'text-[#555558] hover:text-[#111111]'
              }`}
            >
              Photographs
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition ${
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
                className={`px-3 py-1.5 rounded-full transition ${
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
                  onClick={() => setLightboxAsset(item)}
                  className={`group relative rounded-2xl overflow-hidden border border-[#E8E6E0] bg-[#F4F2EE] shadow-sm hover:shadow-md cursor-pointer ${
                    isPanoramic ? 'sm:col-span-2 aspect-[21/9]' : 'aspect-[4/3]'
                  }`}
                >
                  <img
                    src={item.media_url}
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setLightboxAsset(null)}
          >
            <div 
              className="max-w-5xl w-full bg-white border border-[#E8E6E0] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
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

              <div className="p-6 sm:p-8 space-y-4 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F4F2EE] text-[#111111] border border-[#E8E6E0] font-semibold">
                      {lightboxAsset.region}
                    </span>
                    <span className="text-[#8E8E91]">Date: {lightboxAsset.date}</span>
                  </div>
                  <span className="text-[#555558]">Source / Attribution: <strong className="text-[#111111]">{lightboxAsset.credit}</strong></span>
                </div>

                <h3 className="text-2xl font-serif font-medium text-[#111111]">
                  {lightboxAsset.title}
                </h3>
                <p className="text-sm text-[#555558] font-light leading-relaxed">
                  {lightboxAsset.caption}
                </p>

                <div className="pt-3 border-t border-[#E8E6E0] flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {lightboxAsset.tags?.map((t) => (
                      <span key={t} className="px-2.5 py-0.5 rounded-full bg-[#F4F2EE] text-[10px] font-mono text-[#555558] border border-[#E8E6E0]">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <a
                    href={lightboxAsset.media_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-mono font-medium flex items-center gap-1.5 transition shadow-sm"
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
