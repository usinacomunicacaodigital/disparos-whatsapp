import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import AdminPanel from './components/admin/AdminPanel';
// Fix: Import AdminTab type.
import { Contact, Message, AdminTab } from './types';
import { MOCK_CONTACTS, MOCK_MESSAGES } from './constants';
import { initSocket, disconnectSocket, onNewMessage, sendMessage as sendSocketMessage } from './services/socketService';

interface NewMessagePayload {
  contactId: string;
  message: Message;
}

const App: React.FC = () => {
  const [contacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [activeContactId, setActiveContactId] = useState<string | null>('1');
  const [view, setView] = useState<'chat' | 'admin'>('admin');
  // Fix: Explicitly type the state for initialAdminTab to match the expected prop type in AdminPanel.
  const [initialAdminTab, setInitialAdminTab] = useState<AdminTab>('dashboard');

  useEffect(() => {
    // Initialize WebSocket connection when the app mounts
    initSocket();

    // Listen for incoming messages from the server
    onNewMessage(({ contactId, message }: NewMessagePayload) => {
      setMessages(prevMessages => ({
        ...prevMessages,
        [contactId]: [...(prevMessages[contactId] || []), message],
      }));
    });

    // Disconnect on component unmount to clean up
    return () => {
      disconnectSocket();
    };
  }, []);

  const activeContact = useMemo(() => 
    contacts.find(c => c.id === activeContactId),
    [contacts, activeContactId]
  );

  const handleSendMessage = (text: string) => {
    if (!activeContactId) return;

    // Send the message through the WebSocket to the backend
    // The backend will process it, send it via Meta API, save to DB,
    // and then broadcast it back to connected clients.
    sendSocketMessage(activeContactId, text);
  };
  
  const handleNavigateToSettings = () => {
    setView('admin');
    setInitialAdminTab('settings');
  };

  return (
    <div className="flex h-screen font-sans text-gray-800 dark:text-gray-200 antialiased">
      <div className="w-full max-w-sm md:max-w-md lg:w-1/3 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <Sidebar 
          contacts={contacts} 
          activeContactId={activeContactId} 
          onContactSelect={(id) => {
            setActiveContactId(id);
            if (view !== 'chat') setView('chat');
          }}
          messages={messages}
          currentView={view}
          onViewChange={(newView) => {
            setView(newView);
            // Reset to dashboard when switching to admin view from chat
            if (newView === 'admin' && view === 'chat') {
              setInitialAdminTab('dashboard');
            }
          }}
          onNavigateToSettings={handleNavigateToSettings}
        />
      </div>
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        {view === 'chat' ? (
          activeContact ? (
            <ChatWindow 
              contact={activeContact} 
              messages={messages[activeContact.id] || []} 
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-500 dark:text-gray-400">Selecione uma conversa</h2>
                <p className="text-gray-400 dark:text-gray-500">Comece a enviar mensagens para seus contatos.</p>
              </div>
            </div>
          )
        ) : (
          <AdminPanel key={initialAdminTab} initialTab={initialAdminTab} />
        )}
      </div>
    </div>
  );
};

export default App;