import React, { useState, useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';

// Pages
import { HomePage } from './pages/HomePage';
import { RepositoryPage } from './pages/RepositoryPage';
import { ExpeditionsPage } from './pages/ExpeditionsPage';
import { ExpeditionDetailPage } from './pages/ExpeditionDetailPage';
import { DatasetsPage } from './pages/DatasetsPage';
import { DatasetDetailPage } from './pages/DatasetDetailPage';
import PublicationsPage from './pages/PublicationsPage';
import MediaPage from './pages/MediaPage';
import ActivitiesPage from './pages/ActivitiesPage';
import StationsPage from './pages/StationsPage';
import { ObservatoryPage } from './pages/ObservatoryPage';
import { KnowledgeGraphPage } from './pages/KnowledgeGraphPage';
import LearnPage from './pages/LearnPage';
import { StudioPage } from './pages/StudioPage';
import { CalendarPage } from './pages/CalendarPage';
import AdminPage from './pages/AdminPage';

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
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#74B8CC]/30 selection:text-[#07151F] text-[#F7F8F5] bg-[#07151F]">
      {/* Global Header */}
      <Header 
        onOpenSearch={() => setSearchModalOpen(true)}
        currentRole={currentRole}
        onSelectRole={(r) => setCurrentRole(r)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
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
              <span className="text-4xl font-mono text-cyan-400 font-bold">404</span>
              <h1 className="text-2xl font-serif font-bold text-white">Record Not Found in Polar Archive</h1>
              <p className="text-slate-400 text-sm max-w-md">
                The requested URL does not match any index in the National Polar Science Knowledge Platform.
              </p>
              <a
                href="/"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-mono transition"
              >
                Return to Polar Gateway
              </a>
            </div>
          </Route>
        </Switch>
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
