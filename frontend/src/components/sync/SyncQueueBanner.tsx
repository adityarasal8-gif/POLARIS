import React, { useEffect, useState } from 'react';
import { useConnectivity } from '../../context/ConnectivityContext';
import { syncOutbox } from '../../utils/offlineStore';
import { RefreshCw, Radio } from 'lucide-react';

export const SyncQueueBanner = () => {
  const { isOnline, pendingSyncCount, setPendingSyncCount, manualOverride } = useConnectivity();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (isOnline && !manualOverride && pendingSyncCount > 0 && !isSyncing) {
      handleSync();
    }
  }, [isOnline, manualOverride, pendingSyncCount, isSyncing]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncOutbox();
      setPendingSyncCount(0);
    } catch (e) {
      console.error('Sync failed', e);
    } finally {
      setIsSyncing(false);
    }
  };

  if (pendingSyncCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-[#111111] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-4 border border-[#FFFFFF]/10 backdrop-blur-md">
        <Radio className="w-5 h-5 text-amber-500 animate-pulse" />
        <div className="flex-1">
          <p className="text-sm font-medium">Satellite Outbox: {pendingSyncCount} {pendingSyncCount === 1 ? 'log' : 'logs'} pending upload.</p>
          <p className="text-xs text-[#8E8E91]">{isOnline && !manualOverride ? 'Auto-sync enabled.' : 'Waiting for High-Speed connection.'}</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing || (!isOnline && manualOverride)}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSyncing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
          <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
        </button>
      </div>
    </div>
  );
};
