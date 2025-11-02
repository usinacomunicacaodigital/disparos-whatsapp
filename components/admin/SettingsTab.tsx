import React, { useState, useEffect } from 'react';
import { WhatsAppConfig } from '../../types';

// Initial config state
const INITIAL_WHATSAPP_CONFIG: WhatsAppConfig = {
  status: 'Disconnected',
  phoneNumber: null,
  accountId: null,
  qrCodeData: undefined,
};

const StatusIndicator: React.FC<{ status: WhatsAppConfig['status'] }> = ({ status }) => {
  const baseClasses = "px-3 py-1 text-sm font-semibold rounded-full inline-flex items-center transition-colors";
  const statusConfig = {
    Connected: { text: 'Conectado', classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    Disconnected: { text: 'Desconectado', classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    Pending: { text: 'Verificação Pendente', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    AwaitingQRCode: { text: 'Aguardando QR Code', classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
    QRCodeReady: { text: 'Escaneie o QR Code', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
  };
  const config = statusConfig[status];

  return <span className={`${baseClasses} ${config.classes}`}>{config.text}</span>;
};


const SettingsTab: React.FC = () => {
  const [config, setConfig] = useState<WhatsAppConfig>(INITIAL_WHATSAPP_CONFIG);
  const [showManualSetup, setShowManualSetup] = useState(false);
  
  // Manual form states
  const [accountId, setAccountId] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate QR Code generation
  const handleGenerateQRCode = () => {
    setConfig(prev => ({ ...prev, status: 'AwaitingQRCode' }));
    setTimeout(() => {
        const fakeQRCodeData = `https://wa.me/qr/${Date.now()}`;
        setConfig(prev => ({ ...prev, status: 'QRCodeReady', qrCodeData: fakeQRCodeData }));
    }, 2000);
  };

  // Simulate successful scan after QR code is shown
  useEffect(() => {
      if (config.status === 'QRCodeReady') {
          const connectionTimeout = setTimeout(() => {
              setConfig(prev => ({
                  ...prev,
                  status: 'Connected',
                  phoneNumber: `Simulado +258 84 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`,
                  qrCodeData: undefined,
              }));
          }, 5000); // Wait 5 seconds to simulate user scanning

          return () => clearTimeout(connectionTimeout);
      }
  }, [config.status]);

  const handleDisconnect = () => {
      setConfig(INITIAL_WHATSAPP_CONFIG);
  };

  const handleManualConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId.trim() || !phoneNumberId.trim()) {
      setError('Ambos os campos são obrigatórios.');
      return;
    }

    setIsConnecting(true);
    setError(null);
    setConfig(prev => ({ ...prev, status: 'Pending' }));

    setTimeout(() => {
      setConfig({
        status: 'Connected',
        accountId: accountId,
        phoneNumber: phoneNumberId,
      });
      setIsConnecting(false);
    }, 2000);
  };

  const renderMainContent = () => {
    switch (config.status) {
      case 'AwaitingQRCode':
        return (
          <div className="text-center p-8 flex flex-col items-center justify-center h-64">
            <svg className="animate-spin h-8 w-8 text-emerald-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-300">Gerando QR Code...</p>
          </div>
        );
      case 'QRCodeReady':
        return (
          <div className="p-4 md:p-6">
            <h4 className="text-center font-semibold text-gray-800 dark:text-gray-200 mb-4">Escaneie para conectar o seu WhatsApp</h4>
            <div className="flex justify-center bg-white p-4 rounded-md shadow-inner">
               <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${config.qrCodeData}`} alt="WhatsApp QR Code"/>
            </div>
            <ol className="mt-6 text-sm text-gray-600 dark:text-gray-400 space-y-3 list-decimal list-inside">
                <li>Abra o WhatsApp no seu celular.</li>
                <li>Toque em <strong>Menu</strong> ou <strong>Configurações</strong> e selecione <strong>Aparelhos conectados</strong>.</li>
                <li>Toque em <strong>Conectar um aparelho</strong>.</li>
                <li>Aponte seu celular para esta tela para capturar o código.</li>
            </ol>
          </div>
        );
      case 'Connected':
        return (
          <div className="text-center p-8">
              <p className="text-lg text-gray-800 dark:text-gray-200">
                  Conectado com sucesso ao número:
              </p>
              <p className="font-bold text-xl my-3 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/50 py-2 px-4 rounded-md inline-block">
                  {config.phoneNumber}
              </p>
              <div className="mt-6">
                <button onClick={handleDisconnect} className="py-2 px-6 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    Desconectar
                </button>
              </div>
          </div>
        );
      case 'Disconnected':
      default:
        return (
          <div className="text-center p-8">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Conecte seu Número de WhatsApp</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-6 max-w-sm mx-auto">A forma mais fácil e segura de conectar sua conta é usando o QR Code oficial.</p>
            <button onClick={handleGenerateQRCode} className="inline-flex items-center justify-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700">
              Conectar com QR Code
            </button>
          </div>
        );
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Configurações do WhatsApp</h3>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-bold text-gray-800 dark:text-gray-200">Status da Conexão</h4>
          <StatusIndicator status={config.status} />
        </div>
        {renderMainContent()}
      </div>

      <div className="max-w-2xl mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <button 
            onClick={() => setShowManualSetup(!showManualSetup)}
            className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-700 dark:text-gray-200"
          >
            <span>Configuração Manual (Avançado)</span>
            <svg className={`w-5 h-5 transition-transform ${showManualSetup ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showManualSetup && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleManualConnect} className="space-y-6">
                <div>
                  <label htmlFor="wa-account-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID da Conta do WhatsApp Business</label>
                  <input type="text" id="wa-account-id" value={accountId} onChange={e => setAccountId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-700 sm:text-sm" placeholder="Ex: 109876543210987" />
                </div>
                <div>
                  <label htmlFor="wa-phone-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID do Número de Telefone</label>
                  <input type="text" id="wa-phone-id" value={phoneNumberId} onChange={e => setPhoneNumberId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-700 sm:text-sm" placeholder="Ex: 102345678901234" />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="pt-2 text-right">
                  <button type="submit" disabled={isConnecting} className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400">
                    {isConnecting ? 'Conectando...' : 'Conectar Manualmente'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
