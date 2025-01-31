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
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Menu, PlusCircle, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Menubar,
  MenubarCheckboxItem,
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
  const [BFDBackground, setBFDBackground] = useState(BackgroundVariant.Dots);

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
      <h1 className="text-2xl font-bold mb-2">Block Flow Diagram</h1>
      <div className="pb-2 w-auto">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => addNewNode("unitOperation")}>
                New Operation
              </MenubarItem>
              <MenubarItem onClick={() => addNewNode("inputNode")}>
                New Input
              </MenubarItem>
              <MenubarItem onClick={() => addNewNode("outputNode")}>
                New Output
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={deleteSelectedElements}>Delete</MenubarItem>
              <MenubarSeparator />
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem
                checked={BFDBackground == BackgroundVariant.Dots}
                onClick={() => setBFDBackground(BackgroundVariant.Dots)}
              >
                Dots
              </MenubarCheckboxItem>
              <MenubarCheckboxItem
                checked={BFDBackground == BackgroundVariant.Lines}
                onClick={() => setBFDBackground(BackgroundVariant.Lines)}
              >
                Lines
              </MenubarCheckboxItem>
              <MenubarCheckboxItem
                checked={BFDBackground == BackgroundVariant.Cross}
                onClick={() => setBFDBackground(BackgroundVariant.Cross)}
              >
                Cross
              </MenubarCheckboxItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
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
            <Background variant={BFDBackground} gap={12} size={1} />
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
