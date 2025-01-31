import { Handle, Position } from "@xyflow/react";

function OutputNode({ data }: { data: { label: string } }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md border-2 border-primary bg-background">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <div className="font-bold">{data.label}</div>
    </div>
  );
}

export default OutputNode;
