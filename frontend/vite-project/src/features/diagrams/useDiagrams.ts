import { useState, useEffect } from "react";
import { deleteDiagram, createDiagram, getAllDiagrams, } from "../../api/diagrams";
import { type DiagramSummaryResponse } from "../../types/DiagramResponse";
import { type ProjectResponse } from "../../types/ProjectResponse";

type DiagramsChangeHandler = (
    projectId: string,
    diagrams: DiagramSummaryResponse[],
) => void;

export function useDiagrams(
    project: ProjectResponse,
    onDiagramsChange: DiagramsChangeHandler,
){
    const [diagrams, setDiagrams] = useState<DiagramSummaryResponse[]>(project.Diagrams ?? []);
    const [loading, setLoading] = useState(project.Diagrams === null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        if (project.Diagrams !== null) return;

        getAllDiagrams(project.id)
            .then((data) => {
                if (active) {
                    setDiagrams(data);
                    onDiagramsChange(project.id, data);
                }
            })
            .catch((err: unknown) => {
                if (active) {
                    setError(err instanceof Error ? err.message : "Error desconocido");
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };

    }, [project.id, project.Diagrams, onDiagramsChange]);

    async function addDiagram(name: string, projectId: string){
        const newDiagram = await createDiagram(projectId, name);
        const updatedDiagrams = [newDiagram, ...diagrams];
        setDiagrams(updatedDiagrams);
        onDiagramsChange(projectId, updatedDiagrams);
    }

    async function removeDiagram(projectId: string, diagramId: string){
        await deleteDiagram(projectId, diagramId);
        const updatedDiagrams = diagrams.filter((diagram) => diagram.id !== diagramId);
        setDiagrams(updatedDiagrams);
        onDiagramsChange(projectId, updatedDiagrams);
    }

    return {    
        diagrams,
        loading,
        error,
        addDiagram,
        removeDiagram

    };
}

