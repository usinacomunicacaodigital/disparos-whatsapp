import React, { useRef, useEffect, useState } from 'react';
import { Contact, Message } from '../types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import ContactInfoPanel from './ContactInfoPanel';
import { generateSmartReplies } from '../services/geminiService';

interface ChatWindowProps {
  contact: Contact;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ contact, messages, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState('');
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'contact') {
      setIsLoadingReplies(true);
      setSmartReplies([]);
      generateSmartReplies(lastMessage.text)
        .then(response => {
          setSmartReplies(response.suggestions);
        })
        .catch(err => {
          console.error("Failed to fetch smart replies:", err);
          setSmartReplies([]); // Clear on error
        })
        .finally(() => {
          setIsLoadingReplies(false);
        });
    }
  }, [messages]);
  
  const handleSendMessage = (messageText: string) => {
    if(!messageText.trim()) return;
    onSendMessage(messageText);
    setText('');
    setSmartReplies([]);
  };

  return (
    <div className="flex h-full">
      <div className="flex flex-col flex-1 h-full bg-white dark:bg-gray-900">
        <header className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 z-10">
          <img src={contact.avatarUrl} alt={contact.name} className="w-10 h-10 rounded-full mr-4" />
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">{contact.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{contact.phone}</p>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-100/50 dark:bg-gray-900/50">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </main>
        
        <footer className="p-2 md:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <MessageInput 
            text={text}
            setText={setText}
            onSendMessage={handleSendMessage}
            smartReplies={smartReplies}
            isLoadingReplies={isLoadingReplies}
            onSmartReplyClick={(reply) => {
              setText(reply);
              setSmartReplies([]); // Clear suggestions after one is chosen
            }}
          />
        </footer>
      </div>
      <ContactInfoPanel contact={contact} />
    </div>
  );
};

export default ChatWindow;
