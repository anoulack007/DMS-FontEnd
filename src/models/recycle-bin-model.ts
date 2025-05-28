// import { folderModel } from "./Document";

interface Owner {
  company: string;
  email: string;
  name: string;
  username: string;
}

export interface RecycleBinDocument {
  id: string;
  name: string;
  documentId: string;
  documentNumber: string;
  path: string;
  pathLocal: string;
  type: string;
  url: string;
  size: number;
  version: string;
  status: string;
  ownerId: string;
  folderId: string;
  pin: boolean;
  isDeleted: boolean;
  createdAt: string; 
  updatedAt: string; 
  owner: Owner;
  folder: {
    name: string;
    path: string;
  };
}
