import React from 'react';
import { Link } from 'wouter';
import { Database, ExternalLink, Globe, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#111111] border-t border-[#262624] pt-16 pb-12 text-[#8E8E91] text-xs font-sans snap-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Col 1 & 2: Institutional Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 text-white font-bold text-lg tracking-tight">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
              <span className="font-sans">POLARIS</span>
            </div>
            <p className="text-[#8E8E91] leading-relaxed max-w-sm text-xs sm:text-sm">
              Integrated Polar Science Outreach, Knowledge Repository, and Media Dissemination Platform for India's scientific initiatives in Antarctica, the Arctic, the Himalayas, and the Southern Ocean.
            </p>
          </div>

          {/* Col 3: Research Programs */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 font-mono">
              Field Science
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/expeditions" className="hover:text-white transition-colors">Polar Expeditions Archive</Link></li>
              <li><Link href="/stations" className="hover:text-white transition-colors">Research Stations Registry</Link></li>
              <li><Link href="/observatory" className="hover:text-white transition-colors">Live Polar Observatory</Link></li>
              <li><Link href="/repository" className="hover:text-white transition-colors">Knowledge Repository Search</Link></li>
              <li><Link href="/knowledge-graph" className="hover:text-white transition-colors">Relational Knowledge Graph</Link></li>
            </ul>
          </div>

          {/* Col 4: Data & Public Outreach */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 font-mono">
              Data & Outreach
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/datasets" className="hover:text-white transition-colors">NPDC Datasets Catalog</Link></li>
              <li><Link href="/publications" className="hover:text-white transition-colors">Peer-Reviewed Papers</Link></li>
              <li><Link href="/learn" className="hover:text-white transition-colors">Student Education Hub</Link></li>
              <li><Link href="/media" className="hover:text-white transition-colors">Scientific Photography</Link></li>
              <li><Link href="/activities" className="hover:text-white transition-colors">Activities & Dispatches</Link></li>
              <li><Link href="/studio" className="hover:text-white transition-colors">AI Outreach Studio</Link></li>
            </ul>
          </div>

          {/* Col 5: Governance & Provenance */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 font-mono">
              Standards & Policy
            </h4>
            <div className="space-y-3 text-[11px] leading-relaxed">
              <div className="flex items-start space-x-2">
                <Database className="w-3.5 h-3.5 text-[#2563EB] mt-0.5 shrink-0" />
                <span>NPDC Open Data Policy under CC-BY-NC 4.0 guidelines.</span>
              </div>
              <div className="flex items-start space-x-2">
                <Globe className="w-3.5 h-3.5 text-[#2563EB] mt-0.5 shrink-0" />
                <span>Station meteorological telemetry proxied in real time via Open-Meteo.</span>
              </div>
              <a
                href="https://ncpor.res.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-[#2563EB] hover:underline pt-1"
              >
                <span>NCPOR Official Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Discrete Hackathon Prototype Notice */}
        <div className="pt-8 border-t border-[#262624] flex flex-col md:flex-row items-center justify-between text-[11px] text-[#6E6E71] space-y-4 md:space-y-0">
          <div>
            © 2026 POLARIS. Prototype developed for{' '}
            <span className="text-[#A3A3A6] font-medium">Smart India Hackathon 2026 — SIH26063</span>.
          </div>
          <div className="flex items-center space-x-6 text-[11px]">
            <span className="hover:text-white cursor-pointer">National Data Policy</span>
            <span className="hover:text-white cursor-pointer">Accessibility</span>
            <span className="hover:text-white cursor-pointer">Terms & Conditions</span>
            <Link href="/admin" className="hover:text-white transition flex items-center gap-1 font-mono">
              <Shield className="w-3 h-3" />
              <span>Console</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
