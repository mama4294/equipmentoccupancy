import { memo } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { Block } from "@/Types";
import { ProcessNode, ProcessNodeProps } from "./processNode";

function Mixer({ data, selected }: NodeProps<Block>) {
  const inputs = [
    { id: "1", label: "Feed" },
    { id: "2", label: "Dilutant" },
  ];
  const outputs = [{ id: "3", label: "Mixture" }];

  return (
    <ProcessNode
      title={"Mixer"}
      equipment={data.equipment}
      inputs={inputs}
      outputs={outputs}
      additionalData={[]}
      selected={selected}
    />
  );
}

export default memo(Mixer);
