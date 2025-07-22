import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faPlus } from '@fortawesome/free-solid-svg-icons';

type Chat = {
  id: string;
  title: string;
};

type Props = {
  chats: Chat[];
  currentChatId: string;
  onSelect: (id: string) => void;
  onNewChat?: () => void;
};

const ChatHistory: React.FC<Props> = ({ chats, currentChatId, onSelect, onNewChat }) => {
  return (
    <div className="flex flex-col h-full w-full">
      <button
        className="flex items-center gap-2 px-4 py-2 mb-2 rounded hover:bg-blue-100 text-blue-700 font-semibold text-base transition-all"
        onClick={onNewChat}
      >
        <FontAwesomeIcon icon={faPlus} />
        New Chat
      </button>
      <ul className="flex-1 overflow-y-auto select-none">
        {chats.map((chat) => (
          <li key={chat.id}>
            <button
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 text-left
                ${chat.id === currentChatId ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-800'}`}
              onClick={() => onSelect(chat.id)}
            >
              <FontAwesomeIcon icon={faCommentDots} className="text-lg" />
              <span className="truncate">{chat.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatHistory; 