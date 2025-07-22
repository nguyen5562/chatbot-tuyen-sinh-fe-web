import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOutAlt, faUserShield, faChevronDown, faSignInAlt, faHome } from '@fortawesome/free-solid-svg-icons';
import { logout, isAdmin, isLoggedIn } from '../../utils/auth';
import { useToast } from '../Toast/ToastProvider';

interface UserMenuProps {
  onLogout?: () => void;
  isAdminPage?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ onLogout, isAdminPage }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('user') || 'User';
  const admin = isAdmin();
  const loggedIn = isLoggedIn();
  const { showToast } = useToast();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleLogout = () => {
    logout();
    showToast('Đăng xuất thành công!', 'info');
    onLogout && onLogout();
    navigate('/');
  };

  if (isAdminPage) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all shadow text-white text-lg font-semibold focus:outline-none"
          onClick={() => setOpen((v) => !v)}
        >
          <FontAwesomeIcon icon={faUserCircle} className="text-3xl" />
          <span className="hidden md:inline-block font-bold">{username}</span>
          <FontAwesomeIcon icon={faChevronDown} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn">
            <button
              className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-blue-50 text-lg font-medium transition-all"
              onClick={() => navigate('/')}
            >
              <FontAwesomeIcon icon={faHome} className="text-xl text-blue-600" />
              Go to home page
            </button>
            <button
              className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-blue-50 text-lg font-medium transition-all"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="text-xl text-red-500" />
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all shadow text-white text-lg font-semibold focus:outline-none"
        onClick={() => navigate('/login')}
      >
        <FontAwesomeIcon icon={faSignInAlt} className="text-2xl" />
        <span className="font-bold">Đăng nhập</span>
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all shadow text-white text-lg font-semibold focus:outline-none"
        onClick={() => setOpen((v) => !v)}
      >
        <FontAwesomeIcon icon={faUserCircle} className="text-3xl" />
        <span className="hidden md:inline-block font-bold">{username}</span>
        <FontAwesomeIcon icon={faChevronDown} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn">
          {admin && (
            <button
              className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-blue-50 text-lg font-medium transition-all"
              onClick={() => navigate('/admin')}
            >
              <FontAwesomeIcon icon={faUserShield} className="text-xl text-blue-600" />
              Go to admin page
            </button>
          )}
          <button
            className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-blue-50 text-lg font-medium transition-all"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="text-xl text-red-500" />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 