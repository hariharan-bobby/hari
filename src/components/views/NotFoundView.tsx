import React from 'react';
import { BrainCircuit, ArrowLeft } from 'lucide-react';

interface NotFoundViewProps {
  onNavigateHome: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigateHome }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in max-w-lg mx-auto">
      <div className="p-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-3xl mb-4 border border-blue-500/20">
        <BrainCircuit className="w-16 h-16 animate-bounce" />
      </div>

      <span className="px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-xs font-bold font-mono uppercase tracking-wider mb-2">
        Error 404 — Memory Vector Not Found
      </span>

      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
        Lost in the Neural Network?
      </h1>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
        The page or document address you requested does not exist in ChromaDB's vector index. Let's return to your Second Brain dashboard.
      </p>

      <div className="mt-6 flex items-center justify-center space-x-3">
        <button
          onClick={onNavigateHome}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </button>
      </div>
    </div>
  );
};
