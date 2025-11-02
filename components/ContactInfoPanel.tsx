import React from 'react';
import { Contact } from '../types';

interface ContactInfoPanelProps {
  contact: Contact;
}

const ContactInfoPanel: React.FC<ContactInfoPanelProps> = ({ contact }) => {
  return (
    <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col p-4">
      <div className="flex flex-col items-center text-center py-4 border-b border-gray-200 dark:border-gray-700">
        <img src={contact.avatarUrl} alt={contact.name} className="w-24 h-24 rounded-full mb-4 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-gray-800" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{contact.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{contact.phone}</p>
      </div>
      <div className="py-4 space-y-4 overflow-y-auto">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {contact.tags.length > 0 ? contact.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                {tag}
              </span>
            )) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">Nenhuma tag</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase mb-2">Públicos</h3>
           <ul className="space-y-1">
            {contact.audiences.length > 0 ? contact.audiences.map(audience => (
              <li key={audience} className="text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                {audience}
              </li>
            )) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">Não pertence a nenhum público</p>
            )}
          </ul>
        </div>
         <div>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase mb-2">Última Atividade</h3>
          <p className="text-sm text-gray-700 dark:text-gray-200">{contact.lastActivity}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoPanel;
