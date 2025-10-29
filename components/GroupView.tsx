
import React from 'react';
import { Group } from '../types';
import ItemCard from './ItemCard';
import { ArrowLeftIcon, TrashIcon } from './Icons';

interface GroupViewProps {
  group: Group;
  onBack: () => void;
  onDeleteGroup: (groupId: string) => void;
  onDeleteItem: (itemId: string) => void;
}

const GroupView: React.FC<GroupViewProps> = ({ group, onBack, onDeleteGroup, onDeleteItem }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center text-primary hover:underline">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Groups
        </button>
        <button 
          onClick={() => onDeleteGroup(group.id)}
          className="flex items-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors text-sm"
        >
          <TrashIcon className="w-4 h-4 mr-2"/>
          Delete Group
        </button>
      </div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">{group.name}</h2>
      
      {group.items.length === 0 ? (
         <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">This group is empty.</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Click the '+' button to add an item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {group.items.map((item) => (
            <ItemCard key={item.id} item={item} onDelete={() => onDeleteItem(item.id)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupView;
