
import { apiFetch, extractErrorMessage  } from "./client";
import { type DiagramResponse, type DiagramSummaryResponse } from "../types/DiagramResponse";


export async function getAllDiagrams(projectId: string): Promise<DiagramSummaryResponse[]>{
    const response = await apiFetch(`/api/projects/${projectId}/diagrams`);
    if(!response.ok) throw Error(await extractErrorMessage(response, 'Error al cargar diagramas'));
    return response.json();
}

//obtain diagram using its Id, it returns a whole diagram response because it will be used 
//to get the canvas from the backend, so it does need more than just a diagramSummary
export async function getDiagramById(projectId: string, diagramId: string): Promise<DiagramResponse>{
    const response = await apiFetch(`/api/projects/${projectId}/diagrams/${diagramId}`);
    if(!response.ok) throw Error(await extractErrorMessage(response, 'Error al buscar diagrama mediante id'));
    return response.json();
}

export async function createDiagram(projectId: string, name: string ): Promise<DiagramResponse>{

    const response = await apiFetch(`/api/projects/${projectId}/diagrams`, {
        method: 'POST',
        body: JSON.stringify({name})
    });

    if(!response.ok) throw Error(await extractErrorMessage(response, 'Error al crear el diagrama'));

    return response.json();
}

export async function deleteDiagram(projectId: string, diagramId: string): Promise<void>{
    const response = await apiFetch(`/api/projects/${projectId}/diagrams/${diagramId}`,
        {
            method: 'DELETE'
        });
    if(!response.ok) throw Error(await extractErrorMessage(response, 'Error al borrar el diagrama'));
}

//method to update the diagram
export async function updateDiagram(

    projectId: string,
    diagramId: string,
    name: string,
    content: string,
    rowVersion: string,
): Promise<DiagramResponse>{

    const response = await apiFetch(`/api/projects/${projectId}/diagrams/${diagramId}`, {
        method: 'PUT',
        body: JSON.stringify({name, content, rowVersion})
    });

    if(response.status == 409){
        throw new ConcurrencyError(await extractErrorMessage(response, 'Conflicto de version'));
    }
    if(!response.ok){
        throw new Error(await extractErrorMessage(response, 'Error al guardar el diagrama'));
    }

    return response.json();

}

export class ConcurrencyError extends Error{};