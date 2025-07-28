import React, { useState, useRef } from 'react';
import UserMenu from '../components/Auth/UserMenu';
import ChatHistory from '../components/Chat/ChatHistory';
import { isLoggedIn } from '../utils/auth';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import type { Props as ChatPageProps } from '../pages/ChatPage';
import type { Chat } from '../pages/ChatPage';

const MainLayout: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([
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
  const guestNewChatRef = useRef<() => void>(null);
  const setShowInputAtBottomRef = useRef<(v: boolean) => void>(null);
  const [guestChats, setGuestChats] = useState<Chat[]>([
    { id: 'g1', title: 'Cuộc hội thoại mới', messages: [] },
  ]);
  const [guestCurrentChatId, setGuestCurrentChatId] = useState('g1');

  const loggedIn = isLoggedIn();

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
    if (setShowInputAtBottomRef.current) setShowInputAtBottomRef.current(false);
  };

  // Hàm reset khi logout
  const handleLogout = () => {
    setChats([]);
    setCurrentChatId('');
    setGuestChats([{ id: 'g1', title: 'Cuộc hội thoại mới', messages: [] }]);
    setGuestCurrentChatId('g1');
    if (guestNewChatRef.current) guestNewChatRef.current();
    if (setShowInputAtBottomRef.current) setShowInputAtBottomRef.current(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(to right, #1976d2, #42a5f5)' }} elevation={4}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: 1, textShadow: '0 2px 8px #0002' }}>ChatBot MTA</span>
          </Box>
          <UserMenu onLogout={handleLogout} />
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Box sx={{ width: 288, bgcolor: 'white', borderRight: 1, borderColor: 'divider', p: 0, zIndex: 10, minHeight: 0 }}>
          <ChatHistory
            chats={(loggedIn ? chats : guestChats).map(({ id, title }) => ({ id, title }))}
            currentChatId={loggedIn ? currentChatId : guestCurrentChatId}
            onSelect={loggedIn ? setCurrentChatId : setGuestCurrentChatId}
            onNewChat={handleNewChat}
            loggedIn={loggedIn}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {React.isValidElement(children) && (children.type as { name?: string }).name === 'ChatPage'
            ? React.cloneElement(children as React.ReactElement<ChatPageProps>, {
                chats,
                setChats,
                currentChatId,
                setCurrentChatId,
                loggedIn,
                setShowInputAtBottomRef: (fn: (v: boolean) => void) => { setShowInputAtBottomRef.current = fn; },
                guestChats,
                setGuestChats,
                guestCurrentChatId,
                setGuestCurrentChatId,
              })
            : children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout; 