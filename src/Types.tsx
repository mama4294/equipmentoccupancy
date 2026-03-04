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

// NOTE: the union is used throughout the app for user-facing time selectors.  We
// extend it with "week" so dropdowns (e.g. campaign frequency) automatically
// support the new unit.  Existing logic that iterates over durationOptions will
// now include a week option, but most of the code continues to treat weeks like
// longer days/hrs and will only display it when appropriate.
export type DurationUnit = "week" | "day" | "hr" | "min" | "sec";

export const durationOptions: { value: DurationUnit; label: string }[] = [
  { value: "week", label: "Week" },
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
  quantity: number;
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
  cycleTime: number; //seconds
};

export type Timepoint = { time: number; value: number };
