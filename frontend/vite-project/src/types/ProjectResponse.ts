import type { Role } from "./Role";

export interface ProjectResponse {
    id: string;
    name: string;
    ownerId: string;
    myRole: Role | null;
    createdAt: string;
    updatedAt: string;
}