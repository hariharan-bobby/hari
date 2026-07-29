import React, { useState } from 'react';
import {
  User,
  Shield,
  Smartphone,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Globe,
  Sparkles,
  Camera,
  Trash2,
  Download,
  Bell,
  Palette,
  CreditCard,
  History,
  LogOut,
  Clock,
  Edit3,
  X
} from 'lucide-react';
import type { UserProfile } from '../../types/memory';

interface SettingsViewProps {
  user: UserProfile;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  darkMode,
  onToggleDarkMode,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'ai' | 'billing' | 'privacy'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username || '@alexrivera');
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '+1 (555) 234-5678');
  const [bio, setBio] = useState(user.bio || 'AI Researcher & Machine Learning Student exploring RAG memory vaults.');
  const [dob, setDob] = useState(user.dob || '1998-04-12');
  const [gender, setGender] = useState(user.gender || 'Male');
  const [country, setCountry] = useState(user.country || 'United States');
  const [timezone, setTimezone] = useState(user.timezone || 'Pacific Time (PST / UTC-8)');
  const [avatar, setAvatar] = useState(user.avatar);

  // AI Preferences State
  const [aiModel, setAiModel] = useState(user.aiModel || 'GPT-4o (OpenAI)');
  const [aiStyle, setAiStyle] = useState(user.aiStyle || 'Professional');
  const [aiLanguage, setAiLanguage] = useState(user.aiLanguage || 'English (US)');
  const [aiVoice, setAiVoice] = useState(user.aiVoice || 'Whisper Natural (Male)');

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [enable2FA, setEnable2FA] = useState(true);

  // Notification Toggles State
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklySummary: true,
    productUpdates: false,
    securityAlerts: true,
  });

  // Privacy & Appearance Toggles
  const [privacyMode, setPrivacyMode] = useState(false);
  const [accentColor] = useState('Royal Blue');

  // Connected Accounts State
  const [connectedAccounts, setConnectedAccounts] = useState([
    { id: 'gdrive', name: 'Google Drive', icon: '📁', connected: true, desc: '14 PDFs & Docs Synced' },
    { id: 'gmail', name: 'Gmail Integration', icon: '✉️', connected: true, desc: 'Recruiter threads auto-ingested' },
    { id: 'whatsapp', name: 'WhatsApp Voice', icon: '💬', connected: true, desc: 'Voice memos synced' },
    { id: 'notion', name: 'Notion Workspace', icon: '📝', connected: true, desc: 'Research notes synced' },
    { id: 'github', name: 'GitHub Code Repos', icon: '🐙', connected: true, desc: 'Project repos indexed' },
    { id: 'onedrive', name: 'OneDrive', icon: '☁️', connected: false, desc: 'Cloud storage link' },
    { id: 'dropbox', name: 'Dropbox', icon: '📦', connected: false, desc: 'Cloud files link' },
    { id: 'gcal', name: 'Google Calendar', icon: '📅', connected: true, desc: 'Meeting events synced' },
    { id: 'slack', name: 'Slack Team Workspace', icon: '💬', connected: false, desc: 'Channels & messages' },
    { id: 'discord', name: 'Discord Server', icon: '🎮', connected: false, desc: 'Community chats' },
    { id: 'teams', name: 'Microsoft Teams', icon: '👥', connected: false, desc: 'Work meetings' },
  ]);

  // Activity Timeline Logs
  const activityLogs = [
    { id: 1, action: 'Uploaded "Zoho_Internship_Offer_Letter.pdf"', time: '2 hours ago', icon: '📄' },
    { id: 2, action: 'Connected GitHub account (@alexrivera)', time: 'Yesterday', icon: '🔗' },
    { id: 3, action: 'Asked AI RAG Assistant 25 questions', time: '2 days ago', icon: '💬' },
    { id: 4, action: 'Changed Account Password', time: '3 days ago', icon: '🔑' },
    { id: 5, action: 'Logged in from Chrome on macOS', time: '4 days ago', icon: '💻' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      username,
      email,
      phone,
      bio,
      dob,
      gender,
      country,
      timezone,
      avatar,
      aiModel,
      aiStyle,
      aiLanguage,
      aiVoice,
      accentColor,
    });

    setIsEditing(false);
    showSuccessToast('Profile Updated Successfully!');
  };

  const handleCancelEdit = () => {
    setName(user.name);
    setUsername(user.username || '@alexrivera');
    setEmail(user.email);
    setPhone(user.phone || '+1 (555) 234-5678');
    setBio(user.bio || '');
    setIsEditing(false);
  };

  const showSuccessToast = (msg: string) => {
    setSavedSuccessMessage(msg);
    setTimeout(() => setSavedSuccessMessage(null), 3000);
  };

  const toggleConnection = (id: string) => {
    setConnectedAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, connected: !acc.connected } : acc))
    );
    showSuccessToast('Account Integration Updated!');
  };

  const handleExportData = () => {
    const exportPayload = JSON.stringify(
      {
        userProfile: { name, email, role: user.role, plan: user.plan },
        totalMemoriesIndexed: user.totalIndexed,
        exportTimestamp: new Date().toISOString(),
        vectorStatus: 'ChromaDB Local Snapshot Ready',
      },
      null,
      2
    );

    const blob = new Blob([exportPayload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memora-ai-user-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showSuccessToast('User Data Exported Successfully!');
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto animate-fade-in">
      {/* Toast Notification */}
      {savedSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{savedSuccessMessage}</span>
        </div>
      )}

      {/* Header Banner & Profile Completion Progress */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <img
              src={avatar}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-500/40 shadow-md"
            />
            {isEditing && (
              <label className="absolute inset-0 bg-slate-900/60 rounded-2xl flex items-center justify-center cursor-pointer text-white">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setAvatar(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </label>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {name}
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md">
                {username}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {user.role} • <span className="text-amber-500 font-bold">★ {user.plan} Plan</span>
            </p>

            {/* Profile Completion Bar */}
            <div className="mt-3 flex items-center gap-3 w-64">
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${user.completionScore || 85}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                {user.completionScore || 85}% Complete
              </span>
            </div>
          </div>
        </div>

        {/* Edit Profile Header Action */}
        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-300 transition-colors flex items-center gap-1.5"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        {[
          { id: 'profile', label: 'Personal Info', icon: User },
          { id: 'security', label: 'Account & Security', icon: Shield },
          { id: 'ai', label: 'AI & Integrations', icon: Sparkles },
          { id: 'billing', label: 'Usage & Billing', icon: CreditCard },
          { id: 'privacy', label: 'Privacy & Appearance', icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PERSONAL EDITABLE INFORMATION */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" /> Editable Personal Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium disabled:opacity-70"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Username
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium disabled:opacity-70"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  disabled={!isEditing}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium disabled:opacity-70"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium disabled:opacity-70"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                disabled={!isEditing}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium disabled:opacity-70"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Gender
              </label>
              <select
                disabled={!isEditing}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium disabled:opacity-70"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Non-Binary</option>
                <option>Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Country
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium disabled:opacity-70"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Time Zone
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium disabled:opacity-70"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Bio / About Me
              </label>
              <textarea
                rows={3}
                disabled={!isEditing}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium disabled:opacity-70"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Save Profile
              </button>
            </div>
          )}
        </form>
      )}

      {/* TAB 2: ACCOUNT SECURITY */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Password & 2FA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-500" /> Change Password
              </h3>
              <div className="space-y-3 text-xs">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
                <button
                  onClick={() => {
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    showSuccessToast('Password Changed Successfully!');
                  }}
                  className="w-full py-2 bg-blue-600 text-white font-bold rounded-xl shadow-md"
                >
                  Update Password
                </button>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" /> Two-Factor Authentication (2FA)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Secure your AI Second Brain vault using authenticator app codes (TOTP).
              </p>
              <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  2FA Status: {enable2FA ? 'Enabled 🟢' : 'Disabled 🔴'}
                </span>
                <button
                  onClick={() => setEnable2FA(!enable2FA)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    enable2FA ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  {enable2FA ? 'Configured' : 'Enable 2FA'}
                </button>
              </div>
            </div>
          </div>

          {/* Active Devices & Danger Zone */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-500" /> Login Activity & Active Devices
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">MacBook Pro 16" — Chrome (Current Device)</p>
                  <p className="text-[10px] text-slate-400">San Francisco, USA • IP 192.168.1.42 • Active Now</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 font-bold rounded-md">This Device</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">iPhone 15 Pro — Safari Mobile</p>
                  <p className="text-[10px] text-slate-400">San Francisco, USA • IP 192.168.1.88 • 2 hours ago</p>
                </div>
                <button className="text-xs text-red-500 font-bold hover:underline">Revoke</button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => showSuccessToast('Logged out from all other sessions.')}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout from All Devices
              </button>

              <button
                onClick={() => alert('Account deletion simulator: All 142 memories in ChromaDB will be permanently purged.')}
                className="px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs rounded-xl hover:bg-red-500/20 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI PREFERENCES & CONNECTED ACCOUNTS */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          {/* AI Preferences */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" /> AI Vault Configuration & Tone
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Default AI Model
                </label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                >
                  <option>GPT-4o (OpenAI)</option>
                  <option>Gemini 1.5 Pro (Google)</option>
                  <option>Claude 3.5 Sonnet (Anthropic)</option>
                  <option>Llama 3 70B (Local Vector Server)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Response Style
                </label>
                <select
                  value={aiStyle}
                  onChange={(e) => setAiStyle(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                >
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Concise</option>
                  <option>Detailed</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Language Preference
                </label>
                <select
                  value={aiLanguage}
                  onChange={(e) => setAiLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                >
                  <option>English (US)</option>
                  <option>Spanish (Español)</option>
                  <option>French (Français)</option>
                  <option>German (Deutsch)</option>
                  <option>Japanese (日本語)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Voice Synthesis Preference
                </label>
                <select
                  value={aiVoice}
                  onChange={(e) => setAiVoice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                >
                  <option>Whisper Natural (Male)</option>
                  <option>Whisper Natural (Female)</option>
                  <option>Studio Clear (Neutral)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Connected Accounts Expanded Grid */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-500" /> Connected Third-Party Platforms ({connectedAccounts.filter(a => a.connected).length} Connected)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {connectedAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{acc.icon}</span> {acc.name}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{acc.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleConnection(acc.id)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all ${
                      acc.connected
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {acc.connected ? 'Connected' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: USAGE DASHBOARD & BILLING */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* Usage Dashboard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="glass-panel p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Docs Uploaded</span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">{user.totalIndexed}</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">AI Chats</span>
              <p className="text-xl font-extrabold text-blue-500">840</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Graph Nodes</span>
              <p className="text-xl font-extrabold text-purple-500">38</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Storage Used</span>
              <p className="text-xl font-extrabold text-amber-500">4.28 GB</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Remaining Storage</span>
              <p className="text-xl font-extrabold text-emerald-500">5.72 GB</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Last Login</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">Just now</p>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">
                  ★ Active Subscription: {user.plan} Vault
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
                  $19.00 / month
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Renews automatically on {user.planExpiry || 'August 15, 2027'} via Visa ending in 4920.
                </p>
              </div>

              <button
                onClick={() => alert('Redirecting to Enterprise Plan Upgrade portal...')}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg"
              >
                Upgrade to Enterprise Plan
              </button>
            </div>

            {/* Billing History */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-500" /> Recent Invoices & Billing History
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Pro Vault Monthly - July 2026</p>
                    <p className="text-[10px] text-slate-400">Paid July 15, 2026 • Visa ****4920</p>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">$19.00 PAID</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Pro Vault Monthly - June 2026</p>
                    <p className="text-[10px] text-slate-400">Paid June 15, 2026 • Visa ****4920</p>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">$19.00 PAID</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PRIVACY, APPEARANCE & TIMELINE */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          {/* Privacy & Data Controls */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" /> Privacy & Data Control Panel
            </h3>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export My Data (JSON)
              </button>

              <button
                onClick={() => showSuccessToast('Chat History Cleared!')}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-300"
              >
                Clear Chat History
              </button>

              <button
                onClick={() => showSuccessToast('AI Vector Cache Flushed!')}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-300"
              >
                Delete AI Memories Cache
              </button>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Incognito Privacy Mode</p>
                <p className="text-[10px] text-slate-400">Do not store RAG query search logs in local history</p>
              </div>
              <button
                onClick={() => setPrivacyMode(!privacyMode)}
                className={`px-3 py-1 rounded-xl font-bold ${
                  privacyMode ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                {privacyMode ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Notifications Toggles */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" /> Notifications & Alerts
            </h3>

            <div className="space-y-3 text-xs">
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive deadline reminders via email' },
                { key: 'push', label: 'Push Notifications', desc: 'Browser desktop notifications for AI speech transcripts' },
                { key: 'weeklySummary', label: 'Weekly AI Summary', desc: 'Synthesized Second Brain weekly digest report' },
                { key: 'securityAlerts', label: 'Security & Login Alerts', desc: 'Instant alerts on new device sign-ins' },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{n.label}</p>
                    <p className="text-[10px] text-slate-400">{n.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      setNotifications({ ...notifications, [n.key]: !(notifications as any)[n.key] });
                      showSuccessToast('Notification preference saved.');
                    }}
                    className={`px-3 py-1 rounded-xl font-bold ${
                      (notifications as any)[n.key] ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    {(notifications as any)[n.key] ? 'ON' : 'OFF'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Appearance Customization */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-500" /> Appearance & Styling Theme
            </h3>

            <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Dark / Light Mode Toggle</p>
                <p className="text-[10px] text-slate-400">Switch current theme</p>
              </div>

              <button
                onClick={onToggleDarkMode}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-md"
              >
                {darkMode ? '🌙 Dark Mode Active' : '☀️ Light Mode Active'}
              </button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" /> Profile & Security Activity Timeline
            </h3>

            <div className="space-y-2 text-xs">
              {activityLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-base">{log.icon}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
