import type { DiagramSummaryResponse } from "../../types/DiagramResponse";

import type { ProjectResponse } from "../../types/ProjectResponse";
interface DiagramCardProps{
    project: ProjectResponse,
    diagram: DiagramSummaryResponse,
    onDelete: (projectId: string, diagramId: string) => void;
}

export function DiagramCard({diagram, project, onDelete}: DiagramCardProps){
    return(
        <div>
            <h3>{diagram.name}</h3>
            <span>Rol: {project.myRole}</span>
            {project.myRole === 'Owner' &&(
                <button type="button" onClick={() => onDelete(project.id, diagram.id)}>Borrar</button>
            )} 
        </div>
    );
}