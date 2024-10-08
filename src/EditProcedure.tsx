import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./components/ui/drawer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Plus, Minus } from "lucide-react";
import { Input } from "./components/ui/input";
import { useStore } from "./Store";

import {
  DurationUnit,
  Operation,
  predecessorRelation,
  Procedure,
} from "./Types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

type Props = {
  procedureToEdit?: Procedure;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const EditProcedure = ({ procedureToEdit, isOpen, setIsOpen }: Props) => {
  const { addProcedure } = useStore();

  const initialOperation: Operation = {
    id: uuidv4(),
    name: "",
    duration: 0,
    durationUnit: "hr",
    predecessor: { id: "", name: "", external: false },
    predecessorRelation: "start-to-finish",
    offset: 0,
    offsetUnit: "hr",
    resources: [],
    start: 0,
    end: 0,
    parentId: "",
  };

  const initialProcedure: Procedure = {
    id: uuidv4(),
    name: "",
    equipmentTag: "",
    operations: [initialOperation],
  };

  const [procedure, setProcedure] = useState<Procedure>(initialProcedure);

  useEffect(() => {
    if (procedureToEdit) {
      setProcedure(procedureToEdit);
    }
  }, [procedureToEdit]);

  const handleAddOperation = () => {
    setProcedure((prev) => ({
      ...prev,
      operations: [...prev.operations, { ...initialOperation, id: uuidv4() }],
    }));
  };

  const handleRemoveOperation = (id: string) => {
    setProcedure((prev) => ({
      ...prev,
      operations: prev.operations.filter((op) => op.id !== id),
    }));
  };

  const handleOperationChange = (
    id: string,
    field: keyof Operation,
    value: any
  ) => {
    setProcedure((prev) => ({
      ...prev,
      operations: prev.operations.map((op) =>
        op.id === id ? { ...op, [field]: value } : op
      ),
    }));
  };

  const handleSubmit = () => {
    if (procedureToEdit) {
      //   updateProcedure(procedure);
    } else {
      addProcedure(procedure);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    // Update predecessors when operations change
    setProcedure((prev) => ({
      ...prev,
      operations: prev.operations.map((op, index) => ({
        ...op,
        predecessor:
          index === 0
            ? { id: "initial", name: "Initial", external: false }
            : {
                id: prev.operations[index - 1].id,
                name: prev.operations[index - 1].name,
                external: false,
              },
      })),
    }));
  }, [procedure.operations.length]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setProcedure(initialProcedure)}
        >
          New Process
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {procedureToEdit ? "Edit" : "New"} Procedure
          </DrawerTitle>
          <DrawerDescription>
            {procedureToEdit ? "Edit an existing" : "Add a new"} procedure with
            multiple operations.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Procedure Name</Label>
              <Input
                id="title"
                placeholder="Fermentation"
                value={procedure.name}
                onChange={(e) =>
                  setProcedure((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <Label htmlFor="operations">Operations</Label>
            <div id="operations">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Predecessor</TableHead>
                    <TableHead>Relation</TableHead>
                    <TableHead>Offset</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {procedure.operations.map((operation, index) => (
                    <TableRow key={operation.id}>
                      <TableCell>
                        <Input
                          value={operation.name}
                          onChange={(e) =>
                            handleOperationChange(
                              operation.id,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Name"
                        />
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            value={operation.duration}
                            onChange={(e) =>
                              handleOperationChange(
                                operation.id,
                                "duration",
                                e.target.value
                              )
                            }
                            placeholder="Duration"
                            className="w-20"
                          />
                          <Select
                            value={operation.durationUnit}
                            onValueChange={(value: DurationUnit) =>
                              handleOperationChange(
                                operation.id,
                                "durationUnit",
                                value
                              )
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="day">Day</SelectItem>
                              <SelectItem value="hr">Hour</SelectItem>
                              <SelectItem value="min">Minute</SelectItem>
                              <SelectItem value="sec">Second</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell className="p-2">
                        <Select
                          value={operation.predecessor.id}
                          onValueChange={(value: string) => {
                            const predecessor =
                              value === "initial"
                                ? {
                                    id: "initial",
                                    name: "Initial",
                                    external: false,
                                  }
                                : {
                                    id: value,
                                    name:
                                      procedure.operations.find(
                                        (op) => op.id === value
                                      )?.name || "",
                                    external: false,
                                  };
                            handleOperationChange(
                              operation.id,
                              "predecessor",
                              predecessor
                            );
                          }}
                        >
                          <SelectTrigger className="w-[150px] h-8">
                            <SelectValue placeholder="Select predecessor" />
                          </SelectTrigger>
                          <SelectContent>
                            {index === 0 && (
                              <SelectItem value="initial">Initial</SelectItem>
                            )}
                            {procedure.operations.slice(0, index).map((op) => (
                              <SelectItem key={op.id} value={op.id}>
                                {op.name ||
                                  `Operation ${
                                    procedure.operations.indexOf(op) + 1
                                  }`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-2">
                        <Select
                          value={operation.predecessorRelation}
                          onValueChange={(value: predecessorRelation) =>
                            handleOperationChange(
                              operation.id,
                              "predecessorRelation",
                              value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Relation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="finish-to-start">
                              Finish to Start
                            </SelectItem>
                            <SelectItem value="start-to-start">
                              Start to Start
                            </SelectItem>
                            <SelectItem value="finish-to-finish">
                              Finish to Finish
                            </SelectItem>
                            <SelectItem value="start-to-finish">
                              Start to Finish
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            value={operation.offset}
                            onChange={(e) =>
                              handleOperationChange(
                                operation.id,
                                "offset",
                                parseInt(e.target.value)
                              )
                            }
                            placeholder="Offset"
                            className="w-20"
                          />
                          <Select
                            value={operation.offsetUnit}
                            onValueChange={(value: DurationUnit) =>
                              handleOperationChange(
                                operation.id,
                                "offsetUnit",
                                value
                              )
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="day">Day</SelectItem>
                              <SelectItem value="hr">Hour</SelectItem>
                              <SelectItem value="min">Minute</SelectItem>
                              <SelectItem value="sec">Second</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell className="p-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveOperation(operation.id)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="outline" onClick={handleAddOperation}>
                <Plus className="h-4 w-4 mr-2" /> Add Operation
              </Button>
            </div>
          </div>
        </div>
        <DrawerFooter className="pt-2">
          <Button onClick={handleSubmit}>
            {procedureToEdit ? "Update" : "Save"} Procedure
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EditProcedure;
