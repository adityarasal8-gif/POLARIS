import React, { useState } from 'react';
import { useConnectivity } from '../context/ConnectivityContext';
import { Wifi, WifiOff, Radio, ChevronDown, CheckCircle2 } from 'lucide-react';

export const ConnectivityBadge = () => {
  const { mode, isOnline, manualOverride, setManualOverride, pendingSyncCount } = useConnectivity();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  let statusColor = '';
  let statusText = '';
  let Icon = Wifi;

  if (mode === 'HIGH_BANDWIDTH') {
    statusColor = 'text-green-500';
    statusText = 'INSAT-3DR Uplink Online (High-Speed)';
    Icon = Wifi;
  } else if (mode === 'SATELLITE_BANDWIDTH') {
    statusColor = 'text-amber-500';
    statusText = 'Satellite Low-Bandwidth Mode (<64 kbps)';
    Icon = Radio;
  } else {
    statusColor = 'text-red-500';
    statusText = 'Offline Field Mode (Cached)';
    Icon = WifiOff;
  }

  return (
    <div className="relative" onMouseLeave={() => setDropdownOpen(false)}>
      <button
        onMouseEnter={() => setDropdownOpen(true)}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-[#E8E6E0] bg-[#FFFFFF] hover:bg-[#F4F2EE] transition-all text-xs font-mono shadow-sm`}
      >
        <Icon className={`w-3.5 h-3.5 ${statusColor}`} />
        <span className="hidden sm:inline font-medium text-[#111111]">{statusText}</span>
        <ChevronDown className="w-3.5 h-3.5 text-[#555558]" />
      </button>

      {dropdownOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-64 bg-[#FFFFFF] p-3 rounded-2xl shadow-xl border border-[#E8E6E0] z-50 animate-in fade-in slide-in-from-top-2"
          onMouseEnter={() => setDropdownOpen(true)}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8E6E0] pb-2">
              <span className="text-xs font-bold text-[#111111] uppercase tracking-wide">Network Status</span>
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => setManualOverride(false)}
                disabled={!isOnline}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  !isOnline ? 'opacity-50 cursor-not-allowed' :
                  !manualOverride ? 'bg-[#F4F2EE] font-semibold text-[#111111]' : 'hover:bg-[#F4F2EE] text-[#555558]'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <Wifi className="w-3.5 h-3.5 text-green-500" />
                  <span>High Bandwidth</span>
                </span>
                {!manualOverride && isOnline && <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />}
              </button>

              <button 
                onClick={() => setManualOverride(true)}
                disabled={!isOnline}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  !isOnline ? 'opacity-50 cursor-not-allowed' :
                  manualOverride ? 'bg-[#F4F2EE] font-semibold text-[#111111]' : 'hover:bg-[#F4F2EE] text-[#555558]'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <Radio className="w-3.5 h-3.5 text-amber-500" />
                  <span>Satellite Data-Saver</span>
                </span>
                {manualOverride && isOnline && <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />}
              </button>
            </div>

            <div className="pt-2 border-t border-[#E8E6E0]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#555558]">Outbox Queue:</span>
                <span className={`font-mono font-bold ${pendingSyncCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                  {pendingSyncCount} pending
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
