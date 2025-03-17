import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { Block } from "@/Types";
import { ProcessNode } from "./processNode";

function Fermentation({ data, selected }: NodeProps<Block>) {
  const inputs = [
    { id: "1", label: "Media" },
    { id: "2", label: "Air" },
    { id: "4", label: "Feed" },
  ];
  const outputs = [{ id: "3", label: "Broth" }];

  return (
    <ProcessNode
      title={"Fermentation"}
      equipment={data.equipment}
      inputs={inputs}
      outputs={outputs}
      additionalData={[]}
      selected={selected}
    />
  );
}

export default memo(Fermentation);
