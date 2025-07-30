import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from '../components/Chat/ChatMessage';
import ChatInput from '../components/Chat/ChatInput';
import ChatHistory from '../components/Chat/ChatHistory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { modelApi } from "../utils/apis/modelApi";
import { chatApi } from "../utils/apis/chatApi";
import Box from '@mui/material/Box';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import type { ChatDTO } from '../types/chat';
import type { Message } from '../types/message';

const ChatPage: React.FC = () => {
  // Guest chat state giữ nguyên
  const [guestChats, setGuestChats] = useState<ChatDTO[]>([
    { id: 'g1', title: 'Cuộc hội thoại mới', messages: [] },
  ]);
  const [guestCurrentChatId, setGuestCurrentChatId] = useState('g1');

  // Auth
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const userId = useAuthStore((state) => state.userId);

  // Chat store
  const chats = useChatStore((state) => state.chats);
  const currentChatId = useChatStore((state) => state.currentChatId);
  const setChats = useChatStore((state) => state.setChats);
  const setCurrentChatId = useChatStore((state) => state.setCurrentChatId);
  // const addChat = useChatStore((state) => state.addChat);
  const addMessage = useChatStore((state) => state.addMessage);
  const updateAssistantMessage = useChatStore((state) => state.updateAssistantMessage);

  // State cho input và loading
  const chatRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInputAtBottom, setShowInputAtBottom] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(false);

  // Thêm hằng cho id cuộc hội thoại mới
  const NEW_CHAT_ID = 'new';

  // useEffect lấy danh sách chat khi đăng nhập
  useEffect(() => {
    if (loggedIn && userId) {
      setIsLoadingChats(true);
      chatApi.getChatByUser(userId).then((res) => {
        if (res.status === 'Success' && res.data) {
          // Thêm 'Cuộc hội thoại mới' vào đầu danh sách
          setChats([{ id: NEW_CHAT_ID, title: 'Cuộc hội thoại mới', messages: [] }, ...res.data]);
          setCurrentChatId(NEW_CHAT_ID); // Luôn chọn cuộc hội thoại mới khi vào
        }
        setIsLoadingChats(false);
      }).catch(() => {
        setIsLoadingChats(false);
      });
    }
  }, [loggedIn, userId, setChats, setCurrentChatId]);

  // Hàm tạo chat mới
  const handleNewChat = async () => {
    if (loggedIn && userId) {
      // Kiểm tra xem đã có 'Cuộc hội thoại mới' chưa
      const hasNewChat = chats.some(chat => chat.id === NEW_CHAT_ID);
      if (!hasNewChat) {
        // Chỉ tạo 'Cuộc hội thoại mới' nếu chưa có
        setChats([
          { id: NEW_CHAT_ID, title: 'Cuộc hội thoại mới', messages: [] },
          ...chats
        ]);
      }
      setCurrentChatId(NEW_CHAT_ID);
      setShowInputAtBottom(false);
    } else {
      // Guest logic - kiểm tra xem đã có 'Cuộc hội thoại mới' chưa
      const hasNewGuestChat = guestChats.some(chat => chat.title === 'Cuộc hội thoại mới');
      if (!hasNewGuestChat) {
        // Chỉ tạo 'Cuộc hội thoại mới' nếu chưa có
        const newId = 'g' + Date.now().toString();
        setGuestChats(prev => [
          { id: newId, title: 'Cuộc hội thoại mới', messages: [] },
          ...prev,
        ]);
        setGuestCurrentChatId(newId);
      } else {
        // Nếu đã có, chọn cuộc hội thoại mới đầu tiên
        const newChat = guestChats.find(chat => chat.title === 'Cuộc hội thoại mới');
        if (newChat) {
          setGuestCurrentChatId(newChat.id);
        }
      }
      setShowInputAtBottom(false);
    }
  };

  // Lấy messages của chat đang chọn
  // eslint-disable-next-line react-hooks/exhaustive-deps
  let currentMessages: Message[] = [];
  if (loggedIn && chats && currentChatId) {
    if (currentChatId === NEW_CHAT_ID) {
      currentMessages = [];
    } else {
      currentMessages = chats.find((c) => c.id === currentChatId)?.messages || [];
    }
  } else if (guestChats && guestCurrentChatId) {
    currentMessages = guestChats.find((c) => c.id === guestCurrentChatId)?.messages || [];
  }

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [currentMessages, loading]);

  // Gửi tin nhắn
  const handleSend = async (msg: string) => {
    if (!msg.trim()) return;
    if (!showInputAtBottom) setShowInputAtBottom(true);
    if (loggedIn) {
      if (currentChatId === NEW_CHAT_ID) {
        // Nếu đang ở cuộc hội thoại mới, tạo chat mới trước
        try {
          if (!userId) throw new Error('userId is required');
          const res = await chatApi.createChat(userId, { title: 'Cuộc hội thoại mới' });
          if (res.status === 'Success' && res.data) {
            // Thay thế 'Cuộc hội thoại mới' bằng chat thật vừa tạo
            const chatsWithoutNew = chats.filter((c) => c.id !== NEW_CHAT_ID);
            setChats([
              res.data!,
              ...chatsWithoutNew
            ]);
            setCurrentChatId(res.data.id);
            // Gửi tin nhắn vào chat mới
            const userMsg = { id: Date.now().toString(), role: 'user', content: msg };
            const loadingMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: '__loading__' };
            addMessage(res.data.id, userMsg);
            addMessage(res.data.id, loadingMsg);
            setInput('');
            setLoading(true);
            try {
              const response = await modelApi.getResponse(msg);
              if (response) {
                await chatApi.sendMessage(res.data.id, { content: msg, role: 'user' });
                await chatApi.sendMessage(res.data.id, { content: response, role: 'assistant' });
                updateAssistantMessage(res.data.id, response);
              }
            } catch {
              updateAssistantMessage(res.data.id, 'Đã có lỗi xảy ra.');
            }
            setLoading(false);
          }
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
        return;
      } else if (currentChatId && typeof currentChatId === 'string') {
        // Gửi tin nhắn vào chat đã có
        const userMsg = { id: Date.now().toString(), role: 'user', content: msg };
        const loadingMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: '__loading__' };
        addMessage(currentChatId, userMsg);
        addMessage(currentChatId, loadingMsg);
        setInput('');
        setLoading(true);
        try {
          const response = await modelApi.getResponse(msg);
          if (response) {
            await chatApi.sendMessage(currentChatId, { content: msg, role: 'user' });
            await chatApi.sendMessage(currentChatId, { content: response, role: 'assistant' });
            updateAssistantMessage(currentChatId, response);
          }
        } catch {
          updateAssistantMessage(currentChatId, 'Đã có lỗi xảy ra.');
        }
        setLoading(false);
      }
    } else if (guestCurrentChatId) {
      // Guest logic giữ nguyên
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
      setInput('');
      setLoading(true);
      try {
        const response = await modelApi.getResponse(msg);
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
      } catch {
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
      setLoading(false);
    }
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
  const sidebarWidth = 288;

  // Hiển thị loading overlay khi đang tải chat
  if (loggedIn && isLoadingChats) {
    return (
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, alignItems: 'center', justifyContent: 'center', background: chatBg }}>
        <div className="flex flex-col items-center justify-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-blue-600 mb-4" />
          <div className="text-xl font-semibold text-gray-700">Đang tải cuộc hội thoại...</div>
        </div>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
      {/* Sidebar ChatHistory */}
      <Box sx={{ width: sidebarWidth, bgcolor: 'white', borderRight: 1, borderColor: 'divider', p: 0, zIndex: 10, minHeight: 0, height: '100vh', overflowY: 'auto' }}>
        <ChatHistory
          chats={loggedIn ? chats : guestChats}
          currentChatId={loggedIn ? currentChatId : guestCurrentChatId}
          onSelect={loggedIn ? setCurrentChatId : setGuestCurrentChatId}
          onNewChat={handleNewChat}
          loggedIn={loggedIn}
        />
      </Box>
      {/* Main chat area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, height: '100vh' }}>
        <div className="flex flex-col h-full min-h-0 w-full relative overflow-hidden">
          {/* Nền gradient cố định */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: chatBg }} />
          {/* New chat UI ở giữa màn hình */}
          <div
            className={`absolute left-0 right-0 top-0 bottom-0 flex flex-col items-center justify-center transition-all duration-700 z-10 -mt-40
            ${isNewChat ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-32'}`}
          >
            <div className="text-3xl md:text-4xl font-extrabold text-black mb-10 mt-10 text-center drop-shadow-xl">Bạn muốn hỏi gì?</div>
            <div className="w-full flex justify-center">
              <form
                className="relative w-full max-w-2xl flex items-center"
                onSubmit={e => {
                  e.preventDefault();
                  if (!loading) handleSend(input);
                }}
              >
                <div className="flex-1 flex items-center bg-white rounded-full shadow-2xl px-8 py-4 text-lg w-full">
                  <input
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-lg"
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  className="ml-4 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-blue-700 transition-all"
                  disabled={loading}
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
            <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-8 space-y-6 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent bg-transparent" style={{ maxHeight: 'calc(100vh - 120px)', minHeight: 0 }}>
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
            <div className="px-4 pb-20 pt-2 bg-gradient-to-t transparent">
              <ChatInput
                value={input}
                onChange={setInput}
                onSend={msg => { if (!loading) handleSend(msg); }}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default ChatPage; 