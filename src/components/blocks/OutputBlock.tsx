import { Handle, NodeProps, Position } from "@xyflow/react";
import { Block } from "@/Types";
import { cn } from "@/lib/utils";
import { useStore } from "@/Store";

function OutputNode({ data, selected }: NodeProps<Block>) {
  const { isDebug } = useStore();
  return (
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
  );
}

export default OutputNode;
