
export type MemberPermission = 'VIEW' | 'EDIT' | 'ADMIN';
export interface MemberModel {
  id: string;
  createdAt: string;
  permissions: MemberPermission;
  userId: string;
  folderId: string;
  members: Document[]
  file: {
    owner: {
      image: {
        url: string;
        filename: string;
        mimetype: string;
        path: string;
      };
    };
  };
  fileId: string;
  updatedAt: string;
  user: {
    id: string;
    role: string;
    image: {
      url: string;
      filename: string;
      mimetype: string;
      path: string;
    };
    email: string;
    name: string;
    username: string;
    company: string;
  };
}
