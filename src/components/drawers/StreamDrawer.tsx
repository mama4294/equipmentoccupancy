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
import { Stream } from "@/Types";

const StreamDataDrawer = ({
  open,
  onOpenChange,
  selectedEdgeId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEdgeId: string | null;
}) => {
  const { updateStreamLabel, streams, registeredComponents } = useStore();

  if (!selectedEdgeId) return;
  const selectedEdge = streams.find((p: Stream) => p.id == selectedEdgeId);
  if (!selectedEdge) return;

  const calculatedComponents = selectedEdge.components;

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
          <div
            className="grid grid-cols-12 gap-2 p-3 font-medium border-b"
            id="components"
          >
            <div className="col-span-5">Ingredient</div>
            <div className="col-span-4">Mass</div>
            <div className="col-span-3"></div>
          </div>
          {calculatedComponents.map((component) => (
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

export default StreamDataDrawer;
