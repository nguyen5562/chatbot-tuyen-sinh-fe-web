import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '../Toast/ToastProvider';

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
    <div className="w-full">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-700 flex items-center gap-3 justify-center">
        <FontAwesomeIcon icon={faFileUpload} className="text-2xl" />
        Quản lý file
      </h2>
      <FileUpload onUpload={handleUpload} />
      <div className="mt-8">
        <h3 className="font-semibold mb-2 text-lg text-blue-700">Danh sách file đã upload</h3>
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li key={i} className="border rounded-xl px-4 py-3 flex justify-between items-center bg-gray-50 shadow">
              <span className="font-medium">{f.name}</span>
              <span className="text-xs text-gray-500">{(f.size / 1024).toFixed(2)} KB</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileManager; 