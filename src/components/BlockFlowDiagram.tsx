"use client";

import { useState, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  type Node,
  type NodeTypes,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "./ui/card";
import { useStore } from "../Store";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import UnitOpNode from "./blocks/ProcedureBlock";
import OutputNode from "./blocks/OutputBlock";
import InputNode from "./blocks/InputBlock";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

const nodeTypes: NodeTypes = {
  unitOperation: UnitOpNode,
  inputNode: InputNode,
  outputNode: OutputNode,
};

//TODO: add new nodes at cursor location if on screen instead of randomly.
//TODO: Fix on Node change
//TODO: add edges to state
//TODO: connect operations to equipment.

export default function BlockFlowDiagram() {
  const {
    procedures,
    streams,
    onProceduresChange,
    onStreamsChange,
    onConnect,
    addProcedure,
    deleteSelectedElements,
  } = useStore();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [BFDBackground, setBFDBackground] = useState(BackgroundVariant.Dots);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    setIsDrawerOpen(true);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-2">Block Flow Diagram</h1>
      <div className="pb-2 w-auto">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => addProcedure("unitOperation")}>
                New Operation
              </MenubarItem>
              <MenubarItem onClick={() => addProcedure("inputNode")}>
                New Input
              </MenubarItem>
              <MenubarItem onClick={() => addProcedure("outputNode")}>
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
          <ContextMenu>
            <ContextMenuTrigger>
              <ReactFlow
                nodes={procedures}
                edges={streams}
                onNodesChange={onProceduresChange}
                onEdgesChange={onStreamsChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
              >
                <Controls />
                <MiniMap />
                <Background variant={BFDBackground} gap={12} size={1} />
              </ReactFlow>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => addProcedure("unitOperation")}>
                Add Operation
              </ContextMenuItem>
              <ContextMenuItem onClick={() => addProcedure("inputNode")}>
                Add Input
              </ContextMenuItem>
              <ContextMenuItem onClick={() => addProcedure("outputNode")}>
                Add Output
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          <EditProcedureDrawer
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            selectedNode={selectedNodeId}
          />
        </div>
      </Card>
    </div>
  );
}

const EditProcedureDrawer = ({
  open,
  onOpenChange,
  selectedNodeId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNodeId: string | null;
}) => {
  const { updateProcedureData, procedures } = useStore();

  if (!selectedNodeId) return;

  const selectedNode = procedures.find((p) => p.id == selectedNodeId);
  if (!selectedNode) return;

  const { label, equipment } = selectedNode.data;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Unit Operation</DrawerTitle>
          <DrawerDescription>
            Make changes to the selected unit operation here. Click save when
            you're done.
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="node-label">Label</Label>
            <Input
              id="node-label"
              value={label}
              onChange={(e) =>
                updateProcedureData(selectedNodeId, {
                  ...selectedNode.data,
                  label: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="node-description">Equipment</Label>
            <Input
              id="node-tag"
              value={equipment}
              onChange={(e) =>
                updateProcedureData(selectedNodeId, {
                  ...selectedNode.data,
                  equipment: e.target.value,
                })
              }
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
