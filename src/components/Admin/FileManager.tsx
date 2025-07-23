import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { useToast } from '../Toast/ToastProvider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Định nghĩa kiểu file
 type FileItem = {
  name: string;
  size: number;
};

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const { showToast } = useToast();

  const handleUpload = (file: File) => {
    setFiles((prev) => [...prev, { name: file.name, size: file.size }]);
    showToast('Upload file thành công!', 'success');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', mt: 2 }}>
      <Typography variant="h4" fontWeight={800} color="primary" mb={4} display="flex" alignItems="center" justifyContent="center" gap={2}>
        <CloudUploadIcon fontSize="large" />
        Quản lý file
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <FileUpload onUpload={handleUpload} />
      </Paper>
      <Typography variant="h6" fontWeight={700} color="primary" mb={2}>
        Danh sách file đã upload
      </Typography>
      <Paper sx={{ borderRadius: 3, boxShadow: 2 }}>
        <List>
          {files.length === 0 && (
            <ListItem>
              <ListItemText primary={<Typography color="text.secondary">Chưa có file nào được upload.</Typography>} />
            </ListItem>
          )}
          {files.map((f, i) => (
            <React.Fragment key={i}>
              <ListItem secondaryAction={
                <Typography variant="body2" color="text.secondary">{(f.size / 1024).toFixed(2)} KB</Typography>
              }>
                <ListItemText primary={f.name} />
              </ListItem>
              {i < files.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default FileManager; 