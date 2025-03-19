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
import { Button } from "../ui/button";
import { Plus, Target, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";

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
  const [isInputDrawerOpen, setIsInputDrawerOpen] = useState(false);
  const [BFDBackground, setBFDBackground] = useState(BackgroundVariant.Dots);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    setIsStreamDrawerOpen(false);

    //determine what type of node was clicked
    if (node.type == "inputNode") {
      setIsInputDrawerOpen(true);
      console.log("Input");
      //open input editor
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

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between align-top flex-wrap">
        <h1 className="text-2xl font-bold mb-2">Simulation</h1>
        <Button>
          <Target className="w-4 h-4 mr-2" />
          Simulate
        </Button>
      </div>
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
          <InputStreamDrawer
            open={isInputDrawerOpen}
            onOpenChange={setIsInputDrawerOpen}
            selectedNodeId={selectedNodeId}
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

const InputStreamDrawer = ({
  open,
  onOpenChange,
  selectedNodeId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNodeId: string | null;
}) => {
  const {
    addComponentToBlock,
    blocks,
    registeredComponents,
    deleteComponentFromBlock,
  } = useStore();

  // State for the new ingredient form
  const [newIngredientId, setNewIngredientId] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [newUnit, setNewUnit] = useState<string>("g");

  if (!selectedNodeId) return;

  const selectedNode = blocks.find((p) => p.id == selectedNodeId);
  if (!selectedNode) return;

  const blockComponents = Array.isArray(selectedNode.data?.components)
    ? selectedNode.data.components
    : [];

  //filter the ingredients that haven't already been used for the select
  const availableIngredients = registeredComponents.filter(
    (ingredient) =>
      !blockComponents.some((component) => component.id === ingredient.id)
  );

  // Function to add a new ingredient
  const addIngredient = () => {
    addComponentToBlock(selectedNodeId, {
      id: newIngredientId,
      mass: newQuantity,
      unit: newUnit,
    });

    setNewQuantity(0);
    setNewIngredientId("");
  };

  // Function to update the quantity of an ingredient
  const updateQuantity = (id: string, quantity: number) => {
    // setIngredients(
    //   ingredients.map((ingredient) =>
    //     ingredient.id === id ? { ...ingredient, quantity } : ingredient
    //   )
    // );
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Input Stream</DrawerTitle>
          <DrawerDescription>
            Make changes to the stream here.
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4">
          <div className="space-y-4">
            <div className="rounded-md border">
              {blockComponents.length <= 0 ? (
                <div className="text-center py-2 text-muted-foreground mb-4">
                  No ingredients added yet.
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-12 gap-2 p-3 font-medium border-b">
                    <div className="col-span-5">Ingredient</div>
                    <div className="col-span-4">Quantity</div>
                    <div className="col-span-3"></div>
                  </div>
                  {blockComponents.map((component) => (
                    <div
                      key={component.id}
                      className="grid grid-cols-12 gap-2 p-3 border-b"
                    >
                      <div className="col-span-5 flex items-center">
                        {registeredComponents.find(
                          (comp) => comp.id === component.id
                        )?.name || component.id}
                      </div>
                      <div className="col-span-4 flex items-center gap-1">
                        <Input
                          type="number"
                          value={component.mass}
                          onChange={(e) =>
                            updateQuantity(
                              component.id,
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          className="h-8"
                          min={0}
                        />
                        <span>{component.unit}</span>
                      </div>
                      <div className="col-span-3 flex justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            deleteComponentFromBlock(
                              selectedNodeId,
                              component.id
                            )
                          }
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new ingredient row */}
              <div className="grid grid-cols-12 gap-2 p-3 border-t bg-muted/10">
                <div className="col-span-5">
                  <Select
                    value={newIngredientId}
                    onValueChange={setNewIngredientId}
                  >
                    <SelectTrigger id="ingredient" className="h-8">
                      <SelectValue placeholder="Select ingredient" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableIngredients.length > 0 ? (
                        availableIngredients.map((ingredient) => (
                          <SelectItem key={ingredient.id} value={ingredient.id}>
                            {ingredient.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No ingredients available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-4 flex items-center gap-1">
                  <Input
                    id="quantity"
                    type="number"
                    value={newQuantity || ""}
                    onChange={(e) =>
                      setNewQuantity(Number.parseInt(e.target.value) || 0)
                    }
                    className="h-8 flex-grow"
                    min={0}
                    placeholder="0"
                  />
                  <Select value={newUnit} onValueChange={setNewUnit}>
                    <SelectTrigger className="w-16 h-8 flex-shrink-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="l">l</SelectItem>
                      <SelectItem value="pcs">pcs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3 flex justify-center">
                  <Button
                    // variant="outline"
                    size="sm"
                    onClick={addIngredient}
                    // disabled={!newIngredient || newQuantity <= 0}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
