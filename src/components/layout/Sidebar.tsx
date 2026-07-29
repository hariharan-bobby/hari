import React from 'react';
import {
  LayoutDashboard,
  MessageSquareText,
  GitFork,
  UploadCloud,
  Search,
  Clock,
  GraduationCap,
  Settings,
  BrainCircuit,
  Globe,
  HardDrive
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  totalIndexedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, totalIndexedCount }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'chat', label: 'AI Vault Chat', icon: MessageSquareText, badge: 'RAG' },
    { id: 'graph', label: 'Memory Graph', icon: GitFork, badge: 'Graph' },
    { id: 'upload', label: 'Upload Center', icon: UploadCloud, badge: null },
    { id: 'search', label: 'Semantic Search', icon: Search, badge: null },
    { id: 'timeline', label: 'Timeline View', icon: Clock, badge: null },
    { id: 'study', label: 'AI Study & Digest', icon: GraduationCap, badge: 'New' },
    { id: 'settings', label: 'Settings & Cloud', icon: Settings, badge: null },
  ];

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] sticky top-16 hidden md:flex flex-col glass-panel border-r border-slate-200/80 dark:border-slate-800/80 p-4 transition-all">
      {/* Brand Header */}
      <div className="flex items-center space-x-3 px-2 py-3 mb-4">
        <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/30">
          <BrainCircuit className="w-6 h-6 animate-pulse-glow" />
        </div>
        <div>
          <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
            Mem<span className="text-blue-600 dark:text-blue-400">Buddy</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-300">Your Second Brain</p>
        </div>
      </div>

      {/* Public Landing Link Switcher */}
      <button
        onClick={() => onSelectTab('landing')}
        className={`w-full flex items-center justify-between px-3 py-2 mb-4 rounded-xl text-xs font-semibold border transition-all ${
          currentTab === 'landing'
            ? 'bg-blue-50 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-700'
            : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-500" />
          <span>Product Landing Page</span>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-300 font-mono">🔗</span>
      </button>

      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400 px-3 mb-2">
        Core Vault Navigation
      </div>

      {/* Primary Navigation List */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-300'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Storage & Vector Index Status Card */}
      <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 mt-auto space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-blue-500" /> Chroma Vector DB
          </span>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold font-mono">100% Online</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-[42%]" />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
          <span>{totalIndexedCount} Documents</span>
          <span>4.28 GB / 10 GB</span>
        </div>
      </div>
    </aside>
  );
};
