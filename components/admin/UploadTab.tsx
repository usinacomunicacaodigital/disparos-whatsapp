import React, { useState, useCallback } from 'react';
import { MOCK_AUDIENCES } from '../../constants';

const UploadTab: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState(MOCK_AUDIENCES[0].id);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      setFile(files[0]);
      setUploadSuccess(false);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    setUploadSuccess(false);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setFile(null);
    }, 2000);
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileChange(event.dataTransfer.files);
  }, []);

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Upload de Contatos</h3>
      <div className="max-w-xl mx-auto">
        <div 
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <div className="flex flex-col items-center">
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Arraste e solte sua planilha aqui ou
            </p>
            <label htmlFor="file-upload" className="mt-2 font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 cursor-pointer">
              <span>selecione um arquivo</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={e => handleFileChange(e.target.files)} />
            </label>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">CSV, XLSX até 10MB</p>
          </div>
        </div>

        {file && (
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p className="font-medium text-gray-800 dark:text-gray-200">Arquivo selecionado: {file.name}</p>
          </div>
        )}

        {uploadSuccess && (
          <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 rounded-md">
            <p className="font-medium text-green-800 dark:text-green-200">Upload concluído com sucesso!</p>
          </div>
        )}

        <div className="mt-6">
          <label htmlFor="audience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Adicionar contatos ao público:
          </label>
          <select
            id="audience"
            name="audience"
            value={selectedAudience}
            onChange={e => setSelectedAudience(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md bg-white dark:bg-gray-700"
          >
            {MOCK_AUDIENCES.map(aud => <option key={aud.id} value={aud.id}>{aud.name}</option>)}
          </select>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Enviando...' : 'Fazer Upload'}
        </button>
      </div>
    </div>
  );
};

export default UploadTab;
