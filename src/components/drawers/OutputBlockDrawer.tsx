import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { useStore } from "../../Store";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";

const OutputBlockDrawer = ({
  open,
  onOpenChange,
  selectedNodeId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNodeId: string | null;
}) => {
  const { updateBlockData, blocks, registeredComponents } = useStore();

  if (!selectedNodeId) return;

  const selectedNode = blocks.find((p) => p.id == selectedNodeId);
  if (!selectedNode) return;

  const { label, calculatedComponents } = selectedNode.data;

  const blockComponents = Array.isArray(calculatedComponents)
    ? calculatedComponents
    : [];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Output</DrawerTitle>
          <DrawerDescription>Make changes to the output</DrawerDescription>
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
          <Label htmlFor="components">Ingredients</Label>
          {blockComponents.map((component) => (
            <div
              key={component.id}
              className="grid grid-cols-12 gap-2 p-3 border-b"
            >
              <div className="col-span-5 flex items-center">
                {registeredComponents.find((comp) => comp.id === component.id)
                  ?.name || component.id}
              </div>
              <div className="col-span-4 flex items-center gap-1">
                <span>{component.mass}</span>
                <span>{component.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default OutputBlockDrawer;
