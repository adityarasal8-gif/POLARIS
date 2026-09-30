import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Compass, Search, ChevronDown, Menu, X, 
  BookOpen, Database, Image, FileText, 
  Activity as ActivityIcon, Globe, Lock
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
    <header className="sticky top-0 z-40 w-full bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E8E6E0] transition-colors">
      {/* Top Institutional Bar (Warm Stone) */}
      <div className="w-full bg-[#F4F2EE] border-b border-[#E8E6E0] px-4 sm:px-8 py-1.5 text-[11px] text-[#555558] flex items-center justify-between font-sans">
        <div className="flex items-center space-x-2.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#16A34A]" />
          <span className="font-medium text-[#111111]">Government of India • Ministry of Earth Sciences (MoES)</span>
          <span className="hidden md:inline text-[#8E8E91]">/</span>
          <span className="hidden md:inline">National Centre for Polar and Ocean Research (NCPOR)</span>
        </div>
        <div className="flex items-center space-x-4 text-[11px] font-mono text-[#555558]">
          <span className="hidden sm:inline">Headland Sada, Vasco da Gama, Goa</span>
          <Link href="/admin" className="text-[#111111] hover:text-[#555558] flex items-center gap-1 font-medium transition">
            <Lock className="w-3 h-3 text-[#111111]" />
            <span>Admin Console</span>
          </Link>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group cursor-pointer py-1.5">
          <div className="w-9 h-9 rounded-xl bg-[#111111] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-all">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
              <circle cx="12" cy="12" r="9" className="stroke-white/40" />
              <circle cx="12" cy="12" r="4" className="stroke-white" />
              <path d="M12 2v20M2 12h20" className="stroke-white/70 stroke-[1.5]" />
              <polygon points="12,5 14,10 19,12 14,14 12,19 10,14 5,12 10,10" className="fill-white/20 stroke-white" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-[#111111] font-sans">POLARIS</span>
              <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[#F4F2EE] text-[#555558] border border-[#E8E6E0]">
                MoES · NCPOR
              </span>
            </div>
            <p className="text-[10.5px] text-[#8E8E91] font-medium hidden sm:block">
              India's Polar Science Knowledge Platform
            </p>
          </div>
        </Link>

        {/* Center Navigation Links (AgentShield Pill Style) */}
        <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium text-[#555558]">
          <Link 
            href="/" 
            className={`px-3.5 py-1.5 rounded-full transition-all ${location === '/' ? 'text-[#111111] bg-[#111111]/5 font-semibold' : 'hover:text-[#111111] hover:bg-[#111111]/5'}`}
          >
            Home
          </Link>

          {/* Explore Dropdown */}
          <div className="relative" onMouseLeave={() => setExploreOpen(false)}>
            <button
              onMouseEnter={() => setExploreOpen(true)}
              onClick={() => setExploreOpen(!exploreOpen)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full hover:text-[#111111] hover:bg-[#111111]/5 transition-all"
            >
              <span>Explore</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8E8E91]" />
            </button>

            {exploreOpen && (
              <div 
                className="absolute top-full left-0 w-64 pt-2 z-50 animate-in fade-in duration-150"
                onMouseEnter={() => setExploreOpen(true)}
              >
                <div className="bg-[#FFFFFF] p-2.5 rounded-2xl shadow-xl border border-[#E8E6E0] space-y-1">
                  <Link href="/expeditions" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F2EE] text-xs text-[#111111] group">
                    <Compass className="w-4 h-4 text-[#D97706] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#111111]">Expeditions Archive</div>
                      <div className="text-[10px] text-[#555558]">Antarctica, Arctic, Himalayas</div>
                    </div>
                  </Link>
                  <Link href="/stations" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F2EE] text-xs text-[#111111] group">
                    <Globe className="w-4 h-4 text-[#2563EB] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#111111]">Polar Stations</div>
                      <div className="text-[10px] text-[#555558]">Maitri, Bharati, Himadri, Himansh</div>
                    </div>
                  </Link>
                  <Link href="/media" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F2EE] text-xs text-[#111111] group">
                    <Image className="w-4 h-4 text-[#16A34A] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#111111]">Photo & Media Archive</div>
                      <div className="text-[10px] text-[#555558]">Authentic scientific photography</div>
                    </div>
                  </Link>
                  <Link href="/activities" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F2EE] text-xs text-[#111111] group">
                    <ActivityIcon className="w-4 h-4 text-[#D97706] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#111111]">Activities & Dispatches</div>
                      <div className="text-[10px] text-[#555558]">Field bulletins & institutional news</div>
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
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full hover:text-[#111111] hover:bg-[#111111]/5 transition-all"
            >
              <span>Research</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8E8E91]" />
            </button>

            {researchOpen && (
              <div 
                className="absolute top-full left-0 w-64 pt-2 z-50 animate-in fade-in duration-150"
                onMouseEnter={() => setResearchOpen(true)}
              >
                <div className="bg-[#FFFFFF] p-2.5 rounded-2xl shadow-xl border border-[#E8E6E0] space-y-1">
                  <Link href="/datasets" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F2EE] text-xs text-[#111111] group">
                    <Database className="w-4 h-4 text-[#2563EB] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#111111]">NPDC Datasets</div>
                      <div className="text-[10px] text-[#555558]">Atmosphere, Cryosphere, Oceans</div>
                    </div>
                  </Link>
                  <Link href="/publications" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F2EE] text-xs text-[#111111] group">
                    <FileText className="w-4 h-4 text-[#D97706] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#111111]">Publications Library</div>
                      <div className="text-[10px] text-[#555558]">Peer-reviewed papers & DOIs</div>
                    </div>
                  </Link>
                  <Link href="/knowledge-graph" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F2EE] text-xs text-[#111111] group">
                    <Compass className="w-4 h-4 text-[#16A34A] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#111111]">Relational Knowledge Graph</div>
                      <div className="text-[10px] text-[#555558]">Interactive science network</div>
                    </div>
                  </Link>
                  <Link href="/studio" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F2EE] text-xs text-[#111111] group">
                    <ActivityIcon className="w-4 h-4 text-[#0EA5E9] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#111111]">AI Outreach Studio</div>
                      <div className="text-[10px] text-[#555558]">Editorial dissemination desk</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link 
            href="/expeditions" 
            className={`px-3.5 py-1.5 rounded-full transition-all ${location === '/expeditions' ? 'text-[#111111] bg-[#111111]/5 font-semibold' : 'hover:text-[#111111] hover:bg-[#111111]/5'}`}
          >
            Expeditions
          </Link>

          <Link 
            href="/datasets" 
            className={`px-3.5 py-1.5 rounded-full transition-all ${location === '/datasets' ? 'text-[#111111] bg-[#111111]/5 font-semibold' : 'hover:text-[#111111] hover:bg-[#111111]/5'}`}
          >
            Data
          </Link>

          <Link 
            href="/learn" 
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${location === '/learn' ? 'text-[#111111] bg-[#111111]/5 font-semibold' : 'hover:text-[#111111] hover:bg-[#111111]/5'}`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Learn</span>
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Quick Search Trigger Pill */}
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-2 bg-[#FFFFFF] hover:bg-[#F4F2EE] text-[#555558] hover:text-[#111111] px-3.5 py-1.5 rounded-full border border-[#E8E6E0] transition-all text-xs font-mono shadow-xs"
            title="Search the polar repository (⌘K or /)"
          >
            <Search className="w-3.5 h-3.5 text-[#555558]" />
            <span className="hidden sm:inline">Search archive...</span>
            <kbd className="hidden sm:inline bg-[#F4F2EE] px-1.5 py-0.5 rounded text-[10px] text-[#8E8E91] border border-[#E8E6E0]">
              ⌘K
            </kbd>
          </button>

          {/* Live Observatory Direct CTA (Solid Black AgentShield Pill) */}
          <Link
            href="/observatory"
            className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#111111] hover:opacity-85 text-white text-xs font-semibold shadow-[0_4px_14px_rgba(17,17,17,0.18)] transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Live Observatory</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-[#FFFFFF] text-[#111111] hover:bg-[#F4F2EE] transition border border-[#E8E6E0]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAFAF8] border-b border-[#E8E6E0] px-6 py-5 space-y-3 text-sm animate-in slide-in-from-top duration-200">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#111111] font-semibold">Home</Link>
          <Link href="/expeditions" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#555558]">Polar Expeditions Archive</Link>
          <Link href="/stations" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#555558]">Research Stations</Link>
          <Link href="/observatory" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#111111] font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <span>Live Polar Observatory</span>
          </Link>
          <Link href="/datasets" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#2563EB]">NPDC Datasets Catalog</Link>
          <Link href="/publications" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#D97706]">Publications & Research</Link>
          <Link href="/repository" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#555558]">Knowledge Repository Search</Link>
          <Link href="/learn" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#2563EB]">Student Hub & Quiz</Link>
          <Link href="/media" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#555558]">Media Gallery</Link>
          <Link href="/activities" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#555558]">Institutional Dispatches</Link>
          <Link href="/studio" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#111111]">AI Outreach Studio</Link>
          <div className="pt-3 border-t border-[#E8E6E0] flex items-center justify-between">
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-xs font-mono text-[#111111] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Admin & Scientist Console</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
