//api/project.ts
//File to call the backend endpoints related to project

import {apiFetch} from "./client";

export interface ProjectResponse {
    id: string;
    name: string;
    ownerId: string;
    myRole: 'Owner' | 'Editor' | 'Viewer';
    createdAt: string;
    updatedAt: string;
}

export async function getMyProjects(): Promise<ProjectResponse[]>{
    const response = await apiFetch('/api/projects');
    if(!response.ok) throw new Error('Error al cargar proyectos');
    return response.json();
}

export async function createProject(name: string): Promise<ProjectResponse>{
    const response = await apiFetch('/api/projects' , {
        method: 'POST',
        body: JSON.stringify({name})
    });
    if(!response.ok) throw new Error('Error al crear el proyecto');
    return response.json();
}