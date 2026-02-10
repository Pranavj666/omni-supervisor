'use client';

import { useChatStore } from '@/store/chat-store';
import { AlertBadge } from './alert-badge';
import { Clock, User, Radio } from 'lucide-react';
import { Chat } from '@/lib/types';

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getLastMessagePreview(chat: Chat): string {
  const lastMessage = chat.messages[chat.messages.length - 1];
  if (!lastMessage) return 'No messages';
  
  const content = lastMessage.content;
  return content.length > 60 ? content.substring(0, 60) + '...' : content;
}

export function ChatList() {
  const { chats, selectedChatId, selectChat } = useChatStore();

  return (
    <div className="w-full lg:w-96 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Active Chats</h2>
        <p className="text-sm text-gray-500 mt-1">{chats.length} conversations</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No active chats</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => selectChat(chat.id)}
                className={`w-full p-4 text-left transition-colors hover:bg-gray-50 ${
                  selectedChatId === chat.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {chat.isLive ? (
                      <Radio className="w-4 h-4 text-green-500" />
                    ) : (
                      <User className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="font-semibold text-gray-900">{chat.userName}</span>
                    {chat.isLive && (
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-100 rounded">
                        LIVE
                      </span>
                    )}
                  </div>
                  <AlertBadge riskLevel={chat.riskLevel} />
                </div>

                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {getLastMessagePreview(chat)}
                </p>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {formatTimestamp(chat.lastUpdated)}
                </div>

                {chat.status === 'intervened' && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">
                      Intervened
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
