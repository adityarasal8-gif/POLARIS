import React, { useState, useEffect } from 'react';
import { 
  Layers, Info, Compass, Database, FileText, Globe, Tag, 
  ArrowRight, X, ZoomIn, ZoomOut, RotateCcw, Share2, ExternalLink
} from 'lucide-react';
import { fetchKnowledgeGraph } from '../api';
import { KnowledgeGraphNode, KnowledgeGraphLink } from '../types';

export const KnowledgeGraphPage: React.FC = () => {
  const [nodes, setNodes] = useState<KnowledgeGraphNode[]>([]);
  const [links, setLinks] = useState<KnowledgeGraphLink[]>([]);
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('All');
  const [loading, setLoading] = useState(true);

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

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'station': return '#B9DDE7';
      case 'expedition': return '#D7A75D';
      case 'dataset': return '#74B8CC';
      case 'publication': return '#5BB7A5';
      case 'topic': return '#C4B5FD';
      default: return '#94A3B8';
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

  // Canvas dimensions
  const width = 1100;
  const height = 700;
  const centerX = width / 2;
  const centerY = height / 2;

  // Position nodes radially according to hierarchy
  const nodePositions: { [id: string]: { x: number; y: number } } = {};
  nodes.forEach((node, idx) => {
    if (node.type === 'station') {
      const angle = (idx / 4) * Math.PI * 2 - Math.PI / 4;
      nodePositions[node.id] = {
        x: centerX + Math.cos(angle) * 160,
        y: centerY + Math.sin(angle) * 140
      };
    } else if (node.type === 'expedition') {
      const angle = (idx / 6) * Math.PI * 2 + 0.4;
      nodePositions[node.id] = {
        x: centerX + Math.cos(angle) * 290,
        y: centerY + Math.sin(angle) * 230
      };
    } else if (node.type === 'dataset') {
      const angle = (idx / 8) * Math.PI * 2 + 0.8;
      nodePositions[node.id] = {
        x: centerX + Math.cos(angle) * 410,
        y: centerY + Math.sin(angle) * 290
      };
    } else {
      const angle = (idx / Math.max(nodes.length, 1)) * Math.PI * 2 + 1.2;
      nodePositions[node.id] = {
        x: centerX + Math.cos(angle) * 480,
        y: centerY + Math.sin(angle) * 320
      };
    }
  });

  const filteredNodes = filterType === 'All' 
    ? nodes 
    : nodes.filter(n => n.type.toLowerCase() === filterType.toLowerCase());

  return (
    <div className="w-full min-h-screen bg-[#07151F] text-white flex flex-col relative overflow-hidden select-none">
      {/* Top Floating Minimal Nav / Controls */}
      <div className="absolute top-20 left-0 right-0 z-20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pointer-events-none">
        {/* Title & Metadata */}
        <div className="pointer-events-auto bg-[#07151F]/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[#74B8CC] uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#5BB7A5] animate-ping" />
            <span>Interactive Knowledge Graph</span>
          </div>
          <h1 className="font-editorial text-2xl text-white font-normal mt-0.5">
            Relational Polar Science Network
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono">
            {nodes.length} entities · {links.length} relational connections
          </p>
        </div>

        {/* Filter Pills */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 bg-[#07151F]/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-2xl">
          {['All', 'station', 'expedition', 'dataset', 'publication', 'topic'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono tracking-wide transition-all cursor-pointer capitalize ${
                filterType === type
                  ? 'bg-white text-[#07151F] font-bold'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
              }`}
            >
              {type === 'All' ? 'All Entities' : `${type}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Full-Bleed Canvas */}
      <div className="flex-1 w-full h-[calc(100vh-64px)] pt-16 flex items-center justify-center relative">
        {loading ? (
          <div className="text-center space-y-3 font-mono text-sm text-[#94A3B8]">
            <div className="w-8 h-8 border-2 border-[#74B8CC] border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Constructing relational graph layout...</p>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4">
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              className="w-full h-full max-h-[82vh] cursor-grab active:cursor-grabbing"
            >
              <defs>
                <radialGradient id="graphBgGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#74B8CC" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#07151F" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width={width} height={height} fill="url(#graphBgGlow)" />

              {/* Concentric Reference Rings */}
              <circle cx={centerX} cy={centerY} r={160} fill="none" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 8" />
              <circle cx={centerX} cy={centerY} r={290} fill="none" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 8" />
              <circle cx={centerX} cy={centerY} r={410} fill="none" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 8" />

              {/* Links */}
              {links.map((link, i) => {
                const p1 = nodePositions[link.source];
                const p2 = nodePositions[link.target];
                if (!p1 || !p2) return null;
                const isConnected = selectedNode && (selectedNode.id === link.source || selectedNode.id === link.target);

                return (
                  <line
                    key={i}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={isConnected ? '#74B8CC' : 'rgba(255, 255, 255, 0.1)'}
                    strokeWidth={isConnected ? 2.5 : 1}
                    strokeDasharray={isConnected ? 'none' : '3 3'}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Nodes */}
              {filteredNodes.map((node) => {
                const pos = nodePositions[node.id];
                if (!pos) return null;
                const isSelected = selectedNode?.id === node.id;
                const color = getNodeColor(node.type);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer transition-all duration-300 group"
                  >
                    {/* Outer glow ring on selection */}
                    {isSelected && (
                      <circle
                        r={26}
                        fill="none"
                        stroke={color}
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                        className="animate-spin"
                        style={{ animationDuration: '10s' }}
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      r={isSelected ? 18 : 12}
                      fill="#07151F"
                      stroke={color}
                      strokeWidth={isSelected ? 3 : 2}
                      className="group-hover:scale-110 transition-transform"
                    />

                    {/* Node Core */}
                    <circle r={isSelected ? 6 : 4} fill={color} />

                    {/* Label */}
                    <text
                      y={24}
                      textAnchor="middle"
                      fill={isSelected ? '#FFFFFF' : '#94A3B8'}
                      fontSize={isSelected ? 12 : 10}
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="group-hover:fill-white transition-colors"
                    >
                      {node.name.length > 22 ? `${node.name.slice(0, 20)}...` : node.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* Slide-in Side Drawer (Detail Panel) */}
        {selectedNode && (
          <aside className="absolute right-6 top-36 bottom-8 w-80 sm:w-96 bg-[#07151F]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-6 shadow-2xl flex flex-col justify-between z-30 transition-all">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getNodeColor(selectedNode.type) }} 
                  />
                  <span className="text-xs font-mono uppercase tracking-widest text-[#B9DDE7]">
                    {selectedNode.type} Entity
                  </span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-lg text-[#647887] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="font-editorial text-2xl text-white font-normal leading-tight">
                  {selectedNode.name}
                </h3>
                <div className="flex items-center gap-2 text-xs font-mono text-[#647887]">
                  <span>ID: {selectedNode.id}</span>
                  <span>·</span>
                  <span className="text-[#74B8CC]">{selectedNode.region || 'Polar Domain'}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-[#CBD5E1] leading-relaxed">
                {selectedNode.details}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-[#647887] tracking-wider">
                  Connected Domain Actions
                </h4>
                {selectedNode.type === 'expedition' && (
                  <a
                    href={`/expeditions/${selectedNode.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#D7A75D] hover:bg-[#c49852] text-[#07151F] font-bold text-xs flex items-center justify-between transition-colors"
                  >
                    <span>Open Expedition Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
                {selectedNode.type === 'dataset' && (
                  <a
                    href={`/datasets/${selectedNode.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#74B8CC] hover:bg-[#5fa5b8] text-[#07151F] font-bold text-xs flex items-center justify-between transition-colors"
                  >
                    <span>Inspect Open Dataset</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
                {selectedNode.type === 'station' && (
                  <a
                    href={`/stations`}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#B9DDE7] hover:bg-[#a5cdd8] text-[#07151F] font-bold text-xs flex items-center justify-between transition-colors"
                  >
                    <span>View Station Telemetry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-[11px] font-mono text-[#647887]">
              Relational ties dynamically resolved from NCPOR expedition logs and NPDC metadata archives.
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
