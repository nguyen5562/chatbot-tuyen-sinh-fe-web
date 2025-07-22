import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot } from '@fortawesome/free-solid-svg-icons';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type Props = {
  message: Message;
};

const ChatMessage: React.FC<Props> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end animate-fadeIn`}>
      {!isUser && (
        <span className="mr-3 text-gray-500 text-2xl">
          <FontAwesomeIcon icon={faRobot} />
        </span>
      )}
      <div className={`max-w-lg px-6 py-4 rounded-3xl shadow-xl text-lg font-medium transition-all duration-300 ${isUser ? 'bg-blue-500 text-white rounded-br-md' : 'bg-white text-gray-900 rounded-bl-md border border-blue-100'}`}>
        {message.content}
      </div>
      {isUser && (
        <span className="ml-3 text-blue-500 text-2xl">
          <FontAwesomeIcon icon={faUser} />
        </span>
      )}
    </div>
  );
};

export default ChatMessage; 