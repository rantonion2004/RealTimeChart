//api/project.ts
//File to call the backend endpoints related to project

import {apiFetch, extractErrorMessage} from "./client";
import { type ProjectResponse } from "../types/ProjectResponse";


export async function getMyProjects(): Promise<ProjectResponse[]>{
    const response = await apiFetch('/api/projects');
    if(!response.ok) throw new Error(await extractErrorMessage(response, 'Error al cargar proyectos'));
    return response.json();
}

export async function getById(projectId: string): Promise<ProjectResponse>{
    const response = await apiFetch(`/api/projects/${projectId}`);
    if(!response.ok) throw new Error(await extractErrorMessage(response, 'Error al cargar proyecto'));
    return response.json();
}

export async function createProject(name: string): Promise<ProjectResponse>{
    const response = await apiFetch('/api/projects' , {
        method: 'POST',
        body: JSON.stringify({name})
    });
    if(!response.ok) throw new Error(await extractErrorMessage(response, 'Error al crear proyecto'));
    return response.json();
}


export async function deleteProject(projectId: string): Promise<void>{
    const response = await apiFetch(`/api/projects/${projectId}` ,{
        method: 'DELETE'
    } );

    if(!response.ok){
        throw new Error(await extractErrorMessage(response, "Error al eliminar el proyecto"));
    }

}