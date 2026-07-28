import React from 'react';
import {
  HardDrive,
  FileText,
  MessageSquare,
  Sparkles,
  Search,
  UploadCloud,
  GitFork,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Layers
} from 'lucide-react';
import type { MemoryItem, UserProfile } from '../../types/memory';

interface DashboardViewProps {
  user: UserProfile;
  memories: MemoryItem[];
  onNavigate: (tab: string) => void;
  onOpenDocModal: (doc: MemoryItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  memories,
  onNavigate,
  onOpenDocModal,
}) => {
  const recentUploads = memories.slice(0, 4);

  const categoryStats = [
    { name: 'PDF Documents', count: memories.filter((m) => m.type === 'pdf').length, color: 'bg-blue-500' },
    { name: 'Audio Transcripts', count: memories.filter((m) => m.type === 'audio').length, color: 'bg-amber-500' },
    { name: 'Scanned OCR', count: memories.filter((m) => m.type === 'image').length, color: 'bg-purple-500' },
    { name: 'Email Archives', count: memories.filter((m) => m.type === 'email').length, color: 'bg-emerald-500' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Welcome Banner & Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Banner */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Memora Second Brain v2.6</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
              Your AI memory vault has indexed <strong>{user.totalIndexed} documents</strong> and 1,420 vector embedding chunks across ChromaDB.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('chat')}
              className="px-4 py-2.5 bg-white text-blue-700 font-bold text-xs rounded-xl shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Ask AI Vault
            </button>
            <button
              onClick={() => onNavigate('upload')}
              className="px-4 py-2.5 bg-blue-500/30 hover:bg-blue-500/40 text-white font-semibold text-xs rounded-xl border border-white/20 transition-colors flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              Upload New Memory
            </button>
            <button
              onClick={() => onNavigate('graph')}
              className="px-4 py-2.5 bg-purple-500/30 hover:bg-purple-500/40 text-white font-semibold text-xs rounded-xl border border-white/20 transition-colors flex items-center gap-2"
            >
              <GitFork className="w-4 h-4" />
              Knowledge Graph
            </button>
          </div>
        </div>

        {/* Memory Health Score Meter Card */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between items-center text-center">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Memory Health Score
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
              Optimal Index
            </span>
          </div>

          {/* Dial / Circular Ring */}
          <div className="relative my-4 flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="56"
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-200 dark:text-slate-800"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="56"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray="351.8"
                strokeDashoffset="14"
                strokeLinecap="round"
                className="text-blue-600 dark:text-blue-500 transition-all duration-1000"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {user.healthScore}%
              </span>
              <span className="text-[10px] font-medium text-slate-400">Indexed Confidence</span>
            </div>
          </div>

          <div className="w-full text-xs text-slate-500 dark:text-slate-400 flex justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
            <span>OCR: 99.2%</span>
            <span>Speech: 98.4%</span>
            <span>RAG Score: 0.96</span>
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Memories</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {user.totalIndexed}
          </p>
          <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +12 this week
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">AI RAG Searches</span>
            <Search className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            840
          </p>
          <span className="text-[10px] text-blue-500 font-semibold flex items-center gap-1 mt-1">
            ⚡ Avg response 0.12s
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Storage Used</span>
            <HardDrive className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            4.28 GB
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            out of 10.0 GB (42%)
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Knowledge Nodes</span>
            <GitFork className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            38 Entities
          </p>
          <span className="text-[10px] text-purple-500 font-semibold flex items-center gap-1 mt-1">
            🔗 46 Graph Links
          </span>
        </div>
      </div>

      {/* Main Content Layout: Recent Activity & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Memories List (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" /> Recent Vault Memories
            </h2>
            <button
              onClick={() => onNavigate('search')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All Memories →
            </button>
          </div>

          <div className="space-y-3">
            {recentUploads.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onOpenDocModal(doc)}
                className="p-4 glass-panel rounded-2xl border border-slate-200/70 dark:border-slate-800/70 hover:border-blue-500/40 cursor-pointer glass-card-hover transition-all flex items-center justify-between"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {doc.title}
                      {doc.importance === 'high' && (
                        <span className="w-2 h-2 rounded-full bg-red-500" title="High Importance" />
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {doc.summary}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                      <span className="font-semibold text-blue-500">{doc.category}</span>
                      <span>•</span>
                      <span>Source: {doc.source}</span>
                      <span>•</span>
                      <span>Uploaded {doc.uploadDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-slate-400">
                  <span className="text-xs font-mono text-slate-400 hidden sm:inline">{doc.fileSize}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Smart Reminders & Categories */}
        <div className="space-y-6">
          {/* Smart Reminders Alert Box */}
          <div className="glass-panel p-5 rounded-3xl border border-amber-500/30 bg-amber-500/5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> AI Smart Reminders
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900/50">
                <span className="font-bold text-slate-900 dark:text-white block">Zoho Offer Sign Deadline</span>
                <span className="text-[11px] text-slate-500">July 30, 2026 (5 days remaining)</span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-900/50">
                <span className="font-bold text-slate-900 dark:text-white block">ML Project 2 Submission</span>
                <span className="text-[11px] text-slate-500">Today 11:59 PM (Random Forest code + PDF)</span>
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" /> Vault Storage Breakdown
            </h3>
            <div className="space-y-3 text-xs">
              {categoryStats.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{cat.name}</span>
                    <span className="text-slate-400">{cat.count} files</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`${cat.color} h-full`} style={{ width: `${cat.count * 25}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
