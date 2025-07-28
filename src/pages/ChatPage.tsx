import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from '../components/Chat/ChatMessage';
import ChatInput from '../components/Chat/ChatInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { modelApi } from "../utils/apis/modelApi";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
export interface Chat {
  id: string;
  title: string;
  messages: Message[];
}
export interface Props {
  chats?: Chat[];
  setChats?: React.Dispatch<React.SetStateAction<Chat[]>>;
  currentChatId?: string;
  setCurrentChatId?: (id: string) => void;
  loggedIn?: boolean;
  setShowInputAtBottomRef?: (fn: (v: boolean) => void) => void;
  // Thêm props cho guest
  guestChats?: Chat[];
  setGuestChats?: React.Dispatch<React.SetStateAction<Chat[]>>;
  guestCurrentChatId?: string;
  setGuestCurrentChatId?: (id: string) => void;
}

const ChatPage: React.FC<Props> = ({ chats, setChats, currentChatId, loggedIn, setShowInputAtBottomRef, guestChats, setGuestChats, guestCurrentChatId }) => {
  const chatRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInputAtBottom, setShowInputAtBottom] = useState(false);

  // Expose setShowInputAtBottom cho MainLayout
  useEffect(() => {
    if (setShowInputAtBottomRef) {
      setShowInputAtBottomRef(setShowInputAtBottom);
    }
  }, [setShowInputAtBottomRef]);

  // Lấy messages của chat đang chọn
  // eslint-disable-next-line react-hooks/exhaustive-deps
  let currentMessages: Message[] = [];
  if (loggedIn && chats && currentChatId) {
    currentMessages = chats.find((c) => c.id === currentChatId)?.messages || [];
  } else if (guestChats && guestCurrentChatId) {
    currentMessages = guestChats.find((c) => c.id === guestCurrentChatId)?.messages || [];
  }

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [currentMessages, loading]);

  // Khi gửi tin nhắn đầu tiên, chuyển input xuống dưới với hiệu ứng
  const handleSend = async (msg: string) => {
    if (!msg.trim()) return;
    if (!showInputAtBottom) setShowInputAtBottom(true);
    if (loggedIn && setChats && currentChatId) {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
              ...chat,
              messages: [
                ...chat.messages,
                { id: Date.now().toString(), role: 'user', content: msg },
                { id: (Date.now() + 1).toString(), role: 'assistant', content: '__loading__' },
              ],
            }
            : chat
        )
      );
    } else if (setGuestChats && guestCurrentChatId) {
      setGuestChats((prev) =>
        prev.map((chat) =>
          chat.id === guestCurrentChatId
            ? {
              ...chat,
              messages: [
                ...chat.messages,
                { id: Date.now().toString(), role: 'user', content: msg },
                { id: (Date.now() + 1).toString(), role: 'assistant', content: '__loading__' },
              ],
            }
            : chat
        )
      );
    }
    setInput('');
    setLoading(true);
    try {
      const response = await modelApi.getResponse(msg);
      if (loggedIn && setChats && currentChatId) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId
              ? {
                ...chat,
                messages: chat.messages.map((m) =>
                  m.content === '__loading__'
                    ? { ...m, content: response }
                    : m
                ),
              }
              : chat
          )
        );
      } else if (setGuestChats && guestCurrentChatId) {
        setGuestChats((prev) =>
          prev.map((chat) =>
            chat.id === guestCurrentChatId
              ? {
                ...chat,
                messages: chat.messages.map((m) =>
                  m.content === '__loading__'
                    ? { ...m, content: response }
                    : m
                ),
              }
              : chat
          )
        );
      }
    } catch {
      if (loggedIn && setChats && currentChatId) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId
              ? {
                ...chat,
                messages: chat.messages.map((m) =>
                  m.content === '__loading__'
                    ? { ...m, content: 'Đã có lỗi xảy ra.' }
                    : m
                ),
              }
              : chat
          )
        );
      } else if (setGuestChats && guestCurrentChatId) {
        setGuestChats((prev) =>
          prev.map((chat) =>
            chat.id === guestCurrentChatId
              ? {
                ...chat,
                messages: chat.messages.map((m) =>
                  m.content === '__loading__'
                    ? { ...m, content: 'Đã có lỗi xảy ra.' }
                    : m
                ),
              }
              : chat
          )
        );
      }
    }
    setLoading(false);
  };

  // Reset showInputAtBottom khi chuyển sang chat khác mà chưa có tin nhắn
  React.useEffect(() => {
    if (currentMessages.length === 0) {
      setShowInputAtBottom(false);
    }
    // eslint-disable-next-line
  }, [loggedIn ? currentChatId : guestCurrentChatId]);

  // Giao diện new chat nếu chưa có tin nhắn
  const isNewChat = currentMessages.length === 0 && !showInputAtBottom;

  const chatBg = 'linear-gradient(135deg, #e3f0ff 0%, #b3d1fa 100%)';

  return (
    <div className="flex flex-col h-full min-h-0 w-full relative overflow-hidden">
      {/* Nền gradient cố định */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: chatBg }} />
      {/* New chat UI ở giữa màn hình */}
      <div
        className={`absolute left-0 right-0 top-0 bottom-0 flex flex-col items-center justify-center transition-all duration-700 z-10
        ${isNewChat ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-32'}`}
      >
        <div className="text-3xl md:text-4xl font-extrabold text-black mb-10 mt-10 text-center drop-shadow-xl">Bạn muốn hỏi gì?</div>
        <div className="w-full flex justify-center">
          <form
            className="relative w-full max-w-2xl flex items-center"
            onSubmit={e => {
              e.preventDefault();
              handleSend(input);
            }}
          >
            <div className="flex-1 flex items-center bg-white rounded-full shadow-2xl px-8 py-4 text-lg w-full">
              <input
                className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-lg"
                type="text"
                placeholder="Nhập tin nhắn..."
                value={input}
                onChange={e => setInput(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="ml-4 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-blue-700 transition-all"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>
      </div>
      {/* Chat UI bình thường */}
      <div
        className={`flex flex-col h-full min-h-0 w-full transition-all duration-700 z-10 ${isNewChat ? 'opacity-0 pointer-events-none translate-y-[-32px]' : 'opacity-100 pointer-events-auto'}`}
      >
        <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-8 space-y-6 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent bg-transparent">
          {currentMessages.map((msg, idx) =>
            msg.content === '__loading__' ? (
              <div key={msg.id + idx} className="flex items-center gap-2 text-gray-500 animate-pulse">
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                <span>Đang trả lời...</span>
              </div>
            ) : (
              <ChatMessage key={msg.id} message={{ ...msg, role: msg.role as 'user' | 'assistant' }} />
            )
          )}
        </div>
        <div className="px-4 pb-8 pt-2 bg-gradient-to-t from-white/90 to-transparent">
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 