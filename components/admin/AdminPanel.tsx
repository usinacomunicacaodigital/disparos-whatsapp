import React, { useState, useEffect } from 'react';
import CampaignsTab from './CampaignsTab';
import AudiencesTab from './AudiencesTab';
import UploadTab from './UploadTab';
import NewCampaign from './NewCampaign';
import CampaignReport from './CampaignReport';
import DashboardTab from './DashboardTab';
import TemplatesTab from './TemplatesTab';
import NewTemplate from './NewTemplate';
import ViewAudience from './ViewAudience';
import SettingsTab from './SettingsTab';
import FlowsTab from './FlowsTab';
import FlowBuilder from './FlowBuilder';
import { MOCK_AUDIENCES, MOCK_TEMPLATES, MOCK_AUDIENCE_CONTACTS } from '../../constants';
// Fix: Import AdminTab type from the central types file.
import { Campaign, MessageTemplate, Audience, AdminTab, Flow } from '../../types';
import { getCampaigns, createCampaign as apiCreateCampaign, getFlows } from '../../services/apiService';

// Fix: Removed local AdminTab type definition in favor of the imported one.

interface AdminPanelProps {
  initialTab?: AdminTab;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ initialTab = 'dashboard' }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  
  // State for different views
  const [view, setView] = useState<string>('list'); // 'list', 'create', 'report', 'viewAudience', 'newTemplate', 'builder'
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Data states
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [audiences, setAudiences] = useState<Audience[]>(MOCK_AUDIENCES);
  const [templates, setTemplates] = useState<MessageTemplate[]>(MOCK_TEMPLATES);
  const [flows, setFlows] = useState<Flow[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'campaigns' || activeTab === 'dashboard') {
      setIsLoading(true);
      setError(null);
      getCampaigns()
        .then(data => {
          setCampaigns(data);
        })
        .catch(err => {
          setError('Falha ao carregar campanhas.');
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    if (activeTab === 'flows') {
      setIsLoading(true);
      setError(null);
      getFlows()
        .then(data => {
          setFlows(data);
        })
        .catch(err => {
          setError('Falha ao carregar automações.');
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [activeTab]);
  
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleSaveCampaign = async (newCampaignData: Omit<Campaign, 'id' | 'status' | 'sent' | 'total'>) => {
    const total = audiences.find(a => a.name === newCampaignData.audience)?.contactCount || 0;
    // Fix: Explicitly type `campaignToCreate` to ensure its `status` property is correctly inferred as `CampaignStatus`.
    const campaignToCreate: Omit<Campaign, 'id'> = {
      ...newCampaignData,
      status: newCampaignData.scheduledAt ? 'Agendada' : 'Pausada',
      sent: 0,
      total,
      delivered: 0,
      read: 0,
    };
    
    // In a real app, we'd show a saving indicator here
    const savedCampaign = await apiCreateCampaign(campaignToCreate);
    setCampaigns(prev => [savedCampaign, ...prev]);
    setView('list');
  };

  const handleSaveTemplate = (newTemplateData: Omit<MessageTemplate, 'id'>) => {
    const newTemplate: MessageTemplate = {
      ...newTemplateData,
      id: `tpl${templates.length + 1}`,
    };
    setTemplates(prev => [newTemplate, ...prev]);
    setView('list');
  }

  const handleViewReport = (campaignId: string) => {
    setSelectedId(campaignId);
    setView('report');
  };
  
  const handleViewAudience = (audienceId: string) => {
    setSelectedId(audienceId);
    setView('viewAudience');
  };

  const handleViewFlow = (flowId: string) => {
    setSelectedId(flowId);
    setView('builder');
  };

  const resetView = () => {
    setView('list');
    setSelectedId(null);
  };

  const selectedCampaign = campaigns.find(c => c.id === selectedId);
  const selectedAudience = audiences.find(a => a.id === selectedId);
  const selectedFlow = flows.find(f => f.id === selectedId);

  const getTabClass = (tabName: AdminTab) => {
    return `px-4 py-2 font-medium text-sm rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
      activeTab === tabName
        ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-gray-50 dark:bg-gray-800'
        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
    }`;
  };

  const renderLoading = () => (
    <div className="flex justify-center items-center h-64">
      <svg className="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="ml-4 text-gray-600 dark:text-gray-300">Carregando dados...</p>
    </div>
  );

  const renderError = () => (
    <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
      <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">Ocorreu um erro</h3>
      <p className="text-red-600 dark:text-red-400 mt-1">{error}</p>
    </div>
  );

  const renderContent = () => {
    if (isLoading && ['dashboard', 'campaigns', 'flows'].includes(activeTab)) return renderLoading();
    if (error && ['dashboard', 'campaigns', 'flows'].includes(activeTab)) return renderError();

    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab campaigns={campaigns} contacts={MOCK_AUDIENCE_CONTACTS} />;
      
      case 'campaigns':
        if (view === 'create') return <NewCampaign onBack={resetView} onSaveCampaign={handleSaveCampaign} audiences={audiences} templates={templates} />;
        if (view === 'report' && selectedCampaign) return <CampaignReport campaign={selectedCampaign} onBack={resetView} />;
        return <CampaignsTab campaigns={campaigns} onNewCampaign={() => setView('create')} onViewReport={handleViewReport} />;
        
      case 'audiences':
        if (view === 'viewAudience' && selectedAudience) return <ViewAudience audience={selectedAudience} allContacts={MOCK_AUDIENCE_CONTACTS} onBack={resetView} />;
        return <AudiencesTab audiences={audiences} onViewAudience={handleViewAudience} />;

      case 'templates':
        if (view === 'newTemplate') return <NewTemplate onBack={resetView} onSave={handleSaveTemplate} />;
        return <TemplatesTab templates={templates} onNewTemplate={() => setView('newTemplate')} />;
      
      case 'flows':
        if (view === 'builder' && selectedFlow) return <FlowBuilder flow={selectedFlow} onBack={resetView} />;
        return <FlowsTab flows={flows} onNewFlow={() => alert('New flow creator not implemented yet.')} onViewFlow={handleViewFlow} />;

      case 'upload':
        return <UploadTab />;

      case 'settings':
        return <SettingsTab />;
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <header className="p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Painel Administrativo</h2>
      </header>
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <nav className="flex -mb-px px-4" aria-label="Tabs">
          <button onClick={() => { setActiveTab('dashboard'); resetView(); }} className={getTabClass('dashboard')}>Dashboard</button>
          <button onClick={() => { setActiveTab('campaigns'); resetView(); }} className={getTabClass('campaigns')}>Campanhas</button>
          <button onClick={() => { setActiveTab('audiences'); resetView(); }} className={getTabClass('audiences')}>Públicos</button>
          <button onClick={() => { setActiveTab('templates'); resetView(); }} className={getTabClass('templates')}>Templates</button>
          <button onClick={() => { setActiveTab('flows'); resetView(); }} className={getTabClass('flows')}>Automações</button>
          <button onClick={() => { setActiveTab('upload'); resetView(); }} className={getTabClass('upload')}>Upload</button>
          <button onClick={() => { setActiveTab('settings'); resetView(); }} className={getTabClass('settings')}>Configurações</button>
        </nav>
      </div>
      <main className="flex-1 overflow-y-auto p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPanel;
