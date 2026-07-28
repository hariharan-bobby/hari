export type MemoryType = 'pdf' | 'doc' | 'image' | 'audio' | 'email' | 'note' | 'code' | 'video';

export type EntityCategory = 'person' | 'company' | 'project' | 'document' | 'event' | 'concept';

export interface SourceCitation {
  id: string;
  title: string;
  type: MemoryType;
  snippet: string;
  source: string;
  date: string;
  relevanceScore: number;
}

export interface MemoryItem {
  id: string;
  title: string;
  type: MemoryType;
  category: string;
  summary: string;
  fullContent: string;
  ocrText?: string;
  audioTranscript?: string;
  uploadDate: string;
  fileSize: string;
  tags: string[];
  importance: 'high' | 'medium' | 'low';
  source: 'Google Drive' | 'Local Upload' | 'Gmail' | 'WhatsApp' | 'Voice Recorder' | 'Notion';
  author?: string;
  vectorId: string;
  viewsCount: number;
  entitiesConnected: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: SourceCitation[];
  suggestedFollowups?: string[];
  isThinking?: boolean;
}

export interface GraphNode {
  id: string;
  label: string;
  type: EntityCategory;
  val: number; // size weight
  color?: string;
  connectedDocIds: string[];
  description: string;
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  label: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: MemoryType | 'meeting' | 'calendar';
  description: string;
  sourceDocId?: string;
  participants?: string[];
  actionItem?: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  topic: string;
  confidence?: 'easy' | 'medium' | 'hard';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  storageUsedMB: number;
  storageLimitMB: number;
  totalIndexed: number;
  healthScore: number;
}
