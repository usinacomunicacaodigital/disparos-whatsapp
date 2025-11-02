import React, { useState, Dispatch, SetStateAction } from 'react';
import AIGeneratorModal from './AIGeneratorModal';

interface MessageInputProps {
  text: string;
  // Fix: Update type to allow functional updates from the parent's useState.
  setText: Dispatch<SetStateAction<string>>;
  onSendMessage: (text: string) => void;
  smartReplies: string[];
  isLoadingReplies: boolean;
  onSmartReplyClick: (reply: string) => void;
}

const SmartReplyButton: React.FC<{ text: string; onClick: () => void }> = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
  >
    {text}
  </button>
);

const LoadingSkeleton: React.FC = () => (
  <div className="flex items-center space-x-2 animate-pulse">
    <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
    <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
    <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
  </div>
);

const MessageInput: React.FC<MessageInputProps> = ({ 
  text, 
  setText, 
  onSendMessage, 
  smartReplies, 
  isLoadingReplies,
  onSmartReplyClick
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
    }
  };

  const handleAISelect = (generatedText: string) => {
    setText(prevText => prevText ? `${prevText} ${generatedText}` : generatedText);
    setIsModalOpen(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  
  return (
    <>
      <div className="flex flex-col space-y-2">
        {(isLoadingReplies || smartReplies.length > 0) && (
          <div className="px-2 h-8 flex items-center space-x-2">
            {isLoadingReplies ? <LoadingSkeleton /> : (
              smartReplies.map((reply, index) => (
                <SmartReplyButton key={index} text={reply} onClick={() => onSmartReplyClick(reply)} />
              ))
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 md:space-x-4">
          <button 
            type="button" 
            onClick={() => setIsModalOpen(true)}
            className="p-2 text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors duration-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Gerar com IA"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </button>

          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            placeholder="Digite uma mensagem..."
            className="flex-1 p-3 bg-gray-200 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-transparent"
          />

          <button 
            type="submit" 
            className="bg-emerald-500 text-white p-3 rounded-full hover:bg-emerald-600 transition-colors duration-200 disabled:bg-emerald-300 disabled:cursor-not-allowed"
            disabled={!text.trim()}
            title="Enviar Mensagem"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
      {isModalOpen && (
        <AIGeneratorModal 
          onClose={() => setIsModalOpen(false)} 
          onSelect={handleAISelect} 
        />
      )}
    </>
  );
};

export default MessageInput;