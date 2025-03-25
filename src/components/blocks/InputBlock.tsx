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

function InputNode({ data, selected, id }: NodeProps<Block>) {
  const { isDebug, deleteBlock } = useStore();
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
        <ContextMenuItem>Edit</ContextMenuItem>
        <ContextMenuItem>
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => deleteBlock(id)}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default InputNode;
