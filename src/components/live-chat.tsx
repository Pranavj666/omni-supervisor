'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import { Bot, User, Send, AlertTriangle, Loader2 } from 'lucide-react';
import { evaluateResponse } from '@/lib/supervisor-engine';
import { RiskLevel } from '@/lib/types';

interface LiveChatProps {
  chatId: string;
  userName: string;
  onRiskDetected: (riskLevel: RiskLevel, reason: string) => void;
}

function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function LiveChat({ chatId, userName, onRiskDetected }: LiveChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    onFinish: (message, { finishReason, usage }) => {
      // The messages array is updated by the time onFinish is called
      // Get all user messages and find the last one before this assistant message
      const currentMessages = messages;
      const assistantIndex = currentMessages.findIndex(m => m.id === message.id);
      
      // Find the user message immediately before this assistant message
      let lastUserMessage = null;
      for (let i = assistantIndex - 1; i >= 0; i--) {
        if (currentMessages[i].role === 'user') {
          lastUserMessage = currentMessages[i];
          break;
        }
      }
      
      if (lastUserMessage) {
        // Evaluate the AI response using the supervisor engine
        const evaluation = evaluateResponse(lastUserMessage.content, message.content);
        
        // Trigger callback for CRITICAL or HALLUCINATION risks
        if (evaluation.riskLevel === 'CRITICAL' || evaluation.riskLevel === 'HALLUCINATION') {
          onRiskDetected(evaluation.riskLevel, evaluation.reason);
        }
      }
    },
  });

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-sm font-semibold text-green-600">LIVE</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{userName}</h2>
              <p className="text-sm text-gray-500">Real-time AI conversation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p className="text-lg">Start a conversation with the AI assistant</p>
            <p className="text-sm mt-2">Ask about products, policies, or anything else!</p>
          </div>
        )}
        
        {messages.map((message, index) => {
          const isUser = message.role === 'user';
          const prevMessage = index > 0 ? messages[index - 1] : null;
          
          // Evaluate this message for risk flags
          let riskFlags = null;
          if (!isUser && prevMessage?.role === 'user') {
            const evaluation = evaluateResponse(prevMessage.content, message.content);
            if (evaluation.sentiment === 'negative' || evaluation.hallucination) {
              riskFlags = {
                sentiment: evaluation.sentiment,
                hallucination: evaluation.hallucination,
                reason: evaluation.reason,
              };
            }
          }

          return (
            <div key={message.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-gray-600" />
                </div>
              )}

              <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-2xl`}>
                <div
                  className={`px-4 py-2 rounded-lg ${
                    isUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                <span className="text-xs text-gray-500 mt-1">
                  {formatMessageTime(new Date(message.createdAt || Date.now()))}
                </span>

                {/* Risk Flags */}
                {riskFlags && (riskFlags.hallucination || riskFlags.sentiment === 'negative') && (
                  <div className={`mt-2 p-3 rounded-lg border-2 ${
                    riskFlags.hallucination
                      ? 'bg-purple-50 border-purple-200'
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        riskFlags.hallucination ? 'text-purple-600' : 'text-red-600'
                      }`} />
                      <div>
                        <p className={`text-sm font-semibold ${
                          riskFlags.hallucination ? 'text-purple-900' : 'text-red-900'
                        }`}>
                          {riskFlags.hallucination ? 'Hallucination Detected' : 'User Frustration Detected'}
                        </p>
                        <p className={`text-xs mt-1 ${
                          riskFlags.hallucination ? 'text-purple-700' : 'text-red-700'
                        }`}>
                          {riskFlags.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Bot className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex flex-col items-start">
              <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">AI is typing...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900">Error</p>
                <p className="text-xs text-red-700 mt-1">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
