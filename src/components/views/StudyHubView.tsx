import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  RotateCw,
  ArrowRight,
  ArrowLeft,
  Award,
  Flame,
  Zap,
  Lightbulb,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Flashcard, QuizQuestion } from '../../types/memory';

interface StudyHubViewProps {
  flashcards: Flashcard[];
  quizzes: QuizQuestion[];
}

export const StudyHubView: React.FC<StudyHubViewProps> = ({ flashcards, quizzes }) => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'quiz' | 'digest'>('flashcards');

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimatingNext, setIsAnimatingNext] = useState(false);
  const [modeFilter, setModeFilter] = useState<'all' | 'hard' | 'easy'>('all');
  const [showHint, setShowHint] = useState(false);
  const [confidenceScores, setConfidenceScores] = useState<Record<string, 'easy' | 'medium' | 'hard'>>({
    'fc-1': 'hard',
    'fc-2': 'easy'
  });

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Filter flashcards based on selected difficulty mode
  const filteredFlashcards = flashcards.filter((card) => {
    if (modeFilter === 'hard') return confidenceScores[card.id] === 'hard' || modeFilter === 'hard';
    if (modeFilter === 'easy') return confidenceScores[card.id] === 'easy';
    return true;
  });

  const currentCard = filteredFlashcards[cardIndex % filteredFlashcards.length] || flashcards[0];
  const currentCardScore = confidenceScores[currentCard.id] || (modeFilter === 'hard' ? 'hard' : 'easy');

  const handleNextCard = () => {
    setIsAnimatingNext(true);
    setShowHint(false);
    setTimeout(() => {
      setIsFlipped(false);
      setCardIndex((prev) => (prev + 1) % filteredFlashcards.length);
      setIsAnimatingNext(false);
    }, 200);
  };

  const handlePrevCard = () => {
    setIsAnimatingNext(true);
    setShowHint(false);
    setTimeout(() => {
      setIsFlipped(false);
      setCardIndex((prev) => (prev > 0 ? prev - 1 : filteredFlashcards.length - 1));
      setIsAnimatingNext(false);
    }, 200);
  };

  const handleMarkConfidence = (level: 'easy' | 'medium' | 'hard') => {
    setConfidenceScores({ ...confidenceScores, [currentCard.id]: level });
    if (level === 'easy') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    handleNextCard();
  };

  const handleAnswerSelect = (quizId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [quizId]: optionIdx });
  };

  const calculateScore = () => {
    let score = 0;
    quizzes.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) score++;
    });
    return score;
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5" /> AI Study & Exam Preparation Hub
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Study Mode & Daily Digest
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'flashcards'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🎴 AI Flashcards ({flashcards.length})
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            📝 Exam Quiz ({quizzes.length})
          </button>

          <button
            onClick={() => setActiveTab('digest')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'digest'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ✨ Daily Digest
          </button>
        </div>
      </div>

      {/* FLASHCARDS VIEW */}
      {activeTab === 'flashcards' && currentCard && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* HARD VS EASY MODE DYNAMIC INTERFACE SELECTOR BAR */}
          <div className="glass-panel p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider hidden sm:inline">
              Interface Mode:
            </span>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setModeFilter('all');
                  setCardIndex(0);
                  setIsFlipped(false);
                }}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                  modeFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> All Cards ({flashcards.length})
              </button>

              <button
                onClick={() => {
                  setModeFilter('hard');
                  setCardIndex(0);
                  setIsFlipped(false);
                }}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                  modeFilter === 'hard'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-red-500 dark:text-red-400 hover:bg-red-500/10 border border-red-500/20'
                }`}
              >
                <Flame className="w-3.5 h-3.5" /> 🔥 Hard Mode (Review)
              </button>

              <button
                onClick={() => {
                  setModeFilter('easy');
                  setCardIndex(0);
                  setIsFlipped(false);
                }}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                  modeFilter === 'easy'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20'
                }`}
              >
                <Zap className="w-3.5 h-3.5" /> ⚡ Easy Mode (Mastered)
              </button>
            </div>
          </div>

          {/* Card Progress Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span className={`font-bold flex items-center gap-1.5 ${
                modeFilter === 'hard' ? 'text-red-400' : modeFilter === 'easy' ? 'text-emerald-400' : 'text-blue-500'
              }`}>
                <Sparkles className="w-4 h-4" /> Topic: {currentCard.topic}
              </span>
              <span className="font-mono text-slate-300">
                Card <strong className={modeFilter === 'hard' ? 'text-red-400' : modeFilter === 'easy' ? 'text-emerald-400' : 'text-blue-400'}>
                  {(cardIndex % filteredFlashcards.length) + 1}
                </strong> of {filteredFlashcards.length}
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  modeFilter === 'hard'
                    ? 'bg-gradient-to-r from-red-500 to-rose-600'
                    : modeFilter === 'easy'
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                }`}
                style={{ width: `${(((cardIndex % filteredFlashcards.length) + 1) / filteredFlashcards.length) * 100}%` }}
              />
            </div>
          </div>

          {/* DYNAMIC INTERFACE UI: HARD MODE VS EASY MODE CARD TRANSFORMATIONS */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`w-full min-h-[340px] rounded-3xl p-8 cursor-pointer flex flex-col justify-between items-center text-center transition-all duration-500 shadow-2xl relative border overflow-hidden transform ${
              isAnimatingNext ? 'scale-95 opacity-40' : 'scale-100 opacity-100'
            } ${
              modeFilter === 'hard' || currentCardScore === 'hard'
                ? !isFlipped
                  ? 'bg-gradient-to-br from-slate-950 via-red-950/90 to-rose-950/90 border-red-500/60 shadow-red-500/30'
                  : 'bg-gradient-to-br from-slate-950 via-rose-900/90 to-red-900/90 border-rose-500/70 shadow-rose-500/40'
                : modeFilter === 'easy' || currentCardScore === 'easy'
                ? !isFlipped
                  ? 'bg-gradient-to-br from-slate-950 via-emerald-950/90 to-teal-950/90 border-emerald-500/60 shadow-emerald-500/30'
                  : 'bg-gradient-to-br from-slate-950 via-teal-900/90 to-emerald-900/90 border-teal-500/70 shadow-teal-500/40'
                : !isFlipped
                ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 border-blue-500/40 shadow-blue-500/20'
                : 'bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 border-emerald-500/50 shadow-emerald-500/25'
            }`}
          >
            {/* Background Ambient Glow */}
            <div
              className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
                modeFilter === 'hard' || currentCardScore === 'hard'
                  ? 'bg-red-600/30'
                  : modeFilter === 'easy' || currentCardScore === 'easy'
                  ? 'bg-emerald-500/30'
                  : 'bg-blue-500/20'
              }`}
            />

            {/* Dynamic Status Badge (Hard vs Easy vs Neutral) */}
            <div className="z-10 flex flex-wrap items-center justify-center gap-2">
              {modeFilter === 'hard' ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] uppercase font-extrabold tracking-wider text-red-400 bg-red-500/20 border border-red-500/40 px-4 py-1 rounded-full shadow-md animate-pulse">
                  <Flame className="w-3.5 h-3.5 text-red-400" /> 🔥 HARD MODE — INTENSIVE REPETITION
                </span>
              ) : modeFilter === 'easy' ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] uppercase font-extrabold tracking-wider text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-4 py-1 rounded-full shadow-md animate-bounce">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" /> ⚡ EASY MODE — MASTERED CONCEPTS
                </span>
              ) : null}

              <span className={`inline-flex items-center gap-1.5 text-[11px] uppercase font-extrabold tracking-wider px-3 py-1 rounded-full shadow-sm ${
                !isFlipped
                  ? 'text-blue-300 bg-blue-500/20 border border-blue-500/30'
                  : 'text-emerald-300 bg-emerald-500/20 border border-emerald-500/30'
              }`}>
                {!isFlipped ? <HelpCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                {!isFlipped ? 'Question (Click card to flip)' : 'Verified AI Answer'}
              </span>
            </div>

            {/* Dynamic Card Content */}
            <div className="my-auto space-y-4 z-10 py-6">
              {!isFlipped ? (
                <h3 className="text-2xl font-extrabold text-white leading-relaxed tracking-tight px-4">
                  "{currentCard.question}"
                </h3>
              ) : (
                <div className="space-y-4 text-left max-w-xl mx-auto">
                  <p className={`text-base font-semibold leading-relaxed font-sans ${
                    modeFilter === 'hard' ? 'text-red-100' : 'text-emerald-100'
                  }`}>
                    {currentCard.answer}
                  </p>
                  <div className={`p-3 rounded-2xl border text-xs font-mono flex items-center gap-2 ${
                    modeFilter === 'hard'
                      ? 'bg-red-950/60 border-red-500/40 text-red-200'
                      : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                  }`}>
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Verified ChromaDB Vector Recall (768-d High Precision)</span>
                  </div>
                </div>
              )}
            </div>

            {/* HARD MODE AI HINT ACCORDION WIDGET */}
            {(modeFilter === 'hard' || currentCardScore === 'hard') && (
              <div className="z-10 w-full mb-3" onClick={(e) => e.stopPropagation()}>
                {!showHint ? (
                  <button
                    type="button"
                    onClick={() => setShowHint(true)}
                    className="text-xs font-bold text-amber-400 hover:underline flex items-center justify-center gap-1.5 mx-auto bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl"
                  >
                    <Lightbulb className="w-3.5 h-3.5" /> Need an AI Memory Hint?
                  </button>
                ) : (
                  <div className="p-3 bg-amber-950/60 text-amber-200 border border-amber-500/40 rounded-2xl text-xs text-left font-mono space-y-1 animate-fade-in">
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5" /> AI Spaced Repetition Hint:
                    </span>
                    <p className="text-amber-100">
                      Focus on how Random Forest constructs multiple decision trees via bagging (bootstrap aggregating) to average predictions and reduce model variance!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Controls */}
            <div className="z-10 flex items-center justify-between w-full pt-4 border-t border-slate-700/50 text-xs">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" /> Click anywhere to flip
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(!isFlipped);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  modeFilter === 'hard'
                    ? 'bg-red-600 text-white hover:bg-red-500'
                    : modeFilter === 'easy'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                }`}
              >
                {isFlipped ? 'Show Question ←' : 'Flip to Answer 🔄'}
              </button>
            </div>
          </div>

          {/* Navigation Controls & Mode Marking Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handlePrevCard}
              className="px-4 py-2.5 bg-slate-800 text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" /> Previous Card
            </button>

            {/* Confidence Mode Marking Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleMarkConfidence('hard')}
                className={`px-3.5 py-2 font-bold text-xs rounded-xl border transition-all flex items-center gap-1.5 ${
                  currentCardScore === 'hard'
                    ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-500/30'
                    : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                }`}
              >
                <Flame className="w-3.5 h-3.5" /> 🔴 Mark as Hard
              </button>

              <button
                onClick={() => handleMarkConfidence('easy')}
                className={`px-3.5 py-2 font-bold text-xs rounded-xl border transition-all flex items-center gap-1.5 ${
                  currentCardScore === 'easy'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                }`}
              >
                <Zap className="w-3.5 h-3.5" /> 🟢 Mark as Easy
              </button>
            </div>

            <button
              onClick={handleNextCard}
              className={`px-5 py-2.5 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all text-white ${
                modeFilter === 'hard'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700'
                  : modeFilter === 'easy'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700'
              }`}
            >
              <span>Next Card</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* QUIZ VIEW */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="space-y-6">
            {quizzes.map((q, qIdx) => (
              <div key={q.id} className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-mono font-bold shadow-md">
                    {qIdx + 1}
                  </span>
                  <span>{q.question}</span>
                </h3>

                <div className="space-y-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx;
                    const isCorrect = q.correctIndex === optIdx;

                    let btnStyle = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400';
                    if (isSelected) {
                      btnStyle = 'bg-blue-600 text-white border-blue-600 shadow-md font-bold';
                    }
                    if (quizSubmitted) {
                      if (isCorrect) btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-lg';
                      else if (isSelected) btnStyle = 'bg-red-600 text-white border-red-600 font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleAnswerSelect(q.id, optIdx)}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs font-medium transition-all ${btnStyle}`}
                      >
                        <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span> {opt}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="p-4 bg-blue-950/60 rounded-2xl border border-blue-800/80 text-xs text-slate-200 space-y-1 animate-fade-in">
                    <span className="text-blue-400 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> AI Knowledge Explanation:
                    </span>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-6 glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
            {quizSubmitted ? (
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Exam Results</h4>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Score: <span className="text-emerald-400 font-mono text-lg">{calculateScore()} / {quizzes.length}</span> ({(calculateScore() / quizzes.length * 100).toFixed(0)}%)
                  </p>
                </div>
              </div>
            ) : (
              <span className="text-xs text-slate-400 font-medium">
                Select answers for all {quizzes.length} questions to evaluate your readiness.
              </span>
            )}

            {!quizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Submit & Grade Exam
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setQuizSubmitted(false);
                }}
                className="px-6 py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-700 border border-slate-700"
              >
                Reset & Retake Exam
              </button>
            )}
          </div>
        </div>
      )}

      {/* DAILY DIGEST VIEW */}
      {activeTab === 'digest' && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-200/60 dark:border-slate-800">
            <div className="p-3 bg-purple-500/10 text-purple-600 rounded-2xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                MemBuddy Daily Digest — July 25, 2026
              </h2>
              <p className="text-xs text-slate-400">Synthesized key highlights across your Second Brain vault</p>
            </div>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">📌 Top Priority Deadlines</h4>
              <p>• <strong>ML Project 2 Submission:</strong> Today 11:59 PM (Random Forest algorithm + 5-page report).</p>
              <p>• <strong>Zoho Offer Letter Sign Deadline:</strong> July 30, 2026 ($1,200/mo stipend).</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">💡 Key Concept Summary (Machine Learning)</h4>
              <p>Transformers utilize self-attention mechanism matrices (Query, Key, Value) to compute contextual representations. Random Forest leverages bagging to average decision trees and reduce variance.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">🏢 Career & Recruiters</h4>
              <p>Sarah Jenkins (Amazon) confirmed 4-round loop interview for Aug 5, 2026. Practice STAR responses for Leadership Principles.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
