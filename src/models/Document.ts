export interface Document {
  id: string;
  name: string;
  path: string;
  documentId: string;
  modified: string;
  fileSize: string;
  status: string;
  isFolder: boolean;
  parentId: string;
  isPinned: boolean;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
}
