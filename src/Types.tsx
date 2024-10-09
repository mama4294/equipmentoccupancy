export type State = {
  projectTitle: string;
  equipment: Equipment[];
  // batches: Batch[];
  // resourceOptions: ResourceOption[];
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

type Predecessor = {
  id: string;
  name: string;
  external: boolean;
};

export type predecessorRelation =
  | "finish-to-start"
  | "start-to-start"
  | "finish-to-finish"
  | "start-to-finish";

export type Operation = {
  id: string;
  name: string;
  duration: number;
  durationUnit: DurationUnit;
  predecessor: Predecessor;
  predecessorRelation: predecessorRelation;
  offset: number;
  offsetUnit: DurationUnit;
  resources: Resource[];
  start: number;
  end: number;
  parentId: string;
};

export type Equipment = {
  id: string;
  name: string;
  operations: Operation[];
  // duration: number;
};