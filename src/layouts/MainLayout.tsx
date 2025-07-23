import React, { useState, useRef } from 'react';
import UserMenu from '../components/Auth/UserMenu';
import ChatHistory from '../components/Chat/ChatHistory';
import { isLoggedIn } from '../utils/auth';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

const MainLayout: React.FC<{ children: React.ReactElement<any> }> = ({ children }) => {
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
  const guestNewChatRef = useRef<() => void>();
  const setShowInputAtBottomRef = useRef<(v: boolean) => void>();

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
      guestNewChatRef.current && guestNewChatRef.current();
    }
    setShowInputAtBottomRef.current && setShowInputAtBottomRef.current(false);
  };

  // Hàm reset khi logout
  const handleLogout = () => {
    setChats([]);
    setCurrentChatId('');
    guestNewChatRef.current && guestNewChatRef.current();
    setShowInputAtBottomRef.current && setShowInputAtBottomRef.current(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(to right, #1976d2, #42a5f5)' }} elevation={4}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: 1, textShadow: '0 2px 8px #0002' }}>ChatGPT Clone</span>
          </Box>
          <UserMenu onLogout={handleLogout} />
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Box sx={{ width: 288, bgcolor: 'white', borderRight: 1, borderColor: 'divider', p: 0, zIndex: 10, minHeight: 0 }}>
          <ChatHistory
            chats={chats.map(({ id, title }) => ({ id, title }))}
            currentChatId={currentChatId}
            onSelect={setCurrentChatId}
            onNewChat={handleNewChat}
            loggedIn={loggedIn}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {React.cloneElement(children, {
            chats,
            setChats,
            currentChatId,
            setCurrentChatId,
            loggedIn,
            setGuestNewChatRef: (fn: () => void) => { guestNewChatRef.current = fn; },
            setShowInputAtBottomRef: (fn: (v: boolean) => void) => { setShowInputAtBottomRef.current = fn; },
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout; 