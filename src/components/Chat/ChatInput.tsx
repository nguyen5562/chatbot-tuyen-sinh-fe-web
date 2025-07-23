import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSend: (msg: string) => void;
}

const ChatInput: React.FC<Props> = ({ value, onChange, onSend }) => {
  const [focus, setFocus] = useState(false);
  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Paper
        component="form"
        sx={{ display: 'flex', alignItems: 'center', flex: 1, p: 1.5, borderRadius: 8, boxShadow: 3 }}
        onSubmit={e => {
          e.preventDefault();
          onSend(value);
        }}
        elevation={3}
      >
        <TextField
          variant="standard"
          placeholder="Nhập tin nhắn..."
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          InputProps={{ disableUnderline: true }}
          sx={{ flex: 1, mx: 1, fontSize: 18, bgcolor: 'transparent' }}
        />
      </Paper>
      <Box
        component="button"
        type="submit"
        onClick={e => { e.preventDefault(); onSend(value); }}
        sx={{
          ml: 1,
          bgcolor: focus ? 'primary.main' : 'primary.light',
          color: 'white',
          borderRadius: 2,
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 3,
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.2s',
          '&:hover': { bgcolor: 'primary.main' },
        }}
      >
        <FontAwesomeIcon icon={faPaperPlane} size="lg" />
      </Box>
    </Box>
  );
};

export default ChatInput; 