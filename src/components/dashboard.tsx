'use client';

import { useEffect, useState } from 'react';
import { useChatStore } from '@/store/chat-store';
import { generateSimulatedChats } from '@/lib/simulation';
import { RiskLevel } from '@/lib/types';
import { ChatList } from './chat-list';
import { ChatDetails } from './chat-details';
import { LiveChat } from './live-chat';
import { Shield, PlusCircle, X } from 'lucide-react';

export function Dashboard() {
  const { chats, selectedChatId, setChats, createLiveChat, updateChatRisk } = useChatStore();
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Generate simulated chats on mount
    const simulatedChats = generateSimulatedChats(5);
    setChats(simulatedChats);
  }, [setChats]);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const handleCreateLiveChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      createLiveChat(userName.trim());
      setShowModal(false);
      setUserName('');
    }
  };

  const handleRiskDetected = (riskLevel: RiskLevel, reason: string) => {
    if (selectedChatId) {
      updateChatRisk(selectedChatId, riskLevel, reason);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Omni-Supervisor</h1>
              <p className="text-gray-300 text-sm">AI Observability Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            New Live Chat
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="grid grid-cols-[400px_1fr] w-full">
          <ChatList />
          {selectedChat?.isLive ? (
            <LiveChat
              chatId={selectedChat.id}
              userName={selectedChat.userName}
              onRiskDetected={handleRiskDetected}
            />
          ) : (
            <ChatDetails />
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Start New Live Chat</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateLiveChat}>
              <div className="mb-4">
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                  User Name
                </label>
                <input
                  id="userName"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter user name..."
                  autoFocus
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!userName.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Start Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
