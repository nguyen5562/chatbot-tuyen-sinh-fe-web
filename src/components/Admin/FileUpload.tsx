import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

type Props = {
  onUpload: (file: File) => void;
};

const FileUpload: React.FC<Props> = ({ onUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        className="block mb-2"
        onChange={handleChange}
      />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        <FontAwesomeIcon icon={faUpload} />
        Chọn file
      </button>
    </div>
  );
};

export default FileUpload; 