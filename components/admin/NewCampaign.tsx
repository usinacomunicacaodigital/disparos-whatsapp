import React, { useState, useMemo } from 'react';
import { Audience, Campaign, MessageTemplate, CampaignGenerationResponse } from '../../types';
import { generateCampaignVariations } from '../../services/geminiService';

interface NewCampaignProps {
  onBack: () => void;
  onSaveCampaign: (campaignData: Omit<Campaign, 'id' | 'status' | 'sent' | 'total'>) => void;
  audiences: Audience[];
  templates: MessageTemplate[];
}

const NewCampaign: React.FC<NewCampaignProps> = ({ onBack, onSaveCampaign, audiences, templates }) => {
  const [step, setStep] = useState(1);
  const [campaignName, setCampaignName] = useState('');
  const [audienceId, setAudienceId] = useState(audiences[0]?.id || '');
  
  // Step 2 state
  const [creationMode, setCreationMode] = useState<'template' | 'ai'>('template');
  const [templateId, setTemplateId] = useState(templates[0]?.id || '');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [campaignObjective, setCampaignObjective] = useState('');
  const [campaignTone, setCampaignTone] = useState('Amigável');
  const [isAbTest, setIsAbTest] = useState(false);
  const [generatedVariations, setGeneratedVariations] = useState<CampaignGenerationResponse['variations']>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Step 3 state
  const [schedule, setSchedule] = useState('now');
  const [scheduleDate, setScheduleDate] = useState('');

  const selectedTemplate = useMemo(() => templates.find(t => t.id === templateId), [templates, templateId]);
  const templateVariables = useMemo(() => {
    if (!selectedTemplate) return [];
    const regex = /\{\{(\d+)\}\}/g;
    const matches = selectedTemplate.body.match(regex) || [];
    return [...new Set(matches)].sort(); // Get unique variables like {{1}}, {{2}}
  }, [selectedTemplate]);

  const handleVariableChange = (variable: string, value: string) => {
    setVariables(prev => ({ ...prev, [variable]: value }));
  };

  const handleNextStep = () => setStep(s => s + 1);
  const handlePrevStep = () => setStep(s => s - 1);

  const handleGenerateWithAI = async () => {
    if (!campaignObjective) return;
    setIsGenerating(true);
    setGeneratedVariations([]);
    try {
      const result = await generateCampaignVariations(campaignObjective, campaignTone, isAbTest);
      setGeneratedVariations(result.variations);
    } catch (error) {
      console.error("Failed to generate campaign with AI", error);
      // You could set an error state here to show to the user
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLaunch = () => {
    const selectedAudience = audiences.find(a => a.id === audienceId);
    if (!campaignName || !selectedAudience) return;
    
    const campaignData: Omit<Campaign, 'id' | 'status' | 'sent' | 'total'> = {
      name: campaignName,
      audience: selectedAudience.name,
      scheduledAt: schedule === 'later' ? new Date(scheduleDate).toISOString() : undefined,
    };

    if (creationMode === 'ai') {
      campaignData.variations = generatedVariations.map(v => ({...v, sent: 0, delivered: 0, read: 0}));
    } else {
      campaignData.templateId = templateId;
    }

    onSaveCampaign(campaignData);
  };
  
  const isStep1Valid = campaignName.trim() !== '' && audienceId !== '';
  const isStep2Valid = (creationMode === 'template' && templateId !== '' && templateVariables.every(v => variables[v]?.trim())) || (creationMode === 'ai' && generatedVariations.length > 0);
  const isStep3Valid = schedule === 'now' || (schedule === 'later' && scheduleDate !== '');

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Configuração da Campanha</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Defina o nome e o público-alvo da sua campanha.</p>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Campanha</label>
                <input type="text" id="campaignName" value={campaignName} onChange={e => setCampaignName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-700 sm:text-sm" placeholder="Ex: Lançamento de Verão"/>
              </div>
              <div>
                <label htmlFor="audience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Público-alvo</label>
                <select id="audience" value={audienceId} onChange={e => setAudienceId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-700 sm:text-sm">
                  {audiences.map(aud => <option key={aud.id} value={aud.id}>{aud.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Conteúdo da Mensagem</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Escolha um template ou gere uma nova mensagem com IA.</p>
            <div className="mt-4 border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                <button onClick={() => setCreationMode('template')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${creationMode === 'template' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Usar Template</button>
                <button onClick={() => setCreationMode('ai')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm inline-flex items-center ${creationMode === 'ai' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Gerar com IA ✨</button>
              </nav>
            </div>
            {creationMode === 'template' ? (
              <div className="mt-6 space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Selecione um template pré-aprovado para a sua mensagem.</p>
                 <div>
                    <label htmlFor="template" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Template da Mensagem</label>
                    <select id="template" value={templateId} onChange={e => setTemplateId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-700 sm:text-sm">
                      {templates.map(tpl => <option key={tpl.id} value={tpl.id}>{tpl.name} ({tpl.category})</option>)}
                    </select>
                  </div>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="objective" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Objetivo da Campanha</label>
                    <input type="text" id="objective" value={campaignObjective} onChange={e => setCampaignObjective(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-700 sm:text-sm" placeholder="Ex: Anunciar queima de estoque de sapatos com 20% OFF"/>
                  </div>
                  <div className="flex items-center space-x-8">
                    <div>
                      <label htmlFor="tone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tom da Mensagem</label>
                      <select id="tone" value={campaignTone} onChange={e => setCampaignTone(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-700 sm:text-sm">
                        <option>Amigável</option><option>Formal</option><option>Urgente</option><option>Divertido</option>
                      </select>
                    </div>
                    <div className="flex items-center pt-6">
                      <input id="ab-test" type="checkbox" checked={isAbTest} onChange={e => setIsAbTest(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"/>
                      <label htmlFor="ab-test" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">Ativar Teste A/B</label>
                    </div>
                  </div>
                  <button onClick={handleGenerateWithAI} disabled={isGenerating || !campaignObjective.trim()} className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition-colors disabled:bg-emerald-300 flex items-center justify-center">
                    {isGenerating ? 'Gerando...' : 'Gerar Mensagem'}
                  </button>

                  {generatedVariations.length > 0 && (
                    <div className="space-y-4 pt-4">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">Mensagens Geradas:</h4>
                      {generatedVariations.map(v => (
                        <div key={v.id} className="p-4 border rounded-md bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600">
                          <p className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">Variação {v.id}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 italic whitespace-pre-wrap">{v.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}
          </div>
        );
       case 3:
        const selectedAudience = audiences.find(a => a.id === audienceId);
        return (
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Agendamento e Revisão</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Escolha quando enviar e revise os detalhes da campanha.</p>
             <div className="mt-6">
                <fieldset>
                    <legend className="text-base font-medium text-gray-900 dark:text-white">Opções de Envio</legend>
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center"><input id="now" name="schedule" type="radio" checked={schedule === 'now'} onChange={() => setSchedule('now')} className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500"/><label htmlFor="now" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">Enviar agora (iniciará pausada)</label></div>
                        <div className="flex items-center"><input id="later" name="schedule" type="radio" checked={schedule === 'later'} onChange={() => setSchedule('later')} className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500"/><label htmlFor="later" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">Agendar para depois</label></div>
                    </div>
                </fieldset>
                {schedule === 'later' && (
                    <div className="mt-4">
                        <input type="datetime-local" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm bg-white dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                )}
            </div>
            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white">Resumo da Campanha</h4>
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li><strong>Nome:</strong> {campaignName}</li>
                    <li><strong>Público:</strong> {selectedAudience?.name} ({selectedAudience?.contactCount} contatos)</li>
                    <li><strong>Conteúdo:</strong> {creationMode === 'ai' ? `${generatedVariations.length} variaç${generatedVariations.length > 1 ? 'ões geradas' : 'ão gerada'} por IA` : `Template "${selectedTemplate?.name}"`}</li>
                    <li><strong>Envio:</strong> {schedule === 'now' ? 'Imediato (pausada)' : `Agendado para ${scheduleDate ? new Date(scheduleDate).toLocaleString('pt-BR') : '...'}`}</li>
                </ul>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <header className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button onClick={onBack} className="mr-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Nova Campanha - Passo {step} de 3</h2>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto">
          {renderStepContent()}
        </div>
      </main>
      <footer className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex justify-between max-w-4xl mx-auto">
          <button
            onClick={handlePrevStep}
            disabled={step === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Voltar
          </button>
          {step < 3 ? (
            <button
              onClick={handleNextStep}
              disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed"
            >
              Avançar
            </button>
          ) : (
            <button
              onClick={handleLaunch}
              disabled={!isStep3Valid}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed"
            >
              Salvar Campanha
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default NewCampaign;
