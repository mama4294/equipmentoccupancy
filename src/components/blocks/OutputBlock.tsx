import { Handle, NodeProps, Position } from "@xyflow/react";
import { Block } from "@/Types";

function OutputNode({ data, selected }: NodeProps<Block>) {
  return (
    <div
      className={`px-4 py-2 shadow-md rounded-md border-2 border-primary bg-background cursor-pointer${
        selected ? "border-selected" : "border-primary"
      }`}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <div className="font-bold">{data.label}</div>
    </div>
  );
}

export default OutputNode;
