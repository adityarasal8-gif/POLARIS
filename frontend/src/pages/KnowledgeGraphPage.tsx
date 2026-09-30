import React, { useState, useEffect } from 'react';
import { Layers, Info, Compass, Database, FileText, Globe, Tag, ArrowRight } from 'lucide-react';
import { fetchKnowledgeGraph } from '../api';
import { KnowledgeGraphNode, KnowledgeGraphLink } from '../types';

export const KnowledgeGraphPage: React.FC = () => {
  const [nodes, setNodes] = useState<KnowledgeGraphNode[]>([]);
  const [links, setLinks] = useState<KnowledgeGraphLink[]>([]);
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(null);
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
      case 'station': return '#38BDF8';
      case 'expedition': return '#22C7A8';
      case 'dataset': return '#6EC5E9';
      case 'publication': return '#E7A93B';
      case 'topic': return '#A78BFA';
      default: return '#94A3B8';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'station': return <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />;
      case 'expedition': return <Compass className="w-3.5 h-3.5 text-[#22C7A8]" />;
      case 'dataset': return <Database className="w-3.5 h-3.5 text-[#6EC5E9]" />;
      case 'publication': return <FileText className="w-3.5 h-3.5 text-[#E7A93B]" />;
      case 'topic': return <Tag className="w-3.5 h-3.5 text-[#A78BFA]" />;
      default: return <Layers className="w-3.5 h-3.5 text-[#94A3B8]" />;
    }
  };

  // Layout node coordinates on canvas dynamically
  const width = 800;
  const height = 550;
  const centerX = width / 2;
  const centerY = height / 2;

  // Calculate coordinates by grouping
  const nodePositions: { [id: string]: { x: number; y: number } } = {};
  nodes.forEach((node, idx) => {
    if (node.type === 'station') {
      // Inner circle
      const angle = (idx / 4) * Math.PI * 2;
      nodePositions[node.id] = {
        x: centerX + Math.cos(angle) * 130,
        y: centerY + Math.sin(angle) * 110
      };
    } else if (node.type === 'expedition') {
      // Mid circle
      const angle = (idx / 6) * Math.PI * 2 + 0.3;
      nodePositions[node.id] = {
        x: centerX + Math.cos(angle) * 220,
        y: centerY + Math.sin(angle) * 170
      };
    } else {
      // Outer ring
      const angle = (idx / Math.max(nodes.length, 1)) * Math.PI * 2;
      nodePositions[node.id] = {
        x: centerX + Math.cos(angle) * 310,
        y: centerY + Math.sin(angle) * 220
      };
    }
  });

  return (
    <div className="w-full min-h-screen bg-[#071A2B] text-white py-10 px-4 sm:px-6 lg:px-8 polar-grid-bg text-left">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-[#6EC5E9]/15 pb-4">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#38BDF8] font-bold tracking-wider uppercase mb-1">
            <Layers className="w-4 h-4 text-[#38BDF8]" />
            <span>RELATIONAL POLAR SCIENCE KNOWLEDGE GRAPH</span>
          </div>
          <h1 className="text-3xl font-black text-white">Interactive Research Knowledge Graph</h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Visualizing interconnections between field expeditions, research stations, open datasets, publications, and science domains.
          </p>
        </div>

        {/* Legend */}
        <div className="polar-panel p-3 border border-[#6EC5E9]/15 flex flex-wrap items-center gap-4 text-xs font-mono">
          <span className="text-[#94A3B8] font-semibold text-[11px]">Entity Types:</span>
          <span className="flex items-center space-x-1.5 text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
            <span>Stations</span>
          </span>
          <span className="flex items-center space-x-1.5 text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C7A8]" />
            <span>Expeditions</span>
          </span>
          <span className="flex items-center space-x-1.5 text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6EC5E9]" />
            <span>Datasets</span>
          </span>
          <span className="flex items-center space-x-1.5 text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E7A93B]" />
            <span>Publications</span>
          </span>
          <span className="flex items-center space-x-1.5 text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A78BFA]" />
            <span>Science Topics</span>
          </span>
        </div>

        {/* Graph Visualizer + Details Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive SVG Graph Area (8 cols) */}
          <div className="lg:col-span-8 polar-panel p-4 border border-[#6EC5E9]/20 rounded-2xl relative overflow-hidden shadow-2xl flex items-center justify-center">
            {loading ? (
              <div className="py-32 text-center text-sm font-mono text-[#94A3B8]">
                Synthesizing knowledge graph relationships...
              </div>
            ) : (
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[550px] select-none">
                {/* Relationship Links */}
                {links.map((link, i) => {
                  const p1 = nodePositions[link.source];
                  const p2 = nodePositions[link.target];
                  if (!p1 || !p2) return null;
                  const isHighlighted = selectedNode && (selectedNode.id === link.source || selectedNode.id === link.target);
                  return (
                    <line
                      key={i}
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={isHighlighted ? '#38BDF8' : 'rgba(110, 197, 233, 0.25)'}
                      strokeWidth={isHighlighted ? 2.5 : 1.2}
                      strokeDasharray={isHighlighted ? 'none' : '4,4'}
                    />
                  );
                })}

                {/* Nodes */}
                {nodes.map((node) => {
                  const pos = nodePositions[node.id];
                  if (!pos) return null;
                  const isSelected = selectedNode?.id === node.id;
                  const color = getNodeColor(node.type);

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      onClick={() => setSelectedNode(node)}
                      className="cursor-pointer transition-all duration-200"
                    >
                      <circle
                        r={isSelected ? 18 : 13}
                        fill="#071A2B"
                        stroke={color}
                        strokeWidth={isSelected ? 3.5 : 2}
                        className="hover:scale-110"
                      />
                      <circle r={isSelected ? 6 : 4} fill={color} />
                      <text
                        y={24}
                        textAnchor="middle"
                        fill={isSelected ? '#FFFFFF' : '#CBD5E1'}
                        fontSize={isSelected ? 11 : 9.5}
                        fontFamily="monospace"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                      >
                        {node.name.length > 20 ? `${node.name.slice(0, 18)}...` : node.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {/* Node Inspector Sidebar (4 cols) */}
          <div className="lg:col-span-4 polar-panel p-6 border border-[#6EC5E9]/20 flex flex-col justify-between space-y-6">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="border-b border-[#6EC5E9]/15 pb-3">
                  <div className="flex items-center space-x-2">
                    {getNodeIcon(selectedNode.type)}
                    <span className="text-[10px] font-mono uppercase font-bold text-[#38BDF8]">
                      {selectedNode.type} Entity
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1 leading-snug">
                    {selectedNode.name}
                  </h3>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Entity ID:</span>
                    <span className="text-white">{selectedNode.id}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Region:</span>
                    <span className="text-[#38BDF8]">{selectedNode.region || 'Cross-Regional'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#071A2B] border border-[#6EC5E9]/15 text-xs text-[#CBD5E1] leading-relaxed">
                  {selectedNode.details}
                </div>

                {/* Direct Links matching entity type */}
                <div className="pt-2">
                  {selectedNode.type === 'expedition' && (
                    <a
                      href={`/expeditions/${selectedNode.id}`}
                      className="w-full py-2.5 rounded-lg bg-[#22C7A8] hover:bg-[#1fb396] text-[#071A2B] font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <span>Open Expedition Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {selectedNode.type === 'dataset' && (
                    <a
                      href={`/datasets/${selectedNode.id}`}
                      className="w-full py-2.5 rounded-lg bg-[#38BDF8] hover:bg-[#20aae8] text-[#071A2B] font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <span>Inspect Open Dataset</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {selectedNode.type === 'station' && (
                    <a
                      href={`/stations`}
                      className="w-full py-2.5 rounded-lg bg-[#6EC5E9] hover:bg-[#5bb7dc] text-[#071A2B] font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <span>View Station Telemetry</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-xs text-[#94A3B8]">
                Click any node in the graph to inspect connected parameters.
              </div>
            )}

            <div className="p-4 rounded-xl bg-[#051320] border border-[#6EC5E9]/10 text-[11px] font-mono text-[#647887]">
              Tip: Nodes are linked dynamically from relational tables. Click any node to highlight all parent and child connections.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
