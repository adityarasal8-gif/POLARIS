import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Compass, Search, UserCheck, ChevronDown, 
  Menu, X, BookOpen, Radio, Share2, Layers, 
  Database, Image, FileText, Activity as ActivityIcon, Globe
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  currentRole: string;
  onSelectRole: (role: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, currentRole, onSelectRole }) => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);
  const [disseminateOpen, setDisseminateOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const ROLES = ['Student', 'Scientist', 'Content Editor', 'Administrator'];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#071A2B]/95 backdrop-blur-md border-b border-[#6EC5E9]/15">
      {/* Top Government MoES Bar */}
      <div className="w-full bg-[#051320] border-b border-[#6EC5E9]/10 px-4 py-1 text-[11px] text-[#94A3B8] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#E7A93B]" />
          <span>Government of India • Ministry of Earth Sciences (MoES)</span>
          <span className="hidden sm:inline text-[#647887]">|</span>
          <span className="hidden sm:inline">National Centre for Polar and Ocean Research (NCPOR)</span>
        </div>
        <div className="flex items-center space-x-3 font-mono text-[10px]">
          <span className="text-[#38BDF8]">SIH26063 DEMONSTRATION PORTAL</span>
          <span className="badge-live px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">LIVE TELEMETRY ON</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B2538] to-[#123753] border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shadow-lg group-hover:border-[#38BDF8] transition-all">
            {/* Custom Polaris SVG Icon: polar coordinates & compass geometry */}
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2">
              <circle cx="12" cy="12" r="9" className="stroke-[#6EC5E9]/40" />
              <circle cx="12" cy="12" r="4" className="stroke-[#38BDF8]" />
              <path d="M12 2v20M2 12h20" className="stroke-[#22C7A8]/70 stroke-[1.5]" />
              <polygon points="12,5 14,10 19,12 14,14 12,19 10,14 5,12 10,10" className="fill-[#38BDF8]/20 stroke-[#38BDF8]" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-black tracking-wider text-white">POLARIS</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                MoES
              </span>
            </div>
            <p className="text-[10px] tracking-tight text-[#94A3B8] font-medium hidden sm:block">
              India's Polar Science Knowledge & Outreach Platform
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium text-[#CBD5E1]">
          <Link 
            href="/" 
            className={`px-3 py-1.5 rounded-lg transition-colors ${location === '/' ? 'text-white bg-[#0B2538] border border-[#6EC5E9]/20' : 'hover:text-white hover:bg-[#0B2538]/50'}`}
          >
            Home
          </Link>

          {/* Explore Dropdown */}
          <div className="relative" onMouseLeave={() => setExploreOpen(false)}>
            <button
              onMouseEnter={() => setExploreOpen(true)}
              onClick={() => setExploreOpen(!exploreOpen)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:text-white hover:bg-[#0B2538]/50 transition-colors"
            >
              <span>Explore</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>

            {exploreOpen && (
              <div 
                className="absolute top-full left-0 w-64 pt-2 z-50"
                onMouseEnter={() => setExploreOpen(true)}
              >
                <div className="polar-panel p-2 shadow-2xl border border-[#6EC5E9]/20 space-y-1">
                  <Link href="/repository" className="flex items-center space-x-2.5 px-3 py-2 rounded-md hover:bg-[#123753] text-xs text-white">
                    <Database className="w-4 h-4 text-[#38BDF8]" />
                    <div>
                      <div className="font-semibold">Knowledge Repository</div>
                      <div className="text-[10px] text-[#94A3B8]">Unified multi-category search</div>
                    </div>
                  </Link>
                  <Link href="/expeditions" className="flex items-center space-x-2.5 px-3 py-2 rounded-md hover:bg-[#123753] text-xs text-white">
                    <Compass className="w-4 h-4 text-[#22C7A8]" />
                    <div>
                      <div className="font-semibold">Polar Expeditions</div>
                      <div className="text-[10px] text-[#94A3B8]">Antarctic, Arctic & Himalayan</div>
                    </div>
                  </Link>
                  <Link href="/datasets" className="flex items-center space-x-2.5 px-3 py-2 rounded-md hover:bg-[#123753] text-xs text-white">
                    <Layers className="w-4 h-4 text-[#6EC5E9]" />
                    <div>
                      <div className="font-semibold">NPDC Datasets</div>
                      <div className="text-[10px] text-[#94A3B8]">Atmosphere, Cryosphere, Oceans</div>
                    </div>
                  </Link>
                  <Link href="/publications" className="flex items-center space-x-2.5 px-3 py-2 rounded-md hover:bg-[#123753] text-xs text-white">
                    <FileText className="w-4 h-4 text-[#E7A93B]" />
                    <div>
                      <div className="font-semibold">Scientific Publications</div>
                      <div className="text-[10px] text-[#94A3B8]">Peer-reviewed papers & DOIs</div>
                    </div>
                  </Link>
                  <Link href="/media" className="flex items-center space-x-2.5 px-3 py-2 rounded-md hover:bg-[#123753] text-xs text-white">
                    <Image className="w-4 h-4 text-[#38BDF8]" />
                    <div>
                      <div className="font-semibold">Media Gallery</div>
                      <div className="text-[10px] text-[#94A3B8]">Authentic photos & field video</div>
                    </div>
                  </Link>
                  <Link href="/activities" className="flex items-center space-x-2.5 px-3 py-2 rounded-md hover:bg-[#123753] text-xs text-white">
                    <ActivityIcon className="w-4 h-4 text-[#22C7A8]" />
                    <div>
                      <div className="font-semibold">Activities & News</div>
                      <div className="text-[10px] text-[#94A3B8]">Institutional updates & bulletins</div>
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
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:text-white hover:bg-[#0B2538]/50 transition-colors"
            >
              <span>Research</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>

            {researchOpen && (
              <div 
                className="absolute top-full left-0 w-56 pt-2 z-50"
                onMouseEnter={() => setResearchOpen(true)}
              >
                <div className="polar-panel p-2 shadow-2xl border border-[#6EC5E9]/20 space-y-1">
                  <Link href="/stations" className="flex items-center space-x-2.5 px-3 py-2 rounded-md hover:bg-[#123753] text-xs text-white">
                    <Globe className="w-4 h-4 text-[#38BDF8]" />
                    <div>
                      <div className="font-semibold">Polar Stations</div>
                      <div className="text-[10px] text-[#94A3B8]">Maitri, Bharati, Himadri, Himansh</div>
                    </div>
                  </Link>
                  <Link href="/observatory" className="flex items-center space-x-2.5 px-3 py-2 rounded-md hover:bg-[#123753] text-xs text-white">
                    <Radio className="w-4 h-4 text-[#22C7A8]" />
                    <div>
                      <div className="font-semibold">Live Observatory</div>
                      <div className="text-[10px] text-[#94A3B8]">Real-time telemetry map & trends</div>
                    </div>
                  </Link>
                  <Link href="/knowledge-graph" className="flex items-center space-x-2.5 px-3 py-2 rounded-md hover:bg-[#123753] text-xs text-white">
                    <Layers className="w-4 h-4 text-[#E7A93B]" />
                    <div>
                      <div className="font-semibold">Knowledge Graph</div>
                      <div className="text-[10px] text-[#94A3B8]">Interactive relational mapping</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Learn / Student Hub */}
          <Link 
            href="/learn" 
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${location === '/learn' ? 'text-white bg-[#0B2538] border border-[#6EC5E9]/20' : 'hover:text-white hover:bg-[#0B2538]/50'}`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Student Hub</span>
          </Link>

          {/* Disseminate Dropdown */}
          <div className="relative" onMouseLeave={() => setDisseminateOpen(false)}>
            <button
              onMouseEnter={() => setDisseminateOpen(true)}
              onClick={() => setDisseminateOpen(!disseminateOpen)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:text-white hover:bg-[#0B2538]/50 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-[#22C7A8]" />
              <span>Disseminate</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>

            {disseminateOpen && (
              <div 
                className="absolute top-full right-0 w-60 pt-2 z-50"
                onMouseEnter={() => setDisseminateOpen(true)}
              >
                <div className="polar-panel p-2 shadow-2xl border border-[#6EC5E9]/20 space-y-1">
                  <Link href="/studio" className="flex items-center space-x-2.5 px-3 py-2 rounded-md hover:bg-[#123753] text-xs text-white">
                    <Share2 className="w-4 h-4 text-[#22C7A8]" />
                    <div>
                      <div className="font-semibold">AI Content Studio</div>
                      <div className="text-[10px] text-[#94A3B8]">Source-grounded dissemination</div>
                    </div>
                  </Link>
                  <Link href="/studio/calendar" className="flex items-center space-x-2.5 px-3 py-2 rounded-md hover:bg-[#123753] text-xs text-white">
                    <ActivityIcon className="w-4 h-4 text-[#38BDF8]" />
                    <div>
                      <div className="font-semibold">Outreach Calendar</div>
                      <div className="text-[10px] text-[#94A3B8]">Approved & scheduled releases</div>
                    </div>
                  </Link>
                  <Link href="/admin" className="flex items-center space-x-2.5 px-3 py-2 rounded-md hover:bg-[#123753] text-xs text-white">
                    <UserCheck className="w-4 h-4 text-[#E7A93B]" />
                    <div>
                      <div className="font-semibold">Admin / Scientist Console</div>
                      <div className="text-[10px] text-[#94A3B8]">Role-based portal management</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-2.5">
          {/* Global Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-2 bg-[#0B2538] hover:bg-[#123753] text-[#94A3B8] hover:text-white px-3 py-1.5 rounded-lg border border-[#6EC5E9]/20 transition-all text-xs font-mono"
            title="Press Cmd+K or / to search"
          >
            <Search className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline bg-[#071A2B] px-1.5 py-0.5 rounded text-[10px] text-[#647887] border border-[#6EC5E9]/15">
              ⌘K
            </kbd>
          </button>

          {/* Role Demo Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center space-x-1.5 bg-[#0B2538] hover:bg-[#123753] border border-[#38BDF8]/30 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#22C7A8]" />
              <span className="hidden md:inline text-[11px] text-[#94A3B8]">Role:</span>
              <span className="text-[#38BDF8] font-semibold">{currentRole}</span>
              <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 polar-panel p-2 shadow-2xl border border-[#6EC5E9]/20 z-50">
                <div className="px-2 py-1 text-[10px] font-mono text-[#94A3B8] uppercase border-b border-[#6EC5E9]/15 mb-1">
                  1-Click Demo Access
                </div>
                {ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onSelectRole(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${currentRole === r ? 'bg-[#38BDF8]/20 text-[#38BDF8] font-bold' : 'text-white hover:bg-[#123753]'}`}
                  >
                    <span>{r}</span>
                    {currentRole === r && <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#0B2538] text-white hover:bg-[#123753]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#071A2B] border-b border-[#6EC5E9]/20 px-4 py-4 space-y-2 text-sm">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white font-medium">Home</Link>
          <Link href="/repository" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#38BDF8]">Knowledge Repository</Link>
          <Link href="/expeditions" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#94A3B8]">Expeditions</Link>
          <Link href="/datasets" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#94A3B8]">Datasets</Link>
          <Link href="/observatory" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#22C7A8]">Live Observatory</Link>
          <Link href="/stations" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#94A3B8]">Stations</Link>
          <Link href="/studio" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#38BDF8]">AI Content Studio</Link>
          <Link href="/learn" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#E7A93B]">Student Hub</Link>
          <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#94A3B8]">Admin Console</Link>
        </div>
      )}
    </header>
  );
};
