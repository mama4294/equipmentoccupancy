import { Handle, NodeProps, Position } from "@xyflow/react";
import { Block } from "@/Types";
import { cn } from "@/lib/utils";
import { useStore } from "@/Store";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "../ui/context-menu";
import OutputBlockDrawer from "../drawers/OutputBlockDrawer";
import { useState } from "react";

function OutputNode({ data, selected, id }: NodeProps<Block>) {
  const { isDebug, deleteBlock } = useStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            "px-4 py-2 shadow-md rounded-md border-2 cursor-pointer",
            data.hasError
              ? "bg-destructive text-destructive-foreground"
              : "bg-background",
            selected ? "border-selected" : "border-primary"
          )}
        >
          <Handle type="target" position={Position.Left} className="w-3 h-3" />
          <div className="font-bold">{data.label}</div>
          {isDebug && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => setIsDrawerOpen(true)}>
          Edit
        </ContextMenuItem>
        <ContextMenuItem>
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => deleteBlock(id)}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
      <OutputBlockDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        selectedNodeId={id}
      />
    </ContextMenu>
  );
}

export default OutputNode;
