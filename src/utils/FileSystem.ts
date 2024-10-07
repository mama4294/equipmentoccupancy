import { fileOpen, fileSave } from "browser-fs-access";

declare global {
  interface Window {
    handle: FileSystemFileHandle | undefined;
  }
}

export const saveToFile = async (
  state: any,
  fileName: string,
  handle?: FileSystemFileHandle | undefined
) => {
  const blob = new Blob([JSON.stringify(state)], { type: "application/json" });
  await fileSave(
    blob, //blob to save
    { fileName: fileName }, //Options
    handle //Link to existing file handle if saving over existing file. If undefined, will save as new file.
  )
    .then((result) => {
      if (result != undefined) window.handle = result; //Set handle so future saves will go to this file
      return result;
    })
    .catch((error) => {
      return error;
    });
};

export const openFile = async (): Promise<any> => {
  try {
    // Open file picker
    const blob = await fileOpen({
      mimeTypes: ["application/json"],
    });

    //Set handle so future saves will go to this file
    if (blob.handle) {
      console.log("Blob had a handle", blob.handle);
      window.handle = blob.handle;

      // Get the File object
      const file = await blob.handle.getFile();

      // Read and parse the file contents
      const contents = await file.text();
      const state = JSON.parse(contents);

      return state;
    }
  } catch (error) {
    console.error("Error opening file:", error);
    throw error;
  }
};
