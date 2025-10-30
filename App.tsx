import React, { useState, useRef } from 'react';
import { Group, Item, ItemType, LinkItem, VideoItem } from './types';
import { fileService } from './services/driveService';
import { aiService } from './services/aiService';
import Header from './components/Header';
import GroupGrid from './components/GroupGrid';
import GroupView from './components/GroupView';
import AddItemModal from './components/AddItemModal';
import AddGroupModal from './components/AddGroupModal';
import StudyModeModal from './components/StudyModeModal';
import { PlusIcon, FileUpIcon, FilePlusIcon, DriveIcon, BrainIcon } from './components/Icons';

const getYoutubeVideoId = (videoUrl: string): string | null => {
  try {
      const urlObj = new URL(videoUrl);
      let videoId = null;
      if (videoUrl.includes('youtube.com/watch')) {
          videoId = urlObj.searchParams.get('v');
      } else if (videoUrl.includes('youtu.be/')) {
          videoId = urlObj.pathname.substring(1);
      }
      return videoId;
  } catch(e) {
      return null;
  }
};

const App: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isAddItemModalOpen, setAddItemModalOpen] = useState(false);
  const [isAddGroupModalOpen, setAddGroupModalOpen] = useState(false);
  const [isStudyModalOpen, setStudyModalOpen] = useState(false);
  const [isGeneratingStudyGroup, setIsGeneratingStudyGroup] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartNewSession = () => {
    setGroups([]);
    setSelectedGroup(null);
    setSearchQuery('');
    setIsSessionActive(true);
  };
  
  const handleReturnToHome = () => {
    setIsSessionActive(false);
    // Reset state for a clean start next time
    setGroups([]);
    setSelectedGroup(null);
    setSearchQuery('');
  };

  const handleTriggerLoad = () => {
    fileInputRef.current?.click();
  };

  const handleLoadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const loadedGroups = await fileService.importData(file);
        setGroups(loadedGroups);
        setSelectedGroup(null);
        setSearchQuery('');
        setIsSessionActive(true);
      } catch (error) {
        alert(`Error loading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    // Reset file input to allow loading the same file again
    event.target.value = '';
  };
  
  const handleSaveFile = () => {
    fileService.exportData(groups);
  };

  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group);
  };

  const handleBackToGroups = () => {
    setSelectedGroup(null);
  };

  const handleAddGroup = (name: string) => {
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name,
      items: [],
      createdAt: new Date().toISOString(),
    };
    setGroups(prevGroups => [...prevGroups, newGroup]);
    setAddGroupModalOpen(false);
  };

  const handleAddItem = (item: Item) => {
    if (!selectedGroup) return;

    const updatedGroups = groups.map(g => {
      if (g.id === selectedGroup.id) {
        return { ...g, items: [...g.items, item] };
      }
      return g;
    });
    
    setAddItemModalOpen(false);
    setGroups(updatedGroups);
    setSelectedGroup(updatedGroups.find(g => g.id === selectedGroup.id) || null);
  };
  
  const handleDeleteGroup = (groupId: string) => {
    if (!window.confirm('Are you sure you want to delete this group and all its items? This action cannot be undone until you save.')) return;
    const updatedGroups = groups.filter(g => g.id !== groupId);
    setGroups(updatedGroups);
    setSelectedGroup(null);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!selectedGroup || !window.confirm('Are you sure you want to delete this item?')) return;
  
    const updatedGroups = groups.map(g => {
      if (g.id === selectedGroup.id) {
        return { ...g, items: g.items.filter(item => item.id !== itemId) };
      }
      return g;
    });
  
    setGroups(updatedGroups);
    setSelectedGroup(updatedGroups.find(g => g.id === selectedGroup.id) || null);
  };

  const handleGenerateStudyGroup = async (topic: string) => {
    setIsGeneratingStudyGroup(true);
    try {
      const resources = await aiService.generateStudyContent(topic);
      const newItems: Item[] = resources.map((resource, index) => {
        const baseItem = {
          id: `item-${Date.now()}-${index}`,
          title: resource.title,
          createdAt: new Date().toISOString(),
        };
        if (resource.type === 'VIDEO') {
          const videoId = getYoutubeVideoId(resource.url);
          const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';
          const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg`: undefined;
          return { ...baseItem, type: ItemType.Video, url: resource.url, embedUrl, thumbnailUrl } as VideoItem;
        }
        return { ...baseItem, type: ItemType.Link, url: resource.url } as LinkItem;
      });

      const newGroup: Group = {
        id: `group-${Date.now()}`,
        name: `Estudos: ${topic}`,
        items: newItems,
        createdAt: new Date().toISOString(),
      };

      setGroups(prev => [...prev, newGroup]);
      setIsSessionActive(true);
      setStudyModalOpen(false);
    } catch (error) {
      console.error("Failed to generate study group:", error);
      alert(`Error generating study materials: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingStudyGroup(false);
    }
  };


  if (!isSessionActive) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-black">
          <DriveIcon className="h-16 w-16 text-primary mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">Bem-vindo ao Drive Keep</h1>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button onClick={handleStartNewSession} className="flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors w-60">
              <FilePlusIcon className="w-5 h-5 mr-2" />
              Iniciar Nova Sessão
            </button>
            <button onClick={handleTriggerLoad} className="flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors w-60">
              <FileUpIcon className="w-5 h-5 mr-2" />
              Carregar do Arquivo
            </button>
            <button onClick={() => setStudyModalOpen(true)} className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 transition-colors w-60">
              <BrainIcon className="w-5 h-5 mr-2" />
              Modo de Estudo (IA)
            </button>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleLoadFile} accept=".json" className="hidden" />
        </div>
        <StudyModeModal
          isOpen={isStudyModalOpen}
          onClose={() => setStudyModalOpen(false)}
          onGenerate={handleGenerateStudyGroup}
          isGenerating={isGeneratingStudyGroup}
        />
      </>
    );
  }
  
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200">
      <Header onSave={handleSaveFile} onLoad={handleTriggerLoad} onNew={handleReturnToHome} />
      <main className="p-4 sm:p-6 lg:p-8">
        {selectedGroup ? (
          <GroupView group={selectedGroup} onBack={handleBackToGroups} onDeleteGroup={handleDeleteGroup} onDeleteItem={handleDeleteItem} />
        ) : (
          <GroupGrid 
            groups={filteredGroups} 
            onSelectGroup={handleSelectGroup}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}
      </main>

      {/* FAB */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => selectedGroup ? setAddItemModalOpen(true) : setAddGroupModalOpen(true)}
          className="bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-transform hover:scale-110"
          aria-label={selectedGroup ? "Add Item" : "Add Group"}
        >
          <PlusIcon className="h-8 w-8" />
        </button>
      </div>

      {isAddItemModalOpen && selectedGroup && (
        <AddItemModal 
          onClose={() => setAddItemModalOpen(false)}
          onAddItem={handleAddItem}
        />
      )}

      {isAddGroupModalOpen && (
        <AddGroupModal 
          onClose={() => setAddGroupModalOpen(false)}
          onAddGroup={handleAddGroup}
        />
      )}
       <input type="file" ref={fileInputRef} onChange={handleLoadFile} accept=".json" className="hidden" />
    </div>
  );
};

export default App;