import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { saveToFile, openFile } from "./utils/FileSystem";
import { Equipment, State } from "./Types";

//Procedure: Fermentation
//Operation: Mixing
//Equipment: V-3200

// define the initial state
const initialState: State = {
  projectTitle: "Untitled Project",
  equipment: [],
};

type Action = {
  updateProjectTitle: (title: string) => void;
  saveState: () => void;
  saveAsState: () => void;
  loadState: () => void;
  resetState: () => void;
  addEquipment: (procedure: Equipment) => void;
  updateEquipment: (procedure: Equipment) => void;
  deleteEquipment: (procedure: Equipment) => void;
  duplicateEquipment: (procedure: Equipment) => void;
  moveEquipmentUp: (equipmentId: string) => void;
  moveEquipmentDown: (equipmentId: string) => void;
};

export const useStore = create<State & Action>()(
  persist(
    (set) => ({
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
          equipment: [...state.equipment, { ...equipment }],
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
    }),
    {
      name: "equipment-occupancy-data", // (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
