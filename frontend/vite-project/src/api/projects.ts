//api/project.ts
//File to call the backend endpoints related to project

import {apiFetch, extractErrorMessage} from "./client";
import { type ProjectResponse } from "../types/ProjectResponse";

//with default diagrams receives the project and
//returns it with its diagram(if it has) or a null(it it doesn't have)
function withDefaultDiagrams(project: ProjectResponse): ProjectResponse {
    return { ...project, Diagrams: project.Diagrams ?? null };
}
//now, on each answer, if it returns a ProjectResponse,
//it needs to return it with diagrams, if they don't have diagrams,
//it sets its value as null


export async function getMyProjects(): Promise<ProjectResponse[]>{
    const response = await apiFetch('/api/projects');
    if(!response.ok) throw new Error(await extractErrorMessage(response, 'Error al cargar proyectos'));
    const projects: ProjectResponse[] = await response.json();
    return projects.map(withDefaultDiagrams);
}

export async function getById(projectId: string): Promise<ProjectResponse>{
    const response = await apiFetch(`/api/projects/${projectId}`);
    if(!response.ok) throw new Error(await extractErrorMessage(response, 'Error al cargar proyecto'));
    const project: ProjectResponse = await response.json();
    return withDefaultDiagrams(project);
}

export async function createProject(name: string): Promise<ProjectResponse>{
    const response = await apiFetch('/api/projects' , {
        method: 'POST',
        body: JSON.stringify({name})
    });
    if(!response.ok) throw new Error(await extractErrorMessage(response, 'Error al crear proyecto'));
    const project: ProjectResponse = await response.json();
    return withDefaultDiagrams(project);
}


export async function deleteProject(projectId: string): Promise<void>{
    const response = await apiFetch(`/api/projects/${projectId}` ,{
        method: 'DELETE'
    } );

    if(!response.ok){
        throw new Error(await extractErrorMessage(response, "Error al eliminar el proyecto"));
    }

}