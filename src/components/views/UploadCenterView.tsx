import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Mic,
  Image as ImageIcon,
  FileCode,
  Mail,
  Film,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Square,
  Volume2,
  FileCheck,
  FolderOpen,
  Send,
  Inbox,
  ScanText,
  Camera,
  Edit3,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { MemoryItem, MemoryType } from '../../types/memory';

interface UploadCenterViewProps {
  onAddMemory: (newItem: MemoryItem) => void;
  onNavigate: (tab: string) => void;
}

export const UploadCenterView: React.FC<UploadCenterViewProps> = ({ onAddMemory, onNavigate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState<MemoryType>('pdf');
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState('Career & Work');
  const [customContent, setCustomContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progressStep, setProgressStep] = useState<number>(0);
  const [uploadSuccess, setUploadSuccess] = useState<MemoryItem | null>(null);
  const [selectedFileObj, setSelectedFileObj] = useState<{ name: string; size: string } | null>(null);

  // Live Microphone Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcriptPreview, setTranscriptPreview] = useState<string | null>(null);
  const [isDictatingOCR, setIsDictatingOCR] = useState(false);
  const [isDictatingNote, setIsDictatingNote] = useState(false);

  // Email Ingestion Widget State
  const [emailSender, setEmailSender] = useState('Sarah Jenkins <sjenk@amazon.com>');
  const [emailSubject, setEmailSubject] = useState('Amazon SDE 4-Round Loop Interview Confirmation');

  const supportedTypes = [
    { type: 'pdf' as MemoryType, label: 'PDF & Docs', icon: FileText, desc: 'Offers, Papers, Guides' },
    { type: 'audio' as MemoryType, label: 'Voice Notes', icon: Mic, desc: 'Whisper Transcripts' },
    { type: 'image' as MemoryType, label: 'Scanned OCR', icon: ImageIcon, desc: 'Whiteboards & Receipts' },
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

  // Dictate OCR text via Web Speech Recognition
  const handleDictateOCR = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsDictatingOCR(true);
      setTimeout(() => {
        const sampleOCR = "Tesseract OCR Extracted Text: Machine Learning Whiteboard Architecture — Random Forest ensemble reduces model variance by averaging 100 decision trees trained on bootstrap samples.";
        setCustomContent(sampleOCR);
        setCustomTitle("Whiteboard_ML_Architecture_OCR.png");
        setIsDictatingOCR(false);
      }, 1500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsDictatingOCR(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setCustomContent(`Tesseract OCR Dictation: ${transcript}`);
      };

      recognition.onend = () => {
        setIsDictatingOCR(false);
      };

      recognition.start();
    } catch (err) {
      setIsDictatingOCR(false);
    }
  };

  // Dictate Note via Web Speech Recognition
  const handleDictateNote = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsDictatingNote(true);
      setTimeout(() => {
        const sampleNote = "# Voice Dictated Note\n\n- Key Insight: Implement HNSW vector index in ChromaDB to reduce search latency below 120ms.\n- Action Item: Complete Project 2 report by 11:59 PM today.";
        setCustomContent(sampleNote);
        if (!customTitle) setCustomTitle("Voice_Dictated_Note.md");
        setIsDictatingNote(false);
      }, 1500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsDictatingNote(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setCustomContent((prev) => (prev ? `${prev}\n- ${transcript}` : `# Voice Note\n- ${transcript}`));
      };

      recognition.onend = () => {
        setIsDictatingNote(false);
      };

      recognition.start();
    } catch (err) {
      setIsDictatingNote(false);
    }
  };

  // Presets for Text & Notes
  const handleSelectNotePreset = (presetKey: string) => {
    if (presetKey === 'architecture') {
      setCustomTitle('System_Design_Distributed_Cache.md');
      setCustomCategory('Career & Work');
      setCustomContent(`# Distributed Cache Architecture Notes\n\n## Key Design Principles\n1. **Redis Cluster Partitioning:** Consistent hashing with 1024 virtual slots to prevent hot spots.\n2. **Eviction Policy:** LRU (Least Recently Used) with 8GB memory cap per node.\n3. **Cache Aside Pattern:** App checks Redis first; on miss, queries PostgreSQL & writes back with 300s TTL.`);
    } else if (presetKey === 'ml_summary') {
      setCustomTitle('ML_Project2_Random_Forest_Notes.md');
      setCustomCategory('Academics & CS');
      setCustomContent(`# Machine Learning Project 2 Summary\n\n- Model Choice: Random Forest Classifier\n- Bagging Parameters: n_estimators=100, max_features='sqrt'\n- Cross-Validation Accuracy: 94.2%\n- Submission Deadline: 25 July 2026 at 11:59 PM`);
    } else if (presetKey === 'interview_prep') {
      setCustomTitle('Amazon_STAR_Leadership_Notes.md');
      setCustomCategory('Interview Prep');
      setCustomContent(`# Amazon Leadership Principles STAR Prep\n\n## Customer Obsession\n- **Situation:** Users reported 400ms latency on vector retrieval.\n- **Task:** Reduce query search latency under 150ms.\n- **Action:** Implemented HNSW indexing in ChromaDB.\n- **Result:** Latency dropped to 120ms (70% speedup).`);
    }
  };

  // Presets for Scanned OCR
  const handleSelectOcrPreset = (presetKey: string) => {
    if (presetKey === 'whiteboard') {
      setCustomTitle('Whiteboard_ML_Architecture_OCR.png');
      setCustomCategory('Academics & CS');
      setCustomContent(`[Tesseract OCR v5.3 Extracted Text]\nWhiteboard Topic: Random Forest & Bagging Algorithms\nKey Points:\n• Ensemble learning averages decision trees to lower model variance.\n• Subsample dataset with replacement (Bootstrap Aggregating).\n• Feature sub-selection at each split prevents tree correlation.\n• Project 2 Deadline: July 25, 2026.`);
    } else if (presetKey === 'receipt') {
      setCustomTitle('AWS_Cloud_EC2_Invoice_Receipt.jpg');
      setCustomCategory('Finance & Bills');
      setCustomContent(`[Tesseract OCR v5.3 Extracted Text]\nVendor: Amazon Web Services (AWS Invoice)\nDate: 15 July 2026\nItemized Charges:\n• EC2 t3.xlarge ChromaDB Hosting: $38.00\n• S3 Bucket Vector Embeddings Storage: $4.50\nTotal Paid: $42.50 (Payment Method: Visa ending in 4012)`);
    } else if (presetKey === 'checklist') {
      setCustomTitle('Handwritten_Study_Checklist.png');
      setCustomCategory('Career & Work');
      setCustomContent(`[Tesseract OCR v5.3 Extracted Text]\nHandwritten Notes:\n1. Review System Design scaling patterns (Load Balancing, Sharding).\n2. Practice 5 LeetCode Medium questions on Dynamic Programming.\n3. Prepare STAR responses for Amazon Leadership Principles.\n4. Complete MemBuddy RAG testing.`);
    }
  };

  // Preset Email Templates
  const handleSelectEmailPreset = (presetKey: string) => {
    if (presetKey === 'amazon') {
      setEmailSender('Sarah Jenkins <sjenk@amazon.com>');
      setEmailSubject('Amazon SDE 4-Round Loop Interview Confirmation');
      setCustomTitle('Email_Amazon_SDE_Loop_Interview.eml');
      setCustomCategory('Career & Work');
      setCustomContent(`From: Sarah Jenkins <sjenk@amazon.com>\nTo: Hariharan B <gamertechtamilan@gmail.com>\nSubject: Amazon SDE Loop Interview Confirmation\nDate: 25 July 2026\n\nHi Hariharan,\n\nCongratulations on clearing the preliminary phone screening! We are excited to invite you to the virtual 4-round loop interview scheduled for August 5, 2026.\n\nLoop Schedule:\n• Round 1: System Design & Scalability (10:00 AM PST)\n• Round 2: Data Structures & Algorithms (11:15 AM PST)\n• Round 3: Leadership Principles - STAR Framework (1:00 PM PST)\n• Round 4: Bar Raiser Interview (2:15 PM PST)\n\nPlease confirm your availability by replying to this thread.\n\nBest regards,\nSarah Jenkins\nSenior Technical Recruiter | Amazon Web Services`);
    } else if (presetKey === 'zoho') {
      setEmailSender('Dr. K. Sundaram <sundaram.k@zoho.com>');
      setEmailSubject('Official Internship Offer - Machine Learning Engineer');
      setCustomTitle('Email_Zoho_Internship_Offer.eml');
      setCustomCategory('Career & Work');
      setCustomContent(`From: Dr. K. Sundaram <sundaram.k@zoho.com>\nTo: Hariharan B <gamertechtamilan@gmail.com>\nSubject: Official Internship Offer - Machine Learning Engineer\nDate: 12 July 2026\n\nDear Hariharan,\n\nOn behalf of Zoho Corporation, I am delighted to offer you the position of Machine Learning Engineer Intern. Your stipend will be $1,200/month starting August 15, 2026.\n\nPlease sign and return the attached offer document prior to July 30, 2026.`);
    } else if (presetKey === 'stanford') {
      setEmailSender('Prof. Andrew Vance <vance@cs.stanford.edu>');
      setEmailSubject('CS229 Machine Learning Project 2 Guidelines');
      setCustomTitle('Email_Stanford_CS229_Project2.eml');
      setCustomCategory('Academics & CS');
      setCustomContent(`From: Prof. Andrew Vance <vance@cs.stanford.edu>\nTo: CS229 Students <cs229-list@stanford.edu>\nSubject: CS229 Machine Learning Project 2 Guidelines\nDate: 20 July 2026\n\nClass,\n\nFor Project 2, your model must implement Random Forest or Gradient Boosting classifiers. Code submission deadline is 25 July 2026 at 11:59 PM.`);
    }
  };

  // Handle native file selection from browser OS file dialog or drop
  const handleFilePicked = (file: File) => {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    setSelectedFileObj({ name: file.name, size: `${fileSizeMB} MB` });
    setCustomTitle(file.name);

    if (file.name.endsWith('.eml')) {
      setSelectedFileType('email');
    } else if (file.type.includes('image') || file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) {
      setSelectedFileType('image');
    } else if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      setSelectedFileType('note');
    }

    // Read text/markdown/email content if file is readable
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.eml') || file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCustomContent(e.target.result.toString());
        }
      };
      reader.readAsText(file);
    } else {
      setCustomContent(`Payload for ${file.name} (${fileSizeMB} MB). Prepared for ChromaDB vector embeddings.`);
    }
  };

  const handleSimulateUpload = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let finalTitle = customTitle.trim();
    if (!finalTitle) {
      if (selectedFileType === 'note') {
        finalTitle = `Note_${Date.now()}.md`;
      } else if (selectedFileType === 'image') {
        finalTitle = `Scanned_OCR_${Date.now()}.png`;
      } else if (selectedFileType === 'email') {
        finalTitle = `Email_${emailSubject.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.eml`;
      } else if (selectedFileType === 'audio') {
        finalTitle = `Voice_Note_${new Date().toISOString().slice(0, 10)}.mp3`;
      } else {
        finalTitle = `Document_${Date.now()}.${selectedFileType}`;
      }
    }

    let payload = customContent.trim();
    if (!payload && selectedFileType === 'note') {
      payload = `# Quick Note\n\nText note payload for ${finalTitle}. Prepared for ChromaDB vector embeddings.`;
    }

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
        title: finalTitle.endsWith(`.${selectedFileType}`) ? finalTitle : `${finalTitle}.${selectedFileType}`,
        type: selectedFileType,
        category: customCategory,
        summary: `AI generated summary for ${finalTitle}: Contains structured concepts, metadata vectors, and extracted entities.`,
        fullContent: payload || `Extracted text payload for ${finalTitle}. Synthesized with ChromaDB vector search.`,
        ocrText: selectedFileType === 'image' ? payload || `OCR extracted text for ${finalTitle}` : undefined,
        audioTranscript: selectedFileType === 'audio' ? payload || `Whisper transcript for ${finalTitle}` : undefined,
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: selectedFileObj ? selectedFileObj.size : '1.2 MB',
        tags: ['New Upload', selectedFileType, customCategory],
        importance: 'high',
        source: selectedFileType === 'email' ? 'Gmail' : selectedFileType === 'audio' ? 'Voice Recorder' : 'Local Upload',
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
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 3200);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* Hidden File Input Element */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx,.eml,.mp3,.txt,.md"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFilePicked(e.target.files[0]);
          }
        }}
      />

      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <UploadCloud className="w-3.5 h-3.5" /> Automated Multi-Modal Ingestion Pipeline
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          MemBuddy Upload & Indexing Center
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
          Upload any file format, write markdown notes, import Gmail threads, scan image OCR, or record live voice notes. MemBuddy automatically performs OCR, Whisper Speech-to-Text, Embeddings, and Graph Linking.
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
                        if (st.type === 'email' && !customTitle) {
                          handleSelectEmailPreset('amazon');
                        }
                        if (st.type === 'image' && !customTitle) {
                          handleSelectOcrPreset('whiteboard');
                        }
                        if (st.type === 'note' && !customTitle) {
                          handleSelectNotePreset('architecture');
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

            {/* DEDICATED MARKDOWN TEXT & NOTES INGESTER WIDGET WHEN 'NOTE' IS SELECTED */}
            {selectedFileType === 'note' ? (
              <div className="p-6 bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/30 rounded-3xl border border-blue-500/40 space-y-4 shadow-xl text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl">
                      <Edit3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Markdown Note Editor & Voice Dictator
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Write structured markdown notes or dictate thoughts directly via microphone.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <FolderOpen className="w-3.5 h-3.5" /> Load .MD File
                  </button>
                </div>

                {/* Quick Note Presets */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Or Load Quick Note Preset:
                  </label>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleSelectNotePreset('architecture')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-blue-900/60 border border-slate-700 text-slate-200 rounded-xl font-medium flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Distributed System Design
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectNotePreset('ml_summary')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-blue-900/60 border border-slate-700 text-slate-200 rounded-xl font-medium flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> ML Random Forest Notes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectNotePreset('interview_prep')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-blue-900/60 border border-slate-700 text-slate-200 rounded-xl font-medium flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Amazon STAR Notes
                    </button>
                  </div>
                </div>

                {/* Voice-to-Text Dictation Button inside Note Box */}
                <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <Mic className="w-4 h-4 text-blue-400" />
                    <span>Dictate Note content via Microphone Speech-to-Text</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleDictateNote}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isDictatingNote
                        ? 'bg-red-600 text-white animate-pulse shadow-lg'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    {isDictatingNote ? '🔴 Dictating...' : 'Speak into Mic'}
                  </button>
                </div>

                {/* DIRECT INGESTION BUTTON INSIDE NOTE BOX */}
                <button
                  type="button"
                  onClick={() => handleSimulateUpload()}
                  disabled={uploading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Ingesting Markdown Note into Vector DB...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>⚡ Save & Ingest Text Note into Second Brain</span>
                    </>
                  )}
                </button>
              </div>
            ) : selectedFileType === 'image' ? (
              /* DEDICATED SCANNED OCR & VOICE-TO-TEXT WIDGET WHEN 'IMAGE' IS SELECTED */
              <div className="p-6 bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/30 rounded-3xl border border-blue-500/40 space-y-4 shadow-xl text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl">
                      <ScanText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Scanned OCR & Voice-to-Text Transcriber
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Scan whiteboard photos, receipts, or dictate image text using microphone.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" /> Scan Local Image
                  </button>
                </div>

                {/* Quick OCR Samples */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Or Select Sample Image OCR Document:
                  </label>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleSelectOcrPreset('whiteboard')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-blue-900/60 border border-slate-700 text-slate-200 rounded-xl font-medium flex items-center gap-1.5"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-blue-400" /> Whiteboard ML Diagram
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectOcrPreset('receipt')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-blue-900/60 border border-slate-700 text-slate-200 rounded-xl font-medium flex items-center gap-1.5"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-400" /> AWS Cloud Invoice
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectOcrPreset('checklist')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-blue-900/60 border border-slate-700 text-slate-200 rounded-xl font-medium flex items-center gap-1.5"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-purple-400" /> Handwritten Notes
                    </button>
                  </div>
                </div>

                {/* Voice-to-Text Dictation Button inside OCR Box */}
                <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <Mic className="w-4 h-4 text-blue-400" />
                    <span>Dictate OCR text via Microphone Speech-to-Text</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleDictateOCR}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isDictatingOCR
                        ? 'bg-red-600 text-white animate-pulse shadow-lg'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    {isDictatingOCR ? '🔴 Dictating...' : 'Speak into Mic'}
                  </button>
                </div>

                {/* DIRECT INGESTION BUTTON INSIDE OCR BOX */}
                <button
                  type="button"
                  onClick={() => handleSimulateUpload()}
                  disabled={uploading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Ingesting Scanned OCR into Vector DB...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>⚡ Save & Ingest Scanned OCR Image into Second Brain</span>
                    </>
                  )}
                </button>
              </div>
            ) : selectedFileType === 'audio' ? (
              /* DEDICATED LIVE VOICE RECORDER WIDGET WHEN 'AUDIO' IS SELECTED */
              <div className="p-6 bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/30 rounded-3xl border border-blue-500/40 text-center space-y-4 shadow-xl">
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
                <div className="flex flex-wrap items-center justify-center gap-3">
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

                {/* Live Transcript Result & Direct Ingestion CTA */}
                {transcriptPreview && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 text-xs text-left font-mono space-y-1">
                      <span className="text-blue-400 font-bold flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5" /> Whisper AI Transcribed Text:
                      </span>
                      <p className="text-slate-300 leading-relaxed">{transcriptPreview}</p>
                    </div>

                    {/* DIRECT INGESTION BUTTON INSIDE VOICE BOX */}
                    <button
                      type="button"
                      onClick={() => handleSimulateUpload()}
                      disabled={uploading}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all"
                    >
                      {uploading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Ingesting Voice Note into Vector DB...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>⚡ Save & Ingest Voice Note into Second Brain</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : selectedFileType === 'email' ? (
              /* DEDICATED EMAIL (.EML) / GMAIL THREAD INGESTION WIDGET */
              <div className="p-6 bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-slate-900/40 rounded-3xl border border-blue-500/40 space-y-4 shadow-xl text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Gmail & Email Thread (.eml) Ingester
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Parse email headers, attachments, and recruiter conversations into vectors.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <FolderOpen className="w-3.5 h-3.5" /> Load .EML File
                  </button>
                </div>

                {/* Email Template Preset Shortcuts */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Or Load Quick Email Sample:
                  </label>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleSelectEmailPreset('amazon')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-blue-900/60 border border-slate-700 text-slate-200 rounded-xl font-medium flex items-center gap-1.5"
                    >
                      <Inbox className="w-3.5 h-3.5 text-amber-400" /> Amazon Recruiter Thread
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectEmailPreset('zoho')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-blue-900/60 border border-slate-700 text-slate-200 rounded-xl font-medium flex items-center gap-1.5"
                    >
                      <Inbox className="w-3.5 h-3.5 text-emerald-400" /> Zoho Offer Letter
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectEmailPreset('stanford')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-blue-900/60 border border-slate-700 text-slate-200 rounded-xl font-medium flex items-center gap-1.5"
                    >
                      <Inbox className="w-3.5 h-3.5 text-purple-400" /> Stanford CS Course
                    </button>
                  </div>
                </div>

                {/* Sender & Subject Quick Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Sender (From)
                    </label>
                    <input
                      type="text"
                      value={emailSender}
                      onChange={(e) => setEmailSender(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs"
                      placeholder="Sarah Jenkins <sjenk@amazon.com>"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => {
                        setEmailSubject(e.target.value);
                        setCustomTitle(`Email_${e.target.value.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.eml`);
                      }}
                      className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 font-semibold text-xs"
                      placeholder="Amazon SDE Loop Interview Confirmation"
                    />
                  </div>
                </div>

                {/* DIRECT INGESTION BUTTON INSIDE EMAIL BOX */}
                <button
                  type="button"
                  onClick={() => handleSimulateUpload()}
                  disabled={uploading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Ingesting Email Thread into Vector DB...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>⚡ Save & Ingest Email Thread into Second Brain</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Clickable & Interactive Drag & Drop Area for Local Files */
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFilePicked(e.dataTransfer.files[0]);
                  }
                }}
                className={`p-8 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-blue-500 bg-blue-500/10 scale-102'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800/50 hover:border-blue-500 hover:bg-blue-500/5'
                }`}
              >
                <UploadCloud className="w-10 h-10 text-blue-500 mx-auto mb-2 animate-bounce" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Click to browse disk or drag and drop your file here
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Supports PDF, DOCX, PPTX, MP3, PNG, JPG, EML up to 500 MB
                </p>

                {selectedFileObj && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold font-mono">
                    <FileCheck className="w-4 h-4" />
                    <span>Selected: {selectedFileObj.name} ({selectedFileObj.size})</span>
                  </div>
                )}
              </div>
            )}

            {/* Document Details inputs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Document / Memory Title
                </label>
                {selectedFileType !== 'audio' && selectedFileType !== 'email' && selectedFileType !== 'image' && selectedFileType !== 'note' && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <FolderOpen className="w-3.5 h-3.5" /> Select Local File
                  </button>
                )}
              </div>

              <input
                type="text"
                required
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. System_Design_Cache_Notes.md or Voice_Note.mp3"
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />

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
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center justify-between">
                  <span>Text Payload / Markdown Content / Transcript</span>
                  <span className="text-[10px] text-slate-400 font-mono">{customContent.length} chars</span>
                </label>
                <textarea
                  rows={5}
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  placeholder="Write your markdown note, paste raw text, or dictate via voice speech-to-text..."
                  className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono text-[11px] leading-relaxed"
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
              ⚡ <strong>Zero Latency:</strong> All files, notes, email threads, OCR scans, and voice transcripts are indexed locally with high-dimensional 768-d embeddings.
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
              onClick={() => {
                setUploadSuccess(null);
                setSelectedFileObj(null);
                setCustomTitle('');
                setCustomContent('');
                setTranscriptPreview(null);
              }}
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
