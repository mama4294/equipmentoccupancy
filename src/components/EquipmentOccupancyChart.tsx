import React, { useMemo, useState } from "react";
import { Equipment, EquipmentWithTiming, OperationWithTiming } from "../Types";
import {
  MoreVertical,
  Edit,
  Trash,
  Copy,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { useStore } from "../Store";
import EditProcedure from "./EditEquipment";
import { cn } from "@/lib/utils";

export default function EOChart({
  equipmentWithTiming,
}: {
  equipmentWithTiming: EquipmentWithTiming[];
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // New state for the drawer
  const [selectedEquipment, setSelectedEquipment] =
    useState<Equipment | null>();
  const { equipment: equipmentList } = useStore();

  console.log("equipmentWithTiming: ", equipmentWithTiming);

  const maxDuration = useMemo(() => {
    return Math.max(
      ...equipmentWithTiming.flatMap((p) => p.operations.map((op) => op.end))
    );
  }, [equipmentWithTiming]);

  return (
    <Card className="w-full col-span-4">
      <CardHeader>
        <CardTitle>Equipment Occupancy Chart</CardTitle>
        <CardDescription>Process Schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {equipmentWithTiming.flatMap((equipment) => {
            const equipmentData = equipmentList.find(
              (eq: Equipment) => eq.id === equipment.id
            );
            const quantity = equipmentData?.quantity || 1;
            
            return Array.from({ length: quantity }, (_, index) => (
              <EquipmentRow
                key={`${equipment.id}-${index}`}
                equipmentWithTiming={equipment}
                maxDuration={maxDuration}
                setSelectedEquipment={setSelectedEquipment}
                setIsDrawerOpen={setIsDrawerOpen}
                instanceNumber={index + 1}
                totalInstances={quantity}
              />
            ));
          })}
        </div>
      </CardContent>
      <CardFooter>
        <EditProcedure
          equipmentToEdit={selectedEquipment}
          setEquipmentToEdit={setSelectedEquipment}
          isOpen={isDrawerOpen}
          setIsOpen={setIsDrawerOpen}
        />
      </CardFooter>
    </Card>
  );
}

const EquipmentRow: React.FC<{
  equipmentWithTiming: EquipmentWithTiming;
  maxDuration: number;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEquipment: React.Dispatch<
    React.SetStateAction<Equipment | null | undefined>
  >;
  instanceNumber: number;
  totalInstances: number;
}> = ({
  equipmentWithTiming,
  maxDuration,
  setIsDrawerOpen,
  setSelectedEquipment,
  instanceNumber,
  totalInstances,
}) => {
  const {
    deleteEquipment,
    duplicateEquipment,
    moveEquipmentUp,
    moveEquipmentDown,
    equipment,
  } = useStore();

  const equipmentWithoutTiming = equipment.find(
    (eq: Equipment) => eq.id === equipmentWithTiming.id
  );

  if (!equipmentWithoutTiming) {
    return null;
  }

  return (
    <div className="relative h-8 mb-2">
      <div className="absolute left-0 w-32 pr-2 text-sm font-medium text-right flex items-center justify-end h-full">
        {totalInstances > 1 ? `${equipmentWithoutTiming.name} #${instanceNumber}` : equipmentWithoutTiming.name}
        {instanceNumber === 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 w-8 p-0 ml-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedEquipment(equipmentWithoutTiming);
                  setIsDrawerOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deleteEquipment(equipmentWithoutTiming)}
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => duplicateEquipment(equipmentWithoutTiming)}
              >
                <Copy className="mr-2 h-4 w-4" />
                <span>Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => moveEquipmentUp(equipmentWithoutTiming.id)}
              >
                <ChevronUp className="mr-2 h-4 w-4" />
                <span>Move Up</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => moveEquipmentDown(equipmentWithoutTiming.id)}
              >
                <ChevronDown className="mr-2 h-4 w-4" />
                <span>Move Down</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div
        className="absolute left-32 right-0 h-full bg-secondary"
        onClick={() => {
          setSelectedEquipment(equipmentWithoutTiming);
          setIsDrawerOpen(true);
        }}
      >
        {equipmentWithTiming.operations
          .filter((operation: OperationWithTiming) => {
            // If only one instance, show all operations
            if (totalInstances === 1) return true;
            
            // Round-robin: assign batch to instance based on (batchNumber - 1) % totalInstances
            // Instance 1 gets batches 1, 3, 5... (batchNumber % totalInstances === 1)
            // Instance 2 gets batches 2, 4, 6... (batchNumber % totalInstances === 2)
            const assignedInstance = ((operation.batchNumber - 1) % totalInstances) + 1;
            return assignedInstance === instanceNumber;
          })
          .map((operation: OperationWithTiming) => (
            <OperationBar
              key={operation.id}
              operation={operation}
              maxDuration={maxDuration}
            />
          )
        )}
      </div>
    </div>
  );
};

const OperationBar: React.FC<{
  operation: OperationWithTiming;
  maxDuration: number;
}> = ({ operation, maxDuration }) => {
  const startPercentage = (operation.start / maxDuration) * 100;
  const widthPercentage =
    ((operation.end - operation.start) / maxDuration) * 100;

  const operationColor = (() => {
    switch (operation.batchNumber) {
      case 1:
      case 6:
        return "bg-chart-1";
      case 2:
      case 7:
        return "bg-chart-2";
      case 3:
      case 8:
        return "bg-chart-3";
      case 4:
      case 9:
        return "bg-chart-4";
      case 5:
      case 10:
        return "bg-chart-5";
      default:
        return "bg-gray-500";
    }
  })();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "absolute h-6 rounded-md cursor-pointer",
              operationColor
            )}
            style={{
              left: `${startPercentage}%`,
              width: `${widthPercentage}%`,
            }}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">{operation.name}</p>
          <p>
            Duration: {operation.duration} {operation.durationUnit}
          </p>
          <p>Batch {operation.batchNumber}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
