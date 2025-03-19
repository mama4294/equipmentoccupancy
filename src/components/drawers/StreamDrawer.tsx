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

export default StreamDataDrawer;
