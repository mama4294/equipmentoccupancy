import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { BlockData } from "@/Types";

function UnitOperationNode({ data }: { data: BlockData }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md border-2 border-primary bg-background">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <div className="font-bold">{data.label}</div>
      <div className="text-sm">{data.equipment}</div>
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
}

export default memo(UnitOperationNode);
