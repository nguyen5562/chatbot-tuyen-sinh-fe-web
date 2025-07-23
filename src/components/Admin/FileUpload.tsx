import React, { useRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface Props {
  onUpload: (file: File) => void;
}

const FileUpload: React.FC<Props> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Typography variant="body1" fontWeight={500}>
        Choose File
      </Typography>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button
        variant="contained"
        startIcon={<UploadFileIcon />}
        onClick={() => fileInputRef.current?.click()}
        sx={{ fontWeight: 600 }}
      >
        Chọn file
      </Button>
    </Box>
  );
};

export default FileUpload; 