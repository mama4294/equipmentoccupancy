import { Handle, NodeProps, Position } from "@xyflow/react";
import { Block } from "@/Types";
import { useStore } from "@/Store";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { useState } from "react";
import InputBlockDrawer from "../drawers/InputBlockDrawer";

function InputNode({ data, selected, id }: NodeProps<Block>) {
  const { isDebug, deleteBlock } = useStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={`px-4 py-2 shadow-md rounded-md border-2 border-primary bg-background cursor-pointer ${
            selected ? "border-selected" : "border-primary"
          }`}
        >
          <div className="font-bold">{data.label}</div>
          {isDebug && <pre>{JSON.stringify(data, null, 2)}</pre>}
          <Handle type="source" position={Position.Right} className="w-3 h-3" />
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

      <InputBlockDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        selectedNodeId={id}
      />
    </ContextMenu>
  );
}

export default InputNode;
