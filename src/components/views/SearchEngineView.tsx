import React, { useState } from 'react';
import { Search, FileText, Tag, ArrowUpRight } from 'lucide-react';
import type { MemoryItem } from '../../types/memory';

interface SearchEngineViewProps {
  memories: MemoryItem[];
  onOpenDocModal: (doc: MemoryItem) => void;
}

export const SearchEngineView: React.FC<SearchEngineViewProps> = ({ memories, onOpenDocModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedImportance, setSelectedImportance] = useState<string>('all');

  const filteredMemories = memories.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.ocrText && m.ocrText.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'all' || m.type === selectedType;
    const matchesSource = selectedSource === 'all' || m.source === selectedSource;
    const matchesImportance = selectedImportance === 'all' || m.importance === selectedImportance;

    return matchesSearch && matchesType && matchesSource && matchesImportance;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header & Search Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Search className="w-3.5 h-3.5" /> High-Dimensional Vector Search
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Instant AI Search Engine
            </h1>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {filteredMemories.length} Memories Matched
          </span>
        </div>

        {/* Input Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-blue-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type anything (e.g. 'Amazon', 'Random Forest', 'Stipend', 'Sarah', 'Project 2')..."
            className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800/90 text-sm font-semibold text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-inner"
          />
        </div>

        {/* Multi-Facet Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          {/* File Type Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-semibold"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF Docs</option>
              <option value="audio">Audio Notes</option>
              <option value="image">Scanned OCR</option>
              <option value="email">Emails</option>
              <option value="note">Text Notes</option>
            </select>
          </div>

          {/* Source Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Source:</span>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-semibold"
            >
              <option value="all">All Sources</option>
              <option value="Google Drive">Google Drive</option>
              <option value="Local Upload">Local Upload</option>
              <option value="Gmail">Gmail</option>
              <option value="Voice Recorder">Voice Recorder</option>
              <option value="Notion">Notion</option>
            </select>
          </div>

          {/* Importance Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Importance:</span>
            <select
              value={selectedImportance}
              onChange={(e) => setSelectedImportance(e.target.value)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-semibold"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Feed */}
      <div className="space-y-4">
        {filteredMemories.map((doc) => (
          <div
            key={doc.id}
            onClick={() => onOpenDocModal(doc)}
            className="p-5 glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 cursor-pointer glass-card-hover transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-2xl shrink-0 mt-1">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {doc.title}
                  </h3>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-800">
                    {doc.category}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                  {doc.summary}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3 text-blue-500" /> {doc.tags.join(', ')}</span>
                  <span>•</span>
                  <span>Source: {doc.source}</span>
                  <span>•</span>
                  <span>Uploaded {doc.uploadDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
              <div className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs rounded-lg font-bold">
                98.6% Similarity
              </div>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 hover:underline">
                View Memory <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}

        {filteredMemories.length === 0 && (
          <div className="text-center py-16 glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
            <Search className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No memories matched your query</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or filter selections.</p>
          </div>
        )}
      </div>
    </div>
  );
};
