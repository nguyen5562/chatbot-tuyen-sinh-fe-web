import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faUserShield, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <aside className="w-72 bg-gradient-to-b from-gray-900 to-blue-900 text-white flex flex-col p-6 h-full shadow-2xl rounded-r-3xl">
      <div className="mb-10 flex items-center gap-3">
        <FontAwesomeIcon icon={faComments} className="text-3xl" />
        <h2 className="text-2xl font-extrabold tracking-wide">ChatGPT</h2>
      </div>
      <nav className="flex-1">
        <ul className="space-y-3">
          <li>
            <Link to="/" className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-blue-700/70 transition-all text-lg font-medium">
              <FontAwesomeIcon icon={faComments} className="text-xl" />
              Lịch sử chat
            </Link>
          </li>
          <li>
            <Link to="/admin" className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-blue-700/70 transition-all text-lg font-medium">
              <FontAwesomeIcon icon={faUserShield} className="text-xl" />
              Admin
            </Link>
          </li>
        </ul>
      </nav>
      <button className="mt-10 py-3 px-4 bg-red-600 rounded-xl hover:bg-red-700 flex items-center gap-3 justify-center text-lg font-semibold shadow transition-all" onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} className="text-xl" />
        Đăng xuất
      </button>
    </aside>
  );
};

export default Sidebar; 