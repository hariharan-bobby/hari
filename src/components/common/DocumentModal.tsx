import React from 'react';
import type { MemoryItem } from '../../types/memory';
import { X, FileText, Download, Tag, Eye, Layers, Sparkles, User, Calendar } from 'lucide-react';

interface DocumentModalProps {
  item: MemoryItem | null;
  onClose: () => void;
  onOpenChatWithDoc?: (doc: MemoryItem) => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ item, onClose, onOpenChatWithDoc }) => {
  if (!item) return null;

  const handleDownloadSource = () => {
    const fileHeader = `====================================================\nMEMORA AI SECOND BRAIN VAULT EXPORT\nDocument: ${item.title}\nVector ID: ${item.vectorId}\nCategory: ${item.category}\nUpload Date: ${item.uploadDate}\nSource: ${item.source}\nAuthor: ${item.author || 'Alex Rivera'}\n====================================================\n\n[MEMORA AI SYNTHESIS SUMMARY]\n${item.summary}\n\n[FULL EXTRACTED CONTENT]\n${item.fullContent}\n\n[OCR / AUDIO SPEECH TRANSCRIPT]\n${item.ocrText || item.audioTranscript || 'No visual OCR required for this file.'}\n\n[CONNECTED ENTITIES]\n${item.entitiesConnected.join(', ')}\n\n[TAGS]\n${item.tags.join(', ')}\n`;

    const blob = new Blob([fileHeader], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const downloadFileName = item.title.includes('.') ? item.title : `${item.title}.txt`;
    link.setAttribute('download', downloadFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {item.title}
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  {item.category}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 mt-1">
                <span>Vector ID: <code className="font-mono text-blue-500">{item.vectorId}</code></span>
                <span>•</span>
                <span>Size: {item.fileSize}</span>
                <span>•</span>
                <span>Uploaded: {item.uploadDate}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* AI Summary Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Memora AI Synthesis</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {item.summary}
            </p>
          </div>

          {/* Connected Entities */}
          <div>
            <h3 className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Knowledge Graph Connections
            </h3>
            <div className="flex flex-wrap gap-2">
              {item.entitiesConnected.map((ent, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200/60 dark:border-slate-700"
                >
                  🔗 {ent}
                </span>
              ))}
            </div>
          </div>

          {/* Full Text / OCR / Audio Transcript */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Raw Content */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                <span>Extracted Full Content</span>
                <span className="text-xs text-slate-400 font-normal">Parsed Document</span>
              </h4>
              <div className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                {item.fullContent}
              </div>
            </div>

            {/* OCR / Transcript */}
            <div className="p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                <span>{item.type === 'audio' ? 'Whisper AI Speech Transcript' : 'Tesseract OCR Visual Extract'}</span>
                <span className="text-xs text-blue-500 font-medium">99.2% Accuracy</span>
              </h4>
              <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                {item.ocrText || item.audioTranscript || 'No extra visual OCR data needed.'}
              </div>
            </div>
          </div>

          {/* Meta Badges & Tags */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              {item.tags.map((t, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                  #{t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {item.author || 'System'}</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {item.viewsCount} views</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {item.uploadDate}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end space-x-3">
          {onOpenChatWithDoc && (
            <button
              onClick={() => {
                onClose();
                onOpenChatWithDoc(item);
              }}
              className="px-4 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Chat With This Memory
            </button>
          )}

          <button
            onClick={handleDownloadSource}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Source
          </button>
        </div>
      </div>
    </div>
  );
};
