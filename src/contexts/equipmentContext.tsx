import { useState, createContext, useEffect } from "react";
import { deleteById } from "../utils/arrayLogic";
import { calcGanttLogic, calcEOCLogic } from "../utils/ganttLogic";
import { generateId } from "../utils/helperFunctions";

const defaultEquipmentData = [
  {
    id: "193e230f",
    title: "Mixer",
    operations: [
      {
        id: "9cddeb8a",
        title: "Setup",
        duration: "2",
        durationUnit: {
          value: "hr",
          label: "hr",
        },
        predecessor: {
          value: 0,
          label: "Initial",
          external: false,
        },
        offset: 0,
        offsetUnit: {
          value: "hr",
          label: "hr",
        },
        type: {
          value: "SF",
          label: "Start-to-Finish",
        },
        resources: [],
        start: 1,
        end: 121,
        parentId: "193e230f",
      },
      {
        id: "7bf55c2e",
        title: "Load",
        duration: "20",
        durationUnit: {
          value: "min",
          label: "min",
        },
        predecessor: {
          value: "9cddeb8a",
          label: "Setup",
          external: false,
        },
        offset: 0,
        offsetUnit: {
          value: "hr",
          label: "hr",
        },
        type: {
          value: "SF",
          label: "Start-to-Finish",
        },
        resources: [
          {
            title: "Water",
            id: "9404732e",
            color: "#8ED1FC",
            unit: "lpm",
            label: "Water - 20 lpm",
            value: "Water",
            amount: "20",
          },
        ],
        start: 121,
        end: 141,
        parentId: "193e230f",
      },
      {
        id: "4d963425",
        title: "Mix",
        duration: "45",
        durationUnit: {
          value: "min",
          label: "min",
        },
        predecessor: {
          value: "7bf55c2e",
          label: "Load",
          external: false,
        },
        offset: 0,
        offsetUnit: {
          value: "hr",
          label: "hr",
        },
        type: {
          value: "SF",
          label: "Start-to-Finish",
        },
        resources: [
          {
            title: "Electricity",
            id: "66b598e3",
            color: "#FCB900",
            unit: "kW",
            label: "Electricity - 50 kW",
            value: "Electricity",
            amount: "50",
          },
        ],
        start: 141,
        end: 186,
        parentId: "193e230f",
      },
      {
        id: "d38efdf7",
        title: "Discharge",
        duration: "30",
        durationUnit: {
          value: "min",
          label: "min",
        },
        predecessor: {
          value: "4d963425",
          label: "Mix",
          external: false,
        },
        offset: 0,
        offsetUnit: {
          value: "hr",
          label: "hr",
        },
        type: {
          value: "SF",
          label: "Start-to-Finish",
        },
        resources: [
          {
            title: "Electricity",
            id: "401e3177",
            color: "#FCB900",
            unit: "kW",
            label: "Electricity - 5 kW",
            value: "Electricity",
            amount: "5",
          },
        ],
        start: 186,
        end: 216,
        parentId: "193e230f",
      },
      {
        id: "370d6b7f",
        title: "Clean",
        duration: "2",
        durationUnit: {
          value: "hr",
          label: "hr",
        },
        predecessor: {
          value: "d38efdf7",
          label: "Discharge",
          external: false,
        },
        offset: 0,
        offsetUnit: {
          value: "hr",
          label: "hr",
        },
        type: {
          value: "SF",
          label: "Start-to-Finish",
        },
        resources: [
          {
            title: "Cleaner",
            id: "1725cf6d",
            color: "#7bdcb5",
            unit: "lpm",
            label: "Cleaner - 60 lpm",
            value: "Cleaner",
            amount: "60",
          },
        ],
        start: 216,
        end: 336,
        parentId: "193e230f",
      },
    ],
    duration: 335,
  },
  {
    id: "3086050f",
    title: "Filler",
    operations: [
      {
        id: "6b393d28",
        title: "Load",
        duration: "45",
        durationUnit: {
          value: "min",
          label: "min",
        },
        predecessor: {
          value: "d38efdf7",
          label: "Mixer - Discharge",
          external: true,
        },
        offset: 0,
        offsetUnit: {
          value: "hr",
          label: "hr",
        },
        type: {
          value: "SF",
          label: "Start-to-Finish",
        },
        resources: [],
        start: 216,
        end: 261,
        parentId: "3086050f",
      },
      {
        id: "1723dd37",
        title: "Fill",
        duration: "3",
        durationUnit: {
          value: "hr",
          label: "hr",
        },
        predecessor: {
          value: "6b393d28",
          label: "Load",
          external: false,
        },
        offset: 0,
        offsetUnit: {
          value: "hr",
          label: "hr",
        },
        type: {
          value: "SF",
          label: "Start-to-Finish",
        },
        resources: [
          {
            title: "Electricity",
            id: "ae926b37",
            color: "#FCB900",
            unit: "kW",
            label: "Electricity - 20 kW",
            value: "Electricity",
            amount: "20",
          },
        ],
        start: 261,
        end: 441,
        parentId: "3086050f",
      },
      {
        id: "f770216e",
        title: "Shutdown",
        duration: "20",
        durationUnit: {
          value: "min",
          label: "min",
        },
        predecessor: {
          value: "1723dd37",
          label: "Fill",
          external: false,
        },
        offset: 0,
        offsetUnit: {
          value: "hr",
          label: "hr",
        },
        type: {
          value: "SF",
          label: "Start-to-Finish",
        },
        resources: [],
        start: 441,
        end: 461,
        parentId: "3086050f",
      },
      {
        id: "b5e44240",
        title: "Clean",
        duration: "2",
        durationUnit: {
          value: "hr",
          label: "hr",
        },
        predecessor: {
          value: "f770216e",
          label: "Shutdown",
          external: false,
        },
        offset: 0,
        offsetUnit: {
          value: "hr",
          label: "hr",
        },
        type: {
          value: "SF",
          label: "Start-to-Finish",
        },
        resources: [
          {
            title: "Cleaner",
            id: "a07c41dc",
            color: "#7bdcb5",
            unit: "lpm",
            label: "Cleaner - 60 lpm",
            value: "Cleaner",
            amount: "60",
          },
        ],
        start: 461,
        end: 581,
        parentId: "3086050f",
      },
    ],
    duration: 365,
  },
  {
    id: "1405ec6f",
    title: "Palletizer",
    operations: [
      {
        id: "c5ed6195",
        title: "Palletize",
        duration: "3",
        durationUnit: {
          value: "hr",
          label: "hr",
        },
        predecessor: {
          value: "1723dd37",
          label: "Filler - Fill",
          external: true,
        },
        offset: 0,
        offsetUnit: {
          value: "hr",
          label: "hr",
        },
        type: {
          value: "LINK",
          label: {
            key: null,
            ref: null,
            props: {},
            _owner: {
              tag: 0,
              key: "c5ed6195",
              stateNode: null,
              return: null,
              child: null,
              sibling: null,
              index: 0,
              ref: null,
              pendingProps: null,
              memoizedProps: null,
              updateQueue: null,
              memoizedState: null,
              dependencies: null,
              mode: 27,
              flags: 1,
              subtreeFlags: 14682117,
              deletions: null,
              lanes: 0,
              childLanes: 0,
              alternate: null,
              actualDuration: 5.900000035762787,
              actualStartTime: 336913.39999997616,
              selfBaseDuration: 0.19999998807907104,
              treeBaseDuration: 5.700000047683716,
              _debugSource: {
                fileName:
                  "/Users/matthewmalone/Library/Mobile Documents/com~apple~CloudDocs/Desktop/Programming/NextJS Projects/process-visualizer/process-app/components/equipment/editEquipment.js",
                lineNumber: 325,
                columnNumber: 15,
              },
              _debugOwner: null,
              _debugNeedsRemount: false,
              _debugHookTypes: ["useCallback"],
            },
            _store: {},
          },
        },
        resources: [],
        start: 261,
        end: 441,
        parentId: "1405ec6f",
      },
    ],
    duration: 180,
  },
];

