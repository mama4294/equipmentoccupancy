import React, { useMemo, useState } from "react";
import { Operation, Equipment } from "../Types";
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
import CampaignDialog from "./CampaignDialog";

export default function EOChart({
  calculatedEquipment,
}: {
  calculatedEquipment: Equipment[];
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // New state for the drawer
  const [selectedEquipment, setSelectedEquipment] =
    useState<Equipment | null>();

  const maxDuration = useMemo(() => {
    return Math.max(
      ...calculatedEquipment.flatMap((p) => p.operations.map((op) => op.end))
    );
  }, [calculatedEquipment]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Equipment Occupancy Chart</CardTitle>
        <CardDescription>Process Schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {calculatedEquipment.map((equipment) => (
            <EquipmentRow
              key={equipment.id}
              equipment={equipment}
              maxDuration={maxDuration}
              setSelectedEquipment={setSelectedEquipment}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <EditProcedure
          equipmentToEdit={selectedEquipment}
          setEquipmentToEdit={setSelectedEquipment}
          isOpen={isDrawerOpen}
          setIsOpen={setIsDrawerOpen}
        />
        <CampaignDialog />
      </CardFooter>
    </Card>
  );
}

const EquipmentRow: React.FC<{
  equipment: Equipment;
  maxDuration: number;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEquipment: React.Dispatch<
    React.SetStateAction<Equipment | null | undefined>
  >;
}> = ({ equipment, maxDuration, setIsDrawerOpen, setSelectedEquipment }) => {
  const {
    deleteEquipment,
    duplicateEquipment,
    moveEquipmentUp,
    moveEquipmentDown,
  } = useStore();

  return (
    <div className="relative h-8 mb-2">
      <div className="absolute left-0 w-32 pr-2 text-sm font-medium text-right flex items-center justify-end h-full">
        {equipment.name}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 w-8 p-0 ml-2">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSelectedEquipment(equipment);
                setIsDrawerOpen(true);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteEquipment(equipment)}>
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => duplicateEquipment(equipment)}>
              <Copy className="mr-2 h-4 w-4" />
              <span>Duplicate</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => moveEquipmentUp(equipment.id)}>
              <ChevronUp className="mr-2 h-4 w-4" />
              <span>Move Up</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => moveEquipmentDown(equipment.id)}>
              <ChevronDown className="mr-2 h-4 w-4" />
              <span>Move Down</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        className="absolute left-32 right-0 h-full bg-secondary"
        onClick={() => {
          setSelectedEquipment(equipment);
          setIsDrawerOpen(true);
        }}
      >
        {equipment.operations.map((operation) => (
          <OperationBar
            key={operation.id}
            operation={operation}
            maxDuration={maxDuration}
          />
        ))}
      </div>
    </div>
  );
};

const OperationBar: React.FC<{
  operation: Operation;
  maxDuration: number;
}> = ({ operation, maxDuration }) => {
  const startPercentage = (operation.start / maxDuration) * 100;
  const widthPercentage =
    ((operation.end - operation.start) / maxDuration) * 100;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="absolute h-6 rounded-md bg-primary cursor-pointer"
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
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
