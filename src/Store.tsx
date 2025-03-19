import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { saveToFile, openFile } from "./utils/FileSystem";
import {
  BlockTypes,
  CampaignSchedulingType,
  DurationUnit,
  Equipment,
  Block,
  BlockData,
  ResourceOption,
  State,
  ComponentProperties,
  Mixture,
  componentFlow,
  Stream,
} from "./Types";
import { v4 as uuidv4 } from "uuid";
import {
  MAX_BATCHES_PER_CAMPAIGN,
  MIN_BATCHES_PER_CAMPAIGN,
} from "./utils/constants";
import {
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  addEdge,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  MarkerType,
  XYPosition,
} from "@xyflow/react";
import { solveMassBalance } from "./lib/solveMassBal";

//TODO: On deleteResourceOption, delete all equipment resources of the same type.

//Procedure: Fermentation
//Operation: Mixing
//Equipment: V-3200

const initialState: State = {
  projectTitle: "Untitled Project",
  equipment: [],
  blocks: [
    {
      id: "1",
      type: "unitOperation",
      position: { x: 250, y: 5 },
      data: {
        label: "Fermenter",
        equipment: "3F Fermenter",
        components: [],
        calculatedComponents: [],
        isAutoCalc: false,
      },
    },
  ],
  streams: [],
  registeredComponents: [
    {
      id: "1",
      name: "Water",
      molecularFormula: "H2O",
      molecularWeight: 18.01528,
      density: 1000,
      heatCapacity: 4.184,
    },
    {
      id: "2",
      name: "Oxygen",
      molecularFormula: "O2",
      molecularWeight: 32.0,
      density: 1.429,
      heatCapacity: 0.918,
    },
    {
      id: "3",
      name: "Nitrogen",
      molecularFormula: "N2",
      molecularWeight: 28.0134,
      density: 1.2506,
      heatCapacity: 1.04,
    },
  ],
  mixtures: [
    {
      id: "1",
      name: "Air",
      components: [
        { componentId: "2", proportion: 20.95 },
        { componentId: "3", proportion: 78.08 },
      ],
    },
  ],
  campaign: {
    quantity: 1,
    schedulingType: "optimized",
    frequency: 7,
    frequencyUnit: "day",
  },
  resourceOptions: [
    { id: "1", name: "Water", unit: "lpm" },
    { id: "2", name: "Steam", unit: "kg/hr" },
    { id: "3", name: "Electricity", unit: "kW" },
    { id: "4", name: "CIP", unit: "lpm" },
  ],
};

type Action = {
  //General
  updateProjectTitle: (title: string) => void;
  saveState: () => void;
  saveAsState: () => void;
  loadState: () => void;
  resetState: () => void;
  simulate: () => void;

  //Blocks
  onBlocksChange: OnNodesChange;
  onStreamsChange: OnEdgesChange;
  onConnect: OnConnect;
  addBlock: (type: BlockTypes, position: XYPosition) => void;
  updateBlockData: (id: string, data: BlockData) => void;
  addComponentToBlock: (id: string, data: componentFlow) => void;
  deleteComponentFromBlock: (blockId: string, componentId: string) => void;
  updateMultipleBlocks: (updatedBlocks: Block[]) => void;

  //Streams
  updateStreamLabel: (id: string, label: string) => void;
  updateMultipleStreams: (updatedStreams: Stream[]) => void;

  //Equipment
  addEquipment: (procedure: Equipment) => void;
  updateEquipment: (procedure: Equipment) => void;
  deleteEquipment: (procedure: Equipment) => void;
  duplicateEquipment: (procedure: Equipment) => void;
  moveEquipmentUp: (equipmentId: string) => void;
  moveEquipmentDown: (equipmentId: string) => void;

  //Campaigns
  updateCampaignQuantity: (quantity: number) => void;
  updateCampaignSchedulingType: (
    schedulingType: CampaignSchedulingType
  ) => void;
  deleteSelectedElements: () => void;
  updateCampaignFrequency: (frequency: number) => void;
  updateCampaignFrequencyUnit: (frequencyUnit: DurationUnit) => void;
  addResourceOption: (resource: ResourceOption) => void;
  updateResourceOption: (resource: ResourceOption) => void;
  deleteResourceOption: (resource: ResourceOption) => void;

  //Ingredients
  registeredComponents: ComponentProperties[];
  mixtures: Mixture[];
  addComponent: (component: ComponentProperties) => void;
  updateComponent: (id: string, component: ComponentProperties) => void;
  deleteComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  addMixture: (mixture: Mixture) => void;
  updateMixture: (id: string, mixture: Mixture) => void;
  deleteMixture: (id: string) => void;
  duplicateMixture: (id: string) => void;
};

