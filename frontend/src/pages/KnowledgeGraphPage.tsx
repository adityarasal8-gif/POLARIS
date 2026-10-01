import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Layers, Info, Compass, Database, FileText, Globe, Tag, 
  ArrowRight, X, ZoomIn, ZoomOut, RotateCcw, Share2, ExternalLink,
  Search, Sparkles, Network, Activity, Filter, Eye
} from 'lucide-react';
import { fetchKnowledgeGraph } from '../api';
import { KnowledgeGraphNode, KnowledgeGraphLink } from '../types';

export const KnowledgeGraphPage: React.FC = () => {
  const [nodes, setNodes] = useState<KnowledgeGraphNode[]>([]);
  const [links, setLinks] = useState<KnowledgeGraphLink[]>([]);
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Dynamic animation and physics state
  const [animTime, setAnimTime] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    fetchKnowledgeGraph()
      .then((data) => {
        setNodes(data.nodes);
        setLinks(data.links);
        if (data.nodes.length > 0) setSelectedNode(data.nodes[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load knowledge graph:', err);
        setLoading(false);
      });
  }, []);

  // Continuous subtle harmonic drift animation (60fps orbital floating)
  useEffect(() => {
    let animId: number;
    const updateMotion = () => {
      setAnimTime((prev) => prev + 0.016);
      animId = requestAnimationFrame(updateMotion);
    };
    animId = requestAnimationFrame(updateMotion);
    return () => cancelAnimationFrame(animId);
  }, []);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'station': return '#111111';
      case 'expedition': return '#2563EB';
      case 'dataset': return '#0284C7';
      case 'publication': return '#16A34A';
      case 'topic': return '#D97706';
      default: return '#555558';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'station': return Globe;
      case 'expedition': return Compass;
      case 'dataset': return Database;
      case 'publication': return FileText;
      case 'topic': return Tag;
      default: return Layers;
    }
  };

  // Base canvas dimensions
  const width = 1100;
  const height = 700;
  const centerX = width / 2;
  const centerY = height / 2;

  // Compute base and dynamically drifted positions for nodes
  const nodePositions = useMemo(() => {
    const positions: { [id: string]: { x: number; y: number; baseX: number; baseY: number } } = {};
    
    nodes.forEach((node, idx) => {
      let baseX = centerX;
      let baseY = centerY;

      if (node.type === 'station') {
        const angle = (idx / 4) * Math.PI * 2 - Math.PI / 4;
        baseX = centerX + Math.cos(angle) * 165;
        baseY = centerY + Math.sin(angle) * 145;
      } else if (node.type === 'expedition') {
        const angle = (idx / 6) * Math.PI * 2 + 0.4;
        baseX = centerX + Math.cos(angle) * 290;
        baseY = centerY + Math.sin(angle) * 230;
      } else if (node.type === 'dataset') {
        const angle = (idx / 8) * Math.PI * 2 + 0.8;
        baseX = centerX + Math.cos(angle) * 410;
        baseY = centerY + Math.sin(angle) * 290;
      } else {
        const angle = (idx / Math.max(nodes.length, 1)) * Math.PI * 2 + 1.2;
        baseX = centerX + Math.cos(angle) * 485;
        baseY = centerY + Math.sin(angle) * 325;
      }

      // Harmonic orbital drift (micro-floating movement)
      const driftX = Math.sin(animTime * 0.9 + idx * 1.35) * 6;
      const driftY = Math.cos(animTime * 0.8 + idx * 1.15) * 5;

      positions[node.id] = {
        baseX,
        baseY,
        x: baseX + driftX,
        y: baseY + driftY
      };
    });

    return positions;
  }, [nodes, animTime, centerX, centerY]);

  // Filtering
  const filteredNodes = useMemo(() => {
    return nodes.filter(n => {
      const matchesType = filterType === 'All' || n.type.toLowerCase() === filterType.toLowerCase();
      const matchesSearch = searchQuery === '' || 
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.region && n.region.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [nodes, filterType, searchQuery]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click
      setIsPanning(true);
      startPanRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPanRef.current.x,
        y: e.clientY - startPanRef.current.y
      });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const centerOnNode = (node: KnowledgeGraphNode) => {
    setSelectedNode(node);
    const pos = nodePositions[node.id];
    if (pos) {
      setPan({
        x: (centerX - pos.baseX) * zoom,
        y: (centerY - pos.baseY) * zoom
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] text-[#111111] flex flex-col relative overflow-hidden select-none font-sans">
      {/* Ambient Floating Scientific & Knowledge Perimeter Glyphs */}
      <div className="absolute top-20 left-10 text-[#111111]/8 pointer-events-none select-none animate-float-1 z-0 hidden lg:block">
        <Network className="w-24 h-24 stroke-[1.2]" />
      </div>
      <div className="absolute top-28 right-16 text-[#111111]/8 pointer-events-none select-none animate-float-2 z-0 hidden lg:block">
        <Globe className="w-20 h-20 stroke-[1.2]" />
      </div>
      <div className="absolute bottom-20 left-1/4 text-[#111111]/6 pointer-events-none select-none animate-subtle-drift z-0 hidden md:block">
        <Compass className="w-20 h-20 stroke-[1.2]" />
      </div>
      <div className="absolute bottom-28 right-1/4 text-[#111111]/6 pointer-events-none select-none animate-subtle-drift-rev z-0 hidden md:block">
        <Database className="w-24 h-24 stroke-[1.1]" />
      </div>

      {/* Top Floating Nav, Search & Graph HUD */}
      <div className="absolute top-16 left-0 right-0 z-20 px-4 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 pointer-events-none">
        
        {/* Title, Live Pulse & Telemetry HUD */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-[#E8E6E0] shadow-xs flex items-center justify-between sm:justify-start gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#555558] uppercase tracking-wide font-medium">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping-subtle" />
              <span>DYNAMIC KNOWLEDGE GRAPH · SIH26063</span>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl text-[#111111] font-medium mt-0.5">
              Relational Polar Science Network
            </h1>
            <div className="flex items-center gap-3 text-xs text-[#8E8E91] font-mono mt-0.5">
              <span>{nodes.length} verified entities</span>
              <span>·</span>
              <span>{links.length} relational conduits</span>
              <span>·</span>
              <span className="text-[#2563EB] font-medium flex items-center gap-1">
                <Activity className="w-3 h-3 animate-pulse" />
                Live Flux
              </span>
            </div>
          </div>
        </div>

        {/* Search, Filter Pills & Zoom Dock */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          {/* Quick Node Search */}
          <div className="relative flex items-center bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E8E6E0] shadow-xs">
            <Search className="w-3.5 h-3.5 text-[#8E8E91] mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter nodes..."
              className="bg-transparent text-xs text-[#111111] placeholder-[#8E8E91] focus:outline-none w-28 sm:w-36 font-mono"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-[#8E8E91] hover:text-[#111111] ml-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-full border border-[#E8E6E0] shadow-xs">
            {['All', 'station', 'expedition', 'dataset', 'publication', 'topic'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-full text-xs font-mono tracking-wide transition-all cursor-pointer capitalize ${
                  filterType === type
                    ? 'bg-[#111111] text-white font-medium shadow-xs'
                    : 'text-[#555558] hover:text-[#111111] hover:bg-[#F4F2EE]'
                }`}
              >
                {type === 'All' ? 'All' : `${type}s`}
              </button>
            ))}
          </div>

          {/* Canvas Controls (Zoom In, Zoom Out, Reset) */}
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-full border border-[#E8E6E0] shadow-xs">
            <button
              onClick={() => setZoom(prev => Math.min(prev + 0.15, 2.2))}
              title="Zoom In"
              className="p-1.5 rounded-full text-[#555558] hover:text-[#111111] hover:bg-[#F4F2EE] transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.55))}
              title="Zoom Out"
              className="p-1.5 rounded-full text-[#555558] hover:text-[#111111] hover:bg-[#F4F2EE] transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetView}
              title="Reset View"
              className="p-1.5 rounded-full text-[#555558] hover:text-[#111111] hover:bg-[#F4F2EE] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Full-Bleed Canvas with Pan, Zoom & Automatic Orbit Physics */}
      <div 
        className="flex-1 w-full h-[calc(100vh-64px)] pt-16 flex items-center justify-center relative cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {loading ? (
          <div className="text-center space-y-3 font-mono text-sm text-[#8E8E91]">
            <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Constructing relational graph layout & orbital coordinates...</p>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-2 overflow-hidden">
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              className="w-full h-full max-h-[85vh] transition-transform duration-75"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`
              }}
            >
              <defs>
                <radialGradient id="graphBgGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F4F2EE" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FAFAF8" stopOpacity="0" />
                </radialGradient>

                {/* Animated Gradient for active scientific data packets */}
                <linearGradient id="packetGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="1" />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              <rect width={width} height={height} fill="url(#graphBgGlow)" />

              {/* Concentric Polar Reference Orbital Rings */}
              <circle cx={centerX} cy={centerY} r={165} fill="none" stroke="#E8E6E0" strokeDasharray="4 6" opacity={0.8} />
              <circle cx={centerX} cy={centerY} r={290} fill="none" stroke="#E8E6E0" strokeDasharray="4 6" opacity={0.8} />
              <circle cx={centerX} cy={centerY} r={410} fill="none" stroke="#E8E6E0" strokeDasharray="4 6" opacity={0.7} />
              <circle cx={centerX} cy={centerY} r={485} fill="none" stroke="#E8E6E0" strokeDasharray="4 6" opacity={0.5} />

              {/* Ring Labels */}
              <text x={centerX + 170} y={centerY - 8} fontSize={9} fill="#8E8E91" fontFamily="JetBrains Mono, monospace">Station Inner Ring (45°)</text>
              <text x={centerX + 295} y={centerY - 8} fontSize={9} fill="#8E8E91" fontFamily="JetBrains Mono, monospace">Expedition Mid Ring (65°)</text>
              <text x={centerX + 415} y={centerY - 8} fontSize={9} fill="#8E8E91" fontFamily="JetBrains Mono, monospace">Dataset Cryosphere Ring (75°)</text>

              {/* Conduits / Relational Links */}
              {links.map((link, i) => {
                const p1 = nodePositions[link.source];
                const p2 = nodePositions[link.target];
                if (!p1 || !p2) return null;
                const isConnected = selectedNode && (selectedNode.id === link.source || selectedNode.id === link.target);

                // Calculate position of streaming telemetry packet moving along this conduit
                const packetProgress = (animTime * 0.25 + (i * 0.13)) % 1;
                const packetX = p1.x + (p2.x - p1.x) * packetProgress;
                const packetY = p1.y + (p2.y - p1.y) * packetProgress;

                return (
                  <g key={i}>
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={isConnected ? '#111111' : '#E8E6E0'}
                      strokeWidth={isConnected ? 2.2 : 1}
                      strokeDasharray={isConnected ? 'none' : '3 3'}
                      className="transition-colors duration-300"
                    />

                    {/* Active streaming data packet traveling along line */}
                    {(isConnected || i % 2 === 0) && (
                      <circle
                        cx={packetX}
                        cy={packetY}
                        r={isConnected ? 2.5 : 1.8}
                        fill={isConnected ? '#2563EB' : '#8E8E91'}
                        opacity={isConnected ? 0.9 : 0.6}
                      />
                    )}
                  </g>
                );
              })}

              {/* Nodes with Orbital Drift */}
              {filteredNodes.map((node) => {
                const pos = nodePositions[node.id];
                if (!pos) return null;
                const isSelected = selectedNode?.id === node.id;
                const color = getNodeColor(node.type);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      centerOnNode(node);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Outer Pulsing Selection Orbit */}
                    {isSelected && (
                      <>
                        <circle
                          r={28}
                          fill="none"
                          stroke="#2563EB"
                          strokeWidth={1}
                          strokeDasharray="4 4"
                          className="animate-spin"
                          style={{ animationDuration: '12s' }}
                        />
                        <circle
                          r={23}
                          fill="none"
                          stroke="#111111"
                          strokeWidth={1.5}
                        />
                      </>
                    )}

                    {/* Main Node Housing */}
                    <circle
                      r={isSelected ? 16 : 12}
                      fill="#FFFFFF"
                      stroke={isSelected ? '#111111' : color}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      className="group-hover:scale-115 transition-transform duration-200 shadow-sm"
                    />

                    {/* Node Core Indicator */}
                    <circle 
                      r={isSelected ? 6 : 4} 
                      fill={color} 
                      className="transition-all"
                    />

                    {/* Entity Label */}
                    <text
                      y={24}
                      textAnchor="middle"
                      fill={isSelected ? '#111111' : '#555558'}
                      fontSize={isSelected ? 11 : 9.5}
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight={isSelected ? '600' : '400'}
                      className="group-hover:fill-black transition-colors select-none"
                    >
                      {node.name.length > 20 ? `${node.name.slice(0, 18)}...` : node.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* Slide-in Side Drawer (Detail Panel) */}
        {selectedNode && (
          <aside className="absolute right-4 sm:right-6 top-36 bottom-8 w-80 sm:w-96 bg-white/95 backdrop-blur-xl border border-[#E8E6E0] rounded-3xl p-6 shadow-xl flex flex-col justify-between z-30 transition-all card-hover-spring">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#E8E6E0] pb-4">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: getNodeColor(selectedNode.type) }} 
                  />
                  <span className="text-xs font-mono uppercase tracking-wide text-[#555558] font-semibold">
                    {selectedNode.type} Entity
                  </span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-full text-[#8E8E91] hover:text-[#111111] hover:bg-[#F4F2EE] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-[#111111] font-medium leading-tight">
                  {selectedNode.name}
                </h3>
                <div className="flex items-center gap-2 text-xs font-mono text-[#8E8E91]">
                  <span>ID: {selectedNode.id}</span>
                  <span>·</span>
                  <span className="text-[#111111] font-medium">{selectedNode.region || 'Polar Domain'}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E6E0] text-xs text-[#555558] leading-relaxed font-light">
                {selectedNode.details}
              </div>

              {/* Connected Action Buttons */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-[#8E8E91] tracking-wider">
                  Connected Domain Actions
                </h4>
                {selectedNode.type === 'expedition' && (
                  <a
                    href={`/expeditions/${selectedNode.id}`}
                    className="w-full py-2.5 px-4 rounded-full bg-[#111111] hover:bg-black text-white font-medium text-xs font-mono flex items-center justify-between transition-colors shadow-sm"
                  >
                    <span>Open Expedition Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
                {selectedNode.type === 'dataset' && (
                  <a
                    href={`/datasets/${selectedNode.id}`}
                    className="w-full py-2.5 px-4 rounded-full bg-[#111111] hover:bg-black text-white font-medium text-xs font-mono flex items-center justify-between transition-colors shadow-sm"
                  >
                    <span>Inspect Open Dataset</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
                {selectedNode.type === 'station' && (
                  <a
                    href={`/stations`}
                    className="w-full py-2.5 px-4 rounded-full bg-[#111111] hover:bg-black text-white font-medium text-xs font-mono flex items-center justify-between transition-colors shadow-sm"
                  >
                    <span>View Station Telemetry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E6E0] text-[11px] font-mono text-[#8E8E91] flex items-center justify-between">
              <span>NCPOR Relational Linkage</span>
              <span className="text-[#16A34A] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping-subtle" />
                Verified
              </span>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
