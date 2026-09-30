import React from 'react';
import { Link } from 'wouter';
import { ShieldCheck, Database, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#051320] border-t border-[#6EC5E9]/15 pt-12 pb-8 text-[#94A3B8] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1 & 2: Institutional Identity */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-base tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
              <span>POLARIS</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                MoES
              </span>
            </div>
            <p className="text-[#94A3B8] leading-relaxed max-w-sm">
              Integrated Polar Science Outreach, Knowledge Repository and Media Dissemination Portal for India's scientific initiatives in Antarctica, the Arctic, the Himalayas, and the Southern Ocean.
            </p>
            <div className="pt-2 text-[11px] text-[#647887] space-y-1">
              <div>National Centre for Polar and Ocean Research (NCPOR)</div>
              <div>Ministry of Earth Sciences (MoES), Government of India</div>
              <div>Headland Sada, Vasco da Gama, Goa — 403804</div>
            </div>
          </div>

          {/* Col 3: Research Portals */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 font-mono">
              Research Portals
            </h4>
            <ul className="space-y-2">
              <li><Link href="/expeditions" className="hover:text-[#38BDF8] transition-colors">Polar Expeditions</Link></li>
              <li><Link href="/datasets" className="hover:text-[#38BDF8] transition-colors">NPDC Datasets Catalog</Link></li>
              <li><Link href="/publications" className="hover:text-[#38BDF8] transition-colors">Peer-Reviewed Papers</Link></li>
              <li><Link href="/stations" className="hover:text-[#38BDF8] transition-colors">Research Stations</Link></li>
              <li><Link href="/observatory" className="hover:text-[#38BDF8] transition-colors">Live Polar Observatory</Link></li>
              <li><Link href="/knowledge-graph" className="hover:text-[#38BDF8] transition-colors">Knowledge Graph</Link></li>
            </ul>
          </div>

          {/* Col 4: Public Dissemination */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 font-mono">
              Dissemination & Hub
            </h4>
            <ul className="space-y-2">
              <li><Link href="/studio" className="hover:text-[#22C7A8] transition-colors">AI Content Studio</Link></li>
              <li><Link href="/studio/calendar" className="hover:text-[#22C7A8] transition-colors">Outreach Calendar</Link></li>
              <li><Link href="/media" className="hover:text-[#22C7A8] transition-colors">Scientific Media Gallery</Link></li>
              <li><Link href="/activities" className="hover:text-[#22C7A8] transition-colors">Institutional News</Link></li>
              <li><Link href="/learn" className="hover:text-[#E7A93B] transition-colors">Student Education Hub</Link></li>
              <li><Link href="/admin" className="hover:text-[#E7A93B] transition-colors">Scientist & Admin Console</Link></li>
            </ul>
          </div>

          {/* Col 5: Data Governance & Provenance */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 font-mono">
              Provenance & Open Data
            </h4>
            <div className="space-y-2.5 text-[11px]">
              <div className="flex items-start space-x-2">
                <Database className="w-3.5 h-3.5 text-[#38BDF8] mt-0.5 shrink-0" />
                <span>NPDC Open Data Policy under CC-BY-NC 4.0 guidelines</span>
              </div>
              <div className="flex items-start space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22C7A8] mt-0.5 shrink-0" />
                <span>Ground-truth telemetry verified with Open-Meteo API</span>
              </div>
              <a
                href="https://ncpor.res.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-[#38BDF8] hover:underline pt-1"
              >
                <span>NCPOR Official Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Hackathon & Legal Notice */}
        <div className="pt-8 border-t border-[#6EC5E9]/10 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#647887] space-y-4 md:space-y-0">
          <div>
            © 2026 Government of India • Ministry of Earth Sciences. Prototype developed for{' '}
            <span className="text-[#38BDF8] font-semibold">Smart India Hackathon 2026 — SIH26063</span>.
          </div>
          <div className="flex items-center space-x-6 text-[11px]">
            <span className="hover:text-[#94A3B8] cursor-pointer">Data Policy</span>
            <span className="hover:text-[#94A3B8] cursor-pointer">Accessibility Statement</span>
            <span className="hover:text-[#94A3B8] cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-[#94A3B8] cursor-pointer">Demonstration Corpus Notice</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
