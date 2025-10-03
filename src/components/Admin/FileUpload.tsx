import React, { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface Props {
  onUpload: (file: File) => void;
}

const FileUpload: React.FC<Props> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <Box>
      {/* Drag & Drop Zone */}
      <Paper
        sx={{
          border: dragActive 
            ? '3px dashed #667eea' 
            : '2px dashed rgba(102, 126, 234, 0.3)',
          borderRadius: 4,
          p: 6,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: dragActive 
            ? 'rgba(102, 126, 234, 0.05)' 
            : 'rgba(102, 126, 234, 0.02)',
          '&:hover': {
            border: '2px dashed #667eea',
            background: 'rgba(102, 126, 234, 0.05)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)'
          }
        }}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        elevation={0}
      >
        <CloudUploadIcon 
          sx={{ 
            fontSize: 64, 
            color: dragActive ? '#667eea' : 'rgba(102, 126, 234, 0.6)',
            mb: 2,
            transition: 'all 0.3s ease'
          }} 
        />
        
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700, 
            color: dragActive ? '#667eea' : 'text.primary',
            mb: 1,
            transition: 'all 0.3s ease'
          }}
        >
          {dragActive ? 'Thả file vào đây!' : 'Kéo thả file vào đây'}
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: 3, fontWeight: 500 }}
        >
          hoặc click để chọn file từ máy tính
        </Typography>

        <Button
          variant="contained"
          startIcon={<UploadFileIcon />}
          sx={{ 
            fontWeight: 700,
            fontSize: 16,
            px: 4,
            py: 1.5,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
              transform: 'translateY(-2px)'
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Chọn File
        </Button>
      </Paper>

      {/* File Input (Hidden) */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
      />
    </Box>
  );
};

export default FileUpload; 