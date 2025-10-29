import React, { useState } from 'react';
import { Item, ItemType, VideoItem, FileItem } from '../types';
import { LinkIcon, ImageIcon, VideoIcon, TrashIcon, PlayIcon, FileIcon, DownloadIcon } from './Icons';

interface ItemCardProps {
  item: Item;
  onDelete: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onDelete }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const renderContent = () => {
    switch (item.type) {
      case ItemType.Image:
        return <img src={item.url} alt={item.title} className="w-full h-48 object-cover" />;
      case ItemType.Video:
        const videoItem = item as VideoItem;
        if (videoItem.thumbnailUrl && !isPlaying) {
            return (
                <div
                    className="relative w-full h-48 bg-black flex items-center justify-center cursor-pointer group"
                    onClick={() => setIsPlaying(true)}
                    aria-label={`Play video: ${item.title}`}
                >
                    <img src={videoItem.thumbnailUrl} alt={videoItem.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                        <PlayIcon className="w-16 h-16 text-white drop-shadow-lg" />
                    </div>
                </div>
            );
        }

        const embedUrl = videoItem.embedUrl;
        if (embedUrl) {
          return (
            <div className="w-full h-48">
              <iframe
                src={`${embedUrl}?autoplay=1`}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              ></iframe>
            </div>
          );
        }
        return <div className="h-48 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-red-500">Invalid YouTube URL</div>;
      case ItemType.Link:
        return (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="block p-4 h-48 flex flex-col justify-center items-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <LinkIcon className="w-12 h-12 text-primary" />
            <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-300 break-all">{item.url}</p>
          </a>
        );
      case ItemType.File:
        const fileItem = item as FileItem;
        return (
            <div className="p-4 h-48 flex flex-col justify-center items-center bg-gray-200 dark:bg-gray-700">
                <FileIcon className="w-12 h-12 text-primary" />
                <p className="mt-2 text-sm font-semibold text-center text-gray-700 dark:text-gray-300 break-all">{fileItem.fileName}</p>
                <a 
                    href={fileItem.fileUrl} 
                    download={fileItem.fileName} 
                    className="mt-4 inline-flex items-center px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-full shadow-md hover:bg-primary-dark transition-colors"
                    onClick={(e) => e.stopPropagation()}
                >
                    <DownloadIcon className="w-4 h-4 mr-1"/>
                    Download
                </a>
            </div>
        );
      default:
        return null;
    }
  };
  
  const ItemIcon = ({ type }: { type: ItemType }) => {
    switch(type) {
        case ItemType.Image: return <ImageIcon className="w-5 h-5 text-gray-500"/>
        case ItemType.Video: return <VideoIcon className="w-5 h-5 text-gray-500"/>
        case ItemType.Link: return <LinkIcon className="w-5 h-5 text-gray-500"/>
        case ItemType.File: return <FileIcon className="w-5 h-5 text-gray-500"/>
        default: return null;
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col justify-between animate-slide-up">
      {renderContent()}
      <div className="p-4">
        <div className="flex justify-between items-start">
            <div className="flex-1 mr-2">
                <h3 className="font-bold text-gray-800 dark:text-white break-words">{item.title}</h3>
                <div className="flex items-center mt-1 space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <ItemIcon type={item.type} />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Delete item"
            >
              <TrashIcon className="w-5 h-5"/>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;