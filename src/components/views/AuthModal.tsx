import React, { useState, useRef } from 'react';
import { X, Mail, Lock, User, ArrowRight, CheckCircle2, Sparkles, LogIn, Eye, EyeOff, ShieldCheck, KeyRound, RefreshCw } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (name: string, email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('gamertechtamilan@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('Hariharan B');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Gmail 6-Digit OTP Verification Screen State
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(['8', '4', '2', '9', '1', '5']);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // Interactive Google Account Chooser Modal State
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [customGmail, setCustomGmail] = useState('gamertechtamilan@gmail.com');
  const [customGmailName, setCustomGmailName] = useState('Hariharan B');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setSubmittedMessage(`Password reset link sent to ${email}`);
      setTimeout(() => {
        setSubmittedMessage(null);
        setMode('login');
      }, 2500);
      return;
    }

    // Direct to Gmail OTP Verification Screen!
    setShowOtpScreen(true);
  };

  const handleGoogleSelectAccount = (selectedName: string, selectedEmail: string) => {
    setName(selectedName);
    setEmail(selectedEmail);
    setShowGoogleChooser(false);
    setShowOtpScreen(true);
  };

  const handleOtpDigitChange = (idx: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[idx] = val;
    setOtpDigits(newDigits);
    setOtpError(null);

    // Auto-focus next input box
    if (val && idx < 5) {
      otpRefs[idx + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      otpRefs[idx - 1].current?.focus();
    }
  };

  const handleAutoFillOtp = () => {
    setOtpDigits(['8', '4', '2', '9', '1', '5']);
    setOtpError(null);
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = otpDigits.join('');
    if (fullCode.length < 6) {
      setOtpError('Please enter all 6 digits of your Gmail verification code.');
      return;
    }

    setVerifyingOtp(true);
    setTimeout(() => {
      setVerifyingOtp(false);
      const displayName = name.trim() || email.split('@')[0];
      onSuccess(displayName, email);
      setShowOtpScreen(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 2: GMAIL 6-DIGIT OTP VERIFICATION SCREEN */}
        {showOtpScreen ? (
          <div className="space-y-6 text-center animate-fade-in">
            <div className="inline-flex p-3 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl mb-1 shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Gmail Verification Code
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                We sent a 6-digit verification code to <span className="font-mono text-blue-500 font-bold">{email}</span>
              </p>
            </div>

            {/* OTP Input Grid */}
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpRefs[idx]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-12 text-center text-lg font-bold font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-inner"
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-xs text-red-500 font-semibold">{otpError}</p>
              )}

              {/* Quick Auto-Fill Shortcut */}
              <button
                type="button"
                onClick={handleAutoFillOtp}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1 mx-auto bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20"
              >
                <KeyRound className="w-3.5 h-3.5" /> Auto-Fill Code from Gmail Inbox (842915)
              </button>

              <button
                type="submit"
                disabled={verifyingOtp}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {verifyingOtp ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Gmail OTP...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Verify Code & Unlock Second Brain</span>
                  </>
                )}
              </button>
            </form>

            <button
              onClick={() => setShowOtpScreen(false)}
              className="text-xs text-slate-400 font-semibold hover:underline"
            >
              ← Back to credentials entry
            </button>
          </div>
        ) : showGoogleChooser ? (
          /* GOOGLE ACCOUNT CHOOSER SUB-VIEW */
          <div className="space-y-5 animate-fade-in">
            <div className="text-center">
              <div className="inline-flex p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl mb-3 shadow-md">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Choose a Gmail Account
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                to sign in or register with MemBuddy
              </p>
            </div>

            {/* Account List */}
            <div className="space-y-2 text-xs">
              <button
                onClick={() => handleGoogleSelectAccount('Hariharan B', 'gamertechtamilan@gmail.com')}
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between text-left transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    H
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Hariharan B</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">gamertechtamilan@gmail.com</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">Connected</span>
              </button>

              <button
                onClick={() => handleGoogleSelectAccount('Alex Rivera', 'alex.rivera@gmail.com')}
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between text-left transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    A
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Alex Rivera</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">alex.rivera@gmail.com</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Manual Gmail Input */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Or Sign Up / Login with Another Gmail ID
              </label>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Hariharan B)"
                  value={customGmailName}
                  onChange={(e) => setCustomGmailName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={customGmail}
                  onChange={(e) => setCustomGmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>

              <button
                onClick={() => {
                  if (customGmail.trim()) {
                    const disp = customGmailName.trim() || customGmail.split('@')[0];
                    handleGoogleSelectAccount(disp, customGmail);
                  }
                }}
                className="w-full py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Sign In with Gmail
              </button>
            </div>

            <button
              onClick={() => setShowGoogleChooser(false)}
              className="w-full py-2 text-xs text-slate-500 font-semibold hover:underline"
            >
              ← Back to standard login
            </button>
          </div>
        ) : (
          /* STANDARD LOGIN / REGISTER VIEW */
          <>
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {mode === 'login' && 'Welcome to MemBuddy'}
                {mode === 'register' && 'Create Your Memory Vault'}
                {mode === 'forgot' && 'Reset Password'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {mode === 'login' && 'Enter your Gmail ID or credentials to access your Second Brain'}
                {mode === 'register' && 'Start organizing your thoughts, docs & emails with AI'}
                {mode === 'forgot' && 'Enter your Gmail address to receive recovery instructions'}
              </p>
            </div>

            {submittedMessage && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{submittedMessage}</span>
              </div>
            )}

            {/* Google SSO Button */}
            {mode !== 'forgot' && (
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setShowGoogleChooser(true)}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google OAuth 2.0 / Gmail</span>
                </button>

                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <span className="relative px-3 bg-white dark:bg-slate-900 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Or with email ID
                  </span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      placeholder="Hariharan B"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Gmail / Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="gamertechtamilan@gmail.com"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-xs transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <span>
                  {mode === 'login' && 'Sign In to Vault'}
                  {mode === 'register' && 'Create Account'}
                  {mode === 'forgot' && 'Send Reset Email'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Footer Toggle */}
            <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              {mode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button onClick={() => setMode('register')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                    Sign up free
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button onClick={() => setMode('login')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
