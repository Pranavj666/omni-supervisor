'use client';

import { useChatStore } from '@/store/chat-store';
import { AlertBadge } from './alert-badge';
import { AlertTriangle, User, Bot, CheckCircle } from 'lucide-react';
import { Message } from '@/lib/types';

function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
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
          <p className="text-sm">{message.content}</p>
        </div>
        
        <span className="text-xs text-gray-500 mt-1">
          {formatMessageTime(message.timestamp)}
        </span>

        {message.riskFlags && (message.riskFlags.hallucination || message.riskFlags.sentiment === 'negative') && (
          <div className={`mt-2 p-3 rounded-lg border-2 ${
            message.riskFlags.hallucination 
              ? 'bg-purple-50 border-purple-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-2">
              <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                message.riskFlags.hallucination ? 'text-purple-600' : 'text-red-600'
              }`} />
              <div>
                <p className={`text-sm font-semibold ${
                  message.riskFlags.hallucination ? 'text-purple-900' : 'text-red-900'
                }`}>
                  {message.riskFlags.hallucination ? 'Hallucination Detected' : 'User Frustration Detected'}
                </p>
                <p className={`text-xs mt-1 ${
                  message.riskFlags.hallucination ? 'text-purple-700' : 'text-red-700'
                }`}>
                  {message.riskFlags.reason}
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
}

export function ChatDetails() {
  const { chats, selectedChatId, takeOverChat } = useChatStore();
  
  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg">Select a chat to view details</p>
        </div>
      </div>
    );
  }

  const showInterventionButton = 
    selectedChat.status !== 'intervened' && 
    (selectedChat.riskLevel === 'CRITICAL' || selectedChat.riskLevel === 'HALLUCINATION');

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selectedChat.userName}</h2>
            <p className="text-sm text-gray-500">User ID: {selectedChat.userId}</p>
          </div>
          <AlertBadge riskLevel={selectedChat.riskLevel} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedChat.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      {/* Intervention Button */}
      {showInterventionButton && (
        <div className="bg-white border-t border-gray-200 p-4">
          <button
            onClick={() => takeOverChat(selectedChat.id)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <AlertTriangle className="w-6 h-6" />
            TAKE OVER CONVERSATION
          </button>
        </div>
      )}

      {selectedChat.status === 'intervened' && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-green-900 font-semibold">Conversation Taken Over</p>
              <p className="text-green-700 text-sm">A human supervisor is now handling this chat</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
