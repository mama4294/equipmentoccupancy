import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { Block } from "@/Types";
import { ProcessNode } from "./processNode";

function Mixer({ data, selected }: NodeProps<Block>) {
  const inputs = [
    { id: "input1", label: "Feed" },
    { id: "input2", label: "Dilutant" },
  ];
  const outputs = [{ id: "output1", label: "Mixture" }];

  return (
    <ProcessNode
      title={"Mixer"}
      inputs={inputs}
      outputs={outputs}
      data={data}
      selected={selected}
    />
  );
}

export default memo(Mixer);
