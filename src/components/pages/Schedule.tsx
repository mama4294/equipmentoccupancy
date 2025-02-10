import { useMemo } from "react";
import EquipmentOccupancyChart from "../EquipmentOccupancyChart";
import {
  Campaign,
  Equipment,
  EquipmentWithTiming,
  ResourceOption,
} from "@/Types";
import BottleneckCard from "../cards/BottleneckCard";
import BatchTimeCard from "../cards/BatchTimeCard";
import CampaignCard from "../cards/CampaignCard";
import ResourcesCard from "../cards/ResourcesCard";
import { useStore } from "@/Store";
import { useToast } from "@/hooks/use-toast";
import ChartCard from "../cards/ResourceChart";
import { calculateProcessDetails, calculateTiming } from "@/utils/ganttLogic";

const Schedule = () => {
  const { equipment, campaign, resourceOptions } = useStore();
  const { toast } = useToast();

  const calculatedEquipment = useMemo<EquipmentWithTiming[]>(() => {
    try {
      return calculateTiming(equipment, campaign) as EquipmentWithTiming[];
    } catch (err) {
      console.error("Error in calculateTiming:", err);
      toast({
        title: "Scheduling Failed",
        description:
          err instanceof Error
            ? err.message
            : "An error occurred when determining the schedule",
        variant: "destructive",
      });
      return equipment as EquipmentWithTiming[];
    }
  }, [equipment, campaign]);

  const processDetails = calculateProcessDetails(calculatedEquipment);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Process Schedule</h1>

      <div
        className="relative flex-col items-start gap-8 md:flex"
        x-chunk="dashboard-03-chunk-0"
      >
        <div className="w-full grid grid-cols-4 gap-4">
          {equipment.length > 0 && (
            <>
              <BatchTimeCard details={processDetails} />
              <BottleneckCard details={processDetails} />
              <CampaignCard details={processDetails} />
              <ResourcesCard />
            </>
          )}
          <EquipmentOccupancyChart equipmentWithTiming={calculatedEquipment} />

          {equipment.length > 0 &&
            resourceOptions.map((option: ResourceOption) => (
              <ChartCard resource={option} equipment={calculatedEquipment} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
