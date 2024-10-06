import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { saveToFile, loadStateFromFile } from "./utils/FileSystem";

export type State = {
  projectTitle: string;
  fileHandle: FileSystemFileHandle | null;
};

type Action = {
  updateProjectTitle: (title: string) => void;
  updateFileHandle: (fileHandle: FileSystemFileHandle) => void;
  saveState: () => void;
  loadState: (file: File) => void;
};

export const useStore = create<State & Action>()(
  persist(
    (set) => ({
      projectTitle: "Untitled Project",
      fileHandle: null,
      updateProjectTitle: (projectTitle: string) =>
        set(() => ({ projectTitle: projectTitle })),
      updateFileHandle: (fileHandle: FileSystemFileHandle) =>
        set(() => ({ fileHandle: fileHandle })),
      saveState: () => {
        const state = useStore.getState();
        saveToFile(
          state,
          `${useStore.getState().projectTitle}.json`,
          useStore.getState().fileHandle,
          useStore.getState().updateFileHandle
        );
      },
      loadState: async (file: File) => {
        try {
          const loadedState = await loadStateFromFile(file);
          set(loadedState);
        } catch (error) {
          console.error("Error loading data:", error);
        }
      },
    }),
    {
      name: "equipment-occupancy-data", // (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
