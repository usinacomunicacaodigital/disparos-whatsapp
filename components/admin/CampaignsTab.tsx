import React from 'react';
import { Campaign, CampaignStatus } from '../../types';

const StatusBadge: React.FC<{ status: CampaignStatus }> = ({ status }) => {
  const statusClasses: Record<CampaignStatus, string> = {
    'Ativa': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'Pausada': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'Concluída': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Agendada': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  };
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
      {status}
    </span>
  );
};

const ProgressBar: React.FC<{ sent: number, total: number }> = ({ sent, total }) => {
  const percentage = total > 0 ? (sent / total) * 100 : 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

interface CampaignsTabProps {
  campaigns: Campaign[];
  onNewCampaign: () => void;
  onViewReport: (campaignId: string) => void;
}

const CampaignsTab: React.FC<CampaignsTabProps> = ({ campaigns, onNewCampaign, onViewReport }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Gerenciar Campanhas</h3>
        <button 
          onClick={onNewCampaign}
          className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors flex items-center shadow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nova Campanha
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Progresso</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Público</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{campaign.name}</div>
                    {campaign.scheduledAt && <div className="text-xs text-gray-500">Agendada para {new Date(campaign.scheduledAt).toLocaleDateString()}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={campaign.status} /></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <ProgressBar sent={campaign.sent} total={campaign.total} />
                    <span className="text-xs mt-1 block">{campaign.sent} / {campaign.total} enviados</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{campaign.audience}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex items-center justify-center space-x-3">
                    <button onClick={() => onViewReport(campaign.id)} className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200" title="Ver Relatório">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" /></svg>
                    </button>
                     <button className="text-gray-400 hover:text-blue-600" title={campaign.status === 'Ativa' ? 'Pausar' : 'Iniciar'}>
                       {campaign.status === 'Ativa' ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>}
                    </button>
                    <button className="text-gray-400 hover:text-gray-600" title="Duplicar">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h6a2 2 0 00-2-2H5z" /></svg>
                    </button>
                    <button className="text-gray-400 hover:text-red-600" title="Arquivar">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 8a3 3 0 013-3h4a3 3 0 013 3v4a3 3 0 01-3 3H8a3 3 0 01-3-3V8zm3 0a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V9a1 1 0 00-1-1H8z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignsTab;