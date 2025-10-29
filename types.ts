export enum ItemType {
  Link = 'LINK',
  Image = 'IMAGE',
  Video = 'VIDEO',
  File = 'FILE',
}

export interface BaseItem {
  id: string;
  title: string;
  type: ItemType;
  createdAt: string;
}

export interface LinkItem extends BaseItem {
  type: ItemType.Link;
  url: string;
}

export interface ImageItem extends BaseItem {
  type: ItemType.Image;
  url: string; // can be a data URL from upload or a remote URL
}

export interface VideoItem extends BaseItem {
  type: ItemType.Video;
  url: string; // original YouTube URL
  embedUrl: string;
  thumbnailUrl?: string;
}

export interface FileItem extends BaseItem {
  type: ItemType.File;
  fileName: string;
  fileType: string;
  fileUrl: string; // data URL
}

export type Item = LinkItem | ImageItem | VideoItem | FileItem;

export interface Group {
  id: string;
  name: string;
  items: Item[];
  createdAt: string;
}
