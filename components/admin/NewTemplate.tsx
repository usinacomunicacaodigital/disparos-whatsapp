import React, { useState } from 'react';
import { MessageTemplate } from '../../types';

interface NewTemplateProps {
  onBack: () => void;
  onSave: (templateData: Omit<MessageTemplate, 'id'>) => void;
}

const NewTemplate: React.FC<NewTemplateProps> = ({ onBack, onSave }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Marketing' | 'Utilidade' | 'Autenticação'>('Marketing');
  const [body, setBody] = useState('');

  const handleSave = () => {
    if (name.trim() && body.trim()) {
      onSave({ name, category, body });
    }
  };
  
  const isFormValid = name.trim() !== '' && body.trim() !== '';
  const placeholderText = 'Use {{1}}, {{2}}, etc. para variáveis. Ex: Olá {{1}}, bem-vindo!';

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
       <header className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button onClick={onBack} className="mr-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Novo Template de Mensagem</h2>
      </header>
       <main className="flex-1 overflow-y-auto p-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-2xl mx-auto">
          <div className="space-y-6">
            <div>
              <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Template</label>
              <input type="text" id="templateName" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-700 sm:text-sm" placeholder="Ex: Boas-vindas Premium"/>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</label>
              <select id="category" value={category} onChange={e => setCategory(e.target.value as 'Marketing' | 'Utilidade' | 'Autenticação')} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-700 sm:text-sm">
                <option value="Marketing">Marketing</option>
                <option value="Utilidade">Utilidade</option>
                <option value="Autenticação">Autenticação</option>
              </select>
            </div>
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Corpo da Mensagem</label>
              <textarea id="body" rows={6} value={body} onChange={e => setBody(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-700 sm:text-sm" placeholder={placeholderText}/>
              {/* Fix: Correctly escape double curly braces to prevent JSX parsing issues without rendering extra characters. */}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">As variáveis permitem personalizar a mensagem para cada contato. Ex: {'{{1}}'} pode ser o nome do cliente.</p>
            </div>
          </div>
        </div>
      </main>
      <footer className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex justify-end max-w-2xl mx-auto">
          <button
            onClick={handleSave}
            disabled={!isFormValid}
            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed"
          >
            Salvar Template
          </button>
        </div>
      </footer>
    </div>
  );
};

export default NewTemplate;
