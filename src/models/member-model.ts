
export interface MemberModel {
    id: string;
    createdAt: string;
    userId: string;
    fileId: string;
    updatedAt: string;
    user: {
        image: {
            url: string;
            filename: string;
            mimetype: string;
            path: string;
        }
    email: string;
    name: string;
    username: string;
    company: string;
    }
}