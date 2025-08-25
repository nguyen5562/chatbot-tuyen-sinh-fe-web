import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSend: (msg: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<Props> = ({ value, onChange, onSend, disabled }) => {
  const [focus, setFocus] = useState(false);

  return (
    <Box display="flex" alignItems="center" gap={3}>
      <Paper
        component="form"
        sx={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          p: 2,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: focus
            ? '2px solid transparent'
            : '1px solid rgba(255, 255, 255, 0.2)',
          backgroundImage: focus
            ? 'linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), linear-gradient(135deg, #667eea, #764ba2)'
            : 'none',
          backgroundOrigin: 'border-box',
          backgroundClip: focus ? 'padding-box, border-box' : 'padding-box',
          boxShadow: focus
            ? '0 12px 40px rgba(102, 126, 234, 0.3)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          transform: focus ? 'translateY(-2px)' : 'translateY(0)',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)'
          }
        }}
        onSubmit={e => {
          e.preventDefault();
          if (!disabled && value.trim()) onSend(value);
        }}
        elevation={0}
      >
        <TextField
          variant="standard"
          placeholder="Nhập câu hỏi của bạn..."
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: 16,
              fontWeight: 500,
              color: '#333',
              '&::placeholder': {
                color: '#888',
                opacity: 1
              }
            }
          }}
          sx={{
            flex: 1,
            mx: 1,
            bgcolor: 'transparent',
            '& input': {
              padding: '8px 0'
            }
          }}
          disabled={disabled}
          multiline
          maxRows={4}
        />
      </Paper>

      <IconButton
        type="submit"
        onClick={e => {
          e.preventDefault();
          if (!disabled && value.trim()) onSend(value);
        }}
        sx={{
          background: value.trim()
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'rgba(255, 255, 255, 0.3)',
          color: value.trim() ? 'white' : 'rgba(255, 255, 255, 0.7)',
          width: 56,
          height: 56,
          boxShadow: value.trim()
            ? '0 8px 32px rgba(102, 126, 234, 0.4)'
            : '0 4px 16px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          transform: focus && value.trim() ? 'scale(1.1)' : 'scale(1)',
          '&:hover': {
            background: value.trim()
              ? 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
              : 'rgba(255, 255, 255, 0.4)',
            boxShadow: value.trim()
              ? '0 12px 40px rgba(102, 126, 234, 0.5)'
              : '0 6px 24px rgba(0, 0, 0, 0.15)',
            transform: 'scale(1.05)'
          },
          '&:disabled': {
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'rgba(255, 255, 255, 0.5)',
            cursor: 'not-allowed'
          }
        }}
        disabled={disabled || !value.trim()}
      >
        <FontAwesomeIcon
          icon={faPaperPlane}
          style={{
            fontSize: '18px',
            transition: 'transform 0.2s ease'
          }}
        />
      </IconButton>
    </Box>
  );
};

export default ChatInput; 