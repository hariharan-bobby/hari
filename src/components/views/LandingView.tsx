import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Mic,
  Search,
  GitFork,
  ChevronDown,
  Check,
  Star,
  FileText,
  Clock,
  Scan,
  MessageSquare
} from 'lucide-react';

interface LandingViewProps {
  onEnterApp: () => void;
  onOpenAuth: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onEnterApp, onOpenAuth }) => {
  const [activeDemo, setActiveDemo] = useState<'chat' | 'graph' | 'ocr'>('chat');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const architectureLayers = [
    { num: '1', title: 'Data Sources', desc: 'Gmail, WhatsApp, PDFs, Scanned Docs, Voice Notes, Google Drive, Notion', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    { num: '2', title: 'Data Processing Layer', desc: 'Tesseract OCR, Whisper Speech-to-Text, PDF Text Extraction & Metadata Chunking', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    { num: '3', title: 'AI Intelligence Layer', desc: 'Sentence Transformers Embeddings, ChromaDB Vector DB, Llama 3 / GPT-4o RAG Engine', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
    { num: '4', title: 'Smart Features', desc: 'Semantic Search, Memory Graph, Timeline, Summarization, Flashcards, Daily Digest', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    { num: '5', title: 'User Interface', desc: 'Glassmorphism Web Dashboard, Quick Search ⌘K, Mobile PWA, Instant AI Chat', color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' },
  ];

  const testimonials = [
    { name: 'Dr. Evelyn Reed', role: 'AI Researcher at Stanford', quote: 'MemBuddy completely changed how I organize my research papers and lecture voice notes. Finding obscure citations takes seconds instead of hours.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
    { name: 'Marcus Vance', role: 'Lead Product Architect', quote: 'The interactive Knowledge Graph visually connecting my Amazon offer letters, receipts, and emails feels like magic. Startup worth millions!', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80' },
    { name: 'Sophia Chen', role: 'Software Engineer', quote: 'The local ChromaDB vector search + Whisper OCR integration gives me peace of mind with 100% data privacy.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
  ];

  const faqs = [
    { q: 'How does MemBuddy search my documents semantically?', a: 'MemBuddy converts your uploaded PDFs, audio recordings, scanned images, and emails into high-dimensional vector embeddings using Sentence Transformers, storing them in ChromaDB for instant nearest-neighbor similarity search.' },
    { q: 'Is my data private and secure?', a: 'Yes! Your documents are encrypted end-to-end with local vector indexing options. We do not use your personal vault to train public LLM models.' },
    { q: 'What file formats are supported in the Upload Center?', a: 'MemBuddy automatically processes PDFs, Word (.docx), PowerPoint (.pptx), Scanned PNG/JPG (OCR), Audio (.mp3, .m4a via Whisper AI), Text, Code, and .eml Email archives.' },
    { q: 'Can MemBuddy generate quizzes and flashcards for exams?', a: 'Absolutely! Our AI Study & Learning Hub automatically analyzes your class notes and lecture audio to generate interactive flashcards and multiple-choice quizzes.' },
  ];

  const keyFeatures = [
    {
      title: 'Semantic Search',
      desc: 'Find anything by meaning and natural language context, not just exact keywords.',
      icon: Search,
      color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
    },
    {
      title: 'OCR',
      desc: 'Extract text from images, scanned documents, and handwritten whiteboard notes.',
      icon: Scan,
      color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Voice-to-Text',
      desc: 'Convert speech, voice notes, and lecture audio into accurate text transcripts via Whisper AI.',
      icon: Mic,
      color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Chat with Memories',
      desc: 'Ask questions in natural language and get intelligent, context-aware conversational answers.',
      icon: MessageSquare,
      color: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
    },
    {
      title: 'PDF Understanding',
      desc: 'Read, understand, and extract key insights, tables, and metadata across complex PDFs.',
      icon: FileText,
      color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
    },
    {
      title: 'Memory Timeline',
      desc: 'Visual chronological timeline recalling important events, files, meetings, and deadlines.',
      icon: Clock,
      color: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/15 dark:bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation AI Memory Vault</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-tight">
          Mem<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Buddy</span> – Your Second Brain
        </h1>

        <p className="mt-4 text-xl sm:text-2xl font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Find Anything. Remember Everything.
        </p>

        <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-3xl mx-auto">
          Connect your PDFs, voice notes, emails, handwritten notes, and meetings into a unified intelligent Knowledge Graph with instant RAG semantic retrieval.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-blue-500/30 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <span>Launch Live Vault Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>Sign In / Create Account</span>
          </button>
        </div>

        {/* Interactive Demo Preview Card */}
        <div className="mt-14 max-w-5xl mx-auto glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl text-left">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              <span className="text-xs font-mono text-slate-400 ml-2">membuddy-v2.6-vault</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveDemo('chat')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  activeDemo === 'chat' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Conversational RAG
              </button>
              <button
                onClick={() => setActiveDemo('graph')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  activeDemo === 'graph' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Memory Graph
              </button>
              <button
                onClick={() => setActiveDemo('ocr')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  activeDemo === 'ocr' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                OCR & Speech Extraction
              </button>
            </div>
          </div>

          <div className="py-6">
            {activeDemo === 'chat' && (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800 flex items-start gap-3">
                  <div className="p-2 bg-blue-600 text-white rounded-xl">💬</div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">User Query:</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">"Where is my internship offer letter and what are the details?"</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl space-y-2 border border-slate-800 font-mono text-xs">
                  <p className="text-blue-400 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> MemBuddy AI Response (ChromaDB Retrieval Score: 0.984):
                  </p>
                  <p className="text-slate-300">
                    Found your official offer letter! <span className="text-amber-300 font-semibold font-mono">Zoho_Internship_Offer_Letter.pdf</span> (Uploaded July 12, 2026).
                  </p>
                  <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                    <p>• <strong className="text-white">Position:</strong> Machine Learning Engineer Intern</p>
                    <p>• <strong className="text-white">Stipend:</strong> $1,200 / Month</p>
                    <p>• <strong className="text-white">Start Date:</strong> August 15, 2026</p>
                    <p>• <strong className="text-white">Sign Deadline:</strong> July 30, 2026</p>
                  </div>
                </div>
              </div>
            )}

            {activeDemo === 'graph' && (
              <div className="p-6 bg-slate-950 rounded-2xl text-center border border-slate-800">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-bold mb-4">
                  <GitFork className="w-4 h-4" /> Connected Knowledge Graph
                </div>
                <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-semibold">
                  <span className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-lg">👤 Alex Rivera</span>
                  <span className="text-slate-500 font-mono">────[Offered]────</span>
                  <span className="px-4 py-2 bg-emerald-600 text-white rounded-xl shadow-lg">🏢 Zoho Corp</span>
                  <span className="text-slate-500 font-mono">────[Project]────</span>
                  <span className="px-4 py-2 bg-purple-600 text-white rounded-xl shadow-lg">📄 Machine Learning Notes</span>
                </div>
              </div>
            )}

            {activeDemo === 'ocr' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs space-y-2">
                  <span className="font-bold text-slate-700 dark:text-slate-200">📸 Raw Image/Audio Stream</span>
                  <p className="text-slate-500 italic">"Lecture_10_ML_Audio.mp3" & "Whiteboard_Arch.png"</p>
                  <div className="w-full bg-blue-500 h-1.5 rounded-full animate-pulse" />
                </div>
                <div className="p-4 bg-blue-900/30 rounded-2xl text-xs space-y-2 border border-blue-800">
                  <span className="font-bold text-blue-400">⚡ AI Transcribed Result</span>
                  <p className="text-slate-200 font-mono">"Prof Vance: Use Random Forest for prediction. Project 2 deadline: 25 July 2026."</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* System Architecture Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            MemBuddy Architecture
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Turning Your Data into Intelligent Answers (5-Layer Pipeline)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {architectureLayers.map((layer) => (
            <div
              key={layer.num}
              className={`p-5 rounded-2xl border ${layer.color} glass-card-hover flex flex-col justify-between`}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider font-mono opacity-80">
                  Layer {layer.num}
                </span>
                <h3 className="text-base font-bold mt-1 mb-2 text-slate-900 dark:text-white">
                  {layer.title}
                </h3>
                <p className="text-xs leading-relaxed opacity-90">
                  {layer.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-current/20 text-[10px] font-bold uppercase tracking-wider">
                ✓ Optimized
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features Grid (Streamlined 6 Core Feature Cards) */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto bg-slate-100/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/80 dark:border-slate-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Core Features
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            6 core capabilities powering your personal Second Brain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keyFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="p-6 glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 glass-card-hover">
                <div className={`p-3 rounded-xl w-fit mb-4 ${feat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Loved by Developers, Researchers & Founders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-6 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{t.quote}"
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h4>
                  <p className="text-[10px] text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Simple, Transparent Pricing
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-12">
          Start for free, upgrade when your memory vault expands.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <div className="p-8 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 text-left flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free Starter</h3>
              <p className="text-xs text-slate-500 mt-1">For casual note takers</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
                <span className="text-xs text-slate-400"> / forever</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Up to 50 Indexed Memories</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Basic RAG AI Search</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 1 GB Vector Storage</li>
              </ul>
            </div>
            <button
              onClick={onEnterApp}
              className="mt-8 w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-xs text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="p-8 bg-gradient-to-b from-blue-600 to-indigo-700 text-white rounded-3xl text-left shadow-2xl relative flex flex-col justify-between transform scale-105">
            <div className="absolute -top-3 right-6 px-3 py-1 bg-amber-400 text-slate-900 font-extrabold text-[10px] uppercase rounded-full tracking-wider">
              Most Popular
            </div>
            <div>
              <h3 className="text-xl font-bold">Pro Vault</h3>
              <p className="text-xs opacity-80 mt-1">For power users & professionals</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold">$19</span>
                <span className="text-xs opacity-80"> / month</span>
              </div>
              <ul className="space-y-3 text-xs opacity-90">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-300" /> Unlimited Memories & Vector Search</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-300" /> Whisper AI Voice & Tesseract OCR</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-300" /> Interactive Knowledge Graph</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-300" /> AI Flashcards & Quiz Generator</li>
              </ul>
            </div>
            <button
              onClick={onEnterApp}
              className="mt-8 w-full py-3 rounded-xl bg-white text-blue-700 font-bold text-xs shadow-lg hover:bg-blue-50 transition-all"
            >
              Launch Pro Vault Now
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-8 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 text-left flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enterprise Vault</h3>
              <p className="text-xs text-slate-500 mt-1">For research teams & startups</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$49</span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Custom Local Vector DB Deployment</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Multi-User Team Sharing</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Dedicated API & Webhook Access</li>
              </ul>
            </div>
            <button
              onClick={onEnterApp}
              className="mt-8 w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-xs text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Contact Enterprise
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-extrabold text-center text-slate-900 dark:text-white mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-5 text-left font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openFaq === index ? 'rotate-180 text-blue-500' : 'text-slate-400'}`} />
              </button>
              {openFaq === index && (
                <div className="p-5 pt-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-4 md:px-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-900 dark:text-white">MemBuddy</span>
            <span>— Your Second Brain</span>
          </div>
          <p>© 2026 MemBuddy Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
