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
    <Box
      display="flex"
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      alignItems="flex-start"
      mb={4}
      className="animate-in slide-in-from-bottom-4 fade-in duration-500"
    >
      {!isUser && (
        <Avatar
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            mr: 3,
            width: 48,
            height: 48,
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            border: '3px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <SmartToyIcon fontSize="large" />
        </Avatar>
      )}

      <Paper
        elevation={0}
        sx={{
          maxWidth: 560,
          px: 4,
          py: 3,
          borderRadius: 4,
          fontSize: 16,
          fontWeight: 500,
          lineHeight: 1.6,
          position: 'relative',
          background: isUser
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          color: isUser ? 'white' : 'text.primary',
          border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: isUser
            ? '0 12px 40px rgba(102, 126, 234, 0.4)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          transform: 'translateY(0)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: isUser
              ? '0 16px 48px rgba(102, 126, 234, 0.5)'
              : '0 12px 40px rgba(0, 0, 0, 0.15)'
          },
          // Custom tail for speech bubble effect
          '&::before': {
            content: '""',
            position: 'absolute',
            width: 0,
            height: 0,
            border: '12px solid transparent',
            ...(isUser ? {
              display: 'none'
            } : {
              left: -12,
              top: 20,
              borderRightColor: 'rgba(255, 255, 255, 0.95)'
            })
          }
        }}
      >
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-line',
            color: isUser ? 'white' : 'text.primary',
            fontWeight: 500,
            fontSize: 16,
            lineHeight: 1.6
          }}
        >
          {message.content}
        </Typography>
      </Paper>

      {isUser && (
        <Avatar
          sx={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)',
            color: 'white',
            ml: 3,
            width: 48,
            height: 48,
            boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
            border: '3px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <PersonIcon fontSize="large" />
        </Avatar>
      )}
    </Box>
  );
};

export default ChatMessage; 