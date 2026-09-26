export interface DiagramSummaryResponse {
    id: string;
    name: string;
    updatedAt: string;
}

export interface DiagramResponse {

    id: string;
    projectId: string;
    name: string
    content: string
    updatedAt: string;
    rowVersion: string;
}