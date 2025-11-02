import React from 'react';
import { Audience } from '../../types';

interface AudiencesTabProps {
  audiences: Audience[];
  onViewAudience: (audienceId: string) => void;
}

const AudiencesTab: React.FC<AudiencesTabProps> = ({ audiences, onViewAudience }) => {

  const handleNewAudience = () => {
    // In a real app, this would open a modal or a new page form
    alert("Funcionalidade para criar novo público seria implementada aqui.");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Gerenciar Públicos</h3>
        <button 
          onClick={handleNewAudience}
          className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors flex items-center shadow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Novo Público
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {audiences.map(audience => (
          <div key={audience.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 flex flex-col justify-between transition-all hover:shadow-lg hover:scale-105">
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">{audience.name}</h4>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{audience.contactCount.toLocaleString('pt-BR')} contatos</p>
            </div>
            <div className="mt-4 flex space-x-4">
              <button 
                onClick={() => onViewAudience(audience.id)}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200"
              >
                Ver Contatos
              </button>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200">Editar</button>
              <button className="text-sm font-medium text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudiencesTab;