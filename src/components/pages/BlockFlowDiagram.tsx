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
  EdgeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";
import { useStore } from "../../Store";
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
} from "../ui/drawer";
import UnitOpNode from "../blocks/ProcedureBlock";
import OutputNode from "../blocks/OutputBlock";
import InputNode from "../blocks/InputBlock";
import CustomEdge from "../blocks/StreamEdge";
import Mixer from "../blocks/Mixer";
import Fermentation from "../blocks/Fermentation";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { NodeTypes as BlockType, Stream } from "@/Types";
import { useDarkModeTheme } from "../themes/DarkMode/DarkModeProvider";

const nodeTypes: NodeTypes = {
  unitOperation: UnitOpNode,
  inputNode: InputNode,
  outputNode: OutputNode,
  mixer: Mixer,
  fermentation: Fermentation,
};

const edgeTypes: EdgeTypes = {
  customEdge: CustomEdge,
};

//TODO: highlight selected block
//TODO: connect operations to equipment.

export default function BlockFlowDiagram() {
  const { theme } = useDarkModeTheme();

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
  const [selectedStreamId, setSelectedStreamId] = useState<string | null>(null);
  const [isProcedureDrawerOpen, setIsProcedureDrawerOpen] = useState(false);
  const [isStreamDrawerOpen, setIsStreamDrawerOpen] = useState(false);
  const [BFDBackground, setBFDBackground] = useState(BackgroundVariant.Dots);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    setIsStreamDrawerOpen(false);
    setIsProcedureDrawerOpen(true);
  }, []);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedStreamId(edge.id);
    setIsProcedureDrawerOpen(false);
    setIsStreamDrawerOpen(true);
  }, []);

  const onAddBlock = (event: React.MouseEvent, type: BlockType) => {
    const { clientX, clientY } = event;
    addBlock(type, { x: clientX, y: clientY });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-2">Block Flow Diagram</h1>
      <div className="pb-2 w-auto">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={(e) => onAddBlock(e, "unitOperation")}>
                New Operation
              </MenubarItem>
              <MenubarItem onClick={(e) => onAddBlock(e, "inputNode")}>
                New Input
              </MenubarItem>
              <MenubarItem onClick={(e) => onAddBlock(e, "outputNode")}>
                New Output
              </MenubarItem>
              <MenubarItem onClick={(e) => onAddBlock(e, "mixer")}>
                Mixing
              </MenubarItem>
              <MenubarItem onClick={(e) => onAddBlock(e, "fermentation")}>
                Fermentation
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
                // onNodeClick={onNodeClick}
                //onEdgeClick={onEdgeClick}
                onNodeDoubleClick={onNodeClick}
                onEdgeDoubleClick={onEdgeClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                colorMode={theme}
              >
                <Controls />
                <MiniMap />
                <Background variant={BFDBackground} gap={12} size={1} />
              </ReactFlow>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={(e) => onAddBlock(e, "unitOperation")}>
                Add Operation
              </ContextMenuItem>
              <ContextMenuItem onClick={(e) => onAddBlock(e, "inputNode")}>
                Add Input
              </ContextMenuItem>
              <ContextMenuItem onClick={(e) => onAddBlock(e, "outputNode")}>
                Add Output
              </ContextMenuItem>
              <ContextMenuItem onClick={(e) => onAddBlock(e, "mixer")}>
                Mixer
              </ContextMenuItem>
              <ContextMenuItem onClick={(e) => onAddBlock(e, "fermentation")}>
                Fermentation
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
            selectedEdgeId={selectedStreamId}
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
  const { updateBlockData, blocks } = useStore();

  if (!selectedNodeId) return;

  const selectedNode = blocks.find((p) => p.id == selectedNodeId);
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
                updateBlockData(selectedNodeId, {
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
                updateBlockData(selectedNodeId, {
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
  selectedEdgeId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEdgeId: string | null;
}) => {
  const { updateStreamLabel, streams } = useStore();

  if (!selectedEdgeId) return;
  const selectedEdge = streams.find((p: Stream) => p.id == selectedEdgeId);
  if (!selectedEdge) return;

  console.log("Selected Stream:", selectedEdge);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Stream Data</DrawerTitle>
          <DrawerDescription>See stream data here</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="node-description">Label</Label>
            <Input
              id="edge-label"
              value={selectedEdge.label}
              onChange={(e) =>
                updateStreamLabel(selectedEdgeId, e.target.value)
              }
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
