import React, { useState, useEffect, useCallback } from 'react';
import { Item, ItemType, LinkItem, ImageItem, VideoItem, FileItem } from '../types';
import { XIcon, LinkIcon, ImageIcon, VideoIcon, FileIcon } from './Icons';

interface AddItemModalProps {
  onClose: () => void;
  onAddItem: (item: Item) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onAddItem }) => {
  const [activeTab, setActiveTab] = useState<ItemType>(ItemType.Link);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

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

  const debounce = (func: Function, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const fetchYoutubeInfo = async (videoUrl: string) => {
    if (!getYoutubeVideoId(videoUrl)) {
      setThumbnailPreview(null);
      return;
    }

    setIsFetching(true);
    setError('');
    try {
      const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(videoUrl)}`);
      if (!response.ok) throw new Error('Failed to fetch video data');
      const data = await response.json();

      if (data.error) throw new Error(data.error);

      if (data.title && !title.trim()) {
        setTitle(data.title);
      }
      if (data.thumbnail_url) {
        setThumbnailPreview(data.thumbnail_url);
      }
    } catch (err) {
      console.error('Failed to fetch YouTube info:', err);
      setThumbnailPreview(null);
    } finally {
      setIsFetching(false);
    }
  };
  
  const debouncedFetch = useCallback(debounce(fetchYoutubeInfo, 500), [title]);

  useEffect(() => {
    if (activeTab === ItemType.Video) {
      debouncedFetch(url);
    } else {
      setThumbnailPreview(null);
    }
  }, [url, activeTab, debouncedFetch]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUrl(''); // clear URL if file is selected
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title) {
      setError('Title is required.');
      return;
    }

    let newItem: Item | null = null;
    const baseItem = {
      id: `item-${Date.now()}`,
      title,
      createdAt: new Date().toISOString(),
    };

    const handleFileRead = (file: File, type: ItemType.Image | ItemType.File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        let fileItem: Item;
        if (type === ItemType.Image) {
            fileItem = { ...baseItem, type: ItemType.Image, url: reader.result as string } as ImageItem;
        } else {
            fileItem = { ...baseItem, type: ItemType.File, fileUrl: reader.result as string, fileName: file.name, fileType: file.type } as FileItem;
        }
        onAddItem(fileItem);
      };
      reader.readAsDataURL(file);
    };

    switch (activeTab) {
      case ItemType.Link:
        if (!url || !url.startsWith('http')) {
          setError('A valid URL is required.');
          return;
        }
        newItem = { ...baseItem, type: ItemType.Link, url } as LinkItem;
        break;
      
      case ItemType.Image:
        if (selectedFile) {
          handleFileRead(selectedFile, ItemType.Image);
          return; 
        }
        if (!url || !url.startsWith('http')) {
          setError('A valid image URL is required.');
          return;
        }
        newItem = { ...baseItem, type: ItemType.Image, url } as ImageItem;
        break;

      case ItemType.Video:
        const videoId = getYoutubeVideoId(url);
        if (!videoId) {
          setError('A valid YouTube video URL is required.');
          return;
        }
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        newItem = { ...baseItem, type: ItemType.Video, url, embedUrl, thumbnailUrl: thumbnailPreview || undefined } as VideoItem;
        break;

      case ItemType.File:
        if (selectedFile) {
          handleFileRead(selectedFile, ItemType.File);
          return; 
        }
        setError('A file is required.');
        return;
    }

    if (newItem) {
      onAddItem(newItem);
    }
  };
  
  const renderFormFields = () => {
    switch(activeTab) {
      case ItemType.Image:
        return <>
          <input type="text" value={url} onChange={(e) => { setUrl(e.target.value); setSelectedFile(null); }} placeholder="Or paste image URL" className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 mb-2"/>
          <div className="text-center my-2 text-sm text-gray-500">OR</div>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
        </>;
      case ItemType.Video:
        return <>
            <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="YouTube Video URL" className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"/>
            {isFetching && <p className="text-sm text-gray-500 mt-2 animate-pulse">Fetching video details...</p>}
            {thumbnailPreview && !isFetching && (
                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
                    <img src={thumbnailPreview} alt="Video thumbnail preview" className="rounded-lg w-full border dark:border-gray-600" />
                </div>
            )}
        </>;
      case ItemType.File:
        return <>
          <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
          {selectedFile && <p className="text-sm text-gray-500 mt-2">Selected: {selectedFile.name}</p>}
        </>;
      case ItemType.Link:
      default:
        return <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="URL" className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"/>;
    }
  };

  const TabButton = ({ type, icon, label }: { type: ItemType, icon: React.ReactNode, label: string }) => (
    <button 
      type="button" 
      onClick={() => {
        setActiveTab(type);
        setError('');
        setSelectedFile(null);
        setUrl('');
      }}
      className={`flex-1 flex items-center justify-center p-3 text-sm font-medium border-b-2 transition-colors ${activeTab === type ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fade-in z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md animate-slide-up">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold">Add New Item</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><XIcon className="w-6 h-6"/></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="border-b dark:border-gray-700 flex">
            <TabButton type={ItemType.Link} icon={<LinkIcon className="w-5 h-5"/>} label="Link" />
            <TabButton type={ItemType.Image} icon={<ImageIcon className="w-5 h-5"/>} label="Image" />
            <TabButton type={ItemType.Video} icon={<VideoIcon className="w-5 h-5"/>} label="Video" />
            <TabButton type={ItemType.File} icon={<FileIcon className="w-5 h-5"/>} label="File" />
          </div>

          <div className="p-6 space-y-4">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"/>
            {renderFormFields()}
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark">Add Item</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;