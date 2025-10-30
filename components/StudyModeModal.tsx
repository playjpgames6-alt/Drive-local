import React, { useState } from 'react';
import { XIcon, BrainIcon } from './Icons';

interface StudyModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (topic: string) => void;
  isGenerating: boolean;
}

const StudyModeModal: React.FC<StudyModeModalProps> = ({ isOpen, onClose, onGenerate, isGenerating }) => {
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic to study.');
      return;
    }
    setError('');
    onGenerate(topic.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 animate-fade-in z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md animate-slide-up">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold flex items-center">
            <BrainIcon className="w-6 h-6 mr-2 text-purple-500" />
            Modo de Estudo (IA)
          </h2>
          <button onClick={onClose} disabled={isGenerating} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"><XIcon className="w-6 h-6"/></button>
        </div>
        
        {isGenerating ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">A IA está buscando materiais...</p>
             <p className="text-gray-600 dark:text-gray-400">Isso pode levar alguns segundos.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <label htmlFor="study-topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Qual tópico você gostaria de estudar hoje?</label>
              <input
                id="study-topic"
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Ex: React, História do Brasil, Astrofísica"
                className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
              <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700">Gerar Grupo de Estudo</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudyModeModal;
