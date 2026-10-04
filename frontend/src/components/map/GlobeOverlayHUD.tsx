import React from 'react';
import { ShieldCheck, CloudLightning, Navigation2, Activity } from 'lucide-react';

export const GlobeOverlayHUD: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
      
      {/* Top Left: Global Mission Status */}
      <div className="self-start animate-fade-in pointer-events-auto">
        <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">
              Polaris Global Command
            </span>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent my-1" />
          <div className="text-xs font-mono text-[#E2E8F0]">
            <span className="text-white font-bold">Active Assets:</span> 4 Stations | 2 Vessels
          </div>
          <div className="text-[10px] font-mono text-[#94A3B8] flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
            142 Personnel Deployed
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4 w-full">
        
        {/* Bottom Left: Live Feed Ticker */}
        <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-2xl max-w-md w-full overflow-hidden pointer-events-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
            <Activity className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="text-[9px] font-mono font-bold text-[#94A3B8] uppercase tracking-widest">Live Telemetry</span>
          </div>
          <div className="relative w-full h-4 overflow-hidden">
            <div className="absolute whitespace-nowrap animate-marquee text-[10px] font-mono text-white flex gap-8">
              <span>MAITRI: -22.4°C, Wind 45km/h</span>
              <span className="text-[#38BDF8]">|</span>
              <span>BHARATI: Supply Vessel Docked</span>
              <span className="text-[#38BDF8]">|</span>
              <span>HIMADRI: AOD Reading Nominal</span>
              <span className="text-[#38BDF8]">|</span>
              <span>HIMANSH: Blizzard Warning Active</span>
            </div>
          </div>
        </div>

        {/* Bottom Right: Controls/Legend */}
        <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl pointer-events-auto flex flex-col gap-2">
          <button className="flex items-center justify-between w-40 px-3 py-1.5 hover:bg-white/10 rounded-lg transition-colors group">
            <span className="text-[10px] font-mono text-[#E2E8F0] group-hover:text-white transition-colors">Flight Corridors</span>
            <div className="w-8 h-4 bg-[#2563EB] rounded-full relative">
              <div className="absolute right-1 top-0.5 w-3 h-3 bg-white rounded-full" />
            </div>
          </button>
          <button className="flex items-center justify-between w-40 px-3 py-1.5 hover:bg-white/10 rounded-lg transition-colors group">
            <span className="text-[10px] font-mono text-[#E2E8F0] group-hover:text-white transition-colors">Topography</span>
            <div className="w-8 h-4 bg-[#2563EB] rounded-full relative">
              <div className="absolute right-1 top-0.5 w-3 h-3 bg-white rounded-full" />
            </div>
          </button>
          <button className="flex items-center justify-between w-40 px-3 py-1.5 hover:bg-white/10 rounded-lg transition-colors group">
            <span className="text-[10px] font-mono text-[#E2E8F0] group-hover:text-white transition-colors">Live Weather</span>
            <div className="w-8 h-4 bg-white/20 rounded-full relative">
              <div className="absolute left-1 top-0.5 w-3 h-3 bg-white rounded-full" />
            </div>
          </button>
        </div>
        
      </div>
    </div>
  );
};
