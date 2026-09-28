import { ProjectCard } from "./ProjectCard";
import { useProjects } from "./useProjects";
import { useState } from "react";
import { type FormEvent } from "react";
import { DiagramList } from "../diagrams/DiagramList";
import type { ProjectResponse } from "../../types/ProjectResponse";

export function ProjectList(){
    
    const {projects, loading, error, addProject, removeProject, updateProjectDiagrams} = useProjects();
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const selectedProject: ProjectResponse | null =
        projects.find((project) => project.id === selectedProjectId) ?? null;

    async function handleCreate(e: FormEvent){
        
        e.preventDefault();
        if(!newName.trim()) return;

        setCreating(true);
        setCreateError(null);

        try{
            await addProject(newName.trim());
            setNewName('');
        } catch (err){
            setCreateError(err instanceof Error ? err.message: 'Error al crear proyecto');
        } finally {
            setCreating(false);
        }
    }

    async function handleDelete(projectId: string){
        if (!confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) return;
        try{
            await removeProject(projectId);
        }catch(err){
            alert(err instanceof Error ? err.message : 'Error al eliminar proyecto');
        }
    }

    return(
        <div>
            
            <form onSubmit={handleCreate}>
                <input
                    type="text"
                    placeholder="Nombre del proyecto"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button type="submit" disabled={creating}>
                    {creating? 'Creando...': 'Crear proyecto'}
                </button>
                {createError && <p role='alerts'>{createError}</p>}
            </form>

            {loading && <p>Cargando proyectos...</p>}
            {error && <p role="alert">{error}</p>}
            {!loading && !error && projects.length === 0 && (
                <p>Aún no tienes proyectos. Crea el primero arriba.</p>
            )}

            <div>
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onDelete={handleDelete}
                        onOpen={setSelectedProjectId}
                    />
                ))}
            </div>

            {selectedProject && (
                <div
                    className="project-modal-backdrop"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) setSelectedProjectId(null);
                    }}
                >
                    <section
                        className="project-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="project-modal-title"
                    >
                        <header className="project-modal-header">
                            <h2 id="project-modal-title">{selectedProject.name}</h2>
                            <button
                                type="button"
                                aria-label="Cerrar"
                                onClick={() => setSelectedProjectId(null)}
                            >
                                Cerrar
                            </button>
                        </header>
                        <DiagramList
                            project={selectedProject}
                            onDiagramsChange={updateProjectDiagrams}
                        />
                    </section>
                </div>
            )}

        </div>
    );


}