import { saveAs } from "file-saver";

export const saveStateToFile = (state: any, fileName: string) => {
  const blob = new Blob([JSON.stringify(state)], { type: "application/json" });
  saveAs(blob, fileName);
};

export const loadStateFromFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const state = JSON.parse(event.target?.result as string);
        resolve(state);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

export const saveAsToFile = async (
  state: any,
  fileName: string = "Untitled Project.json",
  updateFileHandle: (handle: FileSystemFileHandle) => void
): Promise<void> => {
  try {
    // Request permission to access files
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: fileName,
      types: [
        {
          description: "JSON File",
          accept: { "application/json": [".json"] },
        },
      ],
    });

    // Create a FileSystemWritableFileStream to write to
    const writable = await fileHandle.createWritable();

    // Write the contents of the file
    await writable.write(JSON.stringify(state));

    // Close the file and write the contents to disk
    await writable.close();

    // Save the file handle to state
    updateFileHandle(fileHandle);

    console.log("File saved successfully");
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
};

export const saveToFile = async (
  state: any,
  fileName: string,
  fileHandle: FileSystemFileHandle | null,
  updateFileHandle: (handle: FileSystemFileHandle) => void
): Promise<void> => {
  if (!fileHandle) {
    await saveAsToFile(state, fileName, updateFileHandle);
    return;
  }

  try {
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(state));
    await writable.close();
    console.log("File updated successfully");
  } catch (error) {
    console.error("Error updating file:", error);
    throw error;
  }
};
