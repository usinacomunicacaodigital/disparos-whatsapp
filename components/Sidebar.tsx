import React from 'react';
import { Contact, Message } from '../types';

interface ContactItemProps {
  contact: Contact;
  isActive: boolean;
  lastMessage?: Message;
  onClick: () => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ contact, isActive, lastMessage, onClick }) => {
  const bgColor = isActive ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50';
  
  return (
    <div 
      className={`flex items-center p-3 cursor-pointer transition-colors duration-200 ${bgColor}`}
      onClick={onClick}
    >
      <img src={contact.avatarUrl} alt={contact.name} className="w-12 h-12 rounded-full mr-4" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-800 dark:text-white truncate">{contact.name}</p>
          {lastMessage && <p className="text-xs text-gray-500 dark:text-gray-400">{lastMessage.timestamp}</p>}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
          {lastMessage ? (lastMessage.sender === 'me' ? `Você: ${lastMessage.text}` : lastMessage.text) : 'Sem mensagens ainda'}
        </p>
      </div>
    </div>
  );
};


interface SidebarProps {
  contacts: Contact[];
  activeContactId: string | null;
  onContactSelect: (id: string) => void;
  messages: Record<string, Message[]>;
  currentView: 'chat' | 'admin';
  onViewChange: (view: 'chat' | 'admin') => void;
  onNavigateToSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ contacts, activeContactId, onContactSelect, messages, currentView, onViewChange, onNavigateToSettings }) => {
  const getButtonClasses = (view: 'chat' | 'admin') => {
    const base = "flex-1 py-2 px-4 text-sm font-semibold text-center rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800";
    if (currentView === view) {
      return `${base} bg-emerald-500 text-white`;
    }
    return `${base} bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600`;
  }

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 sticky top-0">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI WhatsApp</h1>
          <button 
            onClick={onNavigateToSettings}
            className="p-2 text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors duration-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Configurações"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
           <button onClick={() => onViewChange('chat')} className={getButtonClasses('chat')}>
             Conversas
           </button>
           <button onClick={() => onViewChange('admin')} className={getButtonClasses('admin')}>
             Painel Admin
           </button>
        </div>
      </header>
      {currentView === 'chat' && (
        <div className="flex-1 overflow-y-auto">
          {contacts.map(contact => {
            const chatMessages = messages[contact.id] || [];
            const lastMessage = chatMessages[chatMessages.length - 1];
            return (
              <ContactItem
                key={contact.id}
                contact={contact}
                isActive={contact.id === activeContactId}
                lastMessage={lastMessage}
                onClick={() => onContactSelect(contact.id)}
              />
            );
          })}
        </div>
      )}
       {currentView === 'admin' && (
        <div className="flex-1 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Use o painel principal para gerenciar campanhas, públicos e contatos.
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;