export const EquipmentContext = createContext({
  equipment: null,
  setEquipment: () => null,
  defaultResuserResourcesources: null,
  setUserResources: () => null,
  selectionId: null,
  setSelectionId: () => null,
  findSelectedEquipment: () => null,
  addEquipment: () => null,
  findEquipmentDuration: () => null,
  getMinEquipmentTime: () => null,
  duplicate: () => null,
  drawer: null,
  setDrawer: () => null,
  openFormNew: () => null,
  openFormEdit: () => null,
  closeForm: () => null,
});

export const EquipmentProvider = ({ children }) => {
  const [equipment, setEquipment] = useState([]);
  const [EOerror, setOEError] = useState({
    error: false,
    ids: [],
    message: "",
  });
  const [selectionId, setSelectionId] = useState();
  const [drawer, setDrawer] = useState({ open: false, mode: "new" });

  //Equipment Form fuctions
  const openFormNew = () => setDrawer({ open: true, mode: "new" });
  const openFormEdit = (id) => {
    setSelectionId(id);
    setDrawer({ open: true, mode: "edit" });
  };
  const closeForm = () => setDrawer({ open: false, mode: "new" });

  //Local storage functions

  useEffect(() => {
    const getLocalEquipment = () => {
      const localdata = localStorage.getItem("equipment");
      return localdata ? JSON.parse(localdata) : defaultEquipmentData;
    };
    setEquipment(getLocalEquipment());
  }, []);

  const saveEquipment = (data) => {
    localStorage.setItem("equipment", JSON.stringify(data));
    // exportToJsonFile(equipment);
  };

  const resetEquipment = () => {
    setEquipment([]);
  };

  //Equipment state functions

  const deleteEquipment = (id) => {
    console.log("delete");
    setEquipment(deleteById(equipment, id));
    setSelectionId(null);
  };

  const addEquipment = (newEquipment) => {
    const updatedEquip = addIdToOperations([...equipment, newEquipment]);
    setEquipment(updatedEquip);
  };

  const addIdToOperations = (array) => {
    const newArray = array.map((equip) => {
      const newOps = equip.operations.map((op) => {
        return { ...op, parentId: equip.id };
      });
      return { ...equip, operations: newOps };
    });

    return newArray;
  };

  const getLongestEquipmentDuration = (equipment) => {
    if (equipment.length === 0) return { duration: 0 };
    // return Math.max(...equipment.map((obj) => obj.duration));
    let longestEquip = equipment.reduce((max, obj) =>
      max.duration > obj.duration ? max : obj
    );
    // console.log("Longest Equip", longestEquip);
    return longestEquip;
  };

  const getMaxEndpoint = () => {
    if (equipment.length === 0) return 0;
    const operations = equipment.flatMap((eq) => eq.operations);
    let lastOperation = operations.reduce((max, obj) =>
      max.duration > obj.end ? max : obj
    );
    return lastOperation.end;
  };

  const calcCycleTime = () => {
    return getLongestEquipmentDuration(equipment);
  };

  const updateEquipment = (equipmentToUpdate) => {
    const newArr = equipment.map((obj) => {
      if (obj.id === equipmentToUpdate.id) {
        return equipmentToUpdate;
      }
      return obj;
    });
    const updatedEquip = addIdToOperations(newArr);
    setEquipment(updatedEquip);
  };

  const findSelectedEquipment = () => {
    const index = equipment.findIndex((item) => item.id === selectionId);
    return equipment[index];
  };

  const findEquipmentById = (id) => {
    const index = equipment.findIndex((item) => item.id === id);
    return equipment[index];
  };

  const findEquipmentIndexById = (id) => {
    const index = equipment.findIndex((item) => item.id === id);
    return index;
  };

  const findEquipmentDuration = (operations) => {
    const start = operations[0].start;
    const end = operations[operations.length - 1].end;
    const duration = Number(end - start);
    return duration;
  };

  const solveGantt = (array) => {
    return calcGanttLogic(array, equipment);
  };

  const findById = (array, id) => {
    return array.find((item) => item.id === id);
  };

  const getMinEquipmentTime = () => {
    return Math.min(...equipment.map((obj) => obj.operations[0].start));
  };

  const solveEquipmentOccupancy = () => {
    const { error, array } = calcEOCLogic(equipment);

    if (error.error) {
      setOEError({ error: true, ids: error.ids, message: error.message });
    } else {
      setOEError({ error: false, ids: [], message: "" });
      const newArray = equipment.map((equip) => {
        const newOps = equip.operations.map((op) => {
          return findById(array, op.id);
        });
        return { ...equip, operations: newOps };
      });
      setEquipment(newArray);
    }
  };

  const findAllEquipmentOpOptions = () => {
    let newArray = [];
    equipment.map((equip) => {
      equip.operations.map((operation) => {
        newArray.push({
          label: `${equip.title} - ${operation.title}`,
          value: operation.id,
          duration: operation.duration,
          durationUnit: operation.durationUnit,
          external: true,
        });
      });
    });
    return newArray;
  };

  const duplicate = (id) => {
    const copy = findEquipmentById(id);
    const copyWithNewIds = generateNewIds(copy);
    const finalizedCopy = alignPredecessorIds(copyWithNewIds);
    addEquipment({ ...finalizedCopy, title: copy.title + " (Copy)" });
  };

  const generateNewIds = (equipment) => {
    const newId = generateId();
    const operations = equipment.operations;
    const newOperations = operations.map((op) => {
      return {
        ...op,
        parentId: newId,
        id: generateId(),
        ancestorId: op.id,
      };
    });
    const updatedEquip = {
      ...equipment,
      id: newId,
      operations: newOperations,
    };
    return updatedEquip;
  };

  const alignPredecessorIds = (equipment) => {
    //For each operation with internal references, change the reference id to the duplicatedId
    const operations = equipment.operations;
    console.log("OPerations", operations);
    const newOperations = operations.map((op) => {
      if (op.predecessor.value === 0) {
        return op;
      }
      if (!op.predecessor.external) {
        console.log(
          "Looking for an op with this value: ",
          op.predecessor.value
        );
        const referenceOp = operations.find(
          (item) => item.ancestorId === op.predecessor.value
        );
        console.log("referenceOp", referenceOp);
        const newPredId = referenceOp.id;

        return {
          ...op,
          predecessor: {
            ...op.predecessor,
            value: newPredId,
          },
        };
      } else {
        return op;
      }
    });
    const updatedEquip = {
      ...equipment,
      operations: newOperations,
    };
    return updatedEquip;
  };

  const moveUp = (id) => {
    const index = findEquipmentIndexById(id);
    if (index === 0) return;
    let newArr = [...equipment];
    newArr.splice(index - 1, 0, newArr.splice(index, 1)[0]);
    setEquipment(newArr);
  };
  const moveDown = (id) => {
    const index = findEquipmentIndexById(id);
    if (index === equipment.length - 1) return;
    let newArr = [...equipment];
    newArr.splice(index + 1, 0, newArr.splice(index, 1)[0]);
    setEquipment(newArr);
  };

  return (
    <EquipmentContext.Provider
      value={{
        equipment,
        EOerror,
        setEquipment,
        selectionId,
        findSelectedEquipment,
        deleteEquipment,
        addEquipment,
        updateEquipment,
        findEquipmentById,
        findAllEquipmentOpOptions,
        solveGantt,
        solveEquipmentOccupancy,
        saveEquipment,
        moveUp,
        moveDown,
        duplicate,
        findEquipmentDuration,
        calcCycleTime,
        getMinEquipmentTime,
        drawer,
        openFormNew,
        openFormEdit,
        closeForm,
        getMaxEndpoint,
        resetEquipment,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};
