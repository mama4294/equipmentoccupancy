import { useState, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  type Node,
  type NodeTypes,
  BackgroundVariant,
  Edge,
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
//TODO: highlight selected block
//TODO: connect operations to equipment.
//TODO: Fix night mode MiniMap and controls

export default function BlockFlowDiagram() {
  const {
    blocks: procedures,
    streams,
    onBlocksChange,
    onStreamsChange,
    onConnect,
    addBlock,
    deleteSelectedElements,
  } = useStore();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isProcedureDrawerOpen, setIsProcedureDrawerOpen] = useState(false);
  const [isStreamDrawerOpen, setIsStreamDrawerOpen] = useState(false);
  const [BFDBackground, setBFDBackground] = useState(BackgroundVariant.Dots);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    setIsStreamDrawerOpen(false);
    setIsProcedureDrawerOpen(true);
  }, []);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    console.log(edge);
    setIsProcedureDrawerOpen(false);
    setIsStreamDrawerOpen(true);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-2">Block Flow Diagram</h1>
      <div className="pb-2 w-auto">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => addBlock("unitOperation")}>
                New Operation
              </MenubarItem>
              <MenubarItem onClick={() => addBlock("inputNode")}>
                New Input
              </MenubarItem>
              <MenubarItem onClick={() => addBlock("outputNode")}>
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
                onNodesChange={onBlocksChange}
                onEdgesChange={onStreamsChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                nodeTypes={nodeTypes}
              >
                <Controls />
                <MiniMap />
                <Background variant={BFDBackground} gap={12} size={1} />
              </ReactFlow>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => addBlock("unitOperation")}>
                Add Operation
              </ContextMenuItem>
              <ContextMenuItem onClick={() => addBlock("inputNode")}>
                Add Input
              </ContextMenuItem>
              <ContextMenuItem onClick={() => addBlock("outputNode")}>
                Add Output
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          <EditProcedureDrawer
            open={isProcedureDrawerOpen}
            onOpenChange={setIsProcedureDrawerOpen}
            selectedNodeId={selectedNodeId}
          />
          <StreamDataDrawer
            open={isStreamDrawerOpen}
            onOpenChange={setIsStreamDrawerOpen}
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
  const { updateBlockData: updateProcedureData, blocks: procedures } =
    useStore();

  console.log("selectedNodeId:", selectedNodeId);

  if (!selectedNodeId) return;

  const selectedNode = procedures.find((p) => p.id == selectedNodeId);
  if (!selectedNode) return;

  const { label, equipment } = selectedNode.data;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Procedure</DrawerTitle>
          <DrawerDescription>
            Make changes to the selected procedure here.
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

const StreamDataDrawer = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Stream Data</DrawerTitle>
          <DrawerDescription>See stream data here</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};
