import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { saveToFile, openFile } from "./utils/FileSystem";

export type State = {
  projectTitle: string;
};

// define the initial state
const initialState: State = {
  projectTitle: "Untitled Project",
};

type Action = {
  updateProjectTitle: (title: string) => void;
  saveState: () => void;
  loadState: () => void;
  resetState: () => void;
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
    }),
    {
      name: "equipment-occupancy-data", // (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
