import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '../components/Toast/ToastProvider';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(username, password);
    showToast('Đăng ký thành công!', 'success');
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
      <div className="max-w-md w-full mx-auto mt-16 p-10 bg-white/90 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-extrabold mb-6 text-green-700 flex items-center gap-3 justify-center">
          <FontAwesomeIcon icon={faUserPlus} className="text-2xl" />
          Đăng ký
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 text-xl">
              <FontAwesomeIcon icon={faUser} />
            </span>
            <input
              className="w-full border-none rounded-full px-6 py-3 shadow text-lg outline-none pl-12 focus:ring-4 focus:ring-green-200 transition-all"
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 text-xl">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input
              className="w-full border-none rounded-full px-6 py-3 shadow text-lg outline-none pl-12 focus:ring-4 focus:ring-green-200 transition-all"
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-full text-lg font-bold shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faUserPlus} />
            Đăng ký
          </button>
        </form>
        <div className="mt-6 text-center">
          <span>Đã có tài khoản? </span>
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 