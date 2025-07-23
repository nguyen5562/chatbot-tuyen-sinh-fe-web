import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faUsers } from '@fortawesome/free-solid-svg-icons';

type Props = {
  selectedTab: 'file' | 'user';
  setSelectedTab: (tab: 'file' | 'user') => void;
};

const AdminSidebar: React.FC<Props> = ({ selectedTab, setSelectedTab }) => {
  return (
    <aside className="w-72 bg-gradient-to-b from-gray-900 to-blue-900 text-white flex flex-col p-6 h-full shadow-2xl">
      <nav className="flex-1">
        <ul className="space-y-3">
          <li>
            <button
              className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all text-lg font-medium w-full text-left ${selectedTab === 'file' ? 'bg-blue-600 text-white' : 'hover:bg-blue-700/70 text-white/80'}`}
              onClick={() => setSelectedTab('file')}
            >
              <FontAwesomeIcon icon={faFileAlt} className="text-xl" />
              Quản lý file
            </button>
          </li>
          <li>
            <button
              className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all text-lg font-medium w-full text-left ${selectedTab === 'user' ? 'bg-blue-600 text-white' : 'hover:bg-blue-700/70 text-white/80'}`}
              onClick={() => setSelectedTab('user')}
            >
              <FontAwesomeIcon icon={faUsers} className="text-xl" />
              Quản lý người dùng
            </button>
          </li>
        </ul>
      </nav>
      <div className="mb-6" />
    </aside>
  );
};

export default AdminSidebar; 