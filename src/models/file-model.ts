interface owner{
    company: string
    name: string
    email: string
    username: string
}
export interface FileModel {
    id: string
    name: string
    path: string
    folderId: string
    folder: string
    pathLocal: string
    type: string
    size: string
    status: string
    version: Version[]
    owner: owner
    ownerId: string
    url: string
    isDeleted: boolean
    pin: boolean
    isDelete: boolean
    createdAt: string
    updatedAt: string
}

export interface Version {
    id: string;
    version: string;
    modifiedBy: string;
    modifiedAt: string;
    createdAt: string;
    updateBy: string;
    event: string;
  }
  



