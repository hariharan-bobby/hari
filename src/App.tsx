import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DocumentModal } from './components/common/DocumentModal';

import { LandingView } from './components/views/LandingView';
import { DashboardView } from './components/views/DashboardView';
import { AIChatView } from './components/views/AIChatView';
import { MemoryGraphView } from './components/views/MemoryGraphView';
import { UploadCenterView } from './components/views/UploadCenterView';
import { SearchEngineView } from './components/views/SearchEngineView';
import { TimelineView } from './components/views/TimelineView';
import { StudyHubView } from './components/views/StudyHubView';
import { SettingsView } from './components/views/SettingsView';
import { AuthModal } from './components/views/AuthModal';
import { NotFoundView } from './components/views/NotFoundView';

import {
  initialProfile,
  initialMemories,
  initialGraphNodes,
  initialGraphLinks,
  initialTimelineEvents,
  initialFlashcards,
  initialQuizzes,
  defaultChatHistory,
} from './data/mockData';

import type { MemoryItem, ChatMessage, UserProfile, SourceCitation } from './types/memory';

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [user, setUser] = useState<UserProfile>(initialProfile);
  const [memories, setMemories] = useState<MemoryItem[]>(initialMemories);
  const [graphNodes] = useState(initialGraphNodes);
  const [graphLinks] = useState(initialGraphLinks);
  const [timelineEvents] = useState(initialTimelineEvents);
  const [flashcards] = useState(initialFlashcards);
  const [quizzes] = useState(initialQuizzes);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(defaultChatHistory);

  // Modals state
  const [selectedDocModal, setSelectedDocModal] = useState<MemoryItem | null>(null);
  const [selectedDocForChat, setSelectedDocForChat] = useState<MemoryItem | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Known valid tab IDs
  const validTabs = ['landing', 'dashboard', 'chat', 'graph', 'upload', 'search', 'timeline', 'study', 'settings'];

  // Sync dark mode class on body element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Global Keyboard Shortcut ⌘K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCurrentTab('search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAddMemory = (newMemory: MemoryItem) => {
    setMemories([newMemory, ...memories]);
    setUser((prev) => ({
      ...prev,
      totalIndexed: prev.totalIndexed + 1,
      storageUsedMB: prev.storageUsedMB + 5,
    }));
  };

  // RAG Conversational Engine Simulator
  const handleSendMessage = (userText: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);

    // Perform vector similarity matching against memory store
    const lowerQuery = userText.toLowerCase();
    const matchedDocs = memories.filter((m) => {
      return (
        m.title.toLowerCase().includes(lowerQuery) ||
        m.tags.some((t) => lowerQuery.includes(t.toLowerCase())) ||
        m.summary.toLowerCase().includes(lowerQuery) ||
        (m.ocrText && m.ocrText.toLowerCase().includes(lowerQuery)) ||
        (m.fullContent && m.fullContent.toLowerCase().includes(lowerQuery))
      );
    });

    const citations: SourceCitation[] = matchedDocs.slice(0, 3).map((d) => ({
      id: d.id,
      title: d.title,
      type: d.type,
      snippet: d.summary,
      source: d.source,
      date: d.uploadDate,
      relevanceScore: 0.95 + Math.random() * 0.04,
    }));

    let botReply = '';

    if (lowerQuery.includes('internship') || lowerQuery.includes('zoho') || lowerQuery.includes('offer')) {
      botReply = `Found your official internship offer letter! 📄 **Zoho_Internship_Offer_Letter.pdf** (Uploaded 12 July 2026).\n\nKey Details:\n• **Role:** Machine Learning Engineer Intern\n• **Stipend:** $1,200 / Month\n• **Start Date:** August 15, 2026\n• **Sign Deadline:** July 30, 2026\n\nWould you like me to draft an acceptance email to Dr. K. Sundaram?`;
    } else if (lowerQuery.includes('machine learning') || lowerQuery.includes('notes') || lowerQuery.includes('random forest')) {
      botReply = `Here are your Machine Learning notes and lecture transcripts from Prof. Vance:\n\n1. **Machine Learning Complete Class Notes.pdf** — Covers Random Forest, Gradient Boosting, Loss Functions, and Transformers.\n2. **Lecture 10 ML Audio Transcript.mp3** — Prof. Vance explicitly noted: *"For Project 2, use Random Forest or Gradient Boosting. Deadline is 25 July 2026."*\n\nYou can launch Exam Mode in the AI Study Hub to test your knowledge!`;
    } else if (lowerQuery.includes('meeting') || lowerQuery.includes('summarize')) {
      botReply = `Summary of today's team sync:\n• Discussed ChromaDB vector indexing latency (reduced to 0.12s).\n• Verified Tesseract OCR pipeline on whiteboard photos.\n• Next action item: Submit ML Project 2 code repository by 11:59 PM today.`;
    } else if (lowerQuery.includes('amazon') || lowerQuery.includes('interview')) {
      botReply = `Here is everything retrieved for **Amazon**:\n• **Amazon SDE Interview Prep Guide.pdf** — STAR responses for Leadership Principles (Customer Obsession, Ownership).\n• **Amazon Recruiter Screening Email.eml** — Email from Sarah Jenkins confirming 4-round loop interview on Aug 5, 2026.\n• **AWS Cloud Invoice ($42.50)** — ChromaDB EC2 hosting charge.`;
    } else {
      botReply = `I searched your vault across 142 indexed memories. ${
        matchedDocs.length > 0
          ? `Found ${matchedDocs.length} matching document(s) in vector store.`
          : `Synthesized answer based on your general Second Brain knowledge graph.`
      } How else can I assist with this concept?`;
    }

    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: citations.length > 0 ? citations : undefined,
      };
      setChatHistory((prev) => [...prev, assistantMsg]);
    }, 600);
  };

  const handleOpenDocModal = (doc: MemoryItem) => {
    setSelectedDocModal(doc);
  };

  const handleChatWithDoc = (doc: MemoryItem) => {
    setSelectedDocForChat(doc);
    setCurrentTab('chat');
    handleSendMessage(`Summarize key insights and metadata for document "${doc.title}"`);
  };

  const renderActiveView = () => {
    if (!validTabs.includes(currentTab)) {
      return <NotFoundView onNavigateHome={() => setCurrentTab('dashboard')} />;
    }

    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            user={user}
            memories={memories}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenDocModal={handleOpenDocModal}
          />
        );
      case 'chat':
        return (
          <AIChatView
            memories={memories}
            chatHistory={chatHistory}
            onSendMessage={handleSendMessage}
            onOpenDocModal={handleOpenDocModal}
            selectedDocForChat={selectedDocForChat}
          />
        );
      case 'graph':
        return (
          <MemoryGraphView
            nodes={graphNodes}
            links={graphLinks}
            memories={memories}
            onOpenDocModal={handleOpenDocModal}
          />
        );
      case 'upload':
        return (
          <UploadCenterView
            onAddMemory={handleAddMemory}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        );
      case 'search':
        return (
          <SearchEngineView
            memories={memories}
            onOpenDocModal={handleOpenDocModal}
          />
        );
      case 'timeline':
        return (
          <TimelineView
            events={timelineEvents}
            memories={memories}
            onOpenDocModal={handleOpenDocModal}
          />
        );
      case 'study':
        return (
          <StudyHubView
            flashcards={flashcards}
            quizzes={quizzes}
          />
        );
      case 'settings':
        return (
          <SettingsView
            user={user}
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
            onUpdateProfile={(updated) => setUser({ ...user, ...updated })}
          />
        );
      default:
        return <NotFoundView onNavigateHome={() => setCurrentTab('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300">
      {/* If currentTab is 'landing', show full startup landing page */}
      {currentTab === 'landing' ? (
        <>
          <Navbar
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
            user={user}
            onOpenSearch={() => setCurrentTab('search')}
            onOpenAuth={() => setIsAuthOpen(true)}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
          <LandingView
            onEnterApp={() => setCurrentTab('dashboard')}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        </>
      ) : (
        <>
          {/* Main App Layout */}
          <Navbar
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
            user={user}
            onOpenSearch={() => setCurrentTab('search')}
            onOpenAuth={() => setIsAuthOpen(true)}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />

          <div className="flex flex-1">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={(tab) => setCurrentTab(tab)}
              totalIndexedCount={user.totalIndexed}
            />

            <main className="flex-1 overflow-x-hidden pb-12">
              {renderActiveView()}
            </main>
          </div>
        </>
      )}

      {/* Global Document Detail Modal */}
      <DocumentModal
        item={selectedDocModal}
        onClose={() => setSelectedDocModal(null)}
        onOpenChatWithDoc={handleChatWithDoc}
      />

      {/* Global Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(name, email) => setUser({ ...user, name, email })}
      />
    </div>
  );
}

export default App;
