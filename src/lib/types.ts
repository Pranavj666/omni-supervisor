export type RiskLevel = 'SAFE' | 'WARNING' | 'CRITICAL' | 'HALLUCINATION';

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
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
