import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { Block } from "@/Types";
import { ProcessNode } from "./processNode";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { useStore } from "@/Store";

function Mixer({ data, selected, id }: NodeProps<Block>) {
  const { deleteBlock } = useStore();

  const inputs = [
    { id: "input1", label: "Input 1" },
    { id: "input2", label: "Input 2" },
  ];
  const outputs = [{ id: "output1", label: "Mixture" }];

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <ProcessNode
          title={"Mixer"}
          inputs={inputs}
          outputs={outputs}
          data={data}
          selected={selected}
        />
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

export default memo(Mixer);
