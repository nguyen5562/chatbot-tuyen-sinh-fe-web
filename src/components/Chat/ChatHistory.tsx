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

const SELECTED_BG = '#1565c0'; // blue[800]
const SELECTED_BG_HOVER = '#0d47a1'; // blue[900]

interface Chat {
  id: string;
  title: string;
}

interface Props {
  chats?: Chat[];
  currentChatId?: string;
  onSelect?: (id: string) => void;
  onNewChat?: () => void;
  loggedIn?: boolean;
}

const ChatHistory: React.FC<Props> = ({ chats, currentChatId, onSelect, onNewChat }) => {
  const displayChats = chats && chats.length > 0 ? chats : [{ id: 'g1', title: 'Cuộc hội thoại mới' }];
  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%" pt={3}>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={onNewChat}
        sx={{ mb: 2, fontWeight: 600, color: 'primary.main', borderRadius: 2, borderColor: 'primary.light', py: 1.5 }}
      >
        New Chat
      </Button>
      <List sx={{ flex: 1, overflowY: 'auto', p: 0, pt: 1 }}>
        {displayChats.map((chat) => {
          const selected = chat.id === currentChatId;
          return (
            <ListItem key={chat.id} disablePadding>
              <ListItemButton
                selected={selected}
                onClick={() => onSelect && onSelect(chat.id)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  color: selected ? 'white' : 'text.primary',
                  bgcolor: selected ? SELECTED_BG : 'transparent',
                  opacity: selected ? 1 : undefined,
                  '&:hover': { bgcolor: selected ? SELECTED_BG_HOVER : 'grey.100', opacity: 1 },
                  '&.Mui-selected': { backgroundColor: SELECTED_BG, opacity: 1 },
                  '&.Mui-selected:hover': { backgroundColor: SELECTED_BG_HOVER, opacity: 1 },
                }}
              >
                <ListItemIcon sx={{ color: selected ? 'white' : SELECTED_BG, opacity: 1 }}>
                  <ChatBubbleOutlineIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography noWrap sx={{ color: selected ? 'white' : 'text.primary', fontWeight: selected ? 700 : 500, opacity: 1 }}>{chat.title}</Typography>}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default ChatHistory; 