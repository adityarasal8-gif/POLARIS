import React, { useState, useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';

// Primary Instant Route
import { HomePage } from './pages/HomePage';

// Code-split dynamic routes for optimal Core Web Vitals & sub-millisecond initial bundle
const RepositoryPage = React.lazy(() => import('./pages/RepositoryPage').then(m => ({ default: m.RepositoryPage })));
const ExpeditionsPage = React.lazy(() => import('./pages/ExpeditionsPage').then(m => ({ default: m.ExpeditionsPage })));
const ExpeditionDetailPage = React.lazy(() => import('./pages/ExpeditionDetailPage').then(m => ({ default: m.ExpeditionDetailPage })));
const DatasetsPage = React.lazy(() => import('./pages/DatasetsPage').then(m => ({ default: m.DatasetsPage })));
const DatasetDetailPage = React.lazy(() => import('./pages/DatasetDetailPage').then(m => ({ default: m.DatasetDetailPage })));
const PublicationsPage = React.lazy(() => import('./pages/PublicationsPage'));
const MediaPage = React.lazy(() => import('./pages/MediaPage'));
const ActivitiesPage = React.lazy(() => import('./pages/ActivitiesPage'));
const StationsPage = React.lazy(() => import('./pages/StationsPage'));
const ObservatoryPage = React.lazy(() => import('./pages/ObservatoryPage').then(m => ({ default: m.ObservatoryPage })));
const KnowledgeGraphPage = React.lazy(() => import('./pages/KnowledgeGraphPage').then(m => ({ default: m.KnowledgeGraphPage })));
const LearnPage = React.lazy(() => import('./pages/LearnPage'));
const StudioPage = React.lazy(() => import('./pages/StudioPage').then(m => ({ default: m.StudioPage })));
const CalendarPage = React.lazy(() => import('./pages/CalendarPage').then(m => ({ default: m.CalendarPage })));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));

function PolarSuspenseFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-[#2563EB]/20 animate-ping-subtle" />
        <div className="w-10 h-10 rounded-full border-2 border-[#E8E6E0] border-t-[#2563EB] animate-spin" />
        <div className="absolute w-2 h-2 rounded-full bg-[#2563EB]" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-mono tracking-widest text-[#111111] uppercase font-semibold">
          POLARIS ARCHIVE STREAM
        </p>
        <p className="text-[11px] font-mono text-[#8E8E91]">
          Synthesizing module telemetry & metadata...
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState('Administrator');
  const [location] = useLocation();

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Global keyboard shortcuts for Cmd+K and '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in an input or textarea, don't trigger '/'
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea';

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#111111] selection:text-[#FFFFFF] text-[#111111] bg-[#FAFAF8]">
      {/* Global Header */}
      <Header 
        onOpenSearch={() => setSearchModalOpen(true)}
        currentRole={currentRole}
        onSelectRole={(r) => setCurrentRole(r)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        <React.Suspense fallback={<PolarSuspenseFallback />}>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/repository" component={RepositoryPage} />
            
            {/* Expeditions */}
            <Route path="/expeditions" component={ExpeditionsPage} />
            <Route path="/expeditions/:id" component={ExpeditionDetailPage} />
            
            {/* Datasets */}
            <Route path="/datasets" component={DatasetsPage} />
            <Route path="/datasets/:id" component={DatasetDetailPage} />
            
            {/* Publications, Media & Activities */}
            <Route path="/publications" component={PublicationsPage} />
            <Route path="/media" component={MediaPage} />
            <Route path="/activities" component={ActivitiesPage} />
            
            {/* Research Stations & Observatory */}
            <Route path="/stations" component={StationsPage} />
            <Route path="/observatory" component={ObservatoryPage} />
            <Route path="/knowledge-graph" component={KnowledgeGraphPage} />
            
            {/* Smart Education Hub */}
            <Route path="/learn" component={LearnPage} />
            
            {/* AI Content Dissemination Studio */}
            <Route path="/studio" component={StudioPage} />
            <Route path="/studio/calendar" component={CalendarPage} />
            
            {/* Admin & Scientist Portal */}
            <Route path="/admin">
              <AdminPage currentRole={currentRole} onRoleChange={(r) => setCurrentRole(r)} />
            </Route>

            {/* 404 Fallback */}
            <Route>
              <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
                <span className="text-5xl font-serif text-[#111111] font-light">404</span>
                <h1 className="text-2xl font-serif font-medium text-[#111111]">Record Not Found in Polar Archive</h1>
                <p className="text-[#555558] text-sm max-w-md leading-relaxed">
                  The requested URL does not match any index in the National Polar Science Knowledge Platform.
                </p>
                <a
                  href="/"
                  className="btn-primary text-xs"
                >
                  Return to Polar Gateway
                </a>
              </div>
            </Route>
          </Switch>
        </React.Suspense>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Quick Command & Unified Search Overlay (Cmd+K) */}
      <GlobalSearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)} 
      />
    </div>
  );
}
