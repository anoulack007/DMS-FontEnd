import { IconType } from "../enums/icon-enums";
import { STATUS_ENUMS } from "../enums/status-enum";
import { MemberModel } from "./member-model";

export interface Document {
  id: string;
  name: string;
  fileMember: fileMember;
  ownerId: string;
  files: FileModel;
  folders: folderModel;
  folderMembers: folderMember;
  folderId: string;
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
    id: string;
    username: string;
    email: string;
  };
  url: string;
  isFolder: boolean;
  parentId: string;
  isPinned: boolean;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
  isShared: boolean;
  //  members: MemberModel[];
  members: {
    userId: string;
    user: {
      id: string;
    };
  }
  // Permission flags
  hasAccess: boolean;
  canView: boolean;
  isOwner: boolean;
  isDisabled: boolean;
  isMember: boolean;
  canSelect: boolean;
  accessLevel: 'owner' | 'member' | 'public-readonly' | 'no-access';
  canNavigate: boolean;
}

export interface folderModel {
  id: string;
  folderId: string;
  members: {
    user:{
      id: string;
    }
  };
  name: string;
  ownerId: string;
  path: string;
  size: string;
  status: string;
  userId: string;
  owner: {
    id: string;
    username: string;
    email: string;
  };
  parentId: string;
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
  fileMember: {
    user:{
      id: string;
    }
  };
  owner: {
    id: string;
    username: string;
    emall: string;
  };
  pathLocal: string;
  pin: string;
  version: string;
  name: string;
  ownerId: string;
  path: string;
  type: string;
  url: string;
  size: string;
  status: string;
  isDeleted: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  members: MemberModel[];
  // Permission flags
  hasAccess: boolean;
  canView: boolean;
  isOwner: boolean;
  isDisabled: boolean;
}

export interface folderMember {
  createdAt: string;
  folderId: string;
  folder: folderModel;
  id: string;
  user: {
    id: string;
  }
  owner: {
    id: string;
    username: string;
    email: string;
  };
  members: MemberModel[];
  updatedAt: string;
  userId: string;
  path: string;
}

export interface fileMember {
  createdAt: string;
  fileId: string;
  file: FileModel;
  id: string;
  user:{
    id: string;
    username: string;
  }
  owner: {
    id: string;
    username: string;
    email: string;
  };
  updatedAt: string;
  userId: string;
}

export interface Subfolder {
  id: string;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  members : {
    user: {
      id: string;
    }
  }
  owner: {
    id: string;
    username: string;
    email: string;
  };
  folderId: string;
  isDeleted: boolean;
  isPinned: boolean;
  name: string;
  itemType: string;
  type: string;
  ownerid: string;
  parentId: string;
  path: string;
  size: number;
  status: string;
}

