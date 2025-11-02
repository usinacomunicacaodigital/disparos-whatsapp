
import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isMe = message.sender === 'me';
  
  const bubbleClasses = isMe
    ? 'bg-emerald-500 text-white self-end rounded-br-none'
    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 self-start rounded-bl-none';

  const containerClasses = isMe ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex ${containerClasses}`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl shadow ${bubbleClasses}`}>
        <p className="text-sm break-words">{message.text}</p>
        <p className={`text-xs mt-1 text-right ${isMe ? 'text-emerald-100' : 'text-gray-400 dark:text-gray-500'}`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
