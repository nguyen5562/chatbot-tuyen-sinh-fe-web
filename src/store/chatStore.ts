import { create } from 'zustand';
import type { ChatDTO } from '../types/chat';
import type { Message } from '../types/message';

interface ChatState {
  chats: ChatDTO[];
  currentChatId: string | null;
  setChats: (chats: ChatDTO[]) => void;
  setCurrentChatId: (id: string) => void;
  addChat: (chat: ChatDTO) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateAssistantMessage: (chatId: string, newContent: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  currentChatId: null,
  setChats: (chats) => set({ chats }),
  setCurrentChatId: (id) => set({ currentChatId: id }),
  addChat: (chat) => set((state) => ({ chats: [chat, ...state.chats] })),
  addMessage: (chatId, message) => set((state) => ({
    chats: state.chats.map((chat) =>
      chat.id === chatId
        ? { ...chat, messages: [...chat.messages, message] }
        : chat
    ),
  })),
  updateAssistantMessage: (chatId, newContent) => set((state) => ({
    chats: state.chats.map((chat) =>
      chat.id === chatId
        ? {
            ...chat,
            messages: chat.messages.map((m) =>
              m.role === 'assistant' && m.content === '__loading__'
                ? { ...m, content: newContent }
                : m
            ),
          }
        : chat
    ),
  })),
})); 