import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { saveToFile, openFile } from "./utils/FileSystem";
import { Procedure, State } from "./Types";

//Procedure: Fermentation
//Operation: Mixing
//Equipment: V-3200

// define the initial state
const initialState: State = {
  projectTitle: "Untitled Project",
  procedures: [],
};

type Action = {
  updateProjectTitle: (title: string) => void;
  saveState: () => void;
  saveAsState: () => void;
  loadState: () => void;
  resetState: () => void;
  addProcedure: (procedure: Procedure) => void;
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
        console.log("State reset");
        console.log(window.handle);
      },
      addProcedure: (procedure: Procedure) =>
        set((state) => ({ procedures: [...state.procedures, procedure] })),
    }),
    {
      name: "equipment-occupancy-data", // (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
