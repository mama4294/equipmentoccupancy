import { ComponentProperties, Mixture } from "@/Types";
import { useStore } from "@/Store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import ComponentForm from "../component-form";
import MixtureForm from "../mixture-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const Components = () => {
  const [editingComponent, setEditingComponent] =
    useState<ComponentProperties | null>(null);
  const [editingMixture, setEditingMixture] = useState<Mixture | null>(null);
  const [isComponentSheetOpen, setIsComponentSheetOpen] = useState(false);
  const [isMixtureSheetOpen, setIsMixtureSheetOpen] = useState(false);

  const {
    registeredComponents: components,
    mixtures,
    addComponent,
    updateComponent,
    deleteComponent,
    duplicateComponent,
    addMixture,
    updateMixture,
    deleteMixture,
    duplicateMixture,
  } = useStore();

  const handleSaveComponent = (component: ComponentProperties) => {
    if (editingComponent) {
      updateComponent(component.id, component);
    } else {
      addComponent({ ...component, id: Date.now().toString() });
    }
    setEditingComponent(null);
    setIsComponentSheetOpen(false);
  };

  const handleSaveMixture = (mixture: Mixture) => {
    if (editingMixture) {
      updateMixture(mixture.id, mixture);
    } else {
      addMixture({ ...mixture, id: Date.now().toString() });
    }
    setEditingMixture(null);
    setIsMixtureSheetOpen(false);
  };

  const handleEditComponent = (component: ComponentProperties) => {
    setEditingComponent(component);
    setIsComponentSheetOpen(true);
  };

  const handleEditMixture = (mixture: Mixture) => {
    setEditingMixture(mixture);
    setIsMixtureSheetOpen(true);
  };

  return (
    <section className="">
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Components</CardTitle>
            <CardDescription>Pure components</CardDescription>
          </CardHeader>
          <CardContent>
            <ComponentList
              components={components}
              onEdit={handleEditComponent}
              onDuplicate={duplicateComponent}
              onDelete={deleteComponent}
            />
          </CardContent>
          <CardFooter>
            <Sheet
              open={isComponentSheetOpen}
              onOpenChange={setIsComponentSheetOpen}
            >
              <SheetTrigger asChild>
                <Button onClick={() => setEditingComponent(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Component
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>
                    {editingComponent ? "Edit Component" : "Add New Component"}
                  </SheetTitle>
                </SheetHeader>
                <ComponentForm
                  component={editingComponent}
                  onSave={handleSaveComponent}
                  onCancel={() => setIsComponentSheetOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </CardFooter>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Mixtures</CardTitle>
            <CardDescription>Mixtures of pure components</CardDescription>
          </CardHeader>
          <CardContent>
            <MixtureList
              mixtures={mixtures}
              onEdit={handleEditMixture}
              onDuplicate={duplicateMixture}
              onDelete={deleteMixture}
            />
          </CardContent>
          <CardFooter>
            <Sheet
              open={isMixtureSheetOpen}
              onOpenChange={setIsMixtureSheetOpen}
            >
              <SheetTrigger asChild>
                <Button onClick={() => setEditingMixture(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Mixture
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>
                    {editingMixture ? "Edit Mixture" : "Add New Mixture"}
                  </SheetTitle>
                </SheetHeader>
                <MixtureForm
                  mixture={editingMixture}
                  components={components}
                  onSave={handleSaveMixture}
                  onCancel={() => setIsMixtureSheetOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </CardFooter>
        </Card>
      </div>
    </section>
  );

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-2">Components</h1>
        <div
          className="relative flex-col items-start gap-8 md:flex"
          x-chunk="dashboard-03-chunk-0"
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <Sheet
                open={isComponentSheetOpen}
                onOpenChange={setIsComponentSheetOpen}
              >
                <SheetTrigger asChild>
                  <Button onClick={() => setEditingComponent(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Component
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>
                      {editingComponent
                        ? "Edit Component"
                        : "Add New Component"}
                    </SheetTitle>
                  </SheetHeader>
                  <ComponentForm
                    component={editingComponent}
                    onSave={handleSaveComponent}
                    onCancel={() => setIsComponentSheetOpen(false)}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <ComponentList
            components={components}
            onEdit={handleEditComponent}
            onDuplicate={duplicateComponent}
            onDelete={deleteComponent}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Mixtures</h2>
            <Sheet
              open={isMixtureSheetOpen}
              onOpenChange={setIsMixtureSheetOpen}
            >
              <SheetTrigger asChild>
                <Button onClick={() => setEditingMixture(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Mixture
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>
                    {editingMixture ? "Edit Mixture" : "Add New Mixture"}
                  </SheetTitle>
                </SheetHeader>
                <MixtureForm
                  mixture={editingMixture}
                  components={components}
                  onSave={handleSaveMixture}
                  onCancel={() => setIsMixtureSheetOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </div>
          <MixtureList
            mixtures={mixtures}
            onEdit={handleEditMixture}
            onDuplicate={duplicateMixture}
            onDelete={deleteMixture}
          />
        </div>
      </div>
    </div>
  );
};

export default Components;

interface ComponentListProps {
  components: ComponentProperties[];
  onEdit: (component: ComponentProperties) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

function ComponentList({
  components,
  onEdit,
  onDuplicate,
  onDelete,
}: ComponentListProps) {
  return (
    <ScrollArea className="h-[600px] w-full rounded-md">
      <div className="space-y-4">
        {components.map((component: ComponentProperties) => (
          <div key={component.id} className="p-4 border rounded-md space-y-1">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{component.name}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onEdit(component)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(component.id)}>
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(component.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-muted-foreground">
              Formula: {component.molecularFormula}
            </p>
            <p className="text-sm text-muted-foreground">
              MW: {component.molecularWeight} g/mol
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

interface MixtureListProps {
  mixtures: Mixture[];
  onEdit: (mixture: Mixture) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

function MixtureList({
  mixtures,
  onEdit,
  onDuplicate,
  onDelete,
}: MixtureListProps) {
  return (
    <ScrollArea className="h-[600px] w-full rounded-md">
      <div className="space-y-4">
        {mixtures.map((mixture) => (
          <div key={mixture.id} className="p-4 border rounded-md space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{mixture.name}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onEdit(mixture)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(mixture.id)}>
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(mixture.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-muted-foreground">
              Components: {mixture.components.length}
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
