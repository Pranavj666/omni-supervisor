'use client';

import { useEffect } from 'react';
import { useChatStore } from '@/store/chat-store';
import { generateSimulatedChats } from '@/lib/simulation';
import { ChatList } from './chat-list';
import { ChatDetails } from './chat-details';
import { Shield } from 'lucide-react';

export function Dashboard() {
  const { setChats } = useChatStore();

  useEffect(() => {
    // Generate simulated chats on mount
    const simulatedChats = generateSimulatedChats(5);
    setChats(simulatedChats);
  }, [setChats]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Omni-Supervisor</h1>
            <p className="text-blue-100 text-sm">AI Observability Dashboard</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <ChatList />
        <ChatDetails />
      </div>
    </div>
  );
}
