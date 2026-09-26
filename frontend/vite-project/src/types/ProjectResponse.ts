
export interface ProjectResponse {
    id: string;
    name: string;
    ownerId: string;
    myRole: 'Owner' | 'Editor' | 'Viewer';
    createdAt: string;
    updatedAt: string;
}