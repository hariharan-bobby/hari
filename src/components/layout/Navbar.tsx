import React, { useState } from 'react';
import { Search, Sun, Moon, Bell, ShieldCheck, Sparkles, User, LogOut, Zap } from 'lucide-react';
import type { UserProfile } from '../../types/memory';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  user: UserProfile;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onNavigateTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  user,
  onOpenSearch,
  onOpenAuth,
  onNavigateTab,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const mockNotifications = [
    { id: 1, text: 'Whisper AI transcribed Lecture 10 Audio', time: '10m ago', unread: true },
    { id: 2, text: 'Zoho Offer Sign Deadline approaching (July 30)', time: '1h ago', unread: true },
    { id: 3, text: 'ChromaDB embeddings synchronized (142 nodes)', time: '3h ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-16 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-4 md:px-8 flex items-center justify-between transition-all">
      {/* Left: Quick Search Bar trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-400 bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span>Search files, chats, transcripts, nodes...</span>
          </div>
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-500 shadow-xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3">
        {/* Memory Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>RAG Vault Active (96% Health)</span>
        </div>

        {/* AI Quick Chat Pill */}
        <button
          onClick={() => onNavigateTab('chat')}
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI Vault</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Dark Mode"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Notifications
                </h3>
                <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto my-2">
                {mockNotifications.map((n) => (
                  <div key={n.id} className="py-2.5 flex items-start justify-between text-xs">
                    <div className="pr-2">
                      <p className={`text-slate-800 dark:text-slate-200 ${n.unread ? 'font-semibold' : ''}`}>
                        {n.text}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{n.time}</span>
                    </div>
                    {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1" />}
                  </div>
                ))}
              </div>
              <button
                onClick={() => onNavigateTab('timeline')}
                className="w-full text-center text-xs text-blue-600 dark:text-blue-400 font-semibold pt-2 border-t border-slate-100 dark:border-slate-800 hover:underline"
              >
                View Memory Timeline →
              </button>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/40"
            />
            <span className="hidden md:inline-block text-xs font-semibold text-slate-800 dark:text-slate-200">
              {user.name}
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md">
                  ★ {user.plan} Plan
                </span>
              </div>
              <div className="py-2 space-y-1 text-xs">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigateTab('settings');
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2"
                >
                  <User className="w-4 h-4" /> Profile & Settings
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigateTab('dashboard');
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-blue-500" /> Vault Storage
                </button>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenAuth();
                  }}
                  className="w-full text-left px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl flex items-center gap-2 font-medium text-xs"
                >
                  <LogOut className="w-4 h-4" /> Log In / Switch Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
