import React, { useState } from 'react';
import {
  GitFork,
  FileText,
  Search,
  ExternalLink
} from 'lucide-react';
import type { GraphNode, GraphLink, MemoryItem, EntityCategory } from '../../types/memory';

interface MemoryGraphViewProps {
  nodes: GraphNode[];
  links: GraphLink[];
  memories: MemoryItem[];
  onOpenDocModal: (doc: MemoryItem) => void;
}

export const MemoryGraphView: React.FC<MemoryGraphViewProps> = ({
  nodes,
  links,
  memories,
  onOpenDocModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(nodes[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const categoryColors: Record<EntityCategory, string> = {
    person: '#3b82f6',     // blue
    company: '#10b981',    // emerald
    project: '#8b5cf6',    // purple
    document: '#f59e0b',   // amber
    event: '#ef4444',      // red
    concept: '#06b6d4',    // cyan
  };

  const filteredNodes = nodes.filter((node) => {
    const matchesCat = selectedCategory === 'all' || node.type === selectedCategory;
    const matchesSearch = node.label.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const connectedDocs = selectedNode
    ? memories.filter((m) => selectedNode.connectedDocIds.includes(m.id))
    : [];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* View Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <GitFork className="w-3.5 h-3.5" /> Interactive AI Knowledge Mesh
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Memory Graph Visualizer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Explore interconnected entities across People, Companies, Projects, Documents, and Coursework.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'person', 'company', 'project', 'concept', 'event'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Graph Canvas Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Visualizer (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 bg-slate-950 relative min-h-[500px] flex flex-col justify-between overflow-hidden">
          {/* Top Canvas Controls */}
          <div className="flex items-center justify-between z-10">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search graph nodes..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900/90 border border-slate-800 text-xs text-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2 text-slate-400 text-xs">
              <span className="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 font-mono">
                {filteredNodes.length} Nodes • {links.length} Links
              </span>
            </div>
          </div>

          {/* SVG Knowledge Graph Diagram */}
          <div className="my-8 relative w-full h-[400px] flex items-center justify-center">
            <svg className="w-full h-full absolute inset-0">
              {/* Draw Edge Lines */}
              {links.map((link, idx) => {
                const sNode = nodes.find((n) => n.id === link.source);
                const tNode = nodes.find((n) => n.id === link.target);
                if (!sNode || !tNode) return null;

                const coords: Record<string, { x: number; y: number }> = {
                  'n-alex': { x: 300, y: 180 },
                  'n-zoho': { x: 120, y: 80 },
                  'n-amazon': { x: 480, y: 90 },
                  'n-prof': { x: 140, y: 280 },
                  'n-sarah': { x: 550, y: 200 },
                  'n-memora': { x: 310, y: 320 },
                  'n-ml': { x: 150, y: 380 },
                  'n-chroma': { x: 480, y: 340 },
                  'n-proj2': { x: 80, y: 200 },
                };

                const p1 = coords[sNode.id] || { x: 200, y: 200 };
                const p2 = coords[tNode.id] || { x: 400, y: 200 };

                return (
                  <g key={idx}>
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke="rgba(148, 163, 184, 0.25)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Render Node Spheres */}
            <div className="relative w-full h-full">
              {filteredNodes.map((node) => {
                const coords: Record<string, { x: number; y: number }> = {
                  'n-alex': { x: 300, y: 180 },
                  'n-zoho': { x: 120, y: 80 },
                  'n-amazon': { x: 480, y: 90 },
                  'n-prof': { x: 140, y: 280 },
                  'n-sarah': { x: 550, y: 200 },
                  'n-memora': { x: 310, y: 320 },
                  'n-ml': { x: 150, y: 380 },
                  'n-chroma': { x: 480, y: 340 },
                  'n-proj2': { x: 80, y: 200 },
                };
                const pos = coords[node.id] || { x: 250, y: 200 };
                const isSelected = selectedNode?.id === node.id;
                const nodeColor = categoryColors[node.type];

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group flex flex-col items-center z-20`}
                  >
                    <div
                      style={{
                        backgroundColor: nodeColor,
                        boxShadow: isSelected ? `0 0 25px ${nodeColor}` : '0 0 10px rgba(0,0,0,0.5)',
                      }}
                      className={`rounded-full flex items-center justify-center text-white font-bold transition-all ${
                        isSelected ? 'w-12 h-12 ring-4 ring-white scale-110' : 'w-9 h-9 hover:scale-110'
                      }`}
                    >
                      <span className="text-xs uppercase">{node.type[0]}</span>
                    </div>

                    <span
                      className={`mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap ${
                        isSelected ? 'bg-white text-slate-900 shadow-lg' : 'bg-slate-900/80 text-slate-300'
                      }`}
                    >
                      {node.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Graph Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-400 border-t border-slate-900 pt-3">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Person</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Company</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Project</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Document</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Concept</span>
          </div>
        </div>

        {/* Node Inspector Side Panel */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-6 flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Node Inspector
                </span>
                <span
                  style={{ backgroundColor: `${categoryColors[selectedNode.type]}20`, color: categoryColors[selectedNode.type] }}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase"
                >
                  {selectedNode.type}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {selectedNode.label}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {/* Connected Source Memories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-500" /> Linked Memories ({connectedDocs.length})
                </h4>

                <div className="space-y-2">
                  {connectedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => onOpenDocModal(doc)}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 hover:border-blue-500 cursor-pointer transition-colors text-xs space-y-1"
                    >
                      <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        <span className="truncate">{doc.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {doc.summary}
                      </p>
                    </div>
                  ))}

                  {connectedDocs.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No direct document links associated with this node yet.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select any node in the graph to inspect entity relations and attached memories.
            </div>
          )}

          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 text-xs text-slate-600 dark:text-slate-300">
            💡 <strong className="text-blue-600 dark:text-blue-400">Knowledge Graph Tip:</strong> MemBuddy continuously extracts entity triplets (Subject - Predicate - Object) during vector indexing.
          </div>
        </div>
      </div>
    </div>
  );
};
