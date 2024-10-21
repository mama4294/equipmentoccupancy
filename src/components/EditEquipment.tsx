import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Plus, Minus, PlusCircle, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import { useStore } from "../Store";

import {
  DurationUnit,
  Operation,
  PredecessorRelation,
  Equipment,
  durationOptions,
  resourceOptions,
  Resource,
  ResourceOption,
} from "../Types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { PopoverClose } from "@radix-ui/react-popover";

type Props = {
  equipmentToEdit?: Equipment | null;
  setEquipmentToEdit: (procedure: Equipment | null) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const EditProcedure = ({
  equipmentToEdit,
  setEquipmentToEdit,
  isOpen,
  setIsOpen,
}: Props) => {
  const {
    addEquipment,
    updateEquipment,
    equipment: equipmentList,
  } = useStore();

  const initialOperation: Operation = {
    id: uuidv4(),
    name: "",
    duration: 1,
    durationUnit: "hr",
    predecessorId: "",
    predecessorRelation: "finish-to-start",
    offset: 0,
    offsetUnit: "hr",
    resources: [],
  };

  const initialEquipment: Equipment = {
    id: uuidv4(),
    name: "",
    operations: [initialOperation],
  };

  const [equipment, setEquipment] = useState<Equipment>(initialEquipment);

  useEffect(() => {
    if (equipmentToEdit) {
      setEquipment(equipmentToEdit);
    }
  }, [equipmentToEdit]);

  const handleAddOperation = () => {
    setEquipment((prev) => ({
      ...prev,
      operations: [...prev.operations, { ...initialOperation, id: uuidv4() }],
    }));
  };

  const handleRemoveOperation = (id: string) => {
    setEquipment((prev) => ({
      ...prev,
      operations: prev.operations.filter((op) => op.id !== id),
    }));
  };

  const handleOperationChange = (
    id: string,
    field: keyof Operation,
    value: any
  ) => {
    setEquipment((prev) => ({
      ...prev,
      operations: prev.operations.map((op) =>
        op.id === id ? { ...op, [field]: value } : op
      ),
    }));
  };

  const handleAddResource = (operationId: string, resource: Resource) => {
    setEquipment((prev) => ({
      ...prev,
      operations: prev.operations.map((op) =>
        op.id === operationId
          ? {
              ...op,
              resources: [...op.resources, resource],
            }
          : op
      ),
    }));
  };

  const handleRemoveResource = (operationId: string, resourceId: string) => {
    setEquipment((prev) => ({
      ...prev,
      operations: prev.operations.map((op) =>
        op.id === operationId
          ? {
              ...op,
              resources: op.resources.filter((r) => r.id !== resourceId),
            }
          : op
      ),
    }));
  };

  const handleResourceChange = (
    operationId: string,
    resourceId: string,
    updatedResource: Resource
  ) => {
    setEquipment((prev) => ({
      ...prev,
      operations: prev.operations.map((op) =>
        op.id === operationId
          ? {
              ...op,
              resources: op.resources.map((r) =>
                r.id === resourceId ? updatedResource : r
              ),
            }
          : op
      ),
    }));
  };

  const handleSubmit = () => {
    if (equipmentToEdit) {
      updateEquipment(equipment);
    } else {
      addEquipment(equipment);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    // Update predecessors when operations change
    setEquipment((prev) => ({
      ...prev,
      operations: prev.operations.map((op, index) => ({
        ...op,
        predecessorId: index === 0 ? "initial" : prev.operations[index - 1].id,
      })),
    }));
  }, [equipment.operations.length]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          // variant="outline"
          className="w-full"
          onClick={() => {
            setEquipmentToEdit(null);
            setEquipment(initialEquipment);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Equipment
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {equipmentToEdit ? "Edit" : "New"} Equipment
          </DrawerTitle>
          <DrawerDescription>
            {equipmentToEdit ? "Edit an existing" : "Add a new"} equipment with
            multiple operations.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5 mb-12">
              <Label htmlFor="title">Equipment Name</Label>
              <Input
                id="title"
                placeholder="Fermenter 3A"
                value={equipment.name}
                onChange={(e) =>
                  setEquipment((prev) => ({ ...prev, name: e.target.value }))
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
                    <TableHead>Resources</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipment.operations.map((operation, index) => (
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
                        <div className="relative flex-grow w-28">
                          <Input
                            id="duration"
                            type="number"
                            value={operation.duration}
                            onChange={(e) =>
                              handleOperationChange(
                                operation.id,
                                "duration",
                                e.target.value
                              )
                            }
                            min={1}
                            className="pr-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center">
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
                              <SelectTrigger className="border-0 bg-transparent h-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {durationOptions.map((duration) => {
                                  return (
                                    <SelectItem
                                      value={duration.value}
                                      key={duration.label}
                                    >
                                      {duration.label}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-2">
                        <Select
                          value={operation.predecessorId}
                          onValueChange={(value: string) => {
                            handleOperationChange(
                              operation.id,
                              "predecessorId",
                              value
                            );
                          }}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select predecessor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="initial">Initial</SelectItem>
                            {[...equipmentList, equipment]
                              .flatMap((eq) =>
                                eq.operations.map((op, opIndex) => {
                                  // Skip the current operation
                                  if (op.id === operation.id) return null;

                                  const optionText = `${
                                    eq.name || "Current"
                                  } - ${op.name || `Operation ${opIndex + 1}`}`;

                                  // Use a unique key combining equipment and operation IDs
                                  const key = `${eq.id}-${op.id}`;

                                  return (
                                    <SelectItem key={key} value={op.id}>
                                      {optionText}
                                    </SelectItem>
                                  );
                                })
                              )
                              .filter(
                                (item, index, self) =>
                                  // Filter out null items and remove duplicates
                                  item !== null &&
                                  index ===
                                    self.findIndex(
                                      (t) =>
                                        t && t.props.value === item.props.value
                                    )
                              )}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-2 w-30">
                        <Select
                          value={operation.predecessorRelation}
                          onValueChange={(value: PredecessorRelation) =>
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
                        <div className="relative flex-grow w-28">
                          <Input
                            id="offset"
                            type="number"
                            value={operation.offset}
                            onChange={(e) =>
                              handleOperationChange(
                                operation.id,
                                "offset",
                                e.target.value
                              )
                            }
                            min={1}
                            className="pr-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center">
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
                              <SelectTrigger className="border-0 bg-transparent h-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {durationOptions.map((duration) => {
                                  return (
                                    <SelectItem
                                      value={duration.value}
                                      key={duration.value}
                                    >
                                      {duration.label}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="p-2">
                        <div className="flex flex-wrap gap-2">
                          {operation.resources.map((resource) => {
                            const resourceData = resourceOptions.find(
                              (o: ResourceOption) =>
                                o.id === resource.resourceOptionId
                            );

                            return (
                              <Popover key={resource.id}>
                                <PopoverTrigger>
                                  <Badge
                                    variant="secondary"
                                    className="cursor-pointer"
                                  >
                                    {resourceData!.name} - {resource.value}{" "}
                                    {resourceData!.unit}
                                  </Badge>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                  <ResourceForm
                                    resource={resource}
                                    onSubmit={(editedResource) => {
                                      handleResourceChange(
                                        operation.id,
                                        resource.id,
                                        editedResource
                                      );
                                    }}
                                    onDelete={() =>
                                      handleRemoveResource(
                                        operation.id,
                                        resource.id
                                      )
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
                            );
                          })}
                          <Popover>
                            <PopoverTrigger asChild>
                              <div>
                                <Button variant="outline" size="sm">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <ResourceForm
                                resource={null}
                                onSubmit={(newResource) => {
                                  handleAddResource(operation.id, newResource);
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </TableCell>

                      <TableCell className="p-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveOperation(operation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
            {equipmentToEdit ? "Update" : "Save"} Equipment
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

const ResourceForm = ({
  resource,
  onSubmit,
  onDelete,
}: {
  resource: Resource | null;
  onSubmit: (resource: Resource) => void;
  onDelete?: () => void;
}) => {
  const initialResource: Resource = {
    id: uuidv4(),
    resourceOptionId: resourceOptions[0].id,
    value: 10,
  };

  const [formData, setFormData] = useState<Resource>(
    resource || initialResource
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="resourceName">Resource</Label>
        <Select
          value={formData.resourceOptionId}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, resourceOptionId: value }))
          }
        >
          <SelectTrigger id="resourceName">
            <SelectValue placeholder="Select resource" />
          </SelectTrigger>
          <SelectContent>
            {resourceOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Input
            id="resourceValue"
            type="number"
            value={formData.value}
            onChange={(e) =>
              setFormData((prev: Resource) => ({
                ...prev,
                value: Number(e.target.value),
              }))
            }
            className="flex-grow"
          />
          <span className="text-sm">
            {
              resourceOptions.find((o) => o.id === formData.resourceOptionId)
                ?.unit
            }
          </span>
        </div>
      </div>
      <PopoverClose className="flex justify-between w-full">
        <Button type="submit">{resource ? "Update" : "Add"}</Button>
        {resource && onDelete && (
          <Button type="button" variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </PopoverClose>
    </form>
  );
};
