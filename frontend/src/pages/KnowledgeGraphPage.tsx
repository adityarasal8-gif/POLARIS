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
      case 'station': return '#111111';
      case 'expedition': return '#4F46E5';
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
    <div className="w-full min-h-screen bg-[#FAFAF8] text-[#111111] flex flex-col relative overflow-hidden select-none font-sans">
      {/* Top Floating Minimal Nav / Controls */}
      <div className="absolute top-20 left-0 right-0 z-20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pointer-events-none">
        {/* Title & Metadata */}
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-[#E8E6E0] shadow-sm">
          <div className="flex items-center gap-2 text-xs font-mono text-[#555558] uppercase tracking-wide font-medium">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Interactive Knowledge Graph</span>
          </div>
          <h1 className="font-serif text-2xl text-[#111111] font-medium mt-0.5">
            Relational Polar Science Network
          </h1>
          <p className="text-xs text-[#8E8E91] font-mono">
            {nodes.length} entities · {links.length} relational connections
          </p>
        </div>

        {/* Filter Pills */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-full border border-[#E8E6E0] shadow-sm">
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
              {type === 'All' ? 'All Entities' : `${type}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Full-Bleed Canvas */}
      <div className="flex-1 w-full h-[calc(100vh-64px)] pt-16 flex items-center justify-center relative">
        {loading ? (
          <div className="text-center space-y-3 font-mono text-sm text-[#8E8E91]">
            <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
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
                  <stop offset="0%" stopColor="#F4F2EE" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FAFAF8" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width={width} height={height} fill="url(#graphBgGlow)" />

              {/* Concentric Reference Rings */}
              <circle cx={centerX} cy={centerY} r={160} fill="none" stroke="#E8E6E0" strokeDasharray="4 6" />
              <circle cx={centerX} cy={centerY} r={290} fill="none" stroke="#E8E6E0" strokeDasharray="4 6" />
              <circle cx={centerX} cy={centerY} r={410} fill="none" stroke="#E8E6E0" strokeDasharray="4 6" />

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
                    stroke={isConnected ? '#111111' : '#E8E6E0'}
                    strokeWidth={isConnected ? 2 : 1}
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
                    {/* Outer selection ring */}
                    {isSelected && (
                      <circle
                        r={24}
                        fill="none"
                        stroke="#111111"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      r={isSelected ? 16 : 11}
                      fill="#FFFFFF"
                      stroke={isSelected ? '#111111' : color}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      className="group-hover:scale-110 transition-transform shadow-sm"
                    />

                    {/* Node Core */}
                    <circle r={isSelected ? 5 : 3.5} fill={color} />

                    {/* Label */}
                    <text
                      y={22}
                      textAnchor="middle"
                      fill={isSelected ? '#111111' : '#555558'}
                      fontSize={isSelected ? 11 : 9}
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="group-hover:fill-black transition-colors"
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
          <aside className="absolute right-6 top-36 bottom-8 w-80 sm:w-96 bg-white/95 backdrop-blur-xl border border-[#E8E6E0] rounded-3xl p-6 shadow-xl flex flex-col justify-between z-30 transition-all">
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

            <div className="pt-4 border-t border-[#E8E6E0] text-[11px] font-mono text-[#8E8E91]">
              Relational ties dynamically resolved from NCPOR expedition logs and NPDC metadata archives.
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
