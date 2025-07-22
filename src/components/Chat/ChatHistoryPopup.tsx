import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faTimes } from '@fortawesome/free-solid-svg-icons';

type Chat = {
  id: string;
  title: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  chats: Chat[];
  currentChatId: string;
  onSelect: (id: string) => void;
};

const ChatHistoryPopup: React.FC<Props> = ({ open, onClose, chats, currentChatId, onSelect }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-80 relative animate-fadeInUp">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h3 className="font-bold mb-4 text-lg text-blue-700 flex items-center gap-2">
          <FontAwesomeIcon icon={faCommentDots} />
          Lịch sử chat
        </h3>
        <ul className="space-y-3">
          {chats.map((chat) => (
            <li key={chat.id}>
              <button
                className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200 shadow hover:scale-[1.03] hover:bg-blue-100/80 ${chat.id === currentChatId ? 'bg-blue-600 text-white scale-105 shadow-lg' : 'bg-gray-50 text-gray-800'}`}
                onClick={() => { onSelect(chat.id); onClose(); }}
              >
                <FontAwesomeIcon icon={faCommentDots} className="text-xl" />
                {chat.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatHistoryPopup; 