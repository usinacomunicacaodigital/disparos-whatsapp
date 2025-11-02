
import React, { useState, useCallback } from 'react';
import { generateMessage } from '../services/geminiService';

interface AIGeneratorModalProps {
  onClose: () => void;
  onSelect: (text: string) => void;
}

const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({ onClose, onSelect }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setGeneratedText('');
    try {
      const result = await generateMessage(prompt);
      setGeneratedText(result);
    } catch (err) {
      setError('Falha ao gerar mensagem. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-lg transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gerador de Mensagens com IA</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descreva a mensagem que você quer gerar:
          </label>
          <textarea
            id="prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Ex: uma mensagem de feliz aniversário para um colega de trabalho"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="mt-3 w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition-colors disabled:bg-emerald-300 dark:disabled:bg-emerald-800 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Gerando...
              </>
            ) : 'Gerar Mensagem'}
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        
        {generatedText && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Sugestão:</h3>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md max-h-40 overflow-y-auto">
              <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{generatedText}</p>
            </div>
            <button
              onClick={() => onSelect(generatedText)}
              className="mt-4 w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300 transition-colors"
            >
              Usar esta mensagem
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGeneratorModal;
