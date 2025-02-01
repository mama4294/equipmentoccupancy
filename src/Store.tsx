import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { saveToFile, openFile } from "./utils/FileSystem";
import {
  BFDBlocks,
  CampaignSchedulingType,
  DurationUnit,
  Equipment,
  Procedure,
  ProcedureData,
  ResourceOption,
  State,
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
} from "@xyflow/react";

//TODO: On deleteResourceOption, delete all equipment resources of the same type.

//Procedure: Fermentation
//Operation: Mixing
//Equipment: V-3200

const initialState: State = {
  projectTitle: "Untitled Project",
  equipment: [],
  procedures: [
    {
      id: "1",
      type: "unitOperation",
      position: { x: 250, y: 5 },
      data: { label: "Fermenter", equipment: "3F Fermenter" },
    },
  ],
  streams: [],
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
  updateProjectTitle: (title: string) => void;
  saveState: () => void;
  saveAsState: () => void;
  loadState: () => void;
  resetState: () => void;
  onProceduresChange: OnNodesChange;
  onStreamsChange: OnEdgesChange;
  onConnect: OnConnect;
  addProcedure: (type: BFDBlocks) => void;
  updateProcedureData: (id: string, data: ProcedureData) => void;
  addEquipment: (procedure: Equipment) => void;
  updateEquipment: (procedure: Equipment) => void;
  deleteEquipment: (procedure: Equipment) => void;
  duplicateEquipment: (procedure: Equipment) => void;
  moveEquipmentUp: (equipmentId: string) => void;
  moveEquipmentDown: (equipmentId: string) => void;
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
      onProceduresChange: (changes: NodeChange[]) => {
        set({
          procedures: applyNodeChanges(
            changes,
            get().procedures
          ) as Procedure[],
        });
      },
      onStreamsChange: (changes: EdgeChange[]) => {
        set({
          streams: applyEdgeChanges(changes, get().streams),
        });
      },

      onConnect: (connection: Connection) => {
        set({
          streams: addEdge(
            {
              ...connection,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 30,
                height: 30,
              },
            },
            get().streams
          ),
        });
      },
      addProcedure: (type: BFDBlocks) => {
        const newNode: Procedure = {
          id: `${get().procedures.length + 1}`,
          type,
          position: { x: Math.random() * 500, y: Math.random() * 300 },
          data: {
            label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
            equipment: "",
          },
        };
        set({ procedures: [...get().procedures, newNode] });
      },

      updateProcedureData: (id: string, newData: ProcedureData) => {
        set({
          procedures: get().procedures.map((node: Procedure) => {
            if (node.id === id) {
              node.data = { ...node.data, ...newData };
            }
            return node;
          }),
        });
      },

      deleteSelectedElements: () => {
        set({
          procedures: get().procedures.filter((node: Node) => !node.selected),
          streams: get().streams.filter((edge: Edge) => !edge.selected),
        });
      },

      updateProcedure: (procedure: Procedure) =>
        set((state) => ({
          procedures: state.procedures.map((p) =>
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
    }),
    {
      name: "equipment-occupancy-data", // (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
