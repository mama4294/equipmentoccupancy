import { type Node, type Edge } from "@xyflow/react";

export type State = {
  projectTitle: string;
  equipment: Equipment[];
  campaign: Campaign;
  resourceOptions: ResourceOption[];
  blocks: Block[];
  streams: Edge[];
};

export type BlockData = { label: string; equipment: string };
export type Block = Node<BlockData>;

export type BFDBlocks = "unitOperation" | "inputNode" | "outputNode";

export type CampaignSchedulingType = "optimized" | "fixed";

export type Campaign = {
  quantity: number;
  schedulingType: CampaignSchedulingType;
  frequency: number;
  frequencyUnit: DurationUnit;
};

export type Resource = {
  resourceOptionId: string;
  id: string;
  value: number;
  // unit: string;
};

export type ResourceOption = {
  id: string;
  name: string;
  unit: string;
};

export type DurationUnit = "day" | "hr" | "min" | "sec";

export const durationOptions: { value: DurationUnit; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "hr", label: "Hour" },
  { value: "min", label: "Min" },
  { value: "sec", label: "Sec" },
];

export type PredecessorRelation =
  | "finish-to-start"
  | "start-to-start"
  | "finish-to-finish"
  | "start-to-finish";

export interface Operation {
  id: string;
  name: string;
  duration: number;
  durationUnit: DurationUnit;
  predecessorId: string;
  predecessorRelation: PredecessorRelation;
  offset: number;
  offsetUnit: DurationUnit;
  resources: Resource[];
}

export type Equipment = {
  id: string;
  name: string;
  operations: Block[];
};

export type OperationWithTiming = Block & {
  start: number;
  end: number;
  batchNumber: number;
};

export type EquipmentWithTiming = {
  id: string;
  name: string;
  duration: number; //seconds
  operations: OperationWithTiming[];
};

export type ProcessDetails = {
  bottleneck: EquipmentWithTiming;
  batchDuration: number; //seconds
  campaignDuration: number; //seconds
  batchQty: number;
};

export type Timepoint = { time: number; value: number };
