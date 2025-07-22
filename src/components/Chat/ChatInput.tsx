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
      <input
        className={`flex-1 border-none rounded-full px-6 py-3 shadow-lg text-lg outline-none transition-all duration-200 ${focus ? 'ring-4 ring-blue-300' : ''}`}
        type="text"
        placeholder="Nhập tin nhắn..."
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
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