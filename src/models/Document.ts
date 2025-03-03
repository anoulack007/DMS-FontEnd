import { IconType } from "../enums/icon-enums";
import { STATUS_ENUMS } from "../enums/status-enum";

export interface Document {
  id: string;
  name: string;
  fileMembers: fileMember;
  files: FileModel;
  folders: folderModel;
  folderMembers: folderMember;
  path: string;
  documentId: string;
  modified: string;
  size: string;
  type: IconType;
  itemType: string;
  version: string;
  documentNumber: string;
  status: STATUS_ENUMS;
  owner: {
    company: string;
    email: string;
    name: string;
    username: string;
  };
  url: string;
  isFolder: boolean;
  parentId: string;
  isPinned: boolean;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface folderModel {
  id: string;
  name: string;
  ownerId: string;
  path: string;
  size: string;
  status: string;
  userId: string;
  isDeleted: boolean;
  isPinned: boolean;
  documentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileModel {
  id: string;
  documentNumber: string;
  documentId: string;
  folderId: string;
  nameVersion: string;
  pathLocal: string;
  pin: string;
  version: string;
  name: string;
  ownerId: string;
  path: string;
  type: string;
  size: string;
  status: string;
  isDeleted: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface folderMember {
  createdAt : string;
  folderId : string;
  folder: folderModel;
  id : string;
  updatedAt: string
  userId: string;
}

export interface fileMember {
  createdAt : string;
  fileId : string;
  file: FileModel;
  id : string;
  updatedAt: string
  userId: string;
}
