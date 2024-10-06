import { useState, createContext, useEffect } from "react";
import { generateId } from "../utils/helperFunctions";
import { addToArray, deleteByIds } from "../utils/arrayLogic";

export const CampaignContext = createContext({
  batches: null,
  setBatches: () => null,
  defaultBatch: null,
  handleAdd: () => null,
  handleEdit: () => null,
  handleDelete: () => null,
  saveBatches: () => null,
});

export const CampaignProvider = ({ children }) => {
  const getRandomColor = () => {
    const colors = [
      "#FF6900",
      "#FCB900",
      "#7BDCB5",
      "#00D084",
      "#8ED1FC",
      "#0693E3",
      "#ABB8C3",
      "#EB144C",
      "#F78DA7",
      "#9900EF",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const [batches, setBatches] = useState([]);
  const defaultBatch = { id: generateId(), color: getRandomColor() };

  const exampleBatches = [
    {
      id: 1,
      color: "#7BDCB5",
    },
    {
      id: "d5a3b2ed",
      color: "#8ed1fc",
    },
    {
      id: "ac0b8592",
      color: "#fcb900",
    },
  ];

  useEffect(() => {
    const getLocalData = () => {
      const localdata = localStorage.getItem("batches");
      return localdata ? JSON.parse(localdata) : exampleBatches;
    };
    setBatches(getLocalData());
  }, []);

  const saveBatches = (data) => {
    localStorage.setItem("batches", JSON.stringify(data));
  };

  const resetBatches = () => {
    setBatches([defaultBatch]);
  };

  const handleAdd = () => {
    if (batches.length < 10) {
      setBatches(addToArray(batches, defaultBatch));
    }
  };

  const handleEdit = (event, batchId) => {
    console.log("edit", batchId);
    let id = null;
    let value = null;

    if (event.target !== undefined) {
      id = event.target.id;
      value = event.target.value;
    } else if (event.hex !== undefined) {
      id = "color";
      value = event.hex;
    } else {
      throw new Error("Invalid event");
    }

    const newState = batches.map((batch) => {
      if (batch.id === batchId) {
        // console.log(`Found operation with field ${field} and value ${value}`);
        return { ...batch, [id]: value };
      }
      //otherwise return object as is
      return batch;
    });
    setBatches(newState);
  };

  const handleDelete = (id) => {
    if (batches.length > 1) {
      setBatches(deleteByIds(batches, [{ id: id }]));
    }
  };

  return (
    <CampaignContext.Provider
      value={{
        batches,
        setBatches,
        defaultBatch,
        handleAdd,
        handleEdit,
        handleDelete,
        saveBatches,
        resetBatches,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};
