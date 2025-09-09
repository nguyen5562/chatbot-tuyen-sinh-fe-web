import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { useToast } from '../Toast/toastContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Định nghĩa kiểu file
type FileItem = {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
};

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const { showToast } = useToast();

  const handleUpload = (file: File) => {
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date()
    };
    setFiles((prev) => [newFile, ...prev]);
    showToast('Upload file thành công!', 'success');
  };

  const handleDelete = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    showToast('Xóa file thành công!', 'success');
  };

  const getFileIcon = (fileName: string, fileType: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (fileType.startsWith('image/')) return <ImageIcon sx={{ color: '#4CAF50' }} />;
    if (ext === 'pdf') return <PictureAsPdfIcon sx={{ color: '#F44336' }} />;
    if (ext === 'txt' || ext === 'doc' || ext === 'docx') return <TextSnippetIcon sx={{ color: '#2196F3' }} />;
    return <InsertDriveFileIcon sx={{ color: '#9E9E9E' }} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('vi-VN');
  };

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
          variant="h3" 
          sx={{
            fontWeight: 900, 
            color: '#2d3748',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: '#667eea' }} />
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
            • Hỗ trợ các định dạng: PDF, DOC, DOCX, TXT, JPG, PNG<br/>
            • Kích thước tối đa: 10MB<br/>
            • Tên file nên có ý nghĩa và dễ tìm kiếm
          </Typography>
        </Box>
      </Paper>

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
            <Chip 
              label={`${formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}`} 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 600
              }} 
            />
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
                    {getFileIcon(file.name, file.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 0.5 }}>
                        {file.name}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Chip 
                          label={formatFileSize(file.size)} 
                          size="small" 
                          sx={{ bgcolor: 'rgba(102, 126, 234, 0.1)', color: '#667eea', fontWeight: 600 }}
                        />
                        <Typography variant="caption" sx={{ color: '#718096' }}>
                          {formatDate(file.uploadDate)}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small"
                        sx={{ 
                          color: '#2196F3',
                          '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.1)' }
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton 
                        size="small"
                        sx={{ 
                          color: '#4CAF50',
                          '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.1)' }
                        }}
                      >
                        <DownloadIcon />
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={() => handleDelete(file.id)}
                        sx={{ 
                          color: '#F44336',
                          '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)' }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
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
              Tổng cộng: {files.length} file • {formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setFiles([]);
                showToast('Đã xóa tất cả file!', 'info');
              }}
              sx={{ 
                borderRadius: 3,
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(244, 67, 54, 0.3)'
                }
              }}
            >
              Xóa tất cả
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default FileManager;