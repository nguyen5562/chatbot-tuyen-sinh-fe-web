import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: (msg: string) => void;
};

const ChatInput: React.FC<Props> = ({ value, onChange, onSend }) => {
  const [focus, setFocus] = useState(false);
  return (
    <form
      className="flex gap-3"
      onSubmit={e => {
        e.preventDefault();
        onSend(value);
      }}
    >
      <div className={`flex-1 flex items-center bg-white border border-gray-200 rounded-full shadow-2xl px-6 py-3 text-lg transition-all duration-200 ${focus ? 'ring-4 ring-blue-200' : ''}`}>
        <input
          className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-lg"
          type="text"
          placeholder="Nhập tin nhắn..."
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-blue-700 transition-all"
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </form>
  );
};

export default ChatInput; 