import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
      <div className="max-w-md w-full mx-auto mt-16 p-10 bg-white/90 rounded-3xl shadow-2xl flex flex-col items-center">
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-6xl mb-6 animate-bounce" />
        <h1 className="text-3xl font-bold mb-2 text-gray-800">404 - Không tìm thấy trang</h1>
        <p className="mb-6 text-gray-600 text-center">Trang bạn truy cập không tồn tại hoặc đã bị di chuyển.</p>
        <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold shadow transition-all">Về trang chủ</Link>
      </div>
    </div>
  );
};

export default NotFoundPage; 