export const useStore = create<State & Action>()(
  persist(
    (set, get) => ({
      ...initialState,
      updateProjectTitle: (projectTitle: string) =>
        set(() => ({ projectTitle: projectTitle })),
      saveState: async () => {
        const state = useStore.getState();
        await saveToFile(
          state,
          `${useStore.getState().projectTitle}.json`,
          window.handle
        );
      },

      //GENERAL
      saveAsState: async () => {
        const state = useStore.getState();
        await saveToFile(state, `${useStore.getState().projectTitle}.json`);
      },
      loadState: async () => {
        try {
          const loadedState = await openFile();
          set(loadedState);
        } catch (error) {
          console.error("Error loading data:", error);
        }
      },
      resetState: () => {
        set(initialState);
        window.handle = undefined;
      },

      simulate: () => {
        console.log("Simulating");
        solveMassBalance();
      },

      //BLOCKS
      onBlocksChange: (changes: NodeChange[]) => {
        set({
          blocks: applyNodeChanges(changes, get().blocks) as Block[],
        });
      },

      addBlock: (type: BlockTypes, position: XYPosition) => {
        //TODO add case type and differentite between adds
        const newNode: Block = {
          id: `${get().blocks.length + 1}`,
          type,
          position,
          data: {
            label: "",
            equipment: "",
            components: [],
            calculatedComponents: [],
            isAutoCalc: false,
          },
        };
        set({ blocks: [...get().blocks, newNode] });
      },

      updateBlockData: (id: string, newData: BlockData) => {
        set((state) => ({
          blocks: state.blocks.map((node: Block) => {
            if (node.id === id) {
              return { ...node, data: { ...node.data, ...newData } };
            }
            return node;
          }),
        }));
      },
      addComponentToBlock: (id: string, newData: componentFlow) => {
        set((state) => ({
          blocks: state.blocks.map((node: Block) => {
            if (node.id === id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  components: [...(node.data.components || []), newData],
                },
              };
            }
            return node;
          }),
        }));
      },
      deleteComponentFromBlock: (blockId: string, componentId: string) => {
        set((state) => ({
          blocks: state.blocks.map((node: Block) => {
            if (node.id === blockId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  components: node.data.components.filter(
                    (component) => component.id !== componentId
                  ),
                },
              };
            }
            return node;
          }),
        }));
      },

      updateMultipleBlocks: (updatedBlocks: Block[]) => {
        set({ blocks: updatedBlocks });
      },

      //STREAMS

      updateStreamLabel: (id: string, label: string) => {
        set({
          streams: get().streams.map((edge) => {
            if (edge.id === id) {
              return {
                ...edge,
                label: label as string,
                labelStyle: { fill: "black" }, // Optional: add styling
              };
            }
            return edge;
          }),
        });
      },

      updateMultipleStreams: (updatedStreams: Stream[]) => {
        set({ streams: updatedStreams });
      },

      onStreamsChange: (changes: EdgeChange[]) => {
        set((state) => ({
          streams: applyEdgeChanges(changes, state.streams).map((edge) => ({
            ...edge,
            components: [],
            hasError: false,
            calculationComplete: false,
          })) as Stream[], // Cast to Stream[]
        }));
      },
      onConnect: (connection: Connection) => {
        set({
          streams: addEdge(
            {
              ...connection,
              type: "customEdge",
              label: "",
              markerEnd: {
                type: MarkerType.ArrowClosed,
              },
            },
            get().streams
          ),
        });
      },

      deleteSelectedElements: () => {
        set({
          blocks: get().blocks.filter((node: Node) => !node.selected),
          streams: get().streams.filter((edge: Edge) => !edge.selected),
        });
      },

      updateProcedure: (procedure: Block) =>
        set((state) => ({
          blocks: state.blocks.map((p) =>
            p.id === procedure.id ? procedure : p
          ),
        })),

      addEquipment: (equipment: Equipment) =>
        set((state) => ({ equipment: [...state.equipment, equipment] })),
      updateEquipment: (equipment: Equipment) =>
        set((state) => ({
          equipment: state.equipment.map((p) =>
            p.id === equipment.id ? equipment : p
          ),
        })),
      deleteEquipment: (equipment: Equipment) =>
        set((state) => ({
          equipment: state.equipment.filter((p) => p.id !== equipment.id),
        })),
      duplicateEquipment: (equipment: Equipment) =>
        set((state) => ({
          equipment: [
            ...state.equipment,
            {
              ...equipment,
              id: uuidv4(),
              operations: equipment.operations.map((operation) => ({
                ...operation,
                id: uuidv4(),
              })),
            },
          ],
        })),
      updateCampaignQuantity: (quantity: number) =>
        set((state) => ({
          campaign: {
            ...state.campaign,
            quantity: Math.max(
              MIN_BATCHES_PER_CAMPAIGN,
              Math.min(quantity, MAX_BATCHES_PER_CAMPAIGN)
            ),
          },
        })),
      updateCampaignSchedulingType: (schedulingType: CampaignSchedulingType) =>
        set((state) => ({
          campaign: { ...state.campaign, schedulingType },
        })),

      moveEquipmentUp: (equipmentId: string) =>
        set((state) => {
          const equipmentIndex = state.equipment.findIndex(
            (e) => e.id === equipmentId
          );
          if (equipmentIndex > 0) {
            const newEquipment = [...state.equipment];
            [newEquipment[equipmentIndex - 1], newEquipment[equipmentIndex]] = [
              newEquipment[equipmentIndex],
              newEquipment[equipmentIndex - 1],
            ];
            return { equipment: newEquipment };
          }
          return state;
        }),
      moveEquipmentDown: (equipmentId: string) =>
        set((state) => {
          const equipmentIndex = state.equipment.findIndex(
            (e) => e.id === equipmentId
          );
          if (equipmentIndex < state.equipment.length - 1) {
            const newEquipment = [...state.equipment];
            [newEquipment[equipmentIndex], newEquipment[equipmentIndex + 1]] = [
              newEquipment[equipmentIndex + 1],
              newEquipment[equipmentIndex],
            ];
            return { equipment: newEquipment };
          }
          return state;
        }),
      updateCampaignFrequency: (frequency: number) =>
        set((state) => ({
          campaign: { ...state.campaign, frequency },
        })),
      updateCampaignFrequencyUnit: (frequencyUnit: DurationUnit) =>
        set((state) => ({
          campaign: { ...state.campaign, frequencyUnit },
        })),
      addResourceOption: (resource: ResourceOption) =>
        set((state) => ({
          resourceOptions: [...state.resourceOptions, resource],
        })),
      updateResourceOption: (resource: ResourceOption) =>
        set((state) => ({
          resourceOptions: state.resourceOptions.map((r: ResourceOption) =>
            r.id === resource.id ? resource : r
          ),
        })),
      deleteResourceOption: (resource: ResourceOption) =>
        set((state) => ({
          resourceOptions: state.resourceOptions.filter(
            (r: ResourceOption) => r.id !== resource.id
          ),
        })),

      addComponent: (component) =>
        set((state) => ({
          registeredComponents: [...state.registeredComponents, component],
        })),
      updateComponent: (id, updatedComponent) =>
        set((state) => ({
          registeredComponents: state.registeredComponents.map((c) =>
            c.id === id ? updatedComponent : c
          ),
        })),
      deleteComponent: (id) =>
        set((state) => ({
          registeredComponents: state.registeredComponents.filter(
            (c) => c.id !== id
          ),
        })),
      duplicateComponent: (id) =>
        set((state) => {
          const componentToDuplicate = state.registeredComponents.find(
            (c) => c.id === id
          );
          if (!componentToDuplicate) return state;
          const newComponent = {
            ...componentToDuplicate,
            id: Date.now().toString(),
            name: `${componentToDuplicate.name} (Copy)`,
          };
          return {
            registeredComponents: [...state.registeredComponents, newComponent],
          };
        }),
      addMixture: (mixture) =>
        set((state) => ({
          mixtures: [...state.mixtures, mixture],
        })),
      updateMixture: (id, updatedMixture) =>
        set((state) => ({
          mixtures: state.mixtures.map((m) =>
            m.id === id ? updatedMixture : m
          ),
        })),
      deleteMixture: (id) =>
        set((state) => ({
          mixtures: state.mixtures.filter((m) => m.id !== id),
        })),
      duplicateMixture: (id) =>
        set((state) => {
          const mixtureToDuplicate = state.mixtures.find((m) => m.id === id);
          if (!mixtureToDuplicate) return state;
          const newMixture = {
            ...mixtureToDuplicate,
            id: Date.now().toString(),
            name: `${mixtureToDuplicate.name} (Copy)`,
          };
          return { mixtures: [...state.mixtures, newMixture] };
        }),
    }),
    {
      name: "equipment-occupancy-data", // (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
