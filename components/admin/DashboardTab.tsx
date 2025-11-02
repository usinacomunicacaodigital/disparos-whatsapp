import React from 'react';
import { Campaign, Contact } from '../../types';

const KPICard: React.FC<{ title: string; value: string; icon: React.ReactElement }> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 flex items-center space-x-4">
    <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const BarChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex justify-around items-end h-48 p-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center w-1/5">
          <div className="text-sm font-bold text-gray-700 dark:text-gray-200">{item.value}</div>
          <div 
            className="w-10 bg-emerald-500 rounded-t-md hover:bg-emerald-400 transition-all"
            style={{ height: `${(item.value / maxValue) * 100}%` }}
            title={`${item.name}: ${item.value} envios`}
          ></div>
          <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2 truncate w-full">{item.name}</div>
        </div>
      ))}
    </div>
  );
};

interface DashboardTabProps {
  campaigns: Campaign[];
  contacts: Contact[];
}

const DashboardTab: React.FC<DashboardTabProps> = ({ campaigns, contacts }) => {
  const activeCampaigns = campaigns.filter(c => c.status === 'Ativa').length;
  const totalContacts = contacts.length;
  const avgReadRate = "75%"; // Simulated

  const recentCampaignsData = campaigns
    .filter(c => c.status === 'Concluída')
    .slice(0, 5)
    .map(c => ({ name: c.name, value: c.sent }));
    
  const scheduledCampaigns = campaigns
    .filter(c => c.status === 'Agendada' && c.scheduledAt)
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime());

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="Campanhas Ativas" 
          value={activeCampaigns.toString()} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
        />
        <KPICard 
          title="Total de Contatos" 
          value={totalContacts.toLocaleString('pt-BR')}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        />
        <KPICard 
          title="Taxa de Leitura Média" 
          value={avgReadRate}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M12 12a4 4 0 100-8 4 4 0 000 8z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Campanhas Recentes (Envios)</h4>
          {recentCampaignsData.length > 0 ? <BarChart data={recentCampaignsData} /> : <p className="text-center text-gray-500 dark:text-gray-400 py-10">Nenhuma campanha concluída ainda.</p>}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Próximos Envios Agendados</h4>
          <div className="space-y-3">
            {scheduledCampaigns.length > 0 ? scheduledCampaigns.map(c => (
              <div key={c.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{c.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(c.scheduledAt!).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            )) : <p className="text-center text-gray-500 dark:text-gray-400 py-10">Nenhuma campanha agendada.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;