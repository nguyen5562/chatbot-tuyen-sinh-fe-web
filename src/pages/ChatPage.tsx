import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from '../components/Chat/ChatMessage';
import ChatInput from '../components/Chat/ChatInput';
import ChatHistory from '../components/Chat/ChatHistory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { modelApi } from "../utils/apis/modelApi";
import Box from '@mui/material/Box';
import { useAuthStore } from '../store/authStore';
import type { ChatDTO } from '../types/chat';
import type { Message } from '../types/message';

const ChatPage: React.FC = () => {
  // State chat cho user đã đăng nhập
  const [chats, setChats] = useState<ChatDTO[]>([
    {
      id: '1',
      title: 'Cuộc trò chuyện 1',
      messages: [
        { id: 'm1', role: 'assistant', content: 'Chào bạn! Tôi có thể giúp gì?' },
        { id: 'm2', role: 'user', content: 'Xin chào!' },
      ],
    },
    {
      id: '2',
      title: 'Cuộc trò chuyện 2',
      messages: [
        { id: 'm1', role: 'user', content: 'React là gì?' },
        { id: 'm2', role: 'assistant', content: 'React là một thư viện UI của Facebook.' },
      ],
    },
  ]);
  const [currentChatId, setCurrentChatId] = useState('1');
  // State chat cho guest
  const [guestChats, setGuestChats] = useState<ChatDTO[]>([
    { id: 'g1', title: 'Cuộc hội thoại mới', messages: [] },
  ]);
  const [guestCurrentChatId, setGuestCurrentChatId] = useState('g1');

  const loggedIn = useAuthStore((state) => state.loggedIn);

  // State cho input và loading
  const chatRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInputAtBottom, setShowInputAtBottom] = useState(false);

  // Hàm tạo chat mới
  const handleNewChat = () => {
    if (loggedIn) {
      const newId = Date.now().toString();
      setChats(prev => [
        { id: newId, title: 'Cuộc trò chuyện mới', messages: [] },
        ...prev,
      ]);
      setCurrentChatId(newId);
    } else {
      const newId = 'g' + Date.now().toString();
      setGuestChats(prev => [
        { id: newId, title: 'Cuộc hội thoại mới', messages: [] },
        ...prev,
      ]);
      setGuestCurrentChatId(newId);
    }
    setShowInputAtBottom(false);
  };

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
    if (loggedIn && currentChatId) {
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
    } else if (guestCurrentChatId) {
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
      if (loggedIn && currentChatId) {
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
      } else if (guestCurrentChatId) {
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
      if (loggedIn && currentChatId) {
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
      } else if (guestCurrentChatId) {
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
  useEffect(() => {
    if (currentMessages.length === 0) {
      setShowInputAtBottom(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn ? currentChatId : guestCurrentChatId]);

  // Reset guest chat state khi logout
  useEffect(() => {
    if (!loggedIn) {
      const newGuestId = 'g' + Date.now().toString();
      setGuestChats([{ id: newGuestId, title: 'Cuộc hội thoại mới', messages: [] }]);
      setGuestCurrentChatId(newGuestId);
    }
  }, [loggedIn]);

  // Giao diện new chat nếu chưa có tin nhắn
  const isNewChat = currentMessages.length === 0 && !showInputAtBottom;
  const chatBg = 'linear-gradient(135deg, #e3f0ff 0%, #b3d1fa 100%)';

  // Sidebar width
  const sidebarWidth = 288;

  return (
    <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
      {/* Sidebar ChatHistory */}
      <Box sx={{ width: sidebarWidth, bgcolor: 'white', borderRight: 1, borderColor: 'divider', p: 0, zIndex: 10, minHeight: 0 }}>
        <ChatHistory
          chats={(loggedIn ? chats : guestChats).map(({ id, title }) => ({ id, title }))}
          currentChatId={loggedIn ? currentChatId : guestCurrentChatId}
          onSelect={loggedIn ? setCurrentChatId : setGuestCurrentChatId}
          onNewChat={handleNewChat}
          loggedIn={loggedIn}
        />
      </Box>
      {/* Main chat area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
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
      </Box>
    </Box>
  );
};

export default ChatPage; 