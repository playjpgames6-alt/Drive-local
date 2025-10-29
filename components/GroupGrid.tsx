
import React from 'react';
import { Group } from '../types';
import { FolderIcon, SearchIcon } from './Icons';

interface GroupGridProps {
  groups: Group[];
  onSelectGroup: (group: Group) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const GroupGrid: React.FC<GroupGridProps> = ({ groups, onSelectGroup, searchQuery, onSearchChange }) => {
  const handleNoGroups = () => {
    if (searchQuery) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No groups found</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Try a different search term.</p>
            </div>
        );
    }
    return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No groups yet!</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Click the '+' button to create your first group.</p>
        </div>
    );
  }

  return (
    <div className="animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">My Groups</h2>
        
        <div className="mb-6">
            <div className="relative w-full max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                type="text"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full p-2 pl-10 border rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Search groups"
                />
            </div>
        </div>

        {groups.length === 0 ? handleNoGroups() : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {groups.map((group) => (
                <div
                key={group.id}
                onClick={() => onSelectGroup(group)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center justify-center aspect-square cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                <FolderIcon className="w-16 h-16 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200">{group.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{group.items.length} items</p>
                </div>
            ))}
            </div>
        )}
    </div>
  );
};

export default GroupGrid;
