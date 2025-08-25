import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import type { Chat } from '../../types/chat';

interface Props {
  chats?: Chat[];
  currentChatId: string | null;
  onSelect?: (id: string) => void;
  onNewChat?: () => void;
  loggedIn?: boolean;
}

const ChatHistory: React.FC<Props> = ({ chats, currentChatId, onSelect, onNewChat }) => {
  const displayChats = chats && chats.length > 0 ? chats : [{ id: 'g1', title: 'Cuộc hội thoại mới' }];

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      {/* Header với brand */}
      <Box mb={4} textAlign="center">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 1
          }}
        >
          ChatBot MTA
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Hỗ trợ tuyển sinh 24/7
        </Typography>
      </Box>

      {/* New Chat Button */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onNewChat}
        sx={{
          mb: 3,
          fontWeight: 700,
          fontSize: 16,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          py: 1.5,
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        Cuộc hội thoại mới
      </Button>

      {/* Chat List */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            fontSize: 12,
            mb: 1
          }}
        >
          Lịch sử chat
        </Typography>
      </Box>

      <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
        {displayChats.map((chat) => {
          const selected = chat.id === currentChatId;
          return (
            <ListItem key={chat.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={selected}
                onClick={() => onSelect && onSelect(chat.id)}
                sx={{
                  borderRadius: 3,
                  minHeight: 56,
                  background: selected
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'transparent',
                  color: selected ? 'white' : 'text.primary',
                  boxShadow: selected ? '0 8px 32px rgba(102, 126, 234, 0.3)' : 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: selected
                      ? 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                      : 'rgba(102, 126, 234, 0.08)',
                    transform: 'translateX(4px)',
                    boxShadow: selected
                      ? '0 12px 40px rgba(102, 126, 234, 0.4)'
                      : '0 4px 20px rgba(102, 126, 234, 0.1)'
                  },
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  },
                  '&.Mui-selected:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selected ? 'white' : '#667eea',
                    minWidth: 44
                  }}
                >
                  <ChatBubbleOutlineIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      noWrap
                      sx={{
                        color: selected ? 'white' : 'text.primary',
                        fontWeight: selected ? 700 : 600,
                        fontSize: 15
                      }}
                    >
                      {chat.title}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box
        sx={{
          mt: 4,
          pt: 3,
          borderTop: '1px solid rgba(102, 126, 234, 0.1)',
          textAlign: 'center'
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            fontWeight: 500
          }}
        >
          <span style={{ fontSize: '16px' }}>🎓</span>
          Học viện Công nghệ MTA
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatHistory; 