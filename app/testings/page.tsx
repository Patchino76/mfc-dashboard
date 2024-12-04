"use client";

import React from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

const CustomNode = ({
  data,
}: {
  data: { label: string; background: string };
}) => {
  return (
    <div
      style={{
        padding: "10px 20px",
        borderRadius: "8px",
        background: data.background,
        color: "white",
        width: "120px",
        textAlign: "center",
      }}
    >
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 50, y: 200 },
    data: {
      label: "Трошачка 1",
      background: "gray",
    },
    type: "custom",
  },
  {
    id: "2",
    position: { x: 250, y: 100 },
    data: {
      label: "Лента 1",
      background: "gray",
    },
    type: "custom",
  },
  {
    id: "3",
    position: { x: 250, y: 300 },
    data: {
      label: "Лента 2",
      background: "gray",
    },
    type: "custom",
  },
  {
    id: "4",
    position: { x: 450, y: 100 },
    data: {
      label: "Сито 1",
      background: "gray",
    },
    type: "custom",
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    sourceHandle: "right",
    targetHandle: "left",
    type: "bezier",
    style: { stroke: "#94a3b8", strokeWidth: 2 },
    animated: true,
  },
  {
    id: "e2-3",
    source: "1",
    target: "3",
    sourceHandle: "right",
    targetHandle: "left",
    type: "bezier",
    style: { stroke: "#94a3b8", strokeWidth: 2 },
    animated: true,
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    sourceHandle: "right",
    targetHandle: "left",
    type: "bezier",
    style: { stroke: "#94a3b8", strokeWidth: 2 },
    animated: true,
  },
];

export default function TestingsPage() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
        defaultEdgeOptions={{
          type: "bezier",
          style: { stroke: "#94a3b8", strokeWidth: 2 },
          animated: true,
        }}
      >
        <Background color="#e2e8f0" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
