import React, { useState, useMemo } from 'react';
import { Audience, Contact } from '../../types';

interface ViewAudienceProps {
  audience: Audience;
  allContacts: Contact[];
  onBack: () => void;
}

const ViewAudience: React.FC<ViewAudienceProps> = ({ audience, allContacts, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const audienceContacts = useMemo(() => {
    return allContacts.filter(contact => contact.audiences.includes(audience.name));
  }, [allContacts, audience.name]);

  const filteredContacts = useMemo(() => {
    if (!searchTerm) return audienceContacts;
    return audienceContacts.filter(
      contact => 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm)
    );
  }, [audienceContacts, searchTerm]);

  return (
    <div>
       <header className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Público: {audience.name}</h3>
            <p className="text-sm text-gray-500">{audienceContacts.length} contatos</p>
        </div>
      </header>

       <div className="mb-4">
        <input 
            type="text" 
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contato</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tags</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Última Atividade</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredContacts.map((contact) => (
              <tr key={contact.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full" src={contact.avatarUrl} alt={contact.name} />
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{contact.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{contact.phone}</div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-wrap gap-1">
                        {contact.tags.map(tag => (
                            <span key={tag} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">{tag}</span>
                        ))}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{contact.lastActivity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200 font-semibold">Ver Conversa</button>
                </td>
              </tr>
            ))}
             {filteredContacts.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                        Nenhum contato encontrado.
                    </td>
                </tr>
             )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAudience;
