import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type Props = {
  message: Message;
};

const ChatMessage: React.FC<Props> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <Box display="flex" justifyContent={isUser ? 'flex-end' : 'flex-start'} alignItems="flex-end" className="animate-fadeIn" mb={2}>
      {!isUser && (
        <Avatar sx={{ bgcolor: 'grey.200', color: 'primary.main', mr: 2, width: 40, height: 40 }}>
          <SmartToyIcon fontSize="large" />
        </Avatar>
      )}
      <Paper
        elevation={isUser ? 6 : 2}
        sx={{
          maxWidth: 480,
          px: 3,
          py: 2,
          borderRadius: 6,
          fontSize: 18,
          fontWeight: 500,
          bgcolor: isUser ? 'primary.main' : 'background.paper',
          color: isUser ? 'white' : 'text.primary',
          borderBottomRightRadius: isUser ? 12 : 24,
          borderBottomLeftRadius: !isUser ? 12 : 24,
          border: !isUser ? '1px solid #90caf9' : undefined,
          boxShadow: isUser ? 6 : 2,
        }}
      >
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{message.content}</Typography>
      </Paper>
      {isUser && (
        <Avatar sx={{ bgcolor: 'primary.light', color: 'white', ml: 2, width: 40, height: 40 }}>
          <PersonIcon fontSize="large" />
        </Avatar>
      )}
    </Box>
  );
};

export default ChatMessage; 