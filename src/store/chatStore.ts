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
  updateAssistantMessage: (chatId: string, newContent: string, isStreaming?: boolean) => void;
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
  updateAssistantMessage: (chatId, newContent, isStreaming = false) => set((state) => ({
    chats: state.chats.map((chat) => {
      if (chat.id !== chatId) return chat;

      // Tìm message assistant cuối cùng trong chat này
      let lastAssistantIndex = -1;
      for (let i = chat.messages.length - 1; i >= 0; i -= 1) {
        if (chat.messages[i].role === 'assistant') {
          lastAssistantIndex = i;
          break;
        }
      }

      if (lastAssistantIndex === -1) return chat;

      const updatedMessages = chat.messages.map((message, index) => {
        if (index !== lastAssistantIndex) return message;

        const isLoadingPlaceholder = message.content === '__loading__';
        if (isLoadingPlaceholder) {
          // Thay thế loading message bằng content đầu tiên
          return { ...message, content: newContent };
        }

        if (isStreaming) {
          // Đang streaming: nối token vào message assistant cuối cùng
          return { ...message, content: message.content + newContent };
        }

        // Kết thúc streaming: đảm bảo nội dung cuối cùng là full response
        return { ...message, content: newContent };
      });

      return { ...chat, messages: updatedMessages };
    }),
  })),
})); 