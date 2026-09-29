import type { DiagramSummaryResponse } from "../../types/DiagramResponse";

import type { ProjectResponse } from "../../types/ProjectResponse";
import { getRoleName, Role } from "../../types/Role";
interface DiagramCardProps{
    project: ProjectResponse,
    diagram: DiagramSummaryResponse,
    onDelete: (projectId: string, diagramId: string) => void;
}

export function DiagramCard({diagram, project, onDelete}: DiagramCardProps){
    return(
        <div>
            <h3>{diagram.name}</h3>
            <span>Rol: {project.myRole === null ? "Sin rol" : getRoleName(project.myRole)}</span>
            {project.myRole === Role.Owner || project.myRole === Role.Editor &&(
                <button type="button" onClick={() => onDelete(project.id, diagram.id)}>Borrar</button>
            )} 
        </div>
    );
}