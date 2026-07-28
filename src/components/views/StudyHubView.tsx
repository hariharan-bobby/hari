import React, { useState } from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';
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
  const [confidenceScores, setConfidenceScores] = useState<Record<string, 'easy' | 'medium' | 'hard'>>({});

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const currentCard = flashcards[cardIndex];

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
      particleCount: 100,
      spread: 80,
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
          {/* Card Progress */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Topic: {currentCard.topic}</span>
            <span className="font-mono">Card {cardIndex + 1} of {flashcards.length}</span>
          </div>

          {/* Flippable Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-80 glass-panel rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800/80 cursor-pointer flex flex-col justify-between items-center text-center transition-all duration-500 hover:scale-[1.01] shadow-2xl relative"
          >
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-500 bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full">
              {isFlipped ? 'Answer (Click to Flip back)' : 'Question (Click card to reveal Answer)'}
            </span>

            <div className="my-auto space-y-4">
              {!isFlipped ? (
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  "{currentCard.question}"
                </h3>
              ) : (
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {currentCard.answer}
                </p>
              )}
            </div>

            <p className="text-[10px] text-slate-400">
              💡 Tip: Assess your confidence after flipping
            </p>
          </div>

          {/* Navigation Controls & Confidence Rating */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200"
            >
              ← Previous Card
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setConfidenceScores({ ...confidenceScores, [currentCard.id]: 'hard' });
                  setIsFlipped(false);
                  setCardIndex((prev) => (prev + 1) % flashcards.length);
                }}
                className="px-3 py-1.5 bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs rounded-xl border border-red-500/20 hover:bg-red-500/20"
              >
                🔴 Hard
              </button>

              <button
                onClick={() => {
                  setConfidenceScores({ ...confidenceScores, [currentCard.id]: 'easy' });
                  setIsFlipped(false);
                  setCardIndex((prev) => (prev + 1) % flashcards.length);
                }}
                className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-xl border border-emerald-500/20 hover:bg-emerald-500/20"
              >
                🟢 Easy
              </button>
            </div>

            <button
              onClick={() => {
                setIsFlipped(false);
                setCardIndex((prev) => (prev + 1) % flashcards.length);
              }}
              className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-blue-700"
            >
              Next Card →
            </button>
          </div>
        </div>
      )}

      {/* QUIZ VIEW */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="space-y-6">
            {quizzes.map((q, qIdx) => (
              <div key={q.id} className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-mono">
                    {qIdx + 1}
                  </span>
                  {q.question}
                </h3>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx;
                    const isCorrect = q.correctIndex === optIdx;

                    let btnStyle = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                    if (isSelected) {
                      btnStyle = 'bg-blue-600 text-white border-blue-600';
                    }
                    if (quizSubmitted) {
                      if (isCorrect) btnStyle = 'bg-emerald-600 text-white border-emerald-600';
                      else if (isSelected) btnStyle = 'bg-red-600 text-white border-red-600';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleAnswerSelect(q.id, optIdx)}
                        className={`w-full p-3 rounded-2xl border text-left text-xs font-medium transition-all ${btnStyle}`}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800/60 text-xs text-slate-700 dark:text-slate-300">
                    💡 <strong>AI Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-4 glass-panel rounded-2xl">
            {quizSubmitted ? (
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Final Score: <span className="text-emerald-500 font-mono text-base">{calculateScore()} / {quizzes.length}</span> ({(calculateScore() / quizzes.length * 100).toFixed(0)}%)
              </div>
            ) : (
              <span className="text-xs text-slate-400">Select answers for all questions before submitting.</span>
            )}

            {!quizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg hover:from-blue-700"
              >
                Submit & Grade Exam
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setQuizSubmitted(false);
                }}
                className="px-6 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs rounded-xl hover:bg-slate-300"
              >
                Reset Quiz
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
                Memora AI Daily Digest — July 25, 2026
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
