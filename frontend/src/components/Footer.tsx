import React from 'react';
import { Link } from 'wouter';
import { Database, ExternalLink, Globe, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#050F17] border-t border-[#B9DDE7]/10 pt-16 pb-12 text-[#8E9EA7] text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Col 1 & 2: Institutional Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 text-white font-bold text-lg tracking-tight">
              <span className="w-2.5 h-2.5 rounded-full bg-[#74B8CC]" />
              <span className="font-sans">POLARIS</span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#0D2735] text-[#74B8CC] border border-[#74B8CC]/25">
                MoES · NCPOR
              </span>
            </div>
            <p className="text-[#8E9EA7] leading-relaxed max-w-sm text-xs sm:text-sm">
              Integrated Polar Science Outreach, Knowledge Repository, and Media Dissemination Platform for India's scientific initiatives in Antarctica, the Arctic, the Himalayas, and the Southern Ocean.
            </p>
            <div className="pt-2 text-[11px] text-[#61747E] space-y-1 font-mono">
              <div className="text-[#DCEEF2] font-semibold">National Centre for Polar and Ocean Research (NCPOR)</div>
              <div>Ministry of Earth Sciences, Government of India</div>
              <div>Headland Sada, Vasco da Gama, Goa — 403804, India</div>
            </div>
          </div>

          {/* Col 3: Research Programs */}
          <div>
            <h4 className="text-[#F7F8F5] font-semibold text-xs uppercase tracking-wider mb-4 font-mono">
              Field Science
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/expeditions" className="hover:text-[#74B8CC] transition-colors">Polar Expeditions Archive</Link></li>
              <li><Link href="/stations" className="hover:text-[#74B8CC] transition-colors">Research Stations Registry</Link></li>
              <li><Link href="/observatory" className="hover:text-[#5BB7A5] transition-colors">Live Polar Observatory</Link></li>
              <li><Link href="/repository" className="hover:text-[#74B8CC] transition-colors">Knowledge Repository Search</Link></li>
              <li><Link href="/knowledge-graph" className="hover:text-[#74B8CC] transition-colors">Relational Knowledge Graph</Link></li>
            </ul>
          </div>

          {/* Col 4: Data & Public Outreach */}
          <div>
            <h4 className="text-[#F7F8F5] font-semibold text-xs uppercase tracking-wider mb-4 font-mono">
              Data & Outreach
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/datasets" className="hover:text-[#74B8CC] transition-colors">NPDC Datasets Catalog</Link></li>
              <li><Link href="/publications" className="hover:text-[#D7A75D] transition-colors">Peer-Reviewed Papers</Link></li>
              <li><Link href="/learn" className="hover:text-[#74B8CC] transition-colors">Student Education Hub</Link></li>
              <li><Link href="/media" className="hover:text-[#74B8CC] transition-colors">Scientific Photography</Link></li>
              <li><Link href="/activities" className="hover:text-[#74B8CC] transition-colors">Activities & Dispatches</Link></li>
              <li><Link href="/studio" className="hover:text-[#5BB7A5] transition-colors">AI Content Dissemination Studio</Link></li>
            </ul>
          </div>

          {/* Col 5: Governance & Provenance */}
          <div>
            <h4 className="text-[#F7F8F5] font-semibold text-xs uppercase tracking-wider mb-4 font-mono">
              Standards & Policy
            </h4>
            <div className="space-y-3 text-[11px] leading-relaxed">
              <div className="flex items-start space-x-2">
                <Database className="w-3.5 h-3.5 text-[#74B8CC] mt-0.5 shrink-0" />
                <span>NPDC Open Data Policy under CC-BY-NC 4.0 guidelines.</span>
              </div>
              <div className="flex items-start space-x-2">
                <Globe className="w-3.5 h-3.5 text-[#5BB7A5] mt-0.5 shrink-0" />
                <span>Station meteorological telemetry proxied in real time via Open-Meteo.</span>
              </div>
              <a
                href="https://ncpor.res.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-[#74B8CC] hover:underline pt-1"
              >
                <span>NCPOR Official Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Discrete Hackathon Prototype Notice */}
        <div className="pt-8 border-t border-[#B9DDE7]/10 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#61747E] space-y-4 md:space-y-0">
          <div>
            © 2026 Government of India • Ministry of Earth Sciences (MoES). Prototype developed for{' '}
            <span className="text-[#8E9EA7] font-medium">Smart India Hackathon 2026 — SIH26063</span>.
          </div>
          <div className="flex items-center space-x-6 text-[11px]">
            <span className="hover:text-[#8E9EA7] cursor-pointer">National Data Policy</span>
            <span className="hover:text-[#8E9EA7] cursor-pointer">Accessibility</span>
            <span className="hover:text-[#8E9EA7] cursor-pointer">Terms & Conditions</span>
            <Link href="/admin" className="hover:text-[#74B8CC] transition flex items-center gap-1 font-mono">
              <Shield className="w-3 h-3" />
              <span>Console</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
