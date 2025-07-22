import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
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

const Toast: React.FC<{ message: string; type: ToastType }> = ({ message, type }) => {
  return (
    <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg min-w-[220px] max-w-xs animate-fadeIn ${colors[type]}`}
      style={{ animation: 'fadeIn 0.3s, fadeOut 0.3s 2.7s' }}
    >
      <FontAwesomeIcon icon={icons[type]} className="text-2xl" />
      <span className="font-semibold text-base">{message}</span>
    </div>
  );
};

export default Toast; 