import React, { useState } from 'react';
import UserMenu from '../components/Auth/UserMenu';
import ChatHistory from '../components/Chat/ChatHistory';
import { isLoggedIn } from '../utils/auth';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Quản lý state lịch sử chat ở layout để truyền xuống ChatPage
  const [chats, setChats] = useState([
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

  const loggedIn = isLoggedIn();

  const handleNewChat = () => {
    const newId = Date.now().toString();
    setChats(prev => [
      { id: newId, title: 'Cuộc trò chuyện mới', messages: [] },
      ...prev,
    ]);
    setCurrentChatId(newId);
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-gradient-to-br from-gray-100 to-blue-100">
      <header className="h-16 bg-gradient-to-r from-blue-700 to-blue-500 text-white flex items-center justify-between px-8 shadow-lg gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-extrabold tracking-wide drop-shadow">ChatGPT Clone</span>
        </div>
        <UserMenu />
      </header>
      <div className="flex flex-1 min-h-0 h-0">
        {loggedIn && (
          <aside className="w-72 h-full flex flex-col bg-white/90 border-r border-blue-100 p-2 pt-4 z-10 min-h-0">
            <ChatHistory
              chats={chats.map(({ id, title }) => ({ id, title }))}
              currentChatId={currentChatId}
              onSelect={setCurrentChatId}
              onNewChat={handleNewChat}
            />
          </aside>
        )}
        <main className="flex-1 flex flex-col h-full min-h-0">{
          React.cloneElement(children as React.ReactElement, {
            chats,
            setChats,
            currentChatId,
            setCurrentChatId,
          })
        }</main>
      </div>
    </div>
  );
};

export default MainLayout; 