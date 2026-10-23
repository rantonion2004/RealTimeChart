
import type {Node, Edge} from '@xyflow/react'
import type { DiagramContent, DiagramNodeData, DiagramEdgeData } from '../../types/DiagramContent'

//this is an extra layer:
//Without it we would have the type ReactFlow(Node with all the specific API for that library)
//filtering until content is saved in postgres. If react flow launches a version 
//with changes or if we want to evaluate another canvas library, we would have to migrate the
//saved data in the database. with this translation, we just touch mapToReactFlow.ts, our
//content in Db keeps stable

//changes the modul DiagramNodeData to a react flow data
export function toReactFlowNodes(nodes: DiagramNodeData[]): Node[]{

    return nodes.map((n) => ({

        id: n.id,
        type: 'default',
        position: {x: n.x, y: n.y},
        data: {label: n.text},
        style: {width: n.width, height: n.height, ...n.style}

    }));

}

//changes the ReactFlowEdges(our implementation) to a normal ReactFlowEdge
export function toReactFlowEdges(edges: DiagramEdgeData[]) : Edge[]{
    return edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
    }));
}

export function fromReactFlow(nodes: Node[], edges: Edge[]): DiagramContent{
    return{
        nodes: nodes.map((n) => ({
            id: n.id,
            type: n.type ?? 'default',
            x: n.position.x,
            y: n.position.y,
            width: (n.style?.width as number) ?? 150,
            height: (n.style?.height as number) ?? 50,
            text: (n.data?.label as string) ?? '',  
        })),
        edges: edges.map((e) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            label: typeof e.label === 'string' ? e.label: undefined,
        })),
    };
}