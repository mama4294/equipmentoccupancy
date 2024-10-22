export type State = {
  projectTitle: string;
  equipment: Equipment[];
  campaign: Campaign;
  resourceOptions: ResourceOption[];
};

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
  operations: Operation[];
};

export type OperationWithTiming = Operation & {
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
