import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Mic,
  Copy,
  Check,
  FileText,
  Bot,
  User,
  Volume2,
  Search
} from 'lucide-react';
import type { MemoryItem, ChatMessage } from '../../types/memory';

interface AIChatViewProps {
  memories: MemoryItem[];
  chatHistory: ChatMessage[];
  onSendMessage: (userText: string) => void;
  onOpenDocModal: (doc: MemoryItem) => void;
  selectedDocForChat?: MemoryItem | null;
}

export const AIChatView: React.FC<AIChatViewProps> = ({
  memories,
  chatHistory,
  onSendMessage,
  onOpenDocModal,
  selectedDocForChat,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const promptChips = [
    'Where is my internship offer letter?',
    'Show all Machine Learning notes',
    'Summarize today\'s meeting',
    'Generate interview questions for Amazon',
    'Find everything related to AWS invoice',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleChipClick = (prompt: string) => {
    onSendMessage(prompt);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 m-4 md:m-8 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl shadow-md">
            <Sparkles className="w-5 h-5 animate-pulse-glow" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              MemBuddy RAG Assistant
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full">
                ChromaDB + GPT-4o
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Querying {memories.length} indexed documents & voice transcripts in real-time
            </p>
          </div>
        </div>

        {selectedDocForChat && (
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-xl flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Scoped: {selectedDocForChat.title}</span>
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`p-2 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Body */}
            <div
              className={`max-w-2xl space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-3xl rounded-tr-none p-4 text-xs font-medium shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl rounded-tl-none p-5 text-xs text-slate-800 dark:text-slate-200 shadow-lg'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed">
                {msg.text}
              </div>

              {/* Citations list if present */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider flex items-center gap-1">
                    <Search className="w-3 h-3" /> Retrieved Source Context ({msg.citations.length} Documents)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.citations.map((cite) => {
                      const matchedDoc = memories.find((m) => m.id === cite.id);
                      return (
                        <div
                          key={cite.id}
                          onClick={() => matchedDoc && onOpenDocModal(matchedDoc)}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-blue-500 cursor-pointer transition-colors text-[11px]"
                        >
                          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white truncate">
                            <span className="truncate flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              {cite.title}
                            </span>
                            <span className="text-[9px] font-mono text-emerald-500">
                              {(cite.relevanceScore * 100).toFixed(0)}% match
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            "{cite.snippet}"
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              {msg.sender === 'assistant' && (
                <div className="flex items-center justify-end space-x-3 pt-2 text-slate-400">
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="hover:text-blue-500 transition-colors p-1"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleSpeak(msg.text)}
                    className="hover:text-blue-500 transition-colors p-1"
                    title="Read aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 bg-slate-50/60 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto flex items-center gap-2 text-xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Prompts:</span>
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(chip)}
            className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all shrink-0 font-medium"
          >
            💡 {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything across your entire Second Brain memory vault..."
            className="w-full pl-4 pr-24 py-3.5 bg-slate-100/80 dark:bg-slate-800/80 text-xs font-medium text-slate-900 dark:text-white rounded-2xl border border-slate-200/80 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />

          <div className="absolute right-3 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsRecording(!isRecording)}
              className={`p-2 rounded-xl transition-colors ${
                isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
              }`}
              title={isRecording ? 'Recording voice...' : 'Voice input (Whisper)'}
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl shadow-md transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
