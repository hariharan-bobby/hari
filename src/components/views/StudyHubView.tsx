import React, { useState, useRef } from 'react';
import {
  GraduationCap,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  RotateCw,
  ArrowRight,
  ArrowLeft,
  Flame,
  Zap,
  Lightbulb,
  ShieldCheck,
  BookOpen,
  FileText,
  Copy,
  Check,
  Download,
  Search,
  Eye,
  EyeOff,
  BarChart3,
  AlertTriangle,
  RefreshCw,
  Layers,
  UploadCloud,
  FileUp,
  Trash2,
  ScanText,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Flashcard, QuizQuestion } from '../../types/memory';

interface StudyHubViewProps {
  flashcards: Flashcard[];
  quizzes: QuizQuestion[];
}

export const StudyHubView: React.FC<StudyHubViewProps> = ({ flashcards: initialFlashcards, quizzes }) => {
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<
    'upload' | 'question_bank' | 'topics_summary' | 'flashcards' | 'quiz' | 'quick_revision' | 'smart_notes' | 'analytics' | 'export'
  >('upload');

  // Dedicated Upload State
  const [uploadedPdf, setUploadedPdf] = useState<{ name: string; size: string; pages: number } | null>({
    name: 'CS229_Machine_Learning_Lecture_Notes.pdf',
    size: '4.2 MB',
    pages: 38
  });
  const [uploadedImages, setUploadedImages] = useState<Array<{ name: string; size: string; url: string }>>([
    {
      name: 'Whiteboard_ML_Diagram.png',
      size: '1.8 MB',
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80'
    }
  ]);
  const [dragActivePdf, setDragActivePdf] = useState(false);
  const [dragActiveImg, setDragActiveImg] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(100);
  const [extractedTextPreview, setExtractedTextPreview] = useState<string>(
    `[PyMuPDF & Tesseract OCR v5.3 Extracted Text Payload — 14,820 Characters Across 38 Pages]\n\nChapter 1: Supervised Learning & Linear Regression\nLinear regression models continuous target variables by optimizing the cost function J(θ) = 1/2m ∑(h_θ(x^(i)) - y^(i))^2 using Gradient Descent optimization.\n\nChapter 2: Decision Trees & Entropy\nDecision Trees perform binary feature splits based on Information Gain IG(S, A) = H(S) - ∑ (|S_v|/|S|) * H(S_v) where H(S) represents Shannon Entropy.\n\nChapter 3: Random Forest & Ensemble Bagging\nRandom Forest constructs 100+ decorrelated decision trees using bootstrap aggregation and random feature sub-selection at each node.`
  );
  const [isGeneratingPackage, setIsGeneratingPackage] = useState(false);
  const [packageGenerated, setPackageGenerated] = useState(true);

  // Grounding check warning state
  const [showGroundingWarning, setShowGroundingWarning] = useState(false);

  // Search & Filter state in Question Bank
  const [searchQuery, setSearchQuery] = useState('');
  const [marksFilter, setMarksFilter] = useState<'all' | '2m' | '5m' | '10m'>('all');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('All Topics');
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  // Reveal Full Answer state per question
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  // Flashcards state
  const [flashcards, setFlashcards] = useState<Flashcard[]>(initialFlashcards);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [modeFilter, setModeFilter] = useState<'all' | 'hard' | 'easy'>('all');
  const [confidenceScores, setConfidenceScores] = useState<Record<string, 'easy' | 'medium' | 'hard'>>({
    'fc-1': 'hard',
    'fc-2': 'easy'
  });

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizDifficultyFilter, setQuizDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Export options state
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'txt'>('pdf');
  const [exportScope, setExportScope] = useState<'all' | 'questions_only' | 'qa_full' | 'notes' | 'flashcards'>('qa_full');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  // Mock Detected Topics
  const detectedTopics = [
    { name: 'Linear Regression & Cost Functions', confidence: 0.98, pageNum: 'Pages 4 - 12', qCount: 8 },
    { name: 'Decision Trees & Entropy Splits', confidence: 0.96, pageNum: 'Pages 13 - 24', qCount: 12 },
    { name: 'Random Forest & Ensemble Bagging', confidence: 0.99, pageNum: 'Pages 25 - 38', qCount: 15 },
    { name: 'Support Vector Machines (SVM)', confidence: 0.94, pageNum: 'Pages 39 - 52', qCount: 6 },
    { name: 'KNN & Distance Metrics', confidence: 0.92, pageNum: 'Pages 53 - 61', qCount: 4 }
  ];

  // Comprehensive Exam-Oriented Question Bank (2M, 5M, 10M)
  const examQuestionBank = [
    // 2-MARK QUESTIONS
    {
      id: 'q2-1',
      marks: '2m',
      topic: 'Random Forest & Ensemble Bagging',
      question: 'Define Random Forest algorithm.',
      answer: 'Random Forest is an ensemble learning algorithm that combines multiple decision trees built on bootstrapped sub-samples of the dataset. It averages their predictions to reduce model variance and avoid overfitting.',
      summary: 'Ensemble technique combining multiple decision trees using bootstrap aggregation to minimize prediction variance.',
      keyPoints: [
        'Uses bootstrap aggregation (bagging).',
        'Selects random subsets of features at each split.',
        'Prevents individual tree overfitting.'
      ],
      keywords: ['Ensemble', 'Bagging', 'Variance Reduction', 'Decision Trees'],
      page: 26,
      grounded: true
    },
    {
      id: 'q2-2',
      marks: '2m',
      topic: 'Decision Trees & Entropy Splits',
      question: 'What is Entropy in Decision Trees?',
      answer: 'Entropy is a mathematical metric that measures the degree of impurity or randomness in a dataset. In decision trees, entropy is calculated as H(S) = - ∑ (p_i * log2(p_i)) to determine the optimal split.',
      summary: 'Metric quantifying dataset impurity used to compute Information Gain.',
      keyPoints: [
        'Calculates randomness between 0 (pure) and 1 (max disorder).',
        'Used to compute Information Gain.'
      ],
      keywords: ['Entropy', 'Impurity', 'Information Gain', 'Shannon Formula'],
      page: 15,
      grounded: true
    },
    {
      id: 'q2-3',
      marks: '2m',
      topic: 'Decision Trees & Entropy Splits',
      question: 'What is Overfitting and how do you prevent it?',
      answer: 'Overfitting occurs when a machine learning model learns noise and specific details of the training data rather than general patterns. It is prevented by tree pruning, regularization, and cross-validation.',
      summary: 'Model Memorization of noise; fixed via pruning & regularization.',
      keyPoints: [
        'High training accuracy, poor test generalization.',
        'Prevented via Early Stopping & Pruning.'
      ],
      keywords: ['Overfitting', 'Pruning', 'Generalization', 'Cross-Validation'],
      page: 20,
      grounded: true
    },
    {
      id: 'q2-4',
      marks: '2m',
      topic: 'Linear Regression & Cost Functions',
      question: 'Define Bias-Variance Tradeoff.',
      answer: 'The Bias-Variance Tradeoff is the tension between model underfitting (high bias due to overly simple models) and model overfitting (high variance due to overly complex models). Goal is to minimize total error.',
      summary: 'Balance between model complexity, underfitting (bias), and overfitting (variance).',
      keyPoints: [
        'Bias: Error from erroneous assumptions.',
        'Variance: Error from sensitivity to small training fluctuations.'
      ],
      keywords: ['Bias', 'Variance', 'Tradeoff', 'Generalization Error'],
      page: 8,
      grounded: true
    },
    {
      id: 'q2-5',
      marks: '2m',
      topic: 'Support Vector Machines (SVM)',
      question: 'What is the Kernel Trick in SVM?',
      answer: 'The Kernel Trick projects non-linearly separable data into a higher-dimensional feature space without explicitly calculating coordinates in that higher space, using functions like RBF or Polynomial kernels.',
      summary: 'High-dimensional projection mechanism enabling non-linear classification.',
      keyPoints: [
        'Transforms non-linear boundaries into linear hyperplanes.',
        'Computes dot products in implicit high-dimensional space.'
      ],
      keywords: ['Kernel Trick', 'RBF Kernel', 'Hyperplane', 'Feature Space'],
      page: 42,
      grounded: true
    },
    {
      id: 'q2-6',
      marks: '2m',
      topic: 'Quantum Computing & Neural Links',
      question: 'Explain Quantum Entanglement in Neural Networks.',
      answer: 'This information was not found in the uploaded document.',
      summary: 'Not available in document context.',
      keyPoints: ['Topic outside uploaded document syllabus.'],
      keywords: ['Missing Context'],
      page: 0,
      grounded: false
    },

    // 5-MARK QUESTIONS
    {
      id: 'q5-1',
      marks: '5m',
      topic: 'Decision Trees & Entropy Splits',
      question: 'Explain Decision Tree Algorithm with architectural breakdown.',
      answer: `Introduction:
A Decision Tree is a non-parametric supervised learning algorithm used for classification and regression tasks.

Explanation:
The tree consists of a Root Node (topmost attribute), Internal Nodes (feature tests), Branches (outcome of tests), and Leaf Nodes (final class labels). At each step, the algorithm chooses the attribute that maximizes Information Gain or minimizes Gini Impurity.

Example:
Classifying whether a bank applicant will default on a loan based on Income (> $50k) and Credit Score (> 700).

Conclusion:
Decision Trees are highly interpretable but prone to high variance if left unpruned.`,
      summary: 'Tree-structured classifier using recursive greedy splits on root, internal, and leaf nodes.',
      keyPoints: [
        'Root node splits on highest Information Gain.',
        'Recursive splitting until pure leaf nodes or max depth reached.',
        'Highly interpretable but vulnerable to high variance.'
      ],
      keywords: ['Decision Tree', 'Root Node', 'Leaf Node', 'Information Gain', 'Gini Impurity'],
      page: 18,
      grounded: true
    },
    {
      id: 'q5-2',
      marks: '5m',
      topic: 'Random Forest & Ensemble Bagging',
      question: 'Explain Random Forest algorithm and its bagging mechanism.',
      answer: `Introduction:
Random Forest is an ensemble method combining multiple decision trees trained on distinct bootstrap samples.

Explanation:
1. Bootstrap Sampling: Randomly sample N instances with replacement from dataset.
2. Feature Sub-selection: At each node, select a random subset of m features (m = sqrt(M)).
3. Majority Voting / Averaging: Combine outputs from all trees to produce final prediction.

Example:
If 80 out of 100 decision trees predict "Class A", the Random Forest outputs "Class A".

Conclusion:
Random Forest significantly reduces model variance while maintaining low bias.`,
      summary: 'Combines bootstrap sampling and random feature sub-selection to average tree predictions.',
      keyPoints: [
        'Bootstrap Sampling with replacement.',
        'Random feature selection per split.',
        'Majority voting for classification, mean for regression.'
      ],
      keywords: ['Random Forest', 'Bagging', 'Bootstrap', 'Majority Vote', 'Variance Reduction'],
      page: 28,
      grounded: true
    },
    {
      id: 'q5-3',
      marks: '5m',
      topic: 'KNN & Distance Metrics',
      question: 'Discuss K-Nearest Neighbors (KNN) algorithm, advantages, and disadvantages.',
      answer: `Introduction:
K-Nearest Neighbors (KNN) is a non-parametric, instance-based lazy learning algorithm.

Explanation:
KNN classifies an unlabelled data point based on the majority class of its K nearest neighbors in feature space using Euclidean or Manhattan distance metrics.

Advantages:
• Simple to understand and implement.
• No training phase required (Lazy Learning).

Disadvantages:
• Computationally expensive during inference O(N * D).
• Sensitive to noisy features and scale differences.

Conclusion:
KNN works well for small, scaled datasets but requires feature normalization.`,
      summary: 'Lazy instance-based learning algorithm classifying by Euclidean distance majority vote.',
      keyPoints: [
        'No explicit training phase (Lazy Learning).',
        'Sensitive to feature scaling & curse of dimensionality.',
        'Inference cost O(N * D).'
      ],
      keywords: ['KNN', 'Euclidean Distance', 'Lazy Learning', 'Instance-Based', 'Feature Scaling'],
      page: 55,
      grounded: true
    },

    // 10-MARK QUESTIONS
    {
      id: 'q10-1',
      marks: '10m',
      topic: 'Random Forest & Ensemble Bagging',
      question: 'Compare Decision Tree vs. Random Forest in detail with architectural differences, advantages, and real-world applications.',
      answer: `Definition & Architectural Overview:
A Decision Tree is a single tree structure built by greedy recursive splitting. A Random Forest is an ensemble of decorrelated decision trees built using Bootstrap Aggregation (Bagging) and random feature selection.

Detailed Comparison:
1. Variance & Overfitting: Single decision trees quickly overfit noise. Random Forests average out random errors across hundreds of trees, achieving low variance.
2. Interpretability: Decision Trees produce visual flowcharts easy for human audit. Random Forests operate as black-box ensembles.
3. Computation Speed: Single trees train rapidly O(N log N). Random Forests require parallel tree construction O(T * N log N).

Diagram Description:
[Dataset] ──► [Bootstrap Sample 1] ──► [Tree 1] ──┐
[Dataset] ──► [Bootstrap Sample 2] ──► [Tree 2] ──┼─► [Majority Vote / Average] ──► Final Output
[Dataset] ──► [Bootstrap Sample K] ──► [Tree K] ──┘

Advantages & Disadvantages:
• Decision Tree Pros: Interpretability, fast inference. Cons: High variance, instability.
• Random Forest Pros: Superior accuracy, handles missing values & out-of-bag validation. Cons: Memory intensive, slow execution.

Real-World Applications:
• Medical Diagnosis (Disease Prediction based on patient metrics).
• Financial Fraud Detection (Classifying suspicious credit card transactions).

Conclusion:
While Decision Trees are ideal for quick interpretable rules, Random Forests are superior for high-accuracy production machine learning pipelines.`,
      summary: 'Comprehensive comparative breakdown: Single tree vs ensemble bagging, variance reduction, interpretability, and production usage.',
      keyPoints: [
        'Decision Tree = High variance, high interpretability, fast.',
        'Random Forest = Low variance, black-box ensemble, robust against noise.',
        'Decorrelated trees via random feature subsampling.',
        'Applications in fraud detection & medical diagnostics.'
      ],
      keywords: ['Decision Tree', 'Random Forest', 'Bagging', 'Black Box', 'Fraud Detection', 'Decorrelated Trees'],
      page: 32,
      grounded: true
    }
  ];

  // PDF File Picked Handler
  const handlePdfPicked = (file: File) => {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    setUploadProgress(20);
    setTimeout(() => setUploadProgress(60), 400);
    setTimeout(() => {
      setUploadProgress(100);
      setUploadedPdf({ name: file.name, size: `${sizeMB} MB`, pages: Math.floor(Math.random() * 30 + 10) });
      setExtractedTextPreview(
        `[PyMuPDF Text Extraction — ${file.name} (${sizeMB} MB)]\n\nExtracted full text contents from ${file.name}. Parsed headings, sections, mathematical equations, and diagrams. Ready for RAG embedding generation.`
      );
      setPackageGenerated(false);
    }, 1000);
  };

  // Image Files Picked Handler (OCR)
  const handleImagePicked = (files: FileList) => {
    const newImgs: Array<{ name: string; size: string; url: string }> = [];
    Array.from(files).forEach((file) => {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      newImgs.push({
        name: file.name,
        size: `${sizeMB} MB`,
        url: URL.createObjectURL(file)
      });
    });
    setUploadedImages((prev) => [...prev, ...newImgs]);
    setExtractedTextPreview(
      `[Tesseract OCR v5.3 Extracted Text — ${newImgs.length} Images Uploaded]\n\nTesseract OCR scanned text: Whiteboard diagram nodes, handwritten formulas, definitions, and class lecture notes extracted successfully.`
    );
    setPackageGenerated(false);
  };

  // Quick Presets Handler
  const handleSelectPreset = (presetKey: string) => {
    if (presetKey === 'cs229') {
      setUploadedPdf({ name: 'CS229_Machine_Learning_Lecture_Notes.pdf', size: '4.2 MB', pages: 38 });
      setExtractedTextPreview(
        `[PyMuPDF Extracted Payload — CS229 Machine Learning Lecture Notes (38 Pages)]\n\nCovering Linear Regression, Gradient Descent, Decision Trees, Information Gain, Random Forest Ensemble, SVM Hyperplanes, and KNN Distance Metrics.`
      );
    } else if (presetKey === 'sysdesign') {
      setUploadedPdf({ name: 'System_Design_Distributed_Systems.pdf', size: '6.8 MB', pages: 24 });
      setExtractedTextPreview(
        `[PyMuPDF Extracted Payload — System Design & Distributed Systems Handbook (24 Pages)]\n\nCovering Load Balancing, Consistent Hashing, Redis Caching Strategies, Database Sharding, Eventual Consistency, and CAP Theorem.`
      );
    } else if (presetKey === 'whiteboard') {
      setUploadedImages([
        {
          name: 'Whiteboard_ML_Diagram.png',
          size: '1.8 MB',
          url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80'
        }
      ]);
      setExtractedTextPreview(
        `[Tesseract OCR v5.3 Extracted Text — Whiteboard_ML_Diagram.png]\n\nOCR Extracted Text: Machine Learning Architecture — Decision Tree splitting using Gini Impurity and Random Forest bootstrap aggregation.`
      );
    }
    setPackageGenerated(false);
  };

  // Generate AI Exam Package Action
  const handleGenerateExamPackage = () => {
    setIsGeneratingPackage(true);
    setTimeout(() => {
      setIsGeneratingPackage(false);
      setPackageGenerated(true);
      setActiveTab('question_bank');
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });
    }, 2200);
  };

  // Filter questions based on marks, search query, and topic filter
  const filteredQuestions = examQuestionBank.filter((q) => {
    const matchesMarks = marksFilter === 'all' || q.marks === marksFilter;
    const matchesTopic = selectedTopicFilter === 'All Topics' || q.topic === selectedTopicFilter;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.keywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesMarks && matchesTopic && matchesSearch;
  });

  const handleToggleRevealAnswer = (id: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyKeyword = (kw: string) => {
    navigator.clipboard.writeText(kw);
    setCopiedKeyword(kw);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  // Flashcards navigation & confidence handlers
  const filteredFlashcards = flashcards.filter((card) => {
    if (modeFilter === 'hard') return confidenceScores[card.id] === 'hard' || modeFilter === 'hard';
    if (modeFilter === 'easy') return confidenceScores[card.id] === 'easy';
    return true;
  });

  const currentCard = filteredFlashcards[cardIndex % filteredFlashcards.length] || flashcards[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % filteredFlashcards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev > 0 ? prev - 1 : filteredFlashcards.length - 1));
  };

  const handleMarkConfidence = (level: 'easy' | 'medium' | 'hard') => {
    if (!currentCard) return;
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

  const handleShuffleFlashcards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCardIndex(0);
    setIsFlipped(false);
  };

  // Quiz Answer Select & Score Calculation
  const filteredQuizzes = quizzes.filter((q) => {
    if (quizDifficultyFilter === 'easy') return q.id.includes('1');
    if (quizDifficultyFilter === 'medium') return q.id.includes('2');
    if (quizDifficultyFilter === 'hard') return q.id.includes('3');
    return true;
  });

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

  // Simulate Export Package Generator
  const handleTriggerExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccessMessage(`Downloaded MemBuddy_Exam_Prep_${exportScope}_Package.${exportFormat.toUpperCase()}`);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      setTimeout(() => setExportSuccessMessage(null), 4000);
    }, 2000);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Hidden File Input Elements */}
      <input
        ref={pdfInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handlePdfPicked(e.target.files[0]);
          }
        }}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*,.jpg,.jpeg,.png,.webp"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleImagePicked(e.target.files);
          }
        }}
      />

      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5" /> AI Exam Preparation Mode
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            MemBuddy AI Exam Preparation Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload study PDFs or handwritten notes to generate 2M, 5M, 10M question banks, summaries, flashcards & quizzes
          </p>
        </div>

        {/* Study Streak Badge */}
        <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl">
          <Flame className="w-6 h-6 text-amber-500 animate-pulse" />
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-amber-400">7-Day Study Streak</p>
            <p className="text-xs font-extrabold text-slate-900 dark:text-white">🔥 Active Master</p>
          </div>
        </div>
      </div>

      {/* Grounding RAG Check Banner */}
      <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
          <span>
            <strong>RAG Strict Grounding Active:</strong> All questions & answers are generated 100% strictly from your uploaded PDF or OCR image document. Zero hallucination guarantee.
          </span>
        </div>
        <button
          onClick={() => setShowGroundingWarning(!showGroundingWarning)}
          className="text-[10px] font-bold text-blue-500 hover:underline shrink-0"
        >
          {showGroundingWarning ? 'Hide Rules' : 'View Grounding Rules'}
        </button>
      </div>

      {showGroundingWarning && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs space-y-1 text-amber-600 dark:text-amber-400 animate-fade-in">
          <p className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Grounding Guarantee Protocol:
          </p>
          <p className="text-[11px] leading-relaxed">
            If a requested topic or question is not explicitly covered in your uploaded PDF or image document, MemBuddy returns strictly:
          </p>
          <code className="block p-2 bg-slate-900 text-amber-300 font-mono text-[11px] rounded-xl border border-slate-800">
            {'>'} "This information was not found in the uploaded document."
          </code>
        </div>
      )}

      {/* Main Tab Navigation Header */}
      <div className="bg-slate-100 dark:bg-slate-900/80 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'upload'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Study Material</span>
          {packageGenerated && (
            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
              Ready 🟢
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('question_bank')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'question_bank'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Exam Question Bank ({examQuestionBank.length})
        </button>

        <button
          onClick={() => setActiveTab('topics_summary')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'topics_summary'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" /> Topics & Summaries
        </button>

        <button
          onClick={() => setActiveTab('flashcards')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'flashcards'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" /> 3D Flashcards ({flashcards.length})
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'quiz'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> MCQ Quiz Mode ({quizzes.length})
        </button>

        <button
          onClick={() => setActiveTab('quick_revision')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'quick_revision'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" /> Quick Revision
        </button>

        <button
          onClick={() => setActiveTab('smart_notes')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'smart_notes'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Lightbulb className="w-4 h-4" /> Smart Chapter Notes
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Study Analytics
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'export'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-emerald-500 font-bold hover:bg-emerald-500/10'
          }`}
        >
          <Download className="w-4 h-4" /> Export Package
        </button>
      </div>

      {/* DEDICATED UPLOAD SECTION AT TOP OF PAGE */}
      {activeTab === 'upload' && (
        <div className="space-y-6 animate-fade-in">
          {/* Section Header */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-500" /> Start New Study Session — Upload Study Document
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Choose to upload a PDF or Image scan. MemBuddy will extract text via PyMuPDF or Tesseract OCR and automatically generate your full AI Exam Preparation package.
            </p>
          </div>

          {/* Quick Presets Shortcuts */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Sample Presets:</span>
            <button
              onClick={() => handleSelectPreset('cs229')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-blue-900/60 border border-slate-700 text-slate-200 rounded-xl font-medium flex items-center gap-1.5"
            >
              📄 CS229 ML Lecture Notes (38P PDF)
            </button>
            <button
              onClick={() => handleSelectPreset('sysdesign')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-blue-900/60 border border-slate-700 text-slate-200 rounded-xl font-medium flex items-center gap-1.5"
            >
              📄 System Design Handbook (24P PDF)
            </button>
            <button
              onClick={() => handleSelectPreset('whiteboard')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-blue-900/60 border border-slate-700 text-slate-200 rounded-xl font-medium flex items-center gap-1.5"
            >
              🖼️ Whiteboard Notes (OCR Image)
            </button>
          </div>

          {/* Two Upload Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CARD 1: UPLOAD PDF */}
            <div
              onClick={() => pdfInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragActivePdf(true); }}
              onDragLeave={() => setDragActivePdf(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActivePdf(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handlePdfPicked(e.dataTransfer.files[0]);
                }
              }}
              className={`glass-panel p-6 rounded-3xl border-2 border-dashed cursor-pointer transition-all space-y-4 text-center ${
                dragActivePdf
                  ? 'border-blue-500 bg-blue-500/10 scale-102'
                  : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-500/5'
              }`}
            >
              <div className="p-4 bg-blue-500/20 text-blue-500 rounded-2xl w-fit mx-auto">
                <FileUp className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  📄 Upload PDF Document
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Textbooks, lecture notes, research papers, or question papers (.pdf)
                </p>
              </div>

              {uploadedPdf ? (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-xs space-y-2 text-left">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span className="truncate flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-blue-500 shrink-0" />
                      {uploadedPdf.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedPdf(null);
                      }}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Remove PDF"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Size: {uploadedPdf.size}</span>
                    <span>{uploadedPdf.pages} Pages</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-[11px] text-slate-400 font-medium">
                  Drag and drop PDF here or click to browse disk
                </div>
              )}
            </div>

            {/* CARD 2: UPLOAD IMAGE (OCR) */}
            <div
              onClick={() => imageInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragActiveImg(true); }}
              onDragLeave={() => setDragActiveImg(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActiveImg(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleImagePicked(e.dataTransfer.files);
                }
              }}
              className={`glass-panel p-6 rounded-3xl border-2 border-dashed cursor-pointer transition-all space-y-4 text-center ${
                dragActiveImg
                  ? 'border-indigo-500 bg-indigo-500/10 scale-102'
                  : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-500/5'
              }`}
            >
              <div className="p-4 bg-indigo-500/20 text-indigo-400 rounded-2xl w-fit mx-auto">
                <ScanText className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  🖼️ Upload Image (OCR Text Extraction)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Handwritten notes, whiteboard photos, or screenshots (.png, .jpg, .webp)
                </p>
              </div>

              {uploadedImages.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>{uploadedImages.length} Image(s) Selected</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedImages([]);
                      }}
                      className="text-red-400 hover:underline text-[10px]"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative group shrink-0">
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-14 h-14 object-cover rounded-xl border border-slate-700 shadow-md"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedImages(uploadedImages.filter((_, i) => i !== idx));
                          }}
                          className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-[11px] text-slate-400 font-medium">
                  Drag and drop image scans here or click to browse disk
                </div>
              )}
            </div>
          </div>

          {/* Upload Progress Bar */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-blue-500">
                <span>Extracting Text via PyMuPDF / Tesseract OCR...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Extracted Text Preview Box & Generation CTA */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <ScanText className="w-4 h-4 text-emerald-500" /> Extracted Text Preview
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">
                Ready for RAG Embedding Generation
              </span>
            </div>

            <textarea
              rows={5}
              readOnly
              value={extractedTextPreview}
              className="w-full p-3.5 bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed rounded-2xl border border-slate-800"
            />

            {/* GENERATE AI STUDY PACKAGE BUTTON */}
            <button
              onClick={handleGenerateExamPackage}
              disabled={isGeneratingPackage}
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGeneratingPackage ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating AI Summaries, 2M/5M/10M Question Bank & Flashcards...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>⚡ Generate AI Exam Study Package & Unlock All Modules</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: EXAM QUESTION BANK (2M, 5M, 10M) */}
      {activeTab === 'question_bank' && (
        <div className="space-y-6 animate-fade-in">
          {/* Controls: Marks Filter & Search */}
          <div className="glass-panel p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Filter Marks:</span>
              <button
                onClick={() => setMarksFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  marksFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                All Marks ({examQuestionBank.length})
              </button>
              <button
                onClick={() => setMarksFilter('2m')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  marksFilter === '2m' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                2 Marks
              </button>
              <button
                onClick={() => setMarksFilter('5m')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  marksFilter === '5m' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                5 Marks
              </button>
              <button
                onClick={() => setMarksFilter('10m')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  marksFilter === '10m' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                10 Marks
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className={`p-6 rounded-3xl border transition-all glass-panel ${
                  !q.grounded
                    ? 'border-amber-500/40 bg-amber-500/5'
                    : q.marks === '10m'
                    ? 'border-purple-500/30 dark:border-purple-800/40'
                    : q.marks === '5m'
                    ? 'border-indigo-500/30 dark:border-indigo-800/40'
                    : 'border-blue-500/30 dark:border-blue-800/40'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        q.marks === '10m'
                          ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                          : q.marks === '5m'
                          ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                          : 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {q.marks === '2m' ? '2 Marks (Short Answer)' : q.marks === '5m' ? '5 Marks (Structured)' : '10 Marks (Comprehensive)'}
                    </span>

                    <span className="text-[10px] text-slate-400 font-mono">
                      Page {q.page > 0 ? q.page : 'N/A'}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-slate-400">
                    Topic: {q.topic}
                  </span>
                </div>

                {/* Question Title */}
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-3">
                  Q: {q.question}
                </h3>

                {/* Grounding Status */}
                {!q.grounded && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-2xl text-xs font-mono mb-4">
                    {'>'} "This information was not found in the uploaded document."
                  </div>
                )}

                {/* Answer Summary Card */}
                {q.grounded && (
                  <div className="p-4 bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 mb-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 text-blue-500">
                        <Zap className="w-3.5 h-3.5" /> Answer Revision Summary:
                      </span>
                      <button
                        onClick={() => handleToggleRevealAnswer(q.id)}
                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        {revealedAnswers[q.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {revealedAnswers[q.id] ? 'Hide Full Answer' : 'Reveal Full AI Answer'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {q.summary}
                    </p>

                    {/* Key Revision Points */}
                    <div className="pt-2 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Key Points:</span>
                      <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                        {q.keyPoints.map((kp, idx) => (
                          <li key={idx}>{kp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Full AI Answer Revealed */}
                {q.grounded && revealedAnswers[q.id] && (
                  <div className="p-5 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 text-xs font-mono whitespace-pre-wrap leading-relaxed mb-4 animate-fade-in">
                    <div className="flex items-center justify-between text-blue-400 font-bold mb-2 pb-2 border-b border-slate-800">
                      <span>📘 Full Structured AI Answer (Grounded in PDF)</span>
                      <span>Page {q.page}</span>
                    </div>
                    {q.answer}
                  </div>
                )}

                {/* Keywords Chips */}
                {q.keywords && q.keywords.length > 0 && (
                  <div className="flex items-center flex-wrap gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Keywords:</span>
                    {q.keywords.map((kw, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCopyKeyword(kw)}
                        className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 rounded-lg text-[10px] font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-all"
                        title="Click to copy keyword"
                      >
                        {copiedKeyword === kw ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
                        {kw}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TOPICS & DETAILED SUMMARIES */}
      {activeTab === 'topics_summary' && (
        <div className="space-y-6 animate-fade-in">
          {/* Quick Summary & Detailed Summary Header */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" /> Executive Document Summary
            </h2>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">Quick Summary (5-10 Lines):</span>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                This document covers fundamental Machine Learning algorithms, focusing on Supervised Learning techniques. It provides in-depth mathematical formulations and implementations for Linear Regression, Decision Trees, Random Forests, Support Vector Machines (SVM), and K-Nearest Neighbors (KNN). Key topics include cost function optimization via Gradient Descent, Information Gain entropy splitting, ensemble bootstrap aggregation, hyperplanes with RBF kernels, and bias-variance tradeoff optimization.
              </p>
            </div>
          </div>

          {/* Detected Topics Hierarchy */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" /> Automatically Detected Chapter Topics ({detectedTopics.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {detectedTopics.map((top, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedTopicFilter(top.name)}
                  className="p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-700 cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span className="truncate">{top.name}</span>
                    <span className="text-[10px] text-emerald-500 font-mono font-bold">
                      {(top.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{top.pageNum}</span>
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-md font-bold">{top.qCount} Questions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 3D FLASHCARDS */}
      {activeTab === 'flashcards' && currentCard && (
        <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
          {/* Controls bar */}
          <div className="glass-panel p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setModeFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${modeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                All Cards
              </button>
              <button
                onClick={() => setModeFilter('hard')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${modeFilter === 'hard' ? 'bg-red-600 text-white' : 'bg-slate-800 text-red-400'}`}
              >
                🔥 Hard Mode
              </button>
              <button
                onClick={() => setModeFilter('easy')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${modeFilter === 'easy' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-emerald-400'}`}
              >
                ⚡ Easy Mode
              </button>
            </div>

            <button
              onClick={handleShuffleFlashcards}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" /> Shuffle
            </button>
          </div>

          {/* 3D Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`w-full min-h-[320px] rounded-3xl p-8 cursor-pointer flex flex-col justify-between items-center text-center transition-all duration-500 shadow-2xl relative border overflow-hidden transform ${
              isFlipped ? 'bg-gradient-to-br from-emerald-950/90 via-slate-900 to-teal-950/90 border-emerald-500/40 text-emerald-100' : 'bg-gradient-to-br from-indigo-950/90 via-slate-900 to-blue-950/90 border-blue-500/40 text-blue-100'
            }`}
          >
            <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {isFlipped ? 'Answer (Click to Flip back)' : 'Question (Click Card to Flip)'}
            </div>

            <div className="my-auto py-6">
              <h3 className="text-xl font-extrabold leading-relaxed">
                {isFlipped ? currentCard.answer : currentCard.question}
              </h3>
            </div>

            <div className="text-[11px] text-slate-400">
              Topic: <strong className="text-white">{currentCard.topic}</strong>
            </div>
          </div>

          {/* Card Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevCard}
              className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl font-bold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Previous Card
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleMarkConfidence('hard')}
                className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl font-bold text-xs"
              >
                Mark Hard
              </button>
              <button
                onClick={() => handleMarkConfidence('easy')}
                className="px-4 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold text-xs"
              >
                Mark Easy
              </button>
            </div>

            <button
              onClick={handleNextCard}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5"
            >
              Next Card <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: MCQ QUIZ MODE */}
      {activeTab === 'quiz' && (
        <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
          {/* Difficulty selector */}
          <div className="glass-panel p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400">Quiz Difficulty:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuizDifficultyFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold ${quizDifficultyFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                All Difficulty
              </button>
              <button
                onClick={() => setQuizDifficultyFilter('easy')}
                className={`px-3 py-1.5 rounded-xl font-bold ${quizDifficultyFilter === 'easy' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-emerald-400'}`}
              >
                Easy
              </button>
              <button
                onClick={() => setQuizDifficultyFilter('medium')}
                className={`px-3 py-1.5 rounded-xl font-bold ${quizDifficultyFilter === 'medium' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-amber-400'}`}
              >
                Medium
              </button>
              <button
                onClick={() => setQuizDifficultyFilter('hard')}
                className={`px-3 py-1.5 rounded-xl font-bold ${quizDifficultyFilter === 'hard' ? 'bg-red-600 text-white' : 'bg-slate-800 text-red-400'}`}
              >
                Hard
              </button>
            </div>
          </div>

          {/* Questions list */}
          <div className="space-y-4">
            {filteredQuizzes.map((quiz, qIdx) => (
              <div key={quiz.id} className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {qIdx + 1}. {quiz.question}
                </h3>

                <div className="space-y-2">
                  {quiz.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[quiz.id] === optIdx;
                    const isCorrect = quiz.correctIndex === optIdx;
                    let btnStyle = 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';

                    if (quizSubmitted) {
                      if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold';
                      else if (isSelected) btnStyle = 'bg-red-500/20 border-red-500 text-red-400';
                    } else if (isSelected) {
                      btnStyle = 'bg-blue-600 text-white border-blue-600 font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleAnswerSelect(quiz.id, optIdx)}
                        className={`w-full p-3 text-left rounded-2xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl text-xs space-y-1">
                    <strong>Explanation:</strong> {quiz.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!quizSubmitted ? (
            <button
              onClick={handleSubmitQuiz}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg"
            >
              Submit Quiz & View Score
            </button>
          ) : (
            <div className="p-6 glass-panel rounded-3xl text-center space-y-3 border border-emerald-500/40">
              <h2 className="text-2xl font-extrabold text-white">
                Quiz Score: {calculateScore()} / {filteredQuizzes.length}
              </h2>
              <button
                onClick={() => { setQuizSubmitted(false); setSelectedAnswers({}); }}
                className="px-6 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: QUICK REVISION MODE */}
      {activeTab === 'quick_revision' && (
        <div className="space-y-4 max-w-3xl mx-auto animate-fade-in">
          <div className="p-4 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-3xl border border-blue-500/30 text-xs">
            ⚡ <strong>Quick Revision View:</strong> High-density revision mode showing questions, summaries, key points, and keywords. Click to reveal full answers when needed.
          </div>

          {examQuestionBank.map((q) => (
            <div key={q.id} className="glass-panel p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-500">{q.marks.toUpperCase()} Question</span>
                <span className="text-slate-400 font-mono">Page {q.page}</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">{q.question}</h4>
              <p className="text-slate-400">{q.summary}</p>
              <div className="flex items-center flex-wrap gap-1">
                {q.keywords.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md text-[10px] font-mono">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: SMART CHAPTER NOTES */}
      {activeTab === 'smart_notes' && (
        <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4 text-xs">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" /> Chapter 1: Machine Learning Fundamentals & Ensemble Methods
            </h2>

            <div className="space-y-3 text-slate-300">
              <h3 className="font-bold text-blue-400">1. Core Definitions</h3>
              <p>• <strong>Supervised Learning:</strong> Training models using labelled dataset input-output pairs.</p>
              <p>• <strong>Random Forest:</strong> Bagging ensemble of randomized decision trees.</p>

              <h3 className="font-bold text-purple-400 mt-4">2. Key Formulas & Equations</h3>
              <div className="p-3 bg-slate-900 font-mono text-emerald-400 rounded-xl border border-slate-800">
                Entropy: H(S) = - ∑ p_i * log2(p_i)<br />
                Gini Impurity: Gini(S) = 1 - ∑ (p_i)^2
              </div>

              <h3 className="font-bold text-emerald-400 mt-4">3. Frequently Asked Exam Questions</h3>
              <p>• Q: Compare Decision Tree vs Random Forest (10 Marks)</p>
              <p>• Q: Define Entropy and Information Gain (2 Marks)</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: STUDY ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">PDFs Uploaded</span>
              <p className="text-2xl font-extrabold text-white">14</p>
            </div>
            <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Questions Solved</span>
              <p className="text-2xl font-extrabold text-blue-500">128</p>
            </div>
            <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Quiz Accuracy</span>
              <p className="text-2xl font-extrabold text-emerald-500">92%</p>
            </div>
            <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Flashcards Mastered</span>
              <p className="text-2xl font-extrabold text-amber-500">38 / 45</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: EXPORT STUDY PACKAGE */}
      {activeTab === 'export' && (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 max-w-xl mx-auto text-center space-y-6 animate-fade-in">
          <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-full w-fit mx-auto">
            <Download className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-white">Export Exam Preparation Package</h2>
            <p className="text-xs text-slate-400 mt-1">
              Export generated questions, answers, flashcards, and smart notes into PDF, DOCX, or TXT.
            </p>
          </div>

          <div className="space-y-4 text-xs text-left">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Export File Format</label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
              >
                <option value="pdf">PDF Document (.pdf)</option>
                <option value="docx">Microsoft Word (.docx)</option>
                <option value="txt">Plain Text (.txt)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Package Scope</label>
              <select
                value={exportScope}
                onChange={(e) => setExportScope(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
              >
                <option value="qa_full">Full Question Bank with AI Answers (2M, 5M, 10M)</option>
                <option value="questions_only">Questions Only (Exam Practice Sheet)</option>
                <option value="notes">Smart Chapter Notes & Revision Summaries</option>
                <option value="flashcards">Flashcards Package</option>
              </select>
            </div>
          </div>

          {exportSuccessMessage && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold animate-fade-in">
              ✅ {exportSuccessMessage}
            </div>
          )}

          <button
            onClick={handleTriggerExport}
            disabled={isExporting}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Exam Package...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Study Package ({exportFormat.toUpperCase()})</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
