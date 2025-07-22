import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faUsers } from '@fortawesome/free-solid-svg-icons';

type Props = {
  selectedTab: 'file' | 'user';
  setSelectedTab: (tab: 'file' | 'user') => void;
};

const AdminSidebar: React.FC<Props> = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="w-60 h-screen bg-white flex flex-col justify-between">
      <div className="flex flex-col gap-2 pt-4">
        <button
          className={`flex items-center gap-3 text-lg font-semibold px-4 py-3 text-left transition-all ${selectedTab === 'file' ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 text-blue-700'}`}
          onClick={() => setSelectedTab('file')}
        >
          <FontAwesomeIcon icon={faFileAlt} />
          Quản lý file
        </button>
        <button
          className={`flex items-center gap-3 text-lg font-semibold px-4 py-3 text-left transition-all ${selectedTab === 'user' ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 text-blue-700'}`}
          onClick={() => setSelectedTab('user')}
        >
          <FontAwesomeIcon icon={faUsers} />
          Quản lý người dùng
        </button>
      </div>
      <div className="mb-6" />
    </div>
  );
};

export default AdminSidebar; 