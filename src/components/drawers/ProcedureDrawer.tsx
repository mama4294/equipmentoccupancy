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

export default EditProcedureDrawer;
