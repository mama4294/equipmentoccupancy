"use client";

import { useState, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import UnitOpNode from "./blocks/UnitOpNode";
import OutputNode from "./blocks/OutputNode";
import InputNode from "./blocks/InputNode";

const nodeTypes: NodeTypes = {
  unitOperation: UnitOpNode,
  inputNode: InputNode,
  outputNode: OutputNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "unitOperation",
    position: { x: 250, y: 5 },
    data: { label: "Reactor", description: "Main reactor" },
  },
];

const initialEdges: Edge[] = [];

export default function BlockFlowDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const newEdge = {
        ...params,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const addNewNode = (type: "unitOperation" | "inputNode" | "outputNode") => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type,
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      data: {
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        description: type === "unitOperation" ? "Description" : undefined,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const updateNodeData = (
    id: string,
    newData: { label: string; description?: string }
  ) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = { ...node.data, ...newData };
        }
        return node;
      })
    );
    setSelectedNode((prevNode) =>
      prevNode && prevNode.id === id
        ? { ...prevNode, data: { ...prevNode.data, ...newData } }
        : prevNode
    );
  };

  const deleteSelectedElements = () => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
    setSelectedNode(null);
    setIsDrawerOpen(false);
  };

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedNode(null);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold mb-2">Block Flow Diagram</h1>
        <div className="space-x-2 mb-2">
          <Button onClick={() => addNewNode("unitOperation")} className="">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Unit Operation
          </Button>
          <Button onClick={() => addNewNode("inputNode")} variant="secondary">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Input
          </Button>
          <Button onClick={() => addNewNode("outputNode")} variant="secondary">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Output
          </Button>
          <Button
            onClick={deleteSelectedElements}
            variant="destructive"
            className=""
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
          </Button>
        </div>
      </div>
      <Card className="w-full h-full">
        <div className="w-full h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
          >
            <Controls />
            <MiniMap />
            <Background variant={"dots" as const} gap={12} size={1} />
          </ReactFlow>
        </div>
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Edit Unit Operation</DrawerTitle>
              <DrawerDescription>
                Make changes to the selected unit operation here. Click save
                when you're done.
              </DrawerDescription>
            </DrawerHeader>
            {selectedNode && (
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="node-label">Label</Label>
                  <Input
                    id="node-label"
                    value={selectedNode.data.label}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, {
                        ...selectedNode.data,
                        label: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="node-description">Description</Label>
                  <Input
                    id="node-description"
                    value={selectedNode.data.description || ""}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, {
                        label: selectedNode.data.label,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <Button onClick={closeDrawer} className="w-full">
                  Save Changes
                </Button>
              </div>
            )}
          </DrawerContent>
        </Drawer>
      </Card>
    </div>
  );
}
