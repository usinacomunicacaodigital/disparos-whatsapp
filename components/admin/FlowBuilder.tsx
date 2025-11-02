import React from 'react';
import { Flow, FlowNode } from '../../types';

interface FlowBuilderProps {
  flow: Flow;
  onBack: () => void;
}

const NodeIcon: React.FC<{ type: FlowNode['type'] }> = ({ type }) => {
  const icons = {
    trigger: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    sendMessage: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M12 12a4 4 0 100-8 4 4 0 000 8z" />
      </svg>
    ),
    wait: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    condition: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
  };
  return icons[type] || null;
};

const NodeCard: React.FC<{ node: FlowNode }> = ({ node }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 w-64 transform hover:scale-105 transition-transform duration-200">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <NodeIcon type={node.type} />
          <h4 className="font-semibold text-gray-800 dark:text-white truncate">{node.data.label}</h4>
        </div>
        {node.data.description && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{node.data.description}</p>
        )}
      </div>
    </div>
  );
};

const AddStepButton: React.FC = () => (
    <div className="flex justify-center my-4">
        <button className="p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
        </button>
    </div>
);

const FlowBuilder: React.FC<FlowBuilderProps> = ({ flow, onBack }) => {
  const { name, nodes, edges } = flow;

  const renderNode = (nodeId: string, visited: Set<string> = new Set()): React.ReactNode => {
    if (visited.has(nodeId)) return null;
    visited.add(nodeId);

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return null;
    
    const outgoingEdges = edges.filter(e => e.source === nodeId);

    return (
        <div key={node.id} className="flex flex-col items-center">
            <NodeCard node={node}/>

            {outgoingEdges.length === 1 && (
                <>
                    <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 my-2"></div>
                    {renderNode(outgoingEdges[0].target, visited)}
                </>
            )}

            {outgoingEdges.length > 1 && ( // Conditional branch
                <>
                <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 my-2"></div>
                <div className="flex w-full justify-center relative">
                  <div className="absolute top-0 h-px w-1/2 bg-gray-300 dark:bg-gray-600"></div>
                  <div className="absolute top-0 left-1/2 w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

                    {outgoingEdges.map(edge => (
                        <div key={edge.id} className="w-1/2 flex flex-col items-center px-4">
                             <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                             <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-md -mt-3 z-10">{edge.label}</p>
                             <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                             {renderNode(edge.target, visited)}
                        </div>
                    ))}
                </div>
                </>
            )}
             {outgoingEdges.length === 0 && <AddStepButton />}
        </div>
    );
  };


  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      <header className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
        <button onClick={onBack} className="mr-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Editor de Automação</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{name}</p>
        </div>
        <div className="ml-auto">
             <button className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors shadow">
              Salvar e Ativar
            </button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-4xl">
           {renderNode(nodes.find(n => n.type === 'trigger')?.id || '')}
        </div>
      </main>
    </div>
  );
};

export default FlowBuilder;
