import { Chat, Message } from './types';
import { evaluateResponse } from './supervisor-engine';

// Sample user queries with frustration
const FRUSTRATED_USER_QUERIES = [
  "Where is my order? I ordered 2 weeks ago!",
  "Your chatbot is useless! I need a refund NOW!",
  "This is stupid. Can I return this broken item?",
  "I was told I'd get free shipping but was charged $15. This is wrong!",
  "This is the worst customer service ever. I want my money back!",
];

const NORMAL_USER_QUERIES = [
  "What is your refund policy?",
  "Do you offer free shipping?",
  "Is the Smart Watch available?",
  "Can I return an item if I don't like it?",
  "How long does shipping take?",
];

// Sample bot responses with intentional errors (hallucinations)
const HALLUCINATED_BOT_RESPONSES = [
  "Your order should arrive soon. We offer 60-day refunds on all items!",
  "Yes, you can return items within 90 days of purchase.",
  "Free shipping is available on all orders over $25.",
  "The Smart Watch is currently out of stock.",
  "We have a 45-day return policy for all products.",
];

const CORRECT_BOT_RESPONSES = [
  "We offer 30-day refunds on all items. Items must be unused and in original packaging.",
  "Yes, free shipping is available on orders over $50.",
  "The Smart Watch is available and costs $199.99.",
  "You can return items within 30 days of purchase.",
  "The Laptop Stand is currently unavailable.",
];

const USER_NAMES = [
  "Sarah Johnson",
  "Michael Chen",
  "Emma Davis",
  "James Wilson",
  "Lisa Anderson"
];

/**
 * Generates a realistic conversation with intentional issues
 */
function generateConversation(userName: string, userId: string): Chat {
  const messages: Message[] = [];
  const messageCount = Math.floor(Math.random() * 3) + 2; // 2-4 messages per conversation

  for (let i = 0; i < messageCount; i++) {
    // User message
    const isFirstMessage = i === 0;
    const shouldBeFrustrated = Math.random() > 0.4; // 60% chance of frustration
    
    const userQuery = shouldBeFrustrated 
      ? FRUSTRATED_USER_QUERIES[Math.floor(Math.random() * FRUSTRATED_USER_QUERIES.length)]
      : NORMAL_USER_QUERIES[Math.floor(Math.random() * NORMAL_USER_QUERIES.length)];

    const userMessage: Message = {
      id: `msg-${userId}-${i * 2}`,
      sender: 'user',
      content: userQuery,
      timestamp: new Date(Date.now() - (messageCount - i) * 120000), // 2 minutes apart
    };

    messages.push(userMessage);

    // Bot response
    const shouldHallucinate = Math.random() > 0.5; // 50% chance of hallucination
    const botResponse = shouldHallucinate
      ? HALLUCINATED_BOT_RESPONSES[Math.floor(Math.random() * HALLUCINATED_BOT_RESPONSES.length)]
      : CORRECT_BOT_RESPONSES[Math.floor(Math.random() * CORRECT_BOT_RESPONSES.length)];

    // Evaluate the response
    const evaluation = evaluateResponse(userQuery, botResponse);

    const botMessage: Message = {
      id: `msg-${userId}-${i * 2 + 1}`,
      sender: 'bot',
      content: botResponse,
      timestamp: new Date(Date.now() - (messageCount - i) * 120000 + 30000), // 30 seconds after user
      riskFlags: {
        sentiment: evaluation.sentiment,
        hallucination: evaluation.hallucination,
        reason: evaluation.reason,
      },
    };

    messages.push(botMessage);
  }

  // Determine overall risk level based on messages
  let overallRiskLevel: 'SAFE' | 'WARNING' | 'CRITICAL' | 'HALLUCINATION' = 'SAFE';
  
  for (const msg of messages) {
    if (msg.riskFlags?.hallucination) {
      overallRiskLevel = 'HALLUCINATION';
      break;
    }
    if (msg.riskFlags?.sentiment === 'negative') {
      overallRiskLevel = 'CRITICAL';
    }
  }

  return {
    id: userId,
    userId,
    userName,
    status: 'active',
    riskLevel: overallRiskLevel,
    messages,
    lastUpdated: new Date(),
  };
}

/**
 * Generates multiple simulated conversations
 */
export function generateSimulatedChats(count: number = 5): Chat[] {
  const chats: Chat[] = [];

  for (let i = 0; i < count; i++) {
    const userName = USER_NAMES[i % USER_NAMES.length];
    const userId = `user-${i + 1}`;
    chats.push(generateConversation(userName, userId));
  }

  // Sort by risk level (most critical first)
  return chats.sort((a, b) => {
    const riskOrder = { HALLUCINATION: 0, CRITICAL: 1, WARNING: 2, SAFE: 3 };
    return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
  });
}
