import { create } from 'zustand';
import { Chat, Message } from '@/lib/types';

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
}));
