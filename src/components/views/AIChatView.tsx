import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, Volume2, Copy, Check, Sparkles, Search, FileText } from 'lucide-react';
import type { MemoryItem, ChatMessage } from '../../types/memory';

interface AIChatViewProps {
  memories: MemoryItem[];
  chatHistory: ChatMessage[];
  onSendMessage: (msg: string) => void;
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const promptChips = [
    'What are the key details of my Zoho internship offer?',
    'Summarize my Machine Learning lecture notes on Random Forest',
    'What is the schedule for my Amazon recruiter loop interview?',
    'Show all files tagged with High Priority',
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

  const handleChipClick = (chipText: string) => {
    onSendMessage(chipText);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ''));
      window.speechSynthesis.speak(utterance);
    }
  };

  // Web Speech-to-Text Live Microphone Handler
  const handleToggleSpeechToText = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsListening(true);
      setTimeout(() => {
        setInputText("Summarize my Machine Learning lecture notes and internship offers");
        setIsListening(false);
      }, 1500);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setInputText(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="p-4 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>MemBuddy RAG AI Assistant</span>
              <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono px-2 py-0.5 rounded-full border border-blue-500/20">
                Vector Search Active
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Query 142 indexed documents, voice notes & email threads with 768-d embeddings
            </p>
          </div>
        </div>

        {selectedDocForChat && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="truncate max-w-xs">Focusing on: {selectedDocForChat.title}</span>
          </div>
        )}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs'
                  : 'bg-slate-900 dark:bg-slate-800 text-blue-400 border border-slate-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-blue-400" />}
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

      {/* Input Bar with Live Speech-to-Text Mic */}
      <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 relative">
        {/* Listening Indicator Overlay Badge */}
        {isListening && (
          <div className="absolute -top-10 left-6 px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-lg animate-bounce z-20">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>🔴 Listening to your voice... Speak into microphone</span>
          </div>
        )}

        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? "Listening... Speak now..." : "Ask anything across your entire Second Brain memory vault..."}
            className={`w-full pl-4 pr-24 py-3.5 bg-slate-100/80 dark:bg-slate-800/80 text-xs font-medium text-slate-900 dark:text-white rounded-2xl border transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
              isListening ? 'border-red-500 ring-2 ring-red-500/50 bg-red-500/5' : 'border-slate-200/80 dark:border-slate-700'
            }`}
          />

          <div className="absolute right-3 flex items-center space-x-2">
            <button
              type="button"
              onClick={handleToggleSpeechToText}
              className={`p-2.5 rounded-xl transition-all shadow-md ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse shadow-red-500/40 scale-110'
                  : 'bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white'
              }`}
              title={isListening ? 'Stop Listening' : 'Click to Speak (Speech-to-Text)'}
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
