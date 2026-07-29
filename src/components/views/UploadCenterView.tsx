import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  Mic,
  Image,
  FileCode,
  Mail,
  Film,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Square,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { MemoryItem, MemoryType } from '../../types/memory';

interface UploadCenterViewProps {
  onAddMemory: (newItem: MemoryItem) => void;
  onNavigate: (tab: string) => void;
}

export const UploadCenterView: React.FC<UploadCenterViewProps> = ({ onAddMemory, onNavigate }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState<MemoryType>('pdf');
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState('Career & Work');
  const [customContent, setCustomContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progressStep, setProgressStep] = useState<number>(0);
  const [uploadSuccess, setUploadSuccess] = useState<MemoryItem | null>(null);

  // Live Microphone Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcriptPreview, setTranscriptPreview] = useState<string | null>(null);

  const supportedTypes = [
    { type: 'pdf' as MemoryType, label: 'PDF & Docs', icon: FileText, desc: 'Offers, Papers, Guides' },
    { type: 'audio' as MemoryType, label: 'Voice Notes', icon: Mic, desc: 'Whisper Transcripts' },
    { type: 'image' as MemoryType, label: 'Scanned OCR', icon: Image, desc: 'Whiteboards & Receipts' },
    { type: 'email' as MemoryType, label: 'Emails (.eml)', icon: Mail, desc: 'Recruiter threads' },
    { type: 'note' as MemoryType, label: 'Text & Notes', icon: FileCode, desc: 'Markdown & Ideas' },
    { type: 'video' as MemoryType, label: 'Video Lecture', icon: Film, desc: 'Class Recordings' },
  ];

  // Timer effect for voice recording
  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setTranscriptPreview(null);
    if (!customTitle) {
      setCustomTitle(`Voice_Note_${new Date().toISOString().slice(0, 10)}.mp3`);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    const sampleTranscripts = [
      "Whisper AI Transcript: Discussed MemBuddy vector database architecture with team. Next action item: Submit ML Project 2 code repository and report.",
      "Whisper AI Transcript: Lecture 10 summary on Random Forest classifiers and bagging algorithms. Exam date confirmed for August 2026.",
      "Whisper AI Transcript: Recruiter screen prep for Amazon loop interview. Focus on STAR framework leadership principles."
    ];
    const generated = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];
    setTranscriptPreview(generated);
    setCustomContent(generated);
    if (!customTitle) {
      setCustomTitle(`Voice_Note_${new Date().toISOString().slice(0, 10)}.mp3`);
    }
  };

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    setUploading(true);
    setProgressStep(1); // Step 1: Parsing file

    setTimeout(() => {
      setProgressStep(2); // Step 2: Running Tesseract OCR & Whisper AI
    }, 1000);

    setTimeout(() => {
      setProgressStep(3); // Step 3: Sentence Transformers Embedding Generation
    }, 2000);

    setTimeout(() => {
      setProgressStep(4); // Step 4: Indexing into ChromaDB Vector Store & Graph
      const createdItem: MemoryItem = {
        id: `mem-${Date.now()}`,
        title: customTitle.endsWith(`.${selectedFileType}`) ? customTitle : `${customTitle}.${selectedFileType}`,
        type: selectedFileType,
        category: customCategory,
        summary: `AI generated summary for ${customTitle}: Contains structured concepts, metadata vectors, and extracted entities.`,
        fullContent: customContent || `Extracted text payload for ${customTitle}. Synthesized with ChromaDB vector search.`,
        ocrText: selectedFileType === 'image' ? `OCR extracted text for ${customTitle}` : undefined,
        audioTranscript: selectedFileType === 'audio' ? customContent || `Whisper transcript for ${customTitle}` : undefined,
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: '2.4 MB',
        tags: ['New Upload', selectedFileType, customCategory],
        importance: 'high',
        source: 'Voice Recorder',
        author: 'Hariharan B',
        vectorId: `vec_custom_${Math.floor(Math.random() * 9000 + 1000)}`,
        viewsCount: 1,
        entitiesConnected: ['Hariharan B', customCategory, 'MemBuddy'],
      };

      onAddMemory(createdItem);
      setUploading(false);
      setUploadSuccess(createdItem);

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 3200);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <UploadCloud className="w-3.5 h-3.5" /> Automated Multi-Modal Ingestion Pipeline
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          MemBuddy Upload & Indexing Center
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
          Upload any file format or record live voice notes. MemBuddy automatically performs OCR, Whisper Speech-to-Text, Embeddings, and Graph Linking.
        </p>
      </div>

      {/* Upload Form or Processing animation */}
      {!uploadSuccess ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Form (2 cols) */}
          <form onSubmit={handleSimulateUpload} className="md:col-span-2 glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6">
            {/* File Type Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                Select File Category & Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                {supportedTypes.map((st) => {
                  const Icon = st.icon;
                  const isSel = selectedFileType === st.type;
                  return (
                    <button
                      key={st.type}
                      type="button"
                      onClick={() => {
                        setSelectedFileType(st.type);
                        if (st.type === 'audio' && !customTitle) {
                          setCustomTitle(`Voice_Note_${new Date().toISOString().slice(0, 10)}.mp3`);
                        }
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSel
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-400'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1.5" />
                      <p className="text-xs font-bold">{st.label}</p>
                      <p className={`text-[10px] ${isSel ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>{st.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DEDICATED LIVE VOICE RECORDER WIDGET WHEN 'AUDIO' IS SELECTED */}
            {selectedFileType === 'audio' ? (
              <div className="p-6 bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/30 rounded-3xl border border-blue-500/40 text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <span className="p-3 bg-red-500/20 text-red-500 rounded-full animate-pulse">
                    <Mic className="w-8 h-8" />
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {isRecording ? '🔴 Recording Voice Note...' : 'Live Microphone Voice Recorder'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {isRecording
                      ? `Recording in progress... (${recordingTime}s)`
                      : 'Click record to speak into your microphone and generate Whisper AI transcripts.'}
                  </p>
                </div>

                {/* Animated Audio Waveform */}
                {isRecording && (
                  <div className="flex items-center justify-center space-x-1 py-2">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-blue-500 rounded-full animate-bounce"
                        style={{
                          height: `${Math.floor(Math.random() * 24 + 10)}px`,
                          animationDelay: `${i * 0.15}s`
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-3">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
                    >
                      <Mic className="w-4 h-4" /> Start Live Recording
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="px-6 py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 border border-slate-700"
                    >
                      <Square className="w-4 h-4 text-red-400" /> Stop & Transcribe via Whisper AI
                    </button>
                  )}
                </div>

                {/* Live Transcript Result */}
                {transcriptPreview && (
                  <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 text-xs text-left font-mono space-y-1 animate-fade-in">
                    <span className="text-blue-400 font-bold flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5" /> Whisper AI Transcribed Text:
                    </span>
                    <p className="text-slate-300 leading-relaxed">{transcriptPreview}</p>
                  </div>
                )}
              </div>
            ) : (
              /* Drag & Drop Visual Area for Files */
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
                className={`p-8 border-2 border-dashed rounded-3xl text-center transition-all ${
                  dragActive
                    ? 'border-blue-500 bg-blue-500/10 scale-102'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800/50'
                }`}
              >
                <UploadCloud className="w-10 h-10 text-blue-500 mx-auto mb-2 animate-bounce" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Drag and drop your file here, or browse local disk
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Supports PDF, DOCX, PPTX, MP3, PNG, JPG, EML up to 500 MB
                </p>
              </div>
            )}

            {/* Document Details inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Document / Memory Title
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Q3 System Design Blueprint or Voice_Note.mp3"
                  className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Category Tag
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-semibold"
                  >
                    <option>Career & Work</option>
                    <option>Academics & CS</option>
                    <option>Interview Prep</option>
                    <option>Finance & Bills</option>
                    <option>Projects & Code</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Importance Level
                  </label>
                  <select className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-semibold">
                    <option>High Priority</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Text Payload / Voice Transcript Body
                </label>
                <textarea
                  rows={3}
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  placeholder="Paste raw text, transcript logs, or notes here..."
                  className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing AI Extraction Pipeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Ingest & Build Vector Embeddings</span>
                </>
              )}
            </button>
          </form>

          {/* Right Pipeline Info Box */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4">
                Automated Processing Pipeline
              </h3>

              <div className="space-y-4 text-xs">
                <div className={`p-3 rounded-xl border transition-all ${progressStep >= 1 ? 'bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-300 font-bold' : 'bg-slate-100 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>
                  1. File Parsing & Chunking
                </div>

                <div className={`p-3 rounded-xl border transition-all ${progressStep >= 2 ? 'bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-300 font-bold' : 'bg-slate-100 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>
                  2. OCR & Speech Recognition (Whisper)
                </div>

                <div className={`p-3 rounded-xl border transition-all ${progressStep >= 3 ? 'bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-300 font-bold' : 'bg-slate-100 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>
                  3. Vector Embeddings Generation
                </div>

                <div className={`p-3 rounded-xl border transition-all ${progressStep >= 4 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold' : 'bg-slate-100 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>
                  4. ChromaDB & Knowledge Graph Indexing
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-[11px] text-slate-700 dark:text-slate-200">
              ⚡ <strong>Zero Latency:</strong> All files and voice transcripts are indexed locally with high-dimensional 768-d embeddings.
            </div>
          </div>
        </div>
      ) : (
        /* Upload Success Box */
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 bg-emerald-500/5 text-center space-y-6 max-w-xl mx-auto">
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-full w-fit mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Memory Ingested Successfully!
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              "{uploadSuccess.title}" has been indexed in ChromaDB with Vector ID: <code className="font-mono text-blue-500 font-bold">{uploadSuccess.vectorId}</code>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('chat')}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Chat With This Memory
            </button>
            <button
              onClick={() => setUploadSuccess(null)}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl hover:bg-slate-300 transition-colors"
            >
              Upload Another Memory
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
