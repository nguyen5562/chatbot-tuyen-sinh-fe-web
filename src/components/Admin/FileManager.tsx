import React, { useCallback, useEffect, useState } from 'react';
import FileUpload from './FileUpload';
import { useToast } from '../Toast/toastContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import type { FileDB } from '../../types/file';
import { fileApi } from '../../utils/apis/fileApi';

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<FileDB[]>([]);
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const reloadFiles = useCallback(async () => {
    try {
      const res = await fileApi.getFiles();
      setFiles(res.data ?? []);
    } catch {
      showToast('Tải danh sách file thất bại', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    reloadFiles();
  }, [reloadFiles]);

  const handleUpload = (file: File) => {
    setPendingFile(file);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setPendingFile(null);
  };

  const handleConfirmUpload = async () => {
    if (!pendingFile) return;
    try {
      // API behavior: 200 => chưa tồn tại, 400 => đã tồn tại (throw)
      await fileApi.checkExits(pendingFile.name);
    } catch (err) {
      if (typeof err === 'object' && err && 'statusCode' in err) {
        const code = (err as { statusCode?: number }).statusCode;
        if (code === 400) {
          showToast('File đã tồn tại!', 'warning');
          handleCloseConfirm();
          return;
        }
      }
      showToast('Không kiểm tra được tình trạng file', 'error');
      handleCloseConfirm();
      return;
    }

    try {
      await fileApi.createFile({ name: pendingFile.name });
      showToast('Upload file thành công!', 'success');
      await reloadFiles();
    } catch {
      showToast('Upload file thất bại', 'error');
    } finally {
      handleCloseConfirm();
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') return <ImageIcon sx={{ color: '#4CAF50' }} />;
    if (ext === 'pdf') return <PictureAsPdfIcon sx={{ color: '#F44336' }} />;
    if (ext === 'txt' || ext === 'doc' || ext === 'docx') return <TextSnippetIcon sx={{ color: '#2196F3' }} />;
    return <InsertDriveFileIcon sx={{ color: '#9E9E9E' }} />;
  };

  // Bỏ size/date vì không có trong types

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '1400px', 
      mx: 'auto', 
      p: 4,
      minHeight: 'calc(100vh - 72px)'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{
            fontWeight: 900, 
            color: '#2d3748',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 45, color: '#667eea' }} />
          Quản lý File
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 500, color: '#718096' }}>
          Upload và quản lý tài liệu cho hệ thống ChatBot
        </Typography>
      </Box>

      {/* Upload Section */}
      <Paper 
        sx={{ 
          p: 4, 
          borderRadius: 4, 
          mb: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700, 
            color: '#2d3748', 
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          📁 Upload Tài liệu
        </Typography>
        <FileUpload onUpload={handleUpload} />
        
        {/* Upload Guidelines */}
        <Box sx={{ mt: 3, p: 3, borderRadius: 3, bgcolor: 'rgba(102, 126, 234, 0.05)' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#667eea', mb: 1 }}>
            💡 Hướng dẫn upload:
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6, color: '#718096' }}>
            • Hỗ trợ các định dạng: PDF, DOC, DOCX<br/>
          </Typography>
        </Box>
      </Paper>

      {/* Confirm Upload Dialog */}
      <Dialog 
        open={confirmOpen} 
        onClose={handleCloseConfirm} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{ p: 2.5, bgcolor: 'rgba(102, 126, 234, 0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'rgba(102,126,234,0.15)',
              color: '#667eea'
            }}>
              <CloudUploadIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2d3748' }}>
              Xác nhận upload
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 2.5 }}>
          <Typography variant="body2" style={{paddingTop: '10px'}} sx={{ color: '#4a5568', mb: 1 }}>
            Bạn có muốn upload file sau?
          </Typography>
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 1.25,
            py: 0.75,
            borderRadius: 2,
            bgcolor: 'rgba(102,126,234,0.08)',
            color: '#2d3748',
            border: '1px solid rgba(102,126,234,0.2)'
          }}>
            <InsertDriveFileIcon sx={{ color: '#667eea' }} />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {pendingFile?.name}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button onClick={handleCloseConfirm} color="inherit" variant="outlined" sx={{ borderRadius: 2 }}>
            Hủy
          </Button>
          <Button onClick={handleConfirmUpload} color="primary" variant="contained" sx={{ borderRadius: 2, fontWeight: 700 }}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Files List Section */}
      <Paper 
        sx={{ 
          borderRadius: 4, 
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Files Header */}
        <Box sx={{ 
          p: 3, 
          background: '#667eea',
          color: 'white'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
            📚 Danh sách File ({files.length})
          </Typography>
        </Box>

        {/* Files List */}
        <List sx={{ p: 0 }}>
          {files.length === 0 ? (
            <ListItem sx={{ py: 6, textAlign: 'center' }}>
              <Box sx={{ width: '100%', textAlign: 'center' }}>
                <CloudUploadIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#718096' }}>
                  Chưa có file nào được upload
                </Typography>
                <Typography variant="body2" sx={{ color: '#718096' }}>
                  Hãy upload file đầu tiên để bắt đầu
                </Typography>
              </Box>
            </ListItem>
          ) : (
            files.map((file, index) => (
              <React.Fragment key={file.id}>
                <ListItem 
                  sx={{ 
                    py: 2,
                    px: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.05)',
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ mr: 2 }}>
                    {getFileIcon(file.name)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 0.5 }}>
                        {file.name}
                      </Typography>
                    }
                    secondary={null}
                  />
                </ListItem>
                {index < files.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>

        {/* Action Bar */}
        {files.length > 0 && (
          <Box sx={{ 
            p: 3, 
            bgcolor: 'rgba(102, 126, 234, 0.05)',
            borderTop: '1px solid rgba(102, 126, 234, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#718096' }}>
              Tổng cộng: {files.length} file
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default FileManager;