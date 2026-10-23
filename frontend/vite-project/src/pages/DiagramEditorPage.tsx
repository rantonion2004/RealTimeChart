import {useParams,} from 'react-router-dom'
import { useDiagram } from '../features/diagrams/useDiagram';
import { DiagramCanvas } from '../features/diagrams/DiagramCanvas';

export function DiagramEditorPage(){
    
    const { projectId, diagramId } = useParams<{ projectId: string; diagramId: string }>();
    const {name, content, loading, error, saving, conflict, save, reload} = useDiagram(projectId!, diagramId!);

    if(loading) return <p>Cargando diagrama</p>
    if(error) return <p role="alert">{error}</p>

    return(
        <div style={{height: '100%', position:'relative'}}>
            <div style={{backgroundColor: 'gray'}}>
                <h1>{name}</h1>
            </div>
            
            {conflict && (
                <div role="alert">
                    <p>Este diagrama fue mofificado por alguien mas mientras editabas</p>
                    <button onClick={reload}>Recargar para version mas reciente</button>
                </div>
            )}

            {saving && <span> Guardando...</span>}

            <DiagramCanvas content={content} onSave={save}/>

        </div>
    );

}