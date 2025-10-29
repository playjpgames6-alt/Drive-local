import React from 'react';
import { DriveIcon, SaveIcon, FileUpIcon, FilePlusIcon } from './Icons';

interface HeaderProps {
  onSave: () => void;
  onLoad: () => void;
  onNew: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSave, onLoad, onNew }) => {
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <DriveIcon className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Drive Keep</h1>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={onSave}
          className="flex items-center px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors text-sm"
        >
          <SaveIcon className="w-4 h-4 mr-2" />
          Save
        </button>
        <button 
          onClick={onLoad}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          <FileUpIcon className="w-4 h-4 mr-2" />
          Load
        </button>
        <button 
          onClick={() => {
            if (window.confirm("Are you sure you want to start a new session? Any unsaved changes will be lost.")) {
              onNew();
            }
          }}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          <FilePlusIcon className="w-4 h-4 mr-2" />
          New
        </button>
      </div>
    </header>
  );
};

export default Header;
