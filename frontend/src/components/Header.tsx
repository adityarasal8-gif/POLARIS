import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Compass, Search, ChevronDown, Menu, X, 
  BookOpen, Radio, Database, Image, FileText, 
  Activity as ActivityIcon, Globe, Lock, ArrowUpRight
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  currentRole?: string;
  onSelectRole?: (role: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07151F]/95 backdrop-blur-md border-b border-[#B9DDE7]/10 transition-colors">
      {/* Top Ministry / Institutional Bar */}
      <div className="w-full bg-[#050F17] border-b border-[#B9DDE7]/5 px-4 sm:px-8 py-1.5 text-[11px] text-[#8E9EA7] flex items-center justify-between font-sans">
        <div className="flex items-center space-x-2.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#D7A75D]" />
          <span className="font-medium text-[#DCEEF2]">Government of India • Ministry of Earth Sciences (MoES)</span>
          <span className="hidden md:inline text-[#61747E]">/</span>
          <span className="hidden md:inline">National Centre for Polar and Ocean Research (NCPOR)</span>
        </div>
        <div className="flex items-center space-x-4 text-[11px] font-mono text-[#8E9EA7]">
          <span className="hidden sm:inline">Headland Sada, Vasco da Gama, Goa</span>
          <Link href="/admin" className="text-[#74B8CC] hover:text-white flex items-center gap-1 transition">
            <Lock className="w-3 h-3 text-[#74B8CC]" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3.5 group cursor-pointer py-2">
          <div className="w-10 h-10 rounded-lg bg-[#0D2735] border border-[#74B8CC]/30 flex items-center justify-center text-[#74B8CC] shadow-md group-hover:border-[#74B8CC] transition-all">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2">
              <circle cx="12" cy="12" r="9" className="stroke-[#B9DDE7]/40" />
              <circle cx="12" cy="12" r="4" className="stroke-[#74B8CC]" />
              <path d="M12 2v20M2 12h20" className="stroke-[#5BB7A5]/70 stroke-[1.5]" />
              <polygon points="12,5 14,10 19,12 14,14 12,19 10,14 5,12 10,10" className="fill-[#74B8CC]/20 stroke-[#74B8CC]" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white font-sans">POLARIS</span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#0D2735] text-[#74B8CC] border border-[#74B8CC]/25">
                MoES · NCPOR
              </span>
            </div>
            <p className="text-[11px] text-[#8E9EA7] font-medium hidden sm:block">
              India's Polar Science Knowledge Platform
            </p>
          </div>
        </Link>

        {/* Center Editorial Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium text-[#DCEEF2]">
          <Link 
            href="/" 
            className={`px-3.5 py-2 rounded-md transition-colors ${location === '/' ? 'text-white bg-[#0D2735] font-semibold' : 'hover:text-white hover:bg-[#0D2735]/60'}`}
          >
            Home
          </Link>

          {/* Explore Dropdown */}
          <div className="relative" onMouseLeave={() => setExploreOpen(false)}>
            <button
              onMouseEnter={() => setExploreOpen(true)}
              onClick={() => setExploreOpen(!exploreOpen)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-md hover:text-white hover:bg-[#0D2735]/60 transition-colors"
            >
              <span>Explore</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8E9EA7]" />
            </button>

            {exploreOpen && (
              <div 
                className="absolute top-full left-0 w-64 pt-2 z-50 animate-in fade-in duration-150"
                onMouseEnter={() => setExploreOpen(true)}
              >
                <div className="bg-[#0D2735] p-2.5 rounded-xl shadow-2xl border border-[#B9DDE7]/15 space-y-1">
                  <Link href="/expeditions" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-[#143547] text-xs text-white group">
                    <Compass className="w-4 h-4 text-[#5BB7A5] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#F7F8F5]">Expeditions Archive</div>
                      <div className="text-[10px] text-[#8E9EA7]">Antarctica, Arctic, Himalayas</div>
                    </div>
                  </Link>
                  <Link href="/stations" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-[#143547] text-xs text-white group">
                    <Globe className="w-4 h-4 text-[#74B8CC] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#F7F8F5]">Polar Stations</div>
                      <div className="text-[10px] text-[#8E9EA7]">Maitri, Bharati, Himadri, Himansh</div>
                    </div>
                  </Link>
                  <Link href="/media" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-[#143547] text-xs text-white group">
                    <Image className="w-4 h-4 text-[#D7A75D] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#F7F8F5]">Photo & Media Archive</div>
                      <div className="text-[10px] text-[#8E9EA7]">Authentic scientific photography</div>
                    </div>
                  </Link>
                  <Link href="/activities" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-[#143547] text-xs text-white group">
                    <ActivityIcon className="w-4 h-4 text-[#74B8CC] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#F7F8F5]">Activities & Dispatches</div>
                      <div className="text-[10px] text-[#8E9EA7]">Field news & bulletins</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Research Dropdown */}
          <div className="relative" onMouseLeave={() => setResearchOpen(false)}>
            <button
              onMouseEnter={() => setResearchOpen(true)}
              onClick={() => setResearchOpen(!researchOpen)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-md hover:text-white hover:bg-[#0D2735]/60 transition-colors"
            >
              <span>Research</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8E9EA7]" />
            </button>

            {researchOpen && (
              <div 
                className="absolute top-full left-0 w-64 pt-2 z-50 animate-in fade-in duration-150"
                onMouseEnter={() => setResearchOpen(true)}
              >
                <div className="bg-[#0D2735] p-2.5 rounded-xl shadow-2xl border border-[#B9DDE7]/15 space-y-1">
                  <Link href="/datasets" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-[#143547] text-xs text-white group">
                    <Database className="w-4 h-4 text-[#74B8CC] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#F7F8F5]">NPDC Datasets</div>
                      <div className="text-[10px] text-[#8E9EA7]">Atmosphere, Cryosphere, Oceans</div>
                    </div>
                  </Link>
                  <Link href="/publications" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-[#143547] text-xs text-white group">
                    <FileText className="w-4 h-4 text-[#D7A75D] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#F7F8F5]">Publications Library</div>
                      <div className="text-[10px] text-[#8E9EA7]">Peer-reviewed papers & DOIs</div>
                    </div>
                  </Link>
                  <Link href="/knowledge-graph" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-[#143547] text-xs text-white group">
                    <Compass className="w-4 h-4 text-[#5BB7A5] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#F7F8F5]">Relational Knowledge Graph</div>
                      <div className="text-[10px] text-[#8E9EA7]">Interactive science network</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link 
            href="/expeditions" 
            className={`px-3.5 py-2 rounded-md transition-colors ${location === '/expeditions' ? 'text-white bg-[#0D2735] font-semibold' : 'hover:text-white hover:bg-[#0D2735]/60'}`}
          >
            Expeditions
          </Link>

          <Link 
            href="/datasets" 
            className={`px-3.5 py-2 rounded-md transition-colors ${location === '/datasets' ? 'text-white bg-[#0D2735] font-semibold' : 'hover:text-white hover:bg-[#0D2735]/60'}`}
          >
            Data
          </Link>

          <Link 
            href="/learn" 
            className={`px-3.5 py-2 rounded-md transition-colors flex items-center space-x-1.5 ${location === '/learn' ? 'text-white bg-[#0D2735] font-semibold' : 'hover:text-white hover:bg-[#0D2735]/60'}`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#74B8CC]" />
            <span>Learn</span>
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Quick Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-2 bg-[#0D2735] hover:bg-[#143547] text-[#8E9EA7] hover:text-white px-3.5 py-2 rounded-lg border border-[#B9DDE7]/15 transition-all text-xs font-mono"
            title="Search the polar repository (⌘K or /)"
          >
            <Search className="w-3.5 h-3.5 text-[#74B8CC]" />
            <span className="hidden sm:inline">Search archive...</span>
            <kbd className="hidden sm:inline bg-[#07151F] px-1.5 py-0.5 rounded text-[10px] text-[#61747E] border border-[#B9DDE7]/10">
              ⌘K
            </kbd>
          </button>

          {/* Live Observatory Direct CTA */}
          <Link
            href="/observatory"
            className="hidden sm:inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-[#0D2735] hover:bg-[#143547] border border-[#5BB7A5]/30 text-[#DCEEF2] hover:text-white text-xs font-medium transition"
          >
            <span className="w-2 h-2 rounded-full bg-[#5BB7A5] animate-pulse" />
            <span>Observatory</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-lg bg-[#0D2735] text-white hover:bg-[#143547] transition border border-[#B9DDE7]/15"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#07151F] border-b border-[#B9DDE7]/15 px-6 py-5 space-y-3 text-sm animate-in slide-in-from-top duration-200">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white font-semibold">Home</Link>
          <Link href="/expeditions" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#DCEEF2]">Polar Expeditions Archive</Link>
          <Link href="/stations" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#DCEEF2]">Research Stations</Link>
          <Link href="/observatory" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#5BB7A5] font-semibold">Live Polar Observatory</Link>
          <Link href="/datasets" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#74B8CC]">NPDC Datasets Catalog</Link>
          <Link href="/publications" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#D7A75D]">Publications & Research</Link>
          <Link href="/repository" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#DCEEF2]">Knowledge Repository Search</Link>
          <Link href="/learn" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#74B8CC]">Student Hub & Quiz</Link>
          <Link href="/media" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#DCEEF2]">Media Gallery</Link>
          <Link href="/activities" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#DCEEF2]">Institutional Dispatches</Link>
          <Link href="/studio" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#5BB7A5]">AI Content Studio</Link>
          <div className="pt-3 border-t border-[#B9DDE7]/10 flex items-center justify-between">
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-xs font-mono text-[#74B8CC] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Admin & Scientist Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
