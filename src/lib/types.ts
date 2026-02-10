export type RiskLevel = 'SAFE' | 'WARNING' | 'CRITICAL' | 'HALLUCINATION';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  sender: 'user' | 'bot'; // Backward compatibility
  content: string;
  timestamp: Date;
  createdAt?: Date; // Used by Vercel AI SDK
  riskFlags?: {
    sentiment?: 'negative' | 'neutral' | 'positive';
    hallucination?: boolean;
    reason?: string;
  };
}

export interface Chat {
  id: string;
  userId: string;
  userName: string;
  status: 'active' | 'resolved' | 'intervened';
  riskLevel: RiskLevel;
  messages: Message[];
  lastUpdated: Date;
  isLive?: boolean; // Flag to distinguish real vs simulated chats
}

export interface EvaluationResult {
  riskLevel: RiskLevel;
  sentiment: 'negative' | 'neutral' | 'positive';
  hallucination: boolean;
  reason: string;
}

export interface KnowledgeBase {
  policies: {
    refund: {
      days: number;
      conditions: string[];
      exceptions: string[];
    };
    shipping: {
      freeThreshold: number;
      standard: string;
      expressCost: number;
    };
    return: {
      days: number;
      conditions: string[];
    };
  };
  products: {
    name: string;
    price: number;
    available: boolean;
  }[];
}
