import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, MapPin, Calendar, ExternalLink, ShieldCheck, TrendingUp, Atom, ThermometerSun, Anchor, Navigation } from 'lucide-react';
import { useLocation } from 'wouter';
import { SourceProofModal, ProvenanceData } from '../components/SourceProofModal';
import { SafeImage } from '../components/ui/SafeImage';
import { fetchDatasets, fetchPublications } from '../api';

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=800&q=80',
  '/images/arctic.jpg',
  'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&w=800&q=80',
  '/images/ctd_rosette.jpg',
  '/images/vessel.jpg'
];

type FeedItemType = ProvenanceData & { category: string, abstract: string, image: string, expedition: string, date: string };

export const ExploreFeed: React.FC = () => {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState('All Disciplines');
  const [activeRegion, setActiveRegion] = useState('All Regions');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<ProvenanceData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [feedItems, setFeedItems] = useState<FeedItemType[]>([]);
  const [trendingResearch, setTrendingResearch] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDatasets(), fetchPublications()])
      .then(([datasets, publications]) => {
        const topPubs = [...publications].sort((a, b) => b.citation_count - a.citation_count).slice(0, 3);
        setTrendingResearch(topPubs.map(p => ({
          id: p.id,
          title: p.title,
          journal: p.journal,
          date: p.year.toString(),
          authors: p.authors.join(', '),
          doi: p.doi
        })));

        const get_image_for_title = (title: string, index: number) => {
          const t = title.toLowerCase();
          if (t.includes('arctic') || t.includes('svalbard') || t.includes('himadri') || t.includes('ny-ålesund') || t.includes('spitsbergen')) return DEFAULT_IMAGES[1]; // Glacier/Svalbard
          if (t.includes('himalaya') || t.includes('himansh') || t.includes('chandra') || t.includes('spiti')) return 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80'; // Himalayas
          if (t.includes('ocean') || t.includes('ctd') || t.includes('marine') || t.includes('benthic')) return DEFAULT_IMAGES[3]; // Deep Ocean (CTD)
          if (t.includes('vessel') || t.includes('ship') || t.includes('cruise')) return DEFAULT_IMAGES[4]; // Vessel
          if (t.includes('aurora') || t.includes('magnetic') || t.includes('ionosphere')) return DEFAULT_IMAGES[2]; // Aurora
          if (t.includes('penguin') || t.includes('biology') || t.includes('krill') || t.includes('bird')) return DEFAULT_IMAGES[0]; // Penguin
          if (t.includes('ice core')) return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'; // Ice Core/Mountains
          if (t.includes('maitri') || t.includes('bharati') || t.includes('antarctic')) return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80';
          return DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
        };

        const datasetItems: FeedItemType[] = datasets.map((d, i) => ({
          id: d.id,
          title: d.title,
          type: 'Dataset',
          category: d.science_category,
          abstract: d.description,
          image: get_image_for_title(d.title, i),
          expedition: d.expedition_id || 'NPDC Repository',
          date: d.last_updated.split('T')[0] || 'Unknown Date',
          source_repository: d.provider,
          doi: d.doi,
          citation_text: d.provenance,
          institution_credit: 'MoES / NCPOR'
        }));

        const pubItems: FeedItemType[] = publications.map((p, i) => ({
          id: p.id,
          title: p.title,
          type: 'Publication',
          category: p.research_topic,
          abstract: p.abstract,
          image: get_image_for_title(p.title, i + 3),
          expedition: p.expedition_id || 'Academic Paper',
          date: p.year.toString(),
          source_repository: p.journal,
          doi: p.doi,
          citation_text: `${p.authors.join(', ')} (${p.year}). ${p.title}. ${p.journal}.`,
          institution_credit: 'Peer Reviewed'
        }));

        // Sort datasets and publications chronologically to create a timeline of research
        const combined = [...datasetItems, ...pubItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setFeedItems(combined);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const CATEGORIES = ['All Disciplines', 'Glaciology & Ice Sheets', 'Oceanography & CTD', 'Atmospheric Physics', 'Polar Biology', 'Expedition Logistics'];
  const REGIONS = ['All Regions', 'Antarctica (Schirmacher & Larsemann)', 'Arctic (Svalbard)', 'Third Pole (Himalayas)', 'Southern Ocean'];

  const handleViewSource = (item: ProvenanceData) => {
    setSelectedAsset(item);
    setModalOpen(true);
  };

  const filteredFeedItems = feedItems.filter(item => {
    const matchesCategory = activeCategory === 'All Disciplines' || item.category === activeCategory || (activeCategory === 'Oceanography & CTD' && item.title.toLowerCase().includes('ctd'));
    
    let matchesRegion = true;
    if (activeRegion !== 'All Regions') {
      const r = activeRegion.toLowerCase();
      const content = (item.title + ' ' + item.abstract + ' ' + item.expedition).toLowerCase();
      if (r.includes('antarctica')) matchesRegion = content.includes('antarctic') || content.includes('maitri') || content.includes('bharati');
      else if (r.includes('arctic')) matchesRegion = content.includes('arctic') || content.includes('himadri') || content.includes('svalbard');
      else if (r.includes('himalaya')) matchesRegion = content.includes('himalaya') || content.includes('himansh') || content.includes('spiti');
      else if (r.includes('southern ocean')) matchesRegion = content.includes('ocean') || content.includes('marine') || content.includes('sea');
    }

    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.doi && item.doi.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesRegion && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24">
      {/* Header & Title */}
      <div className="bg-[#111111] pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#222222]">
        <div className="max-w-7xl mx-auto">
          <span className="text-sm font-mono text-[#38BDF8] uppercase tracking-widest block mb-4 flex items-center gap-2">
            <Atom className="w-4 h-4" /> Global Research Feed
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight max-w-3xl">
            Explore <span className="italic text-[#E8E6E0]">Peer-Reviewed</span> Science, Datasets, and Expedition Logs.
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        
        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#E8E6E0] p-6 mb-12 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          
          <div className="w-full md:w-auto space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#8E8E91] uppercase mr-2">Discipline</span>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono transition-colors ${
                    activeCategory === cat ? 'bg-[#111111] text-white' : 'bg-[#F4F2EE] text-[#555558] hover:bg-[#E8E6E0]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#8E8E91] uppercase mr-2">Region</span>
              {REGIONS.map(reg => (
                <button 
                  key={reg}
                  onClick={() => setActiveRegion(reg)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono transition-colors border ${
                    activeRegion === reg ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A]' : 'border-[#E8E6E0] bg-white text-[#555558] hover:bg-[#F4F2EE]'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full md:w-64">
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search DOIs, keywords..."
                className="w-full bg-[#FAFAF8] border border-[#E8E6E0] rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#111111]"
              />
              <Search className="w-4 h-4 text-[#8E8E91] absolute left-3.5 top-3" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-8">
            {loading ? (
              <div className="w-full py-12 flex items-center justify-center text-[#8E8E91] font-mono text-xs">
                Fetching latest research and telemetry streams...
              </div>
            ) : filteredFeedItems.length === 0 ? (
              <div className="w-full py-12 flex items-center justify-center text-[#8E8E91] font-mono text-xs">
                No matching findings discovered in this sector.
              </div>
            ) : filteredFeedItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-[#E8E6E0] overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col md:flex-row">
                
                <div className="md:w-2/5 h-48 md:h-auto overflow-hidden relative">
                  <div className="absolute inset-0 bg-[#111111]/10 group-hover:bg-transparent transition-colors z-10" />
                  <SafeImage 
                    src={item.image} 
                    alt={item.title} 
                    className="group-hover:scale-105 transition-transform duration-700"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded text-[10px] font-mono font-bold uppercase tracking-wider text-[#111111]">
                      {item.type}
                    </span>
                  </div>
                </div>

                <div className="p-6 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs font-mono text-[#555558] mb-2">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {item.date}</span>
                      <span className="flex items-center gap-1 text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded"><Navigation className="w-3.5 h-3.5" /> {item.expedition}</span>
                    </div>
                    <h3 className="text-xl font-serif font-medium text-[#111111] mb-2 leading-tight group-hover:text-[#2563EB] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#555558] font-serif leading-relaxed line-clamp-2">
                      {item.abstract}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#E8E6E0]">
                    <button 
                      onClick={() => {
                        if (item.type === 'Dataset') {
                          setLocation(`/datasets/${item.id}`);
                        } else if (item.doi) {
                          window.open(`https://doi.org/${item.doi}`, '_blank');
                        }
                      }}
                      className="px-4 py-2 bg-[#111111] hover:bg-black text-white rounded-lg text-xs font-mono font-medium transition-colors"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleViewSource(item)}
                      className="px-4 py-2 bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#166534] border border-[#16A34A]/20 rounded-lg text-xs font-mono font-medium transition-colors flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      View Source & DOI ↗
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar / Trending */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-[#2563EB]" />
              <h2 className="text-lg font-mono font-bold uppercase tracking-widest text-[#111111]">
                Trending Research
              </h2>
            </div>
            
            {trendingResearch.map((tr: any) => (
              <div key={tr.id} className="bg-white p-5 rounded-2xl border border-[#E8E6E0] shadow-sm hover:border-[#111111] transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#8E8E91] uppercase">{tr.journal}</span>
                  <span className="text-[10px] font-mono text-[#8E8E91]">{tr.date}</span>
                </div>
                <h4 className="text-sm font-serif font-medium text-[#111111] mb-2 leading-snug group-hover:text-[#2563EB] transition-colors">
                  {tr.title}
                </h4>
                <div className="flex items-center justify-between pt-3 border-t border-[#FAFAF8]">
                  <span className="text-[11px] text-[#555558] italic">{tr.authors}</span>
                  <a href={`https://doi.org/${tr.doi}`} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-[#2563EB] hover:underline flex items-center gap-1">
                    DOI <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}

            <div className="bg-[#111111] p-6 rounded-2xl text-white mt-8">
              <ShieldCheck className="w-8 h-8 text-[#16A34A] mb-4" />
              <h3 className="text-lg font-serif font-medium mb-2">Immutable Provenance</h3>
              <p className="text-xs text-[#A1A1AA] font-mono leading-relaxed mb-4">
                All publications and datasets in the POLARIS feed are cryptographically hashed and linked directly to their canonical DOI source.
              </p>
              <button className="text-xs font-mono text-[#38BDF8] hover:text-white transition-colors flex items-center gap-1 border-b border-[#38BDF8]/30 pb-0.5">
                Read our Data Policy <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <SourceProofModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        data={selectedAsset} 
      />
    </div>
  );
};
