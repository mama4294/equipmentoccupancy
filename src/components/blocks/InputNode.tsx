import { Handle, Position } from "@xyflow/react";

function InputNode({ data }: { data: { label: string } }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md border-2 border-primary bg-background">
      <div className="font-bold">{data.label}</div>
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
}

export default InputNode;
