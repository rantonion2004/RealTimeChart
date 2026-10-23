
export interface DiagramNodeData{
    id: string;
    type: string; //rectangle, circle, etc
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    style?: Record<string,unknown>
}

export interface DiagramEdgeData{
    id: string;
    source: string;
    target: string;
    label?: string;
}

export interface DiagramContent {
    nodes: DiagramNodeData[];
    edges: DiagramEdgeData[];
}

//data from backend to forntent
export function parseContent(content: string): DiagramContent {
    try{
        const parsed = JSON.parse(content);
        return {
            nodes: parsed.nodes ?? [],
            edges: parsed.edges ?? []
        }
    }catch{
        return {nodes: [], edges: []} // diagrama nuevo/corrupto -> arranca vacio
    }
}

//data from frontend to backend
export function serializeContent(content: DiagramContent): string {
    return JSON.stringify(content);
}