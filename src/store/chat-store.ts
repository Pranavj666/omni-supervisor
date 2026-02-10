import { create } from 'zustand';
import { Chat, Message, RiskLevel } from '@/lib/types';

interface ChatStore {
  chats: Chat[];
  selectedChatId: string | null;
  
  // Actions
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  addMessage: (chatId: string, message: Message) => void;
  selectChat: (chatId: string) => void;
  takeOverChat: (chatId: string) => void;
  setChats: (chats: Chat[]) => void;
  createLiveChat: (userName: string) => string;
  updateChatRisk: (chatId: string, riskLevel: RiskLevel, reason: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  selectedChatId: null,

  addChat: (chat) =>
    set((state) => ({
      chats: [...state.chats, chat],
    })),

  updateChat: (chatId, updates) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, ...updates } : chat
      ),
    })),

  addMessage: (chatId, message) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, message],
              lastUpdated: new Date(),
            }
          : chat
      ),
    })),

  selectChat: (chatId) =>
    set(() => ({
      selectedChatId: chatId,
    })),

  takeOverChat: (chatId) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              status: 'intervened' as const,
            }
          : chat
      ),
    })),

  setChats: (chats) =>
    set(() => ({
      chats,
      selectedChatId: chats.length > 0 ? chats[0].id : null,
    })),

  createLiveChat: (userName) => {
    const chatId = `live-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newChat: Chat = {
      id: chatId,
      userId: `user-${Date.now()}`,
      userName,
      status: 'active',
      riskLevel: 'SAFE',
      messages: [],
      lastUpdated: new Date(),
      isLive: true,
    };
    
    set((state) => ({
      chats: [...state.chats, newChat],
      selectedChatId: chatId,
    }));
    
    return chatId;
  },

  updateChatRisk: (chatId, riskLevel, reason) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              riskLevel,
              lastUpdated: new Date(),
            }
          : chat
      ),
    })),
}));
