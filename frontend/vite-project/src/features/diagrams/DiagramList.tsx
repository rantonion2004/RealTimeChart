
import { DiagramCard } from "./DiagramCard";
//import { DiagramSummaryResponse } from "../../types/DiagramResponse";
import { useDiagrams } from "./useDiagrams";
import type { ProjectResponse } from "../../types/ProjectResponse";
import { type FormEvent } from "react";
import { useState } from "react";

interface DiagramListProps {
    project: ProjectResponse;
    onDiagramsChange: (
        projectId: string,
        diagrams: NonNullable<ProjectResponse["Diagrams"]>,
    ) => void;
}

export function DiagramList({project, onDiagramsChange}: DiagramListProps){

    const {diagrams, loading, error, addDiagram, removeDiagram} =
        useDiagrams(project, onDiagramsChange);
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    async function handleCreate(e: FormEvent){
        e.preventDefault();
        if(!newName.trim()) return;

        setCreating(true);
        setCreateError(null);

        try{
            await addDiagram(newName.trim(), project.id);
            setNewName('');
        } catch(err){
            setCreateError(err instanceof Error ? err.message : 'Error desconocido');
        }finally{
            setCreating(false);
        }
    }

    async function handleDelete(projectId: string, diagramId: string){
        if (!confirm('¿Eliminar este diagrama Esta acción no se puede deshacer.')) return;
        try{
            await removeDiagram(projectId, diagramId);
        }catch(err){
            alert(err instanceof Error ? err.message : 'Error al eliminar diagrama');
        }
    }

    return( 
        <div>
            <form onSubmit={handleCreate}>
                <input
                    type="text"
                    placeholder="Nombre del diagrama"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />

                <button  type="submit" disabled={creating}>
                    {creating? 'Creando...': 'Crear diagrama'}
                </button>
                {createError && <p role='alerts'>{createError}</p>}
            </form>

            {loading && <p>Cargando diagramas...</p>}
            {error && <p role="alert">{error}</p>}
            {!loading && !error && diagrams.length === 0 && (
                <p>Aún no tienes diagramas. Crea el primero arriba.</p>
            )}

            <div>
                {diagrams.map((diagram) => (
                    <DiagramCard
                        key={diagram.id}
                        diagram={diagram}
                        project={project}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

        </div>
    );
}