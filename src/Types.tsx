export type State = {
  projectTitle: string;
  equipment: Equipment[];
  campaign: Campaign;
  // resourceOptions: ResourceOption[];
};

export type CampaignSchedulingType = "optimized" | "fixed";

export type Campaign = {
  quantity: number;
  schedulingType: CampaignSchedulingType;
  frequency: number;
  frequencyUnit: DurationUnit;
};

type Resource = {
  title: string;
  id: string;
  unit: string;
  label: string;
  value: string;
  amount: string;
};

export type DurationUnit = "day" | "hr" | "min" | "sec";

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
  parentId: string;
}

export type Equipment = {
  id: string;
  name: string;
  operations: Operation[];
};

export type OperationWithTiming = Operation & {
  start: number;
  end: number;
};

export type EquipmentWithTiming = {
  id: string;
  name: string;
  duration: number; //seconds
  operations: OperationWithTiming[];
};
