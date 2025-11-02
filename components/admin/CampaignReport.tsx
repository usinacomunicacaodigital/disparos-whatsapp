import React from 'react';
import { Campaign, CampaignRecipient, CampaignRecipientStatus, CampaignVariation } from '../../types';

interface CampaignReportProps {
  campaign: Campaign;
  onBack: () => void;
}

const KPICard: React.FC<{ title: string; value: string; description: string }> = ({ title, value, description }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
    <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

const RecipientStatusBadge: React.FC<{ status: CampaignRecipientStatus }> = ({ status }) => {
  const statusClasses: Record<CampaignRecipientStatus, string> = {
    'Enviada': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'Entregue': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Lida': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'Falhou': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
      {status}
    </span>
  );
};

const ABTestResults: React.FC<{ variations: CampaignVariation[] }> = ({ variations }) => {
  // Fix: Safely calculate the winner to avoid division by zero errors.
  let winner: CampaignVariation | null = null;
  if (variations.length === 2) {
    const rateA = variations[0].delivered > 0 ? variations[0].read / variations[0].delivered : 0;
    const rateB = variations[1].delivered > 0 ? variations[1].read / variations[1].delivered : 0;
    if (rateA > rateB) {
      winner = variations[0];
    } else if (rateB > rateA) {
      winner = variations[1];
    }
    // If rates are equal, winner remains null (no winner).
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resultados do Teste A/B</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {variations.map(v => {
          const readRate = v.delivered > 0 ? ((v.read / v.delivered) * 100).toFixed(1) : '0.0';
          return (
            <div key={v.id} className={`p-4 rounded-lg border ${winner && v.id === winner.id ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-700' : 'bg-gray-50 dark:bg-gray-700/50 dark:border-gray-700'}`}>
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-800 dark:text-white">Variação {v.id}</h4>
                {winner && v.id === winner.id && <span className="text-xs font-bold text-emerald-700 bg-emerald-200 px-2 py-1 rounded-full dark:text-emerald-200 dark:bg-emerald-700">Vencedora 🏆</span>}
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 italic p-3 bg-white dark:bg-gray-800 rounded-md">"{v.body}"</p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Envios:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{v.sent.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Entregas:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{v.delivered.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Leituras:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{v.read.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-500 dark:text-gray-400 font-bold">Taxa de Leitura:</span>
                  <span className="font-bold text-xl text-emerald-600 dark:text-emerald-400">{readRate}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};


const CampaignReport: React.FC<CampaignReportProps> = ({ campaign, onBack }) => {
  const { name, sent, delivered = 0, read = 0, recipients = [], variations } = campaign;
  const deliveryRate = sent > 0 ? ((delivered / sent) * 100).toFixed(1) : '0.0';
  const readRate = delivered > 0 ? ((read / delivered) * 100).toFixed(1) : '0.0';

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <header className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button onClick={onBack} className="mr-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Relatório da Campanha</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{name}</p>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <KPICard title="Total de Envios" value={sent.toLocaleString('pt-BR')} description="Contatos na campanha" />
          <KPICard title="Taxa de Entrega" value={`${deliveryRate}%`} description={`${delivered.toLocaleString('pt-BR')} mensagens entregues`} />
          <KPICard title="Taxa de Leitura" value={`${readRate}%`} description={`${read.toLocaleString('pt-BR')} mensagens lidas`} />
        </div>
        
        {/* A/B Test Results */}
        {variations && variations.length > 0 && <ABTestResults variations={variations} />}

        {/* Funnel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Funil de Engajamento</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="w-24 text-sm font-medium text-gray-600 dark:text-gray-300">Enviadas</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6"><div className="bg-emerald-500 h-6 rounded-full" style={{ width: '100%' }}></div></div>
              <span className="w-20 text-right text-sm font-semibold">{sent.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm font-medium text-gray-600 dark:text-gray-300">Entregues</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6"><div className="bg-blue-500 h-6 rounded-full" style={{ width: `${sent > 0 ? (delivered / sent) * 100 : 0}%` }}></div></div>
              <span className="w-20 text-right text-sm font-semibold">{delivered.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm font-medium text-gray-600 dark:text-gray-300">Lidas</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6"><div className="bg-green-500 h-6 rounded-full" style={{ width: `${sent > 0 ? (read / sent) * 100 : 0}%` }}></div></div>
              <span className="w-20 text-right text-sm font-semibold">{read.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>

        {/* Recipients Log */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Log de Envios</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contato</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Última Atualização</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recipients.length > 0 ? recipients.map((recipient) => (
                  <tr key={recipient.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{recipient.contactName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{recipient.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm"><RecipientStatusBadge status={recipient.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{recipient.lastUpdate}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                      Nenhum dado de destinatário disponível para esta campanha.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CampaignReport;