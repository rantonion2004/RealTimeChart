import type { ProjectResponse } from '../../types/ProjectResponse';

interface ProjectCardProps {
    project: ProjectResponse;
    onDelete:(id: string) => void;
    onOpen:(id: string) => void;
}

export function ProjectCard({project, onDelete, onOpen}: ProjectCardProps){
    return(
        <div>
            <button type="button" onClick={() => onOpen(project.id)}>
                <h3>{project.name}</h3>
            </button>
            <span>Rol: {project.myRole}</span>
            {project.myRole == 'Owner' && (
                <button onClick={() => onDelete(project.id)}>borrar</button>
            )} 
        </div>
    );
}