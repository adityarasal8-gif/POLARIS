import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type NetworkMode = 'HIGH_BANDWIDTH' | 'SATELLITE_BANDWIDTH' | 'OFFLINE_FIELD';

interface ConnectivityContextType {
  mode: NetworkMode;
  isOnline: boolean;
  manualOverride: boolean;
  setManualOverride: (override: boolean) => void;
  pendingSyncCount: number;
  setPendingSyncCount: (count: number) => void;
}

const ConnectivityContext = createContext<ConnectivityContextType | undefined>(undefined);

export function ConnectivityProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [manualOverride, setManualOverride] = useState<boolean>(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Heartbeat ping to /api/health
    const interval = setInterval(async () => {
      if (navigator.onLine) {
        try {
          const res = await fetch('/api/health', { method: 'GET', cache: 'no-store' });
          if (!res.ok) setIsOnline(false);
          else setIsOnline(true);
        } catch {
          setIsOnline(false);
        }
      } else {
        setIsOnline(false);
      }
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  let mode: NetworkMode = 'HIGH_BANDWIDTH';
  if (!isOnline) {
    mode = 'OFFLINE_FIELD';
  } else if (manualOverride) {
    mode = 'SATELLITE_BANDWIDTH';
  }

  return (
    <ConnectivityContext.Provider value={{ mode, isOnline, manualOverride, setManualOverride, pendingSyncCount, setPendingSyncCount }}>
      {children}
    </ConnectivityContext.Provider>
  );
}

export function useConnectivity() {
  const context = useContext(ConnectivityContext);
  if (context === undefined) {
    throw new Error('useConnectivity must be used within a ConnectivityProvider');
  }
  return context;
}
