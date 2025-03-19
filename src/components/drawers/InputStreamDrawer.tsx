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

// Define the ingredient type
type Ingredient = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
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
  const { updateBlockData, blocks } = useStore();

  if (!selectedNodeId) return;

  const selectedNode = blocks.find((p) => p.id == selectedNodeId);
  if (!selectedNode) return;

  // const { label, equipment } = selectedNode.data;

  // State for the list of ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", name: "Flour", quantity: 500, unit: "g" },
    { id: "2", name: "Sugar", quantity: 200, unit: "g" },
    { id: "3", name: "Butter", quantity: 100, unit: "g" },
  ]);

  // State for the new ingredient form
  const [newIngredient, setNewIngredient] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [newUnit, setNewUnit] = useState<string>("g");

  // Available ingredients for the dropdown
  const availableIngredients = [
    "Flour",
    "Sugar",
    "Butter",
    "Eggs",
    "Milk",
    "Salt",
    "Baking Powder",
    "Vanilla Extract",
    "Chocolate Chips",
    "Cinnamon",
  ].filter((ingredient) => !ingredients.some((i) => i.name === ingredient));

  // Function to add a new ingredient
  const addIngredient = () => {
    if (newIngredient && newQuantity > 0) {
      setIngredients([
        ...ingredients,
        {
          id: Date.now().toString(),
          name: newIngredient,
          quantity: newQuantity,
          unit: newUnit,
        },
      ]);
      setNewIngredient("");
      setNewQuantity(0);
    }
  };

  // Function to update the quantity of an ingredient
  const updateQuantity = (id: string, quantity: number) => {
    setIngredients(
      ingredients.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, quantity } : ingredient
      )
    );
  };

  // Function to remove an ingredient
  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Ingredients</DrawerTitle>
              <DrawerDescription>
                View and manage your recipe ingredients.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <div className="space-y-4">
                {ingredients.length > 0 ? (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 gap-2 p-3 font-medium border-b">
                      <div className="col-span-5">Ingredient</div>
                      <div className="col-span-4">Quantity</div>
                      <div className="col-span-3"></div>
                    </div>
                    {ingredients.map((ingredient) => (
                      <div
                        key={ingredient.id}
                        className="grid grid-cols-12 gap-2 p-3 border-b"
                      >
                        <div className="col-span-5 flex items-center">
                          {ingredient.name}
                        </div>
                        <div className="col-span-4 flex items-center gap-1">
                          <Input
                            type="number"
                            value={ingredient.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                ingredient.id,
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                            className="h-8"
                            min={0}
                          />
                          <span>{ingredient.unit}</span>
                        </div>
                        <div className="col-span-3 flex justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeIngredient(ingredient.id)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                    {/* Add new ingredient row */}
                    <div className="grid grid-cols-12 gap-2 p-3 border-t bg-muted/10">
                      <div className="col-span-5">
                        <Select
                          value={newIngredient}
                          onValueChange={setNewIngredient}
                        >
                          <SelectTrigger id="ingredient" className="h-8">
                            <SelectValue placeholder="Select ingredient" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableIngredients.length > 0 ? (
                              availableIngredients.map((ingredient) => (
                                <SelectItem key={ingredient} value={ingredient}>
                                  {ingredient}
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
                          variant="outline"
                          size="sm"
                          onClick={addIngredient}
                          disabled={!newIngredient || newQuantity <= 0}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border p-4">
                    <div className="text-center py-2 text-muted-foreground mb-4">
                      No ingredients added yet.
                    </div>
                    {/* Add first ingredient row */}
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-5">
                        <Select
                          value={newIngredient}
                          onValueChange={setNewIngredient}
                        >
                          <SelectTrigger id="ingredient">
                            <SelectValue placeholder="Select ingredient" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableIngredients.map((ingredient) => (
                              <SelectItem key={ingredient} value={ingredient}>
                                {ingredient}
                              </SelectItem>
                            ))}
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
                          min={0}
                        />
                        <Select value={newUnit} onValueChange={setNewUnit}>
                          <SelectTrigger className="w-16">
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
                      <div className="col-span-3">
                        <Button
                          onClick={addIngredient}
                          disabled={!newIngredient || newQuantity <= 0}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default InputStreamDrawer;
