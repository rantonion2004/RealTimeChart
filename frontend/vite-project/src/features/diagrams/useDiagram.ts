
import {useState, useEffect, useCallback} from 'react';
import { getDiagramById, updateDiagram, ConcurrencyError } from '../../api/diagrams';
import { parseContent, serializeContent, type DiagramContent } from '../../types/DiagramContent';

export function useDiagram(projectId: string, diagramId: string){
    
    const [name, setName] = useState('');
    const [content, setContent] = useState<DiagramContent>({nodes: [], edges: []});
    const [rowVersion, setRowVersion] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string |null>(null);
    const [saving, setSaving] = useState(false);
    const [conflict, setConflict] = useState(false);

    useEffect(() => {

        let active = true;

        getDiagramById(projectId, diagramId)
            .then((data) => {
                if(!active) return;
                setName(data.name);
                setContent(parseContent(data.content));
                setRowVersion(data.rowVersion);
                console.log("Diagram direct from useDiagram:", data.content);
            }).catch((err: unknown) =>{
                if(active) setError(err instanceof Error ? err.message: 'Error desconocido');
            }  
            ).finally( () =>{
                if(active) setLoading(false);
            }
            );

            
            return () => {active = false;};

    }, [projectId, diagramId])


    //save method(update). In this case, it is a callback because it will be called outside
    //The catch can receive a concurrency error and put setConflict as true,
    //this can be done becasue the backend already manage this error

    const save = useCallback(async (newContent : DiagramContent) => {

        setSaving(true);
        setConflict(false);

        try {
            const updated = await updateDiagram(
                projectId, diagramId, name, serializeContent(newContent), rowVersion,
            );
            setContent(parseContent(updated.content));
            setRowVersion(updated.rowVersion);
        } catch (err) {
            if(err instanceof ConcurrencyError) setConflict(true);
            else{
                setError(err instanceof Error ? err.message : 'Error al guardar');
            }
        } finally {
            setSaving(false);
        }

    }, [projectId, diagramId, name, rowVersion]);


    const reload = useCallback(async () => {
        setConflict(false);
        setLoading(true);
        const data = await getDiagramById(projectId, diagramId);
        setName(data.name);
        setContent(parseContent(data.content));
        setRowVersion(data.rowVersion);
        setLoading(false)
    }, [projectId, diagramId]);

    return {name, content, loading, error, saving, conflict, save, reload};

}