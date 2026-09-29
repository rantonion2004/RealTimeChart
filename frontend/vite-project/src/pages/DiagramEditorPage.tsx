import {useParams, Link} from 'react-router-dom'


export function DiagramEditorPage(){
    
    const { projectId, diagramId } = useParams<{ projectId: string; diagramId: string }>();

    return(
        <div>
            
            <Link to="/projects"> Volver a projectos </Link>
            <h1>Editor de diagrama</h1>
            <p>Proyecto: {projectId}</p>
            <p>Diagrama: {diagramId}</p>
            <p><em>Aquí va el canvas de React Flow.</em></p>


        </div>
    );

}