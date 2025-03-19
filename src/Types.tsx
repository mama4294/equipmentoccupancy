import { type Node, type Edge } from "@xyflow/react";

export type State = {
  projectTitle: string;
  equipment: Equipment[];
  campaign: Campaign;
  resourceOptions: ResourceOption[];
  blocks: Block[];
  streams: Stream[];
  registeredComponents: ComponentProperties[];
  mixtures: Mixture[];
};

export interface Stream extends Edge {
  label?: string;
}
export type EdgeTypes = "customEdge";

export type BlockData = {
  label: string;
  equipment: string;
  components: componentFlow[];
};
export type Block = Node<BlockData>;

export type NodeTypes =
  | "unitOperation"
  | "inputNode"
  | "outputNode"
  | "mixer"
  | "fermentation";

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

export type Mixture = {
  id: string;
  name: string;
  components: { componentId: string; proportion: number }[];
};

export type componentFlow = {
  id: string;
  mass: number;
  unit: string;
};

export type ComponentProperties = {
  // General Properties
  id: string;
  name: string;
  molecularFormula: string;
  molecularWeight: number; // g/mol
  density?: number; // kg/m³
  specificVolume?: number; // m³/kg
  heatCapacity: number; //kJ/kg/K

  // casNumber?: string;
  // criticalTemperature?: number; // K
  // criticalPressure?: number; // Pa
  // criticalVolume?: number; // m³/mol

  // // Physical Properties
  // density?: number; // kg/m³
  // specificVolume?: number; // m³/kg
  // boilingPoint?: number; // K
  // meltingPoint?: number; // K
  // vaporPressure?: (T: number) => number; // Function of Temperature (Pa)
  // solubilityInWater?: "miscible" | "limited" | "insoluble";
  // partitionCoefficients?: {
  //   octanolWater?: number;
  //   airWater?: number;
  // };

  // // Thermodynamic Properties
  // specificHeat?: {
  //   liquid?: number; // kJ/kg·K
  //   vapor?: number; // kJ/kg·K
  // };
  // enthalpyOfFormation?: number; // kJ/mol
  // heatOfVaporization?: number; // kJ/kg
  // heatOfFusion?: number; // kJ/kg
  // entropy?: number; // J/mol·K

  // // Transport Properties
  // viscosity?: {
  //   liquid?: number; // Pa·s
  //   gas?: number; // Pa·s
  // };
  // thermalConductivity?: {
  //   liquid?: number; // W/m·K
  //   gas?: number; // W/m·K
  // };
  // surfaceTension?: number; // N/m

  // // Phase Equilibrium Data
  // activityCoefficients?: number[];
  // vaporLiquidEquilibrium?: (T: number, P: number) => number; // Function of Temp & Pressure
  // liquidLiquidEquilibrium?: (T: number) => number; // Function of Temperature
  // solidLiquidEquilibrium?: (T: number) => number; // Function of Temperature

  // // Safety & Environmental Properties
  // flashPoint?: number; // K
  // autoignitionTemperature?: number; // K
  // toxicityTLV?: number; // Threshold limit value (ppm)
  // environmentalFate?: {
  //   biodegradability?: string;
  //   toxicityRating?: string;
  //   ozoneDepletionPotential?: number;
  // };

  // // Reaction & Biological Properties
  // reactionKinetics?: {
  //   activationEnergy?: number; // kJ/mol
  //   preExponentialFactor?: number; // 1/s
  // };
  // biodegradabilityCoefficient?: number;
  // oxygenDemand?: {
  //   BOD?: number; // Biological Oxygen Demand
  //   COD?: number; // Chemical Oxygen Demand
  // };
  // henrysLawConstant?: number; // Pa·m³/mol
};
