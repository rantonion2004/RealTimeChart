import {Link} from 'react-router-dom';
import type { ProjectResponse } from '../../types/ProjectResponse';

interface ProjectCardProps {
    project: ProjectResponse;
    onDelete:(id: string) => void;
}

export function ProjectCard({project, onDelete}: ProjectCardProps){
    return(
        <div>
            <Link to={`/projects/${project.id}`}>
                <h3>{project.name}</h3>
            </Link>
            <span>Rol: {project.myRole}</span>
            {project.myRole === 'Owner' &&(
                <button onClick={() => onDelete(project.id)}></button>
            )} 
        </div>
    );
}