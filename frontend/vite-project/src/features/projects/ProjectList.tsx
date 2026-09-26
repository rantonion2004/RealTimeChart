import { ProjectCard } from "./ProjectCard";
import { useProjects } from "./useProjects";
import { useState } from "react";
import { type FormEvent } from "react";

export function ProjectList(){
    
    const {projects, loading, error, addProject, removeProject} = useProjects();
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

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
                    <ProjectCard key={project.id} project={project} onDelete={handleDelete}/>
                ))}
            </div>

        </div>
    );


}