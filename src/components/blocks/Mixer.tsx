import { memo, useState } from "react";
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
import EditProcedureDrawer from "../drawers/ProcedureDrawer";

function Mixer({ data, selected, id }: NodeProps<Block>) {
  const { deleteBlock } = useStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
        <ContextMenuItem onClick={() => setIsDrawerOpen(true)}>
          Edit
        </ContextMenuItem>
        <ContextMenuItem>
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => deleteBlock(id)}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
      <EditProcedureDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        selectedNodeId={id}
      />
    </ContextMenu>
  );
}

export default memo(Mixer);
