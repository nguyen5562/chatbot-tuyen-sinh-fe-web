import React, { useRef, useEffect } from 'react';
import ChatMessage from '../components/Chat/ChatMessage';
import ChatInput from '../components/Chat/ChatInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { isLoggedIn } from '../utils/auth';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
interface Chat {
  id: string;
  title: string;
  messages: Message[];
}
interface Props {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  currentChatId: string;
  setCurrentChatId: (id: string) => void;
}

const ChatPage: React.FC<Props> = ({ chats, setChats, currentChatId }) => {
  const chatRef = useRef<HTMLDivElement>(null);
  const currentChat = chats.find((c) => c.id === currentChatId);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [currentChat, loading]);

  const handleSend = (msg: string) => {
    if (!msg.trim()) return;
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
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: chat.messages.map((m) =>
                  m.content === '__loading__'
                    ? { ...m, content: 'Đây là phản hồi mẫu.' }
                    : m
                ),
              }
            : chat
        )
      );
      setLoading(false);
    }, 1000);
  };

  if (!isLoggedIn()) return null;

  return (
    <div className="flex flex-col h-full min-h-0 w-full">
      <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-8 space-y-6 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent bg-transparent">
        {currentChat?.messages.map((msg, idx) =>
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
  );
};

export default ChatPage; 