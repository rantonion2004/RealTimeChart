import type { DiagramSummaryResponse } from "./DiagramResponse";
import type { Role } from "./Role";

export interface ProjectResponse {
    id: string;
    name: string;
    ownerId: string;
    myRole: Role;
    createdAt: string;
    updatedAt: string;
    Diagrams: DiagramSummaryResponse[] | null;
}