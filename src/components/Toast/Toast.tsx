import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faInfoCircle, faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { ToastType } from './ToastProvider';

const icons = {
  success: faCheckCircle,
  error: faExclamationCircle,
  info: faInfoCircle,
  warning: faExclamationTriangle,
};
const colors = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
  warning: 'bg-yellow-400 text-gray-900',
};

const Toast: React.FC<{ message: string; type: ToastType; onClose: () => void }> = ({ message, type, onClose }) => {
  return (
    <div className={`flex items-center gap-3 pr-12 pl-5 py-4 rounded-2xl shadow-lg min-w-[220px] max-w-xs animate-fadeIn relative ${colors[type]}`}
      style={{ animation: 'fadeIn 0.3s, fadeOut 0.3s 2.7s' }}
    >
      <FontAwesomeIcon icon={icons[type]} className="text-2xl" />
      <span className="font-semibold text-base flex-1">{message}</span>
      <button
        className="absolute top-1/2 -translate-y-1/2 right-3 text-white/80 hover:text-white text-xl p-2 rounded-full transition-all"
        onClick={onClose}
        aria-label="Đóng"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

export default Toast; 