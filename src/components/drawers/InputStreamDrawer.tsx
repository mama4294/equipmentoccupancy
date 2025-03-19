import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "../../Store";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

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
    updateBlockData,
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

  const { label, isAutoCalc } = selectedNode.data;

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

            <div>
              <Label htmlFor="components">Ingredients</Label>
              <div className="flex items-center space-x-2 py-2">
                <Switch
                  id="auto-calculate"
                  checked={isAutoCalc}
                  onCheckedChange={(checked) =>
                    updateBlockData(selectedNodeId, {
                      ...selectedNode.data,
                      isAutoCalc: checked,
                    })
                  }
                />
                <Label htmlFor="auto-calculate">Calculate Mass</Label>
              </div>
              <div className="rounded-md border">
                {blockComponents.length <= 0 ? (
                  <div className="text-center py-2 text-muted-foreground mb-4">
                    No ingredients added yet.
                  </div>
                ) : (
                  <div>
                    <div
                      className="grid grid-cols-12 gap-2 p-3 font-medium border-b"
                      id="components"
                    >
                      <div className="col-span-5">Ingredient</div>
                      <div className="col-span-4">Mass</div>
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
                            disabled={isAutoCalc}
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
                            <SelectItem
                              key={ingredient.id}
                              value={ingredient.id}
                            >
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default InputStreamDrawer;
