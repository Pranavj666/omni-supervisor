import { EvaluationResult, KnowledgeBase } from './types';
import knowledgeBase from '@/data/knowledgeBase.json';

const kb = knowledgeBase as KnowledgeBase;

// Negative keywords for sentiment analysis
const NEGATIVE_KEYWORDS = [
  'stupid', 'wrong', 'useless', 'terrible', 'horrible', 'awful', 
  'worst', 'hate', 'frustrated', 'angry', 'disappointed', 'broken',
  'pathetic', 'ridiculous'
];

/**
 * Evaluates a bot response against user query for risk assessment
 */
export function evaluateResponse(
  userQuery: string,
  botResponse: string
): EvaluationResult {
  const userQueryLower = userQuery.toLowerCase();
  const botResponseLower = botResponse.toLowerCase();

  // Rule 1: Sentiment Analysis
  const hasFrustration = NEGATIVE_KEYWORDS.some(keyword => 
    userQueryLower.includes(keyword)
  );

  const sentiment: 'negative' | 'neutral' | 'positive' = hasFrustration 
    ? 'negative' 
    : 'neutral';

  // Rule 2: Grounding Check - Detect Hallucinations
  let hallucination = false;
  let reason = '';

  // Check for incorrect refund policy (must be 30 days)
  const refundDayMatches = botResponseLower.match(/(\d+)[-\s]day refund/);
  if (refundDayMatches) {
    const days = parseInt(refundDayMatches[1]);
    if (days !== kb.policies.refund.days) {
      hallucination = true;
      reason = `Incorrect refund policy: Bot stated ${days} days, but policy is ${kb.policies.refund.days} days`;
    }
  }

  // Alternative refund day patterns
  const returnDayMatches = botResponseLower.match(/return.*within (\d+) days/);
  if (returnDayMatches && !hallucination) {
    const days = parseInt(returnDayMatches[1]);
    if (days !== kb.policies.refund.days) {
      hallucination = true;
      reason = `Incorrect return policy: Bot stated ${days} days, but policy is ${kb.policies.refund.days} days`;
    }
  }

  // Check for incorrect free shipping threshold (must be $50)
  const shippingMatches = botResponseLower.match(/free shipping.*\$(\d+)/);
  if (shippingMatches && !hallucination) {
    const threshold = parseInt(shippingMatches[1]);
    if (threshold !== kb.policies.shipping.freeThreshold) {
      hallucination = true;
      reason = `Incorrect shipping threshold: Bot stated $${threshold}, but threshold is $${kb.policies.shipping.freeThreshold}`;
    }
  }

  // Alternative shipping patterns
  const shippingMatches2 = botResponseLower.match(/orders over \$(\d+)/);
  if (shippingMatches2 && !hallucination) {
    const threshold = parseInt(shippingMatches2[1]);
    if (threshold !== kb.policies.shipping.freeThreshold) {
      hallucination = true;
      reason = `Incorrect shipping threshold: Bot stated $${threshold}, but threshold is $${kb.policies.shipping.freeThreshold}`;
    }
  }

  // Check for incorrect product availability
  kb.products.forEach(product => {
    const productNameLower = product.name.toLowerCase();
    if (botResponseLower.includes(productNameLower) && !hallucination) {
      if (product.available && (
        botResponseLower.includes('out of stock') || 
        botResponseLower.includes('not available') ||
        botResponseLower.includes('unavailable')
      )) {
        hallucination = true;
        reason = `Incorrect availability: Bot stated ${product.name} is unavailable, but it is in stock`;
      } else if (!product.available && (
        botResponseLower.includes('in stock') ||
        botResponseLower.includes('available')
      ) && !botResponseLower.includes('not available') && !botResponseLower.includes('unavailable')) {
        hallucination = true;
        reason = `Incorrect availability: Bot stated ${product.name} is available, but it is out of stock`;
      }
    }
  });

  // Determine risk level
  let riskLevel: 'SAFE' | 'WARNING' | 'CRITICAL' | 'HALLUCINATION' = 'SAFE';
  
  if (hallucination) {
    riskLevel = 'HALLUCINATION';
    if (!reason) {
      reason = 'Bot response contains incorrect information';
    }
  } else if (hasFrustration) {
    riskLevel = 'CRITICAL';
    reason = 'User shows signs of frustration';
  }

  return {
    riskLevel,
    sentiment,
    hallucination,
    reason: reason || 'No issues detected'
  };
}
