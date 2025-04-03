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
import { BlockTypes as BlockType, BlockTypes } from "@/Types";
import { useDarkModeTheme } from "../themes/DarkMode/DarkModeProvider";
import { Button } from "../ui/button";
import { Target } from "lucide-react";
import InputStreamDrawer from "../drawers/InputBlockDrawer";
import StreamDataDrawer from "../drawers/StreamDrawer";
import OutputBlockDrawer from "../drawers/OutputBlockDrawer";
import { useSolveMassBalance } from "../../lib/useSolveMassBalance";
import EditProcedureDrawer from "../drawers/ProcedureDrawer";
import NodeInspector from "../blocks/NodeInspector";

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
    isDebug,
    toggleDebug,
    setClipboard,
    onPaste,
  } = useStore();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedStreamId, setSelectedStreamId] = useState<string | null>(null);
  const [isProcedureDrawerOpen, setIsProcedureDrawerOpen] = useState(false);
  const [isStreamDrawerOpen, setIsStreamDrawerOpen] = useState(false);
  const [isInputDrawerOpen, setIsInputDrawerOpen] = useState(false);
  const [isOutputDrawerOpen, setIsOutputDrawerOpen] = useState(false);
  const [BFDBackground, setBFDBackground] = useState(BackgroundVariant.Dots);

  const { solveMassBalance } = useSolveMassBalance();

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    setIsStreamDrawerOpen(false);

    //determine what type of node was clicked
    if (node.type == BlockType.InputNode) {
      setIsInputDrawerOpen(true);
    } else if (node.type == BlockType.OutputNode) {
      setIsOutputDrawerOpen(true);
    } else setIsProcedureDrawerOpen(true);
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

  const simulate = useCallback(() => {
    solveMassBalance();
  }, [solveMassBalance]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between align-top flex-wrap">
        <h1 className="text-2xl font-bold mb-2">Simulation</h1>
        <Button onClick={simulate}>
          <Target className="w-4 h-4 mr-2" />
          Simulate
        </Button>
      </div>
      <div className="pb-2 w-auto">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                onClick={(e) => onAddBlock(e, BlockTypes.UnitOperation)}
              >
                New Operation
              </MenubarItem>
              <MenubarItem onClick={(e) => onAddBlock(e, BlockTypes.InputNode)}>
                New Input
              </MenubarItem>
              <MenubarItem
                onClick={(e) => onAddBlock(e, BlockTypes.OutputNode)}
              >
                New Output
              </MenubarItem>
              <MenubarItem onClick={(e) => onAddBlock(e, BlockTypes.Mixer)}>
                Mixing
              </MenubarItem>
              <MenubarItem
                onClick={(e) => onAddBlock(e, BlockTypes.Fermentation)}
              >
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
              <MenubarSeparator />
              <MenubarCheckboxItem checked={isDebug} onClick={toggleDebug}>
                Debug Mode
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
                onCopy={setClipboard}
                onPaste={onPaste}
              >
                {isDebug && <NodeInspector />}
                <Controls />
                <MiniMap />
                <Background variant={BFDBackground} gap={12} size={1} />
              </ReactFlow>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={(e) => onAddBlock(e, BlockTypes.UnitOperation)}
              >
                Add Operation
              </ContextMenuItem>
              <ContextMenuItem
                onClick={(e) => onAddBlock(e, BlockTypes.InputNode)}
              >
                Add Input
              </ContextMenuItem>
              <ContextMenuItem
                onClick={(e) => onAddBlock(e, BlockTypes.OutputNode)}
              >
                Add Output
              </ContextMenuItem>
              <ContextMenuItem onClick={(e) => onAddBlock(e, BlockTypes.Mixer)}>
                Mixer
              </ContextMenuItem>
              <ContextMenuItem
                onClick={(e) => onAddBlock(e, BlockTypes.Fermentation)}
              >
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
          <InputStreamDrawer
            open={isInputDrawerOpen}
            onOpenChange={setIsInputDrawerOpen}
            selectedNodeId={selectedNodeId}
          />
          <OutputBlockDrawer
            open={isOutputDrawerOpen}
            onOpenChange={setIsOutputDrawerOpen}
            selectedNodeId={selectedNodeId}
          />
        </div>
      </Card>
    </div>
  );
}
