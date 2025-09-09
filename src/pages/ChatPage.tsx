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
  const isLoadingChats = useChatStore((state) => state.isLoading);
  const setChats = useChatStore((state) => state.setChats);
  const setCurrentChatId = useChatStore((state) => state.setCurrentChatId);
  const fetchChatHistory = useChatStore((state) => state.fetchChatHistory);

  // const addChat = useChatStore((state) => state.addChat);
  const addMessage = useChatStore((state) => state.addMessage);
  const updateAssistantMessage = useChatStore((state) => state.updateAssistantMessage);

  // State cho input và loading
  const chatRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInputAtBottom, setShowInputAtBottom] = useState(false);

  // Thêm hằng cho id cuộc hội thoại mới
  const NEW_CHAT_ID = 'new';

  // useEffect lấy danh sách chat khi đăng nhập
  useEffect(() => {
    if (loggedIn && userId) {
      fetchChatHistory(userId).then(() => {
        // Sau khi fetch xong, thêm 'Cuộc hội thoại mới' vào đầu danh sách
        // Sử dụng setTimeout để đảm bảo state đã được update
        setTimeout(() => {
          const currentChats = useChatStore.getState().chats;
          const hasNewChat = currentChats.some((chat: ChatDTO) => chat.id === NEW_CHAT_ID);
          if (!hasNewChat) {
            const newChats = [{ id: NEW_CHAT_ID, title: 'Cuộc hội thoại mới', messages: [] }, ...currentChats];
            setChats(newChats);
          }
          setCurrentChatId(NEW_CHAT_ID); // Luôn chọn cuộc hội thoại mới khi vào
        }, 100);
      });
    }
  }, [loggedIn, userId, fetchChatHistory, setChats, setCurrentChatId]);

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
            const newChatWithMessages = {
              ...res.data!,
              messages: [
                { id: Date.now().toString(), role: 'user', content: msg },
                { id: (Date.now() + 1).toString(), role: 'assistant', content: '__loading__' }
              ]
            };
            setChats([
              newChatWithMessages,
              ...chatsWithoutNew
            ]);
            setCurrentChatId(res.data.id);

            // Nếu tiêu đề vẫn là mặc định, cập nhật thành tin nhắn đầu tiên (optimistic update + API)
            if (res.data.title === 'Cuộc hội thoại mới') {
              setTimeout(() => {
                const currentChats = useChatStore.getState().chats;
                const updatedChats = currentChats.map((c) => (c.id === res.data!.id ? { ...c, title: msg } : c));
                setChats(updatedChats);
              }, 100);
              chatApi
                .updateChatTitle(res.data.id, { title: msg })
                .catch(() => { /* ignore */ });
            }
            setInput('');
            setLoading(true);
            try {
              const response = await modelApi.getStreamingResponsePromise(
                msg,
                (token) => {
                  // Cập nhật message theo từng token (append)
                  if (res.data) {
                    updateAssistantMessage(res.data.id, token, true);
                  }
                }
              );
              if (response) {
                await chatApi.sendMessage(res.data.id, { content: msg, role: 'user' });
                await chatApi.sendMessage(res.data.id, { content: response, role: 'assistant' });
                // Đảm bảo message cuối cùng được cập nhật đầy đủ
                updateAssistantMessage(res.data.id, response);
              }
            } catch {
              updateAssistantMessage(res.data.id, 'Đã có lỗi xảy ra.');
            }
            setLoading(false);
          }
        } catch (error) {
          console.error('Error creating new chat:', error);
          setLoading(false);
        }
        return;
      } else if (currentChatId && typeof currentChatId === 'string') {
        // Gửi tin nhắn vào chat đã có
        const userMsg = { id: Date.now().toString(), role: 'user', content: msg };
        const loadingMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: '__loading__' };
        addMessage(currentChatId, userMsg);
        addMessage(currentChatId, loadingMsg);
        
        // Nếu tiêu đề vẫn là mặc định, cập nhật thành tin nhắn đầu tiên (optimistic update + API)
        const currentChatTitle = chats.find((c) => c.id === currentChatId)?.title;
        if (currentChatTitle === 'Cuộc hội thoại mới') {
          setTimeout(() => {
            const currentChats = useChatStore.getState().chats;
            const updatedChats = currentChats.map((c) => (c.id === currentChatId ? { ...c, title: msg } : c));
            setChats(updatedChats);
          }, 100);
          chatApi
            .updateChatTitle(currentChatId, { title: msg })
            .catch(() => { /* ignore */ });
        }
        setInput('');
        setLoading(true);
        try {
          const response = await modelApi.getStreamingResponsePromise(
            msg,
            (token) => {
              // Cập nhật message theo từng token (append)
              updateAssistantMessage(currentChatId, token, true);
            }
          );
          if (response) {
            await chatApi.sendMessage(currentChatId, { content: msg, role: 'user' });
            await chatApi.sendMessage(currentChatId, { content: response, role: 'assistant' });
            // Đảm bảo message cuối cùng được cập nhật đầy đủ
            updateAssistantMessage(currentChatId, response);
          }
        } catch {
          updateAssistantMessage(currentChatId, 'Đã có lỗi xảy ra.');
        }
        setLoading(false);
      }
    } else if (guestCurrentChatId) {
      // Guest logic - cập nhật title khi gửi tin nhắn đầu tiên
      const currentChat = guestChats.find(chat => chat.id === guestCurrentChatId);
      const isFirstMessage = currentChat?.messages.length === 0;

      setGuestChats((prev) =>
        prev.map((chat) =>
          chat.id === guestCurrentChatId
            ? {
              ...chat,
              title: isFirstMessage ? msg : chat.title, // Đổi title thành tin nhắn đầu tiên
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
        let streamingContent = '';
        const response = await modelApi.getStreamingResponsePromise(
          msg,
          (token) => {
            // Cập nhật message theo từng token cho guest (append)
            streamingContent += token;
            setGuestChats((prev) =>
              prev.map((chat) => {
                if (chat.id !== guestCurrentChatId) return chat;

                // Chỉ cập nhật duy nhất message assistant cuối cùng
                let lastAssistantIndex = -1;
                for (let i = chat.messages.length - 1; i >= 0; i -= 1) {
                  if (chat.messages[i].role === 'assistant') {
                    lastAssistantIndex = i;
                    break;
                  }
                }

                if (lastAssistantIndex === -1) return chat;

                const updatedMessages = chat.messages.map((m, idx) => {
                  if (idx !== lastAssistantIndex) return m;
                  return { ...m, content: streamingContent };
                });

                return { ...chat, messages: updatedMessages };
              })
            );
          }
        );
        // Đảm bảo message cuối cùng được cập nhật đầy đủ
        setGuestChats((prev) =>
          prev.map((chat) => {
            if (chat.id !== guestCurrentChatId) return chat;

            let lastAssistantIndex = -1;
            for (let i = chat.messages.length - 1; i >= 0; i -= 1) {
              if (chat.messages[i].role === 'assistant') {
                lastAssistantIndex = i;
                break;
              }
            }

            if (lastAssistantIndex === -1) return chat;

            const updatedMessages = chat.messages.map((m, idx) =>
              idx === lastAssistantIndex ? { ...m, content: response } : m
            );

            return { ...chat, messages: updatedMessages };
          })
        );
      } catch {
        setGuestChats((prev) =>
          prev.map((chat) => {
            if (chat.id !== guestCurrentChatId) return chat;

            let lastAssistantIndex = -1;
            for (let i = chat.messages.length - 1; i >= 0; i -= 1) {
              if (chat.messages[i].role === 'assistant') {
                lastAssistantIndex = i;
                break;
              }
            }

            if (lastAssistantIndex === -1) return chat;

            const updatedMessages = chat.messages.map((m, idx) =>
              idx === lastAssistantIndex && m.content === '__loading__'
                ? { ...m, content: 'Đã có lỗi xảy ra.' }
                : m
            );

            return { ...chat, messages: updatedMessages };
          })
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
  const sidebarWidth = 320;

  // Hiển thị loading overlay khi đang tải chat
  if (loggedIn && isLoadingChats) {
    return (
      <Box sx={{
        display: 'flex',
        flex: 1,
        minHeight: 0,
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f7fafc'
      }}>
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-2xl border border-gray-200">
          <FontAwesomeIcon icon={faSpinner} spin className="text-6xl text-blue-600 mb-6" />
          <div className="text-2xl font-bold text-gray-800">Đang tải cuộc hội thoại...</div>
        </div>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flex: 1, minHeight: 0, background: '#f7fafc' }}>
      {/* Sidebar ChatHistory */}
      <Box sx={{
        width: sidebarWidth,
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        p: 3,
        zIndex: 10,
        minHeight: 0,
        height: '100vh',
        overflowY: 'auto',
        boxShadow: '2px 0 12px rgba(0,0,0,0.05)'
      }}>
        <ChatHistory
          chats={loggedIn ? chats : guestChats}
          currentChatId={loggedIn ? currentChatId : guestCurrentChatId}
          onSelect={loggedIn ? setCurrentChatId : setGuestCurrentChatId}
          onNewChat={handleNewChat}
          loggedIn={loggedIn}
        />
      </Box>

      {/* Main chat area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, height: '100vh', position: 'relative' }}>
        <div className="flex flex-col h-full min-h-0 w-full relative overflow-hidden">
          {/* New chat UI ở giữa màn hình */}
          <div
            className={`absolute left-0 right-0 top-0 bottom-0 flex flex-col items-center justify-center transition-all duration-700 z-10
            ${isNewChat ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-32'}`}
          >
            <div className="text-center mb-12">
              <div className="text-5xl md:text-6xl font-black text-gray-800 mb-4">
                Xin chào! 👋
              </div>
              <div className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
                Tôi là ChatBot MTA, sẵn sàng hỗ trợ bạn với mọi câu hỏi về tuyển sinh
              </div>
            </div>

            <div className="w-full flex justify-center px-8">
              <form
                className="relative w-full max-w-3xl flex items-center gap-4"
                onSubmit={e => {
                  e.preventDefault();
                  if (!loading) handleSend(input);
                }}
              >
                <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200">
                  <input
                    className="w-full px-8 py-6 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 text-lg font-medium rounded-2xl"
                    type="text"
                    placeholder="Hãy đặt câu hỏi của bạn..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center text-xl shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !input.trim()}
                >
                  {loading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <FontAwesomeIcon icon={faPaperPlane} />
                  )}
                </button>
              </form>
            </div>

            {/* Gợi ý câu hỏi */}
            <div className="mt-12 max-w-4xl mx-auto px-8">
              <div className="text-gray-600 text-lg font-medium mb-6 text-center">
                Một số câu hỏi phổ biến:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Điều kiện tuyển sinh của MTA là gì?",
                  "Học phí của các ngành học như thế nào?",
                  "Có những ngành nào tại MTA?",
                  "Quy trình đăng ký xét tuyển ra sao?"
                ].map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(question)}
                    className="bg-white text-gray-700 px-6 py-4 rounded-xl text-left hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300 transform hover:scale-105 shadow-sm"
                  >
                    <span className="text-blue-500 mr-2">💡</span>
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat UI bình thường */}
          <div
            className={`flex flex-col h-full min-h-0 w-full transition-all duration-700 z-10 ${isNewChat ? 'opacity-0 pointer-events-none translate-y-[-32px]' : 'opacity-100 pointer-events-auto'}`}
          >
            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto px-8 py-8 space-y-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
              style={{ maxHeight: 'calc(100vh - 180px)', minHeight: 0 }}
            >
              {currentMessages.map((msg, idx) =>
                msg.content === '__loading__' ? (
                  <div key={msg.id + idx} className="flex items-center gap-3 text-white animate-pulse">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-xl text-purple-300" />
                    <span className="font-medium text-purple-300">Đang suy nghĩ...</span>
                  </div>
                ) : (
                  <ChatMessage key={msg.id} message={{ ...msg, role: msg.role as 'user' | 'assistant' }} />
                )
              )}
            </div>
            <div className="px-8 pb-12 pt-4">
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