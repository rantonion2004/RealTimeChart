import { useCallback, useEffect } from "react";

import {ReactFlow, Background, Controls, Panel, useNodesState, addEdge,
        type Connection, type Node, type Edge, 
        useEdgesState,

} from '@xyflow/react'

import '@xyflow/react/dist/style.css'
import { toReactFlowNodes, toReactFlowEdges, fromReactFlow } from "./mapToReactFlow";
import type { DiagramContent } from "../../types/DiagramContent";

interface DiagramCanvasProps {
    content: DiagramContent;
    onSave: (content: DiagramContent) => void;
}

export function DiagramCanvas({content, onSave} : DiagramCanvasProps){

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>(toReactFlowNodes(content.nodes));
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(toReactFlowEdges(content.edges));

    //si el content llega de afuera(ej. tras recargar por conflicto)
    //sincroniza el canvas

    useEffect(() => {
        console.log("Diagram raw from db: ",content);
        setNodes(toReactFlowNodes(content.nodes));
        setEdges(toReactFlowEdges(content.edges));
        
    }, [content, setNodes, setEdges]);

    const onAddNode = useCallback(
        () => {
            const random = crypto.randomUUID();
            const newNode = {
                id: random,
                position: {x: 0, y:0},
                data: { label: `Nodo` }
            }
            setNodes((nds) => nds.concat(newNode));
            
        } , [nodes, setNodes]);

    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection,eds)),
        [setEdges],
    );

    function handleSave(){
        onSave(fromReactFlow(nodes, edges));
    }

    return(
        <div style={{height: '100%', width: '100%'} }>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                
                fitView
            >
                <Panel position="top-right">
                    <div style={{display: 'flex', gap: 8}}>
                        <button onClick={onAddNode}>Add</button>
                        <button onClick={handleSave}>Guardar</button>
                    </div>
                </Panel>
                <Background/>
                <Controls/>
            </ReactFlow>

        </div>
    );


}