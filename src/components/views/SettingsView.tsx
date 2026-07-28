import React, { useState } from 'react';
import { User, CheckCircle2, Smartphone } from 'lucide-react';
import type { UserProfile } from '../../types/memory';

interface SettingsViewProps {
  user: UserProfile;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [connectedAccounts, setConnectedAccounts] = useState([
    { id: 'gdrive', name: 'Google Drive Sync', icon: '📁', connected: true, status: '14 PDFs Synced' },
    { id: 'gmail', name: 'Gmail Integration', icon: '✉️', connected: true, status: 'Recruiter emails auto-ingested' },
    { id: 'whatsapp', name: 'WhatsApp Voice Recorder', icon: '💬', connected: true, status: 'Voice notes synced' },
    { id: 'notion', name: 'Notion Workspace', icon: '📝', connected: false, status: 'Not connected' },
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, email });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const toggleConnection = (id: string) => {
    setConnectedAccounts(
      connectedAccounts.map((acc) =>
        acc.id === id ? { ...acc, connected: !acc.connected } : acc
      )
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto animate-fade-in">
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Vault Settings & Integrations
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your account profile, connected cloud services, vector DB privacy, and theme.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Form */}
        <form onSubmit={handleSave} className="md:col-span-2 glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" /> User Profile Information
          </h2>

          <div className="flex items-center space-x-4">
            <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500" />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-slate-400">{user.role}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md">
                {user.plan} Plan Subscriber
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Save Changes
          </button>
        </form>

        {/* Connected Accounts */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-500" /> Connected Accounts
          </h2>

          <div className="space-y-3 text-xs">
            {connectedAccounts.map((acc) => (
              <div key={acc.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{acc.icon}</span> {acc.name}
                  </p>
                  <p className="text-[10px] text-slate-400">{acc.status}</p>
                </div>
                <button
                  onClick={() => toggleConnection(acc.id)}
                  className={`px-3 py-1 rounded-xl text-[10px] font-bold ${
                    acc.connected
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {acc.connected ? 'Active' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
