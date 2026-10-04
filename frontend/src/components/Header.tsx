import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Compass, Search, ChevronDown, Menu, X, 
  BookOpen, Database, Image, FileText, 
  Activity as ActivityIcon, Globe, Lock
} from 'lucide-react';
import { usePersona, Persona } from '../context/PersonaContext';
import { AuthModal } from './AuthModal';
import { LogIn, LogOut, User } from 'lucide-react';

interface HeaderProps {
  onOpenSearch?: () => void;
  currentRole?: string;
  onSelectRole?: (role: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { persona, setPersona } = usePersona();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E8E6E0] transition-colors">
      {/* Main Navigation Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
            <div className="flex items-center">
              <span className="text-lg font-bold tracking-tight text-[#111111] font-sans">POLARIS</span>
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
          <div className="relative group">
            <button
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full hover:text-[#111111] hover:bg-[#111111]/5 transition-all"
            >
              <span>Discover</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8E8E91]" />
            </button>

            <div 
              className="absolute top-full left-0 w-64 pt-2 z-50 animate-in fade-in duration-150 hidden group-hover:block"
            >
                <div className="bg-[#FFFFFF] p-2.5 rounded-2xl shadow-xl border border-[#E8E6E0] space-y-1">
                  <Link href="/expeditions" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F2EE] text-xs text-[#111111] group">
                    <Compass className="w-4 h-4 text-[#2563EB] group-hover:scale-110 transition-transform" />
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
                    <Image className="w-4 h-4 text-[#2563EB] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#111111]">Photo & Media Archive</div>
                      <div className="text-[10px] text-[#555558]">Authentic scientific photography</div>
                    </div>
                  </Link>
                  <Link href="/activities" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F2EE] text-xs text-[#111111] group">
                    <ActivityIcon className="w-4 h-4 text-[#2563EB] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#111111]">Activities & Dispatches</div>
                      <div className="text-[10px] text-[#555558]">Field bulletins & institutional news</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

          {/* Research Dropdown */}
          <div className="relative group">
            <button
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full hover:text-[#111111] hover:bg-[#111111]/5 transition-all"
            >
              <span>Research</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8E8E91]" />
            </button>

            <div 
              className="absolute top-full left-0 w-64 pt-2 z-50 animate-in fade-in duration-150 hidden group-hover:block"
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
                    <FileText className="w-4 h-4 text-[#2563EB] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#111111]">Publications Library</div>
                      <div className="text-[10px] text-[#555558]">Peer-reviewed papers & DOIs</div>
                    </div>
                  </Link>
                  <Link href="/knowledge-graph" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F2EE] text-xs text-[#111111] group">
                    <Compass className="w-4 h-4 text-[#2563EB] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#111111]">Relational Knowledge Graph</div>
                      <div className="text-[10px] text-[#555558]">Interactive science network</div>
                    </div>
                  </Link>
                  <Link href="/studio" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F2EE] text-xs text-[#111111] group">
                    <ActivityIcon className="w-4 h-4 text-[#2563EB] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#111111]">AI Outreach Studio</div>
                      <div className="text-[10px] text-[#555558]">Editorial dissemination desk</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>



          <Link 
            href="/explore" 
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${location === '/explore' ? 'text-[#111111] bg-[#111111]/5 font-semibold' : 'hover:text-[#111111] hover:bg-[#111111]/5'}`}
          >
            <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Explore</span>
          </Link>

          <Link 
            href="/learn" 
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${location === '/learn' ? 'text-[#111111] bg-[#111111]/5 font-semibold' : 'hover:text-[#111111] hover:bg-[#111111]/5'}`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Learn</span>
          </Link>

          {persona === 'MoES Scientist' && (
            <Link 
              href="/scientist-dashboard" 
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${location === '/scientist-dashboard' ? 'text-[#111111] bg-[#111111]/5 font-semibold' : 'hover:text-[#111111] hover:bg-[#111111]/5'}`}
            >
              <ActivityIcon className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>Scientist Dashboard</span>
            </Link>
          )}

          {persona === 'MoES Admin' && (
            <Link 
              href="/admin-dashboard" 
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${location === '/admin-dashboard' ? 'text-[#111111] bg-[#111111]/5 font-semibold' : 'hover:text-[#111111] hover:bg-[#111111]/5'}`}
            >
              <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Admin Center</span>
            </Link>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-3">
          
          {/* Quick Search Trigger Pill */}
          <button
            type="button"
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

          {/* Authentication System */}
          {persona === 'Public' ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#111111] hover:opacity-85 text-white text-xs font-semibold shadow-[0_4px_14px_rgba(17,17,17,0.18)] transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login / Sign Up</span>
            </button>
          ) : (
            <div className="relative group">
              <button
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#111111] text-white text-xs font-mono font-semibold transition-all shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>{persona === 'MoES Scientist' ? 'Scientist' : 'Admin'}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              <div className="absolute right-0 top-full pt-2 w-48 z-50 animate-in fade-in slide-in-from-top-2 hidden group-hover:block">
                <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E8E6E0] py-2">
                  <div className="px-4 py-2 border-b border-[#E8E6E0] mb-1">
                    <p className="text-[10px] text-[#8E8E91] uppercase tracking-wider">Signed in as</p>
                    <p className="text-xs font-bold text-[#111111] truncate">{persona}</p>
                  </div>
                  <button
                    onClick={() => {
                      setPersona('Public');
                      setLocation('/');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-mono text-[#DC2626] hover:bg-[#FEF2F2] transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Secure Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}



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
          <button 
            type="button"
            onClick={() => { setMobileMenuOpen(false); onOpenSearch?.(); }} 
            className="w-full text-left py-2 text-[#555558] hover:text-[#111111] flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#2563EB]" />
              <span>Search Repository</span>
            </span>
            <kbd className="bg-[#E8E6E0] px-2 py-0.5 rounded text-[10px] font-mono">⌘K</kbd>
          </button>
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#111111] font-semibold">Home</Link>
          <Link href="/expeditions" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#555558]">Polar Expeditions Archive</Link>
          <Link href="/stations" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#555558]">Research Stations</Link>
          <Link href="/observatory" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#111111] font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <span>Live Polar Observatory</span>
          </Link>
          <Link href="/datasets" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#2563EB]">NPDC Datasets Catalog</Link>
          <Link href="/publications" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#555558]">Publications & Research</Link>
          <Link href="/repository" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#555558]">Knowledge Repository Search</Link>
          <Link href="/learn" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#2563EB]">Student Hub & Quiz</Link>
          <Link href="/explore" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#2563EB]">Explore Feed & DOIs</Link>
          
          {persona === 'MoES Scientist' && (
            <Link href="/scientist-dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-[#DC2626]">Scientist Dashboard</Link>
          )}
          {persona === 'MoES Admin' && (
            <Link href="/admin-dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-[#16A34A]">Admin Center</Link>
          )}

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
      
      {/* Official Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